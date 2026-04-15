import { Router, Request, Response, NextFunction } from "express";
import { db } from "../config/database.js";
import { APIError } from "../middleware/errorHandler.js";

export const settingsRouter = Router();

/**
 * GET /api/settings - Get all settings with date filtering
 * Query params: startDate, endDate, page, limit, search
 */
settingsRouter.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { startDate, endDate, page = 1, limit = 10, search } = req.query;
    const pageNum = parseInt(page as string) || 1;
    const limitNum = parseInt(limit as string) || 10;
    const offset = (pageNum - 1) * limitNum;

    let query = db("settings").where("is_active", true);

    // Apply date filtering
    if (startDate) {
      query = query.where("created_at", ">=", new Date(startDate as string));
    }
    if (endDate) {
      const endDateObj = new Date(endDate as string);
      endDateObj.setHours(23, 59, 59, 999);
      query = query.where("created_at", "<=", endDateObj);
    }

    // Apply search
    if (search) {
      query = query.where((q) => {
        q.where("key", "like", `%${search}%`)
          .orWhere("value", "like", `%${search}%`)
          .orWhere("description", "like", `%${search}%`);
      });
    }

    const total = await query.clone().count("* as count").first();
    const data = await query.orderBy("updated_at", "desc").limit(limitNum).offset(offset);

    res.json({
      success: true,
      data,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: (total?.count as number) || 0,
        pages: Math.ceil(((total?.count as number) || 0) / limitNum),
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/settings/:id - Get a single setting
 */
settingsRouter.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const setting = await db("settings").where("id", id).where("is_active", true).first();

    if (!setting) {
      throw new APIError(404, "Setting not found");
    }

    res.json({
      success: true,
      data: setting,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/settings - Create a new setting
 */
settingsRouter.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { key, value, description, category } = req.body;

    if (!key || !value) {
      throw new APIError(400, "Key and value are required");
    }

    const [id] = await db("settings").insert({
      key,
      value,
      description,
      category,
      is_active: true,
      created_at: new Date(),
      updated_at: new Date(),
    });

    const setting = await db("settings").where("id", id).first();

    res.json({
      success: true,
      data: setting,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * PUT /api/settings/:id - Update a setting
 */
settingsRouter.put("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { key, value, description, category } = req.body;

    const setting = await db("settings").where("id", id).first();
    if (!setting) {
      throw new APIError(404, "Setting not found");
    }

    await db("settings").where("id", id).update({
      key: key || setting.key,
      value: value || setting.value,
      description: description || setting.description,
      category: category || setting.category,
      updated_at: new Date(),
    });

    const updatedSetting = await db("settings").where("id", id).first();

    res.json({
      success: true,
      data: updatedSetting,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * DELETE /api/settings/:id - Delete a setting (soft delete)
 */
settingsRouter.delete("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const setting = await db("settings").where("id", id).first();
    if (!setting) {
      throw new APIError(404, "Setting not found");
    }

    await db("settings").where("id", id).update({
      is_active: false,
      updated_at: new Date(),
    });

    res.json({
      success: true,
      message: "Setting deleted successfully",
    });
  } catch (error) {
    next(error);
  }
});
