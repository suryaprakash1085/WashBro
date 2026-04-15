import { Router, Request, Response, NextFunction } from "express";
import { db } from "../config/database.js";
import { APIError } from "../middleware/errorHandler.js";

export const homepageRouter = Router();

/**
 * GET /api/homepage - Get all homepage content with date filtering
 * Query params: startDate, endDate, page, limit, search
 */
homepageRouter.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { startDate, endDate, page = 1, limit = 10, search } = req.query;
    const pageNum = parseInt(page as string) || 1;
    const limitNum = parseInt(limit as string) || 10;
    const offset = (pageNum - 1) * limitNum;

    let query = db("homepage_content").where("is_active", true);

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
        q.where("title", "like", `%${search}%`)
          .orWhere("section", "like", `%${search}%`)
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
 * GET /api/homepage/:id - Get a single homepage content item
 */
homepageRouter.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const content = await db("homepage_content").where("id", id).where("is_active", true).first();

    if (!content) {
      throw new APIError(404, "Homepage content not found");
    }

    res.json({
      success: true,
      data: content,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/homepage - Create new homepage content
 */
homepageRouter.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, section, description, content, image_url, display_order } = req.body;

    if (!title || !section) {
      throw new APIError(400, "Title and section are required");
    }

    const [id] = await db("homepage_content").insert({
      title,
      section,
      description,
      content,
      image_url,
      display_order: display_order || 0,
      is_active: true,
      created_at: new Date(),
      updated_at: new Date(),
    });

    const newContent = await db("homepage_content").where("id", id).first();

    res.json({
      success: true,
      data: newContent,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * PUT /api/homepage/:id - Update homepage content
 */
homepageRouter.put("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { title, section, description, content, image_url, display_order } = req.body;

    const item = await db("homepage_content").where("id", id).first();
    if (!item) {
      throw new APIError(404, "Homepage content not found");
    }

    await db("homepage_content").where("id", id).update({
      title: title || item.title,
      section: section || item.section,
      description: description || item.description,
      content: content || item.content,
      image_url: image_url || item.image_url,
      display_order: display_order !== undefined ? display_order : item.display_order,
      updated_at: new Date(),
    });

    const updatedContent = await db("homepage_content").where("id", id).first();

    res.json({
      success: true,
      data: updatedContent,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * DELETE /api/homepage/:id - Delete homepage content (soft delete)
 */
homepageRouter.delete("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const item = await db("homepage_content").where("id", id).first();
    if (!item) {
      throw new APIError(404, "Homepage content not found");
    }

    await db("homepage_content").where("id", id).update({
      is_active: false,
      updated_at: new Date(),
    });

    res.json({
      success: true,
      message: "Homepage content deleted successfully",
    });
  } catch (error) {
    next(error);
  }
});
