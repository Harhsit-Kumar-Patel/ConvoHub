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
      req.user = payload; // { id, role, name, workspaceType }
      return next();
    } catch (e) {
      if (required) return res.status(401).json({ message: 'Invalid token' });
      req.user = null;
      return next();
    }
  };
}

// Admin-only guard: requires a valid auth() earlier in the chain
export function admin() {
  return (req, res, next) => {
    // req.user is set by auth()
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden: Admins only' });
    }
    return next();
  };
}

// Role rankings per workspace for hierarchical authorization
const roleRanks = {
  educational: {
    student: 1,
    ta: 2,
    instructor: 3,
    dept_admin: 4,
    admin: 99, // legacy superuser
  },
  professional: {
    member: 1,
    lead: 2,
    manager: 3,
    org_admin: 4,
    admin: 99, // legacy superuser
  },
};

function getRank(workspaceType, role) {
  const space = (workspaceType === 'professional') ? 'professional' : 'educational';
  const table = roleRanks[space];
  return table[role] || 0;
}

function normalizeRole(workspaceType, role) {
  if (role === 'admin') return 'admin';
  if (workspaceType === 'professional') {
    // legacy 'professional' becomes base member
    if (role === 'professional') return 'member';
    return role;
  }
  // educational
  return role; // 'student' already valid
}

// authorize({ min?: string, allowed?: string[] })
// authorize({ min?: string, allowed?: string[], workspaceOnly?: 'educational'|'professional' })
export function authorize(opts = {}) {
  const { min, allowed, workspaceOnly } = opts;
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
    const { role: rawRole, workspaceType } = req.user;
    const role = normalizeRole(workspaceType, rawRole);

    if (workspaceOnly && workspaceType !== workspaceOnly) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    if (role === 'admin') return next(); // superuser bypass

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

    // If neither min nor allowed provided, default to authenticated only
    return next();
  };
}
