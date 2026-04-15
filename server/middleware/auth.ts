import { Request, Response, NextFunction } from 'express';
import { APIError } from './errorHandler.js';

/**
 * Extended Express Request with user information
 */
declare global {
  namespace Express {
    interface Request {
      userId?: number;
      userRole?: 'admin' | 'customer';
      isAuthenticated?: boolean;
    }
  }
}

/**
 * Authentication Middleware
 * Validates JWT token from Authorization header
 */
export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new APIError(401, 'Missing or invalid authorization header');
    }

    const token = authHeader.substring(7); // Remove "Bearer " prefix

    // In production, verify JWT token here
    // For now, we'll do basic token parsing
    try {
      const decoded = Buffer.from(token, 'base64').toString('utf-8');
      const { userId, role } = JSON.parse(decoded);

      req.userId = userId;
      req.userRole = role;
      req.isAuthenticated = true;

      next();
    } catch {
      throw new APIError(401, 'Invalid token format');
    }
  } catch (error) {
    if (error instanceof APIError) {
      return res.status(error.status).json({
        success: false,
        error: {
          message: error.message,
          status: error.status,
        },
      });
    }

    res.status(500).json({
      success: false,
      error: {
        message: 'Authentication error',
        status: 500,
      },
    });
  }
}

/**
 * Admin-only Authorization Middleware
 * Ensures user has admin role
 */
export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.isAuthenticated) {
    return res.status(401).json({
      success: false,
      error: {
        message: 'Authentication required',
        status: 401,
      },
    });
  }

  if (req.userRole !== 'admin') {
    return res.status(403).json({
      success: false,
      error: {
        message: 'Admin access required',
        status: 403,
      },
    });
  }

  next();
}

/**
 * Role-based Authorization Middleware Factory
 * @param allowedRoles Array of allowed roles
 */
export function requireRole(...allowedRoles: Array<'admin' | 'customer'>) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.isAuthenticated) {
      return res.status(401).json({
        success: false,
        error: {
          message: 'Authentication required',
          status: 401,
        },
      });
    }

    if (!allowedRoles.includes(req.userRole as 'admin' | 'customer')) {
      return res.status(403).json({
        success: false,
        error: {
          message: 'Insufficient permissions',
          status: 403,
        },
      });
    }

    next();
  };
}

/**
 * Optional Authentication Middleware
 * Doesn't fail if not authenticated, just extracts user info if available
 */
export function optionalAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);

      try {
        const decoded = Buffer.from(token, 'base64').toString('utf-8');
        const { userId, role } = JSON.parse(decoded);

        req.userId = userId;
        req.userRole = role;
        req.isAuthenticated = true;
      } catch {
        // Invalid token, continue without authentication
      }
    }

    next();
  } catch {
    next();
  }
}

/**
 * Rate Limiting Middleware
 * Prevents abuse by limiting requests per IP
 */
const requestCounts = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 100;

export function rateLimitMiddleware(req: Request, res: Response, next: NextFunction) {
  const clientIp = req.ip || req.socket.remoteAddress || 'unknown';
  const now = Date.now();

  let clientData = requestCounts.get(clientIp);

  if (!clientData || now > clientData.resetTime) {
    clientData = { count: 0, resetTime: now + RATE_LIMIT_WINDOW };
    requestCounts.set(clientIp, clientData);
  }

  clientData.count++;

  res.set('X-RateLimit-Limit', RATE_LIMIT_MAX_REQUESTS.toString());
  res.set('X-RateLimit-Remaining', Math.max(0, RATE_LIMIT_MAX_REQUESTS - clientData.count).toString());
  res.set('X-RateLimit-Reset', clientData.resetTime.toString());

  if (clientData.count > RATE_LIMIT_MAX_REQUESTS) {
    return res.status(429).json({
      success: false,
      error: {
        message: 'Too many requests, please try again later',
        status: 429,
      },
    });
  }

  next();
}

/**
 * Logging Middleware
 * Logs all API requests
 */
export function loggingMiddleware(req: Request, res: Response, next: NextFunction) {
  const startTime = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const userId = req.userId ? ` [User: ${req.userId}]` : '';
    const method = req.method;
    const path = req.path;
    const status = res.statusCode;

    console.log(
      `[${new Date().toISOString()}] ${method} ${path} - ${status} (${duration}ms)${userId}`
    );
  });

  next();
}

/**
 * Request Validation Middleware
 * Validates that request body exists for POST/PUT/PATCH
 */
export function validateRequestBody(req: Request, res: Response, next: NextFunction) {
  if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Request body is required',
          status: 400,
        },
      });
    }
  }

  next();
}

/**
 * CORS Configuration
 * Allows cross-origin requests from specified origins
 */
export const corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://localhost:5173',
    'http://localhost:8080',
    'http://localhost:9005',
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
