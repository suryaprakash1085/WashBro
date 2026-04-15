import { Router, Request, Response, NextFunction } from 'express';
import { db } from '../config/database.js';
import { APIError } from '../middleware/errorHandler.js';

export const authRouter = Router();

/**
 * POST /api/auth/login
 * Login user and return authentication token
 */
authRouter.post('/login', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      throw new APIError(400, 'Email and password are required');
    }

    // Find user by email
    const user = await db('users').where('email', email).first();

    if (!user) {
      throw new APIError(401, 'Invalid email or password');
    }

    // Check if user is active
    if (!user.is_active) {
      throw new APIError(401, 'User account is inactive');
    }

    // In production, use bcrypt for password hashing
    // For now, we do simple comparison
    if (user.password !== password) {
      throw new APIError(401, 'Invalid email or password');
    }

    // Generate token (base64 encoded JSON)
    const token = Buffer.from(
      JSON.stringify({
        userId: user.id,
        role: user.role,
        email: user.email,
      })
    ).toString('base64');

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          is_active: user.is_active,
        },
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/auth/register
 * Register new user account
 */
authRouter.post('/register', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, password, phone } = req.body;

    // Validate input
    if (!name || !email || !password) {
      throw new APIError(400, 'Name, email, and password are required');
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new APIError(400, 'Invalid email format');
    }

    // Check if email already exists
    const existing = await db('users').where('email', email).first();
    if (existing) {
      throw new APIError(400, 'Email already registered');
    }

    // Validate password length
    if (password.length < 6) {
      throw new APIError(400, 'Password must be at least 6 characters');
    }

    // Create new user
    const result = await db('users').insert({
      name,
      email,
      password, // In production, hash with bcrypt
      phone: phone || null,
      role: 'customer',
      is_active: true,
      created_at: new Date(),
      updated_at: new Date(),
    });

    const newUser = await db('users').where('id', result[0]).first();

    // Generate token
    const token = Buffer.from(
      JSON.stringify({
        userId: newUser.id,
        role: newUser.role,
        email: newUser.email,
      })
    ).toString('base64');

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: {
        token,
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          is_active: newUser.is_active,
        },
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/auth/logout
 * Logout user (client-side token removal)
 */
authRouter.post('/logout', async (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'Logout successful',
  });
});

/**
 * GET /api/auth/profile
 * Get current user profile (requires authentication)
 */
authRouter.get('/profile', async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.userId) {
      throw new APIError(401, 'Authentication required');
    }

    const user = await db('users').where('id', req.userId).first();

    if (!user) {
      throw new APIError(404, 'User not found');
    }

    res.json({
      success: true,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        address: user.address,
        city: user.city,
        zipcode: user.zipcode,
        is_active: user.is_active,
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * PUT /api/auth/profile
 * Update current user profile
 */
authRouter.put('/profile', async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.userId) {
      throw new APIError(401, 'Authentication required');
    }

    const { name, phone, address, city, zipcode } = req.body;

    // Update user
    await db('users').where('id', req.userId).update({
      ...(name && { name }),
      ...(phone && { phone }),
      ...(address && { address }),
      ...(city && { city }),
      ...(zipcode && { zipcode }),
      updated_at: new Date(),
    });

    const updatedUser = await db('users').where('id', req.userId).first();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        role: updatedUser.role,
        address: updatedUser.address,
        city: updatedUser.city,
        zipcode: updatedUser.zipcode,
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * PUT /api/auth/change-password
 * Change user password
 */
authRouter.put('/change-password', async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.userId) {
      throw new APIError(401, 'Authentication required');
    }

    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      throw new APIError(400, 'Current and new passwords are required');
    }

    if (newPassword.length < 6) {
      throw new APIError(400, 'New password must be at least 6 characters');
    }

    // Verify current password
    const user = await db('users').where('id', req.userId).first();

    if (user.password !== currentPassword) {
      throw new APIError(401, 'Current password is incorrect');
    }

    // Update password
    await db('users').where('id', req.userId).update({
      password: newPassword,
      updated_at: new Date(),
    });

    res.json({
      success: true,
      message: 'Password changed successfully',
    });
  } catch (error) {
    next(error);
  }
});
