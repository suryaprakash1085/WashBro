import { Router, Request, Response, NextFunction } from "express";
import { db } from "../config/database.js";
import { OrderService } from "../services/OrderService.js";
import { APIError } from "../middleware/errorHandler.js";

export const ordersRouter = Router();
const orderService = new OrderService(db);

/**
 * GET /api/orders - Get all orders with pagination
 * Query params: page, limit, search, sortBy, order
 */
ordersRouter.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    await orderService.getAll(req, res);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/orders/pending - Get pending orders
 */
ordersRouter.get("/pending", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const orders = await orderService.getPendingOrders();
    res.json({
      success: true,
      data: orders,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/orders/stats - Get order statistics
 */
ordersRouter.get("/stats", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const stats = await orderService.getOrderStats();
    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/orders/customer/:customerId - Get orders by customer
 */
ordersRouter.get("/customer/:customerId", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { customerId } = req.params;
    const orders = await orderService.getOrdersByCustomer(parseInt(customerId));
    res.json({
      success: true,
      data: orders,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/orders/status/:status - Get orders by status
 */
ordersRouter.get("/status/:status", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status } = req.params;
    const orders = await orderService.getOrdersByStatus(status);
    res.json({
      success: true,
      data: orders,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/orders/:id - Get order by ID with details
 */
ordersRouter.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const order = await orderService.getOrderWithDetails(parseInt(id));

    if (!order) {
      throw new APIError(404, "Order not found");
    }

    res.json({
      success: true,
      data: order,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/orders - Create new order
 */
ordersRouter.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    await orderService.create(req, res);
  } catch (error) {
    next(error);
  }
});

/**
 * PUT /api/orders/:id - Update order
 */
ordersRouter.put("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    await orderService.update(req, res);
  } catch (error) {
    next(error);
  }
});

/**
 * PUT /api/orders/:id/status - Update order status
 */
ordersRouter.put("/:id/status", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      throw new APIError(400, "Status is required");
    }

    const order = await orderService.updateOrderStatus(parseInt(id), status);
    res.json({
      success: true,
      message: "Order status updated successfully",
      data: order,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * DELETE /api/orders/:id - Delete order
 */
ordersRouter.delete("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    await orderService.delete(req, res);
  } catch (error) {
    next(error);
  }
});
