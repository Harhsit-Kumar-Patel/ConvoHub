import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config.js';

export function auth(required = true) {
  return (req, res, next) => {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;

    if (!token) {
      if (required) return res.status(401).json({ message: 'Unauthorized' });
      req.user = null;
      return next();
    }
    try {
      const payload = jwt.verify(token, JWT_SECRET);
      req.user = payload;
      return next();
    } catch (e) {
      if (required) return res.status(401).json({ message: 'Invalid token' });
      req.user = null;
      return next();
    }
  };
}

const roleRanks = {
  educational: {
    student: 1,
    ta: 2,
    instructor: 3,
    coordinator: 4,
    principal: 5,
    admin: 99,
  },
  professional: {
    member: 1,
    lead: 2,
    manager: 3,
    org_admin: 4,
    admin: 99,
  },
};

function getRank(workspaceType, role) {
  const space = (workspaceType === 'professional') ? 'professional' : 'educational';
  const table = roleRanks[space];
  return table[role] || 0;
}

export function authorize(opts = {}) {
  const { min, allowed, workspaceOnly } = opts;
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
    const { role, workspaceType } = req.user;

    if (workspaceOnly && workspaceType !== workspaceOnly) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    if (role === 'admin') return next();

    if (Array.isArray(allowed) && allowed.length > 0) {
      if (!allowed.includes(role)) {
        return res.status(403).json({ message: 'Forbidden' });
      }
      return next();
    }

    if (min) {
      const userRank = getRank(workspaceType, role);
      const minRank = getRank(workspaceType, min);
      if (userRank < minRank) {
        return res.status(403).json({ message: 'Forbidden' });
      }
      return next();
    }
    return next();
  };
}