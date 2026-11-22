import jwt from 'jsonwebtoken';
import { config } from '../config/environment.js';
import { UsersRepository } from '../repositories/index.js';

export async function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'UNAUTHORIZED',
      message: 'Authentication token missing. Please sign in.'
    });
  }

  try {
    const decoded = jwt.verify(token, config.jwt.secret);
    const user = await UsersRepository.findByUserId(decoded.userId);

    if (!user || !user.is_active) {
      return res.status(403).json({
        success: false,
        error: 'ACCOUNT_INACTIVE',
        message: 'Account is deactivated or does not exist.'
      });
    }

    req.user = {
      userId: user.user_id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department
    };

    next();
  } catch (err) {
    return res.status(403).json({
      success: false,
      error: 'INVALID_TOKEN',
      message: 'Session has expired or token is invalid.'
    });
  }
}

/**
 * Optional authentication middleware:
 * Populates req.user if a valid token is present, but doesn't reject if omitted.
 */
export async function optionalAuthenticate(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) {
    return next();
  }

  try {
    const decoded = jwt.verify(token, config.jwt.secret);
    const user = await UsersRepository.findByUserId(decoded.userId);
    if (user && user.is_active) {
      req.user = {
        userId: user.user_id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department
      };
    }
  } catch (err) {
    // Ignore invalid token in optional mode
  }
  next();
}
