import { Router, Request, Response, NextFunction } from "express";
import { db } from "../config/database.js";
import { UserService } from "../services/UserService.js";
import { APIError } from "../middleware/errorHandler.js";

export const usersRouter = Router();
const userService = new UserService(db);

/**
 * GET /api/users - Get all users with pagination
 * Query params: page, limit, search, sortBy, order
 */
usersRouter.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    await userService.getAll(req, res);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/users/admins - Get all admin users
 */
usersRouter.get("/admins", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const admins = await userService.getAdmins();
    res.json({
      success: true,
      data: admins,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/users/active - Get all active users
 */
usersRouter.get("/active", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await userService.getActiveUsers();
    res.json({
      success: true,
      data: users,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/users/:id - Get user by ID
 */
usersRouter.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    await userService.getById(req, res);
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/users - Create new user
 */
usersRouter.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    await userService.create(req, res);
  } catch (error) {
    next(error);
  }
});

/**
 * PUT /api/users/:id - Update user
 */
usersRouter.put("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    await userService.update(req, res);
  } catch (error) {
    next(error);
  }
});

/**
 * PUT /api/users/:id/status - Update user status (active/inactive)
 */
usersRouter.put("/:id/status", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { is_active } = req.body;

    if (is_active === undefined) {
      throw new APIError(400, "is_active is required");
    }

    const user = await userService.updateUserStatus(parseInt(id), is_active);
    res.json({
      success: true,
      message: "User status updated successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * DELETE /api/users/:id - Delete user
 */
usersRouter.delete("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    await userService.delete(req, res);
  } catch (error) {
    next(error);
  }
});
