import jwt from 'jsonwebtoken';
import { jest } from '@jest/globals';
import { auth, authorize } from '../middleware/auth.js';
import { JWT_SECRET } from '../config.js';

describe('Auth Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      headers: {},
      user: null
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
    next = jest.fn();
  });

  describe('auth() middleware', () => {
    test('should authenticate valid JWT token', () => {
      const token = jwt.sign(
        { id: '123', role: 'student', name: 'Test', workspaceType: 'educational' },
        JWT_SECRET
      );

      req.headers.authorization = `Bearer ${token}`;
      
      const middleware = auth(true);
      middleware(req, res, next);

      expect(req.user).toMatchObject({
        id: '123',
        role: 'student',
        name: 'Test',
        workspaceType: 'educational'
      });
      expect(next).toHaveBeenCalled();
    });

    test('should reject invalid token', () => {
      req.headers.authorization = 'Bearer invalid-token';
      
      const middleware = auth(true);
      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid token' });
      expect(next).not.toHaveBeenCalled();
    });

    test('should reject missing token when required', () => {
      const middleware = auth(true);
      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'Unauthorized' });
      expect(next).not.toHaveBeenCalled();
    });

    test('should allow missing token when not required', () => {
      const middleware = auth(false);
      middleware(req, res, next);

      expect(req.user).toBeNull();
      expect(next).toHaveBeenCalled();
    });
  });

  describe('authorize() middleware', () => {
    beforeEach(() => {
      req.user = {
        id: '123',
        role: 'student',
        workspaceType: 'educational'
      };
    });

    test('should allow admin users always', () => {
      req.user.role = 'admin';
      
      const middleware = authorize({ min: 'principal' });
      middleware(req, res, next);

      expect(next).toHaveBeenCalled();
    });

    test('should allow users with minimum role', () => {
      req.user.role = 'instructor';
      
      const middleware = authorize({ min: 'instructor' });
      middleware(req, res, next);

      expect(next).toHaveBeenCalled();
    });

    test('should reject users below minimum role', () => {
      req.user.role = 'student';
      
      const middleware = authorize({ min: 'instructor' });
      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ message: 'Forbidden' });
      expect(next).not.toHaveBeenCalled();
    });

    test('should allow users in allowed roles list', () => {
      req.user.role = 'ta';
      
      const middleware = authorize({ allowed: ['ta', 'instructor'] });
      middleware(req, res, next);

      expect(next).toHaveBeenCalled();
    });

    test('should reject users not in allowed roles list', () => {
      req.user.role = 'student';
      
      const middleware = authorize({ allowed: ['ta', 'instructor'] });
      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(next).not.toHaveBeenCalled();
    });

    test('should enforce workspace type restriction', () => {
      req.user.workspaceType = 'professional';
      
      const middleware = authorize({ workspaceOnly: 'educational' });
      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(next).not.toHaveBeenCalled();
    });

    test('should reject unauthorized users', () => {
      req.user = null;
      
      const middleware = authorize({ min: 'student' });
      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(next).not.toHaveBeenCalled();
    });
  });
});
