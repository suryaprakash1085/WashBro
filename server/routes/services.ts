import { Router, Request, Response, NextFunction } from "express";
import { db } from "../config/database.js";
import { ServiceService } from "../services/ServiceService.js";

export const servicesRouter = Router();
const serviceService = new ServiceService(db);

/**
 * GET /api/services - Get all services with pagination
 * Query params: page, limit, search, sortBy, order
 */
servicesRouter.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    await serviceService.getAll(req, res);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/services/active - Get all active services
 */
servicesRouter.get("/active", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const services = await serviceService.getActiveServices();
    res.json({
      success: true,
      data: services,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/services/categories - Get all service categories
 */
servicesRouter.get("/categories", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const categories = await serviceService.getCategories();
    res.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/services/stats - Get service statistics
 */
servicesRouter.get("/stats", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const stats = await serviceService.getServiceStats();
    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/services/category/:category - Get services by category
 */
servicesRouter.get("/category/:category", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { category } = req.params;
    const services = await serviceService.getServicesByCategory(category);
    res.json({
      success: true,
      data: services,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/services/:id - Get service by ID
 */
servicesRouter.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    await serviceService.getById(req, res);
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/services - Create new service
 */
servicesRouter.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    await serviceService.create(req, res);
  } catch (error) {
    next(error);
  }
});

/**
 * PUT /api/services/:id - Update service
 */
servicesRouter.put("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    await serviceService.update(req, res);
  } catch (error) {
    next(error);
  }
});

/**
 * DELETE /api/services/:id - Delete service
 */
servicesRouter.delete("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    await serviceService.delete(req, res);
  } catch (error) {
    next(error);
  }
});
