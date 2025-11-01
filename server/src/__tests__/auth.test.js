import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import authRouter from '../routes/auth.js';
import User from '../models/User.js';

let mongoServer;
let app;

// Set up test app
beforeAll(async () => {
  // Create in-memory MongoDB instance
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  
  await mongoose.connect(mongoUri);
  
  // Create test Express app
  app = express();
  app.use(express.json());
  app.use('/api/auth', authRouter);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  // Clear all users before each test
  await User.deleteMany({});
  // Wait a bit to avoid rate limiting between tests
  await new Promise(resolve => setTimeout(resolve, 100));
});

describe('POST /api/auth/register', () => {
  test('should register a new user with valid data', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'TestPass123',
        workspaceType: 'educational',
        role: 'student'
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
    expect(response.body.user).toMatchObject({
      name: 'Test User',
      email: 'test@example.com',
      role: 'student',
      workspaceType: 'educational'
    });
  });

  test('should reject registration with weak password', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'weak',
        workspaceType: 'educational'
      });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message', 'Validation failed');
  });

  test('should reject registration with invalid email', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test User',
        email: 'invalid-email',
        password: 'TestPass123',
        workspaceType: 'educational'
      });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message', 'Validation failed');
  });

  test('should reject registration with missing fields', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'test@example.com',
        password: 'TestPass123'
      });

    expect(response.status).toBe(400);
  });

  test('should reject duplicate email registration', async () => {
    // First registration
    await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'TestPass123',
        workspaceType: 'educational'
      });

    // Duplicate registration
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Another User',
        email: 'test@example.com',
        password: 'TestPass123',
        workspaceType: 'educational'
      });

    expect(response.status).toBe(409);
    expect(response.body).toHaveProperty('message', 'Email already registered');
  });

  test('should default to student role for educational workspace', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'TestPass123',
        workspaceType: 'educational'
        // No role specified
      });

    expect(response.status).toBe(200);
    expect(response.body.user.role).toBe('student');
  });

  test('should default to member role for professional workspace', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'TestPass123',
        workspaceType: 'professional'
        // No role specified
      });

    expect(response.status).toBe(200);
    expect(response.body.user.role).toBe('member');
  });
});

describe('POST /api/auth/login', () => {
  beforeEach(async () => {
    // Create a test user before each login test
    await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'TestPass123',
        workspaceType: 'educational'
      });
  });

  test('should login with correct credentials', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'TestPass123'
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
    expect(response.body.user).toMatchObject({
      email: 'test@example.com',
      name: 'Test User'
    });
  });

  test('should reject login with wrong password', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'WrongPassword123'
      });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('message', 'Invalid credentials');
  });

  test('should reject login with non-existent email', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'nonexistent@example.com',
        password: 'TestPass123'
      });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('message', 'Invalid credentials');
  });

  test('should reject login with missing email', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        password: 'TestPass123'
      });

    expect(response.status).toBe(400);
  });

  test('should reject login with missing password', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com'
      });

    expect(response.status).toBe(400);
  });
});
