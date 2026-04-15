import { Router, Request, Response, NextFunction } from "express";
import { db } from "../config/database.js";
import { MessageService } from "../services/MessageService.js";
import { APIError } from "../middleware/errorHandler.js";

export const messagesRouter = Router();
const messageService = new MessageService(db);

/**
 * GET /api/messages - Get all messages with pagination
 * Query params: page, limit, search, sortBy, order
 */
messagesRouter.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    await messageService.getAll(req, res);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/messages/unread - Get unread messages
 */
messagesRouter.get("/unread", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const messages = await messageService.getUnreadMessages();
    res.json({
      success: true,
      data: messages,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/messages/replied - Get replied messages
 */
messagesRouter.get("/replied", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const messages = await messageService.getRepliedMessages();
    res.json({
      success: true,
      data: messages,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/messages/stats - Get message statistics
 */
messagesRouter.get("/stats", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const stats = await messageService.getMessageStats();
    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/messages/:id - Get message by ID
 */
messagesRouter.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    await messageService.getById(req, res);
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/messages - Create new message
 */
messagesRouter.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    await messageService.create(req, res);
  } catch (error) {
    next(error);
  }
});

/**
 * PUT /api/messages/:id - Update message
 */
messagesRouter.put("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    await messageService.update(req, res);
  } catch (error) {
    next(error);
  }
});

/**
 * PUT /api/messages/:id/read - Mark message as read
 */
messagesRouter.put("/:id/read", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const message = await messageService.markAsRead(parseInt(id));
    res.json({
      success: true,
      message: "Message marked as read",
      data: message,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * PUT /api/messages/:id/reply - Reply to message
 */
messagesRouter.put("/:id/reply", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { reply_message } = req.body;

    if (!reply_message) {
      throw new APIError(400, "Reply message is required");
    }

    const message = await messageService.replyToMessage(parseInt(id), reply_message);
    res.json({
      success: true,
      message: "Message replied successfully",
      data: message,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * DELETE /api/messages/:id - Delete message
 */
messagesRouter.delete("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    await messageService.delete(req, res);
  } catch (error) {
    next(error);
  }
});
