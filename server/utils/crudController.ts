import { Request, Response } from "express";
import { Knex } from "knex";
import { APIError } from "../middleware/errorHandler.js";

/**
 * Generic CRUD Controller Factory
 * Provides reusable CRUD operations for any model
 */
export class CRUDController<T> {
  protected table: string;
  protected db: Knex;
  protected idField: string = "id";

  constructor(table: string, db: Knex, idField: string = "id") {
    this.table = table;
    this.db = db;
    this.idField = idField;
  }

  /**
   * Get all records with optional filtering and pagination
   */
  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const { page = 1, limit = 10, search, sortBy, order = "asc" } = req.query;

      let query = this.db(this.table);

      // Handle search across multiple fields if needed
      if (search && typeof search === "string") {
        // Override in child class for custom search fields
        query = this.applySearch(query, search);
      }

      // Get total count before pagination
      const countResult = await query.clone().count("* as total");
      const total = (countResult[0] as any).total || 0;

      // Apply sorting
      if (sortBy && typeof sortBy === "string") {
        const orderDirection = (order as string).toUpperCase() === "DESC" ? "desc" : "asc";
        query = query.orderBy(sortBy, orderDirection);
      } else {
        query = query.orderBy(this.idField, "desc");
      }

      // Apply pagination
      const pageNum = Math.max(1, parseInt(page as string) || 1);
      const limitNum = Math.max(1, Math.min(100, parseInt(limit as string) || 10));
      const offset = (pageNum - 1) * limitNum;

      const data = await query.limit(limitNum).offset(offset);

      res.json({
        success: true,
        data,
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          pages: Math.ceil(total / limitNum),
        },
      });
    } catch (error) {
      throw new APIError(500, `Error fetching ${this.table}: ${(error as Error).message}`);
    }
  }

  /**
   * Get single record by ID
   */
  async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!id) {
        throw new APIError(400, "ID is required");
      }

      const data = await this.db(this.table).where(this.idField, id).first();

      if (!data) {
        throw new APIError(404, `${this.table} not found`);
      }

      res.json({
        success: true,
        data,
      });
    } catch (error) {
      if (error instanceof APIError) throw error;
      throw new APIError(500, `Error fetching record: ${(error as Error).message}`);
    }
  }

  /**
   * Create new record
   */
  async create(req: Request, res: Response): Promise<void> {
    try {
      const data = req.body;

      if (!data || Object.keys(data).length === 0) {
        throw new APIError(400, "Request body cannot be empty");
      }

      // Validate data before insertion (override in child class)
      await this.validateData(data);

      const result = await this.db(this.table).insert(data);
      const id = result[0];

      const newRecord = await this.db(this.table).where(this.idField, id).first();

      res.status(201).json({
        success: true,
        message: `${this.table} created successfully`,
        data: newRecord,
      });
    } catch (error) {
      if (error instanceof APIError) throw error;
      throw new APIError(500, `Error creating ${this.table}: ${(error as Error).message}`);
    }
  }

  /**
   * Update record by ID
   */
  async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const data = req.body;

      if (!id) {
        throw new APIError(400, "ID is required");
      }

      if (!data || Object.keys(data).length === 0) {
        throw new APIError(400, "Update data cannot be empty");
      }

      // Check if record exists
      const existing = await this.db(this.table).where(this.idField, id).first();
      if (!existing) {
        throw new APIError(404, `${this.table} not found`);
      }

      // Validate data before update (override in child class)
      await this.validateData(data, true);

      // Add updated_at timestamp if it exists in the table
      const updateData = {
        ...data,
        updated_at: new Date(),
      };

      await this.db(this.table).where(this.idField, id).update(updateData);

      const updatedRecord = await this.db(this.table).where(this.idField, id).first();

      res.json({
        success: true,
        message: `${this.table} updated successfully`,
        data: updatedRecord,
      });
    } catch (error) {
      if (error instanceof APIError) throw error;
      throw new APIError(500, `Error updating ${this.table}: ${(error as Error).message}`);
    }
  }

  /**
   * Delete record by ID
   */
  async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!id) {
        throw new APIError(400, "ID is required");
      }

      // Check if record exists
      const existing = await this.db(this.table).where(this.idField, id).first();
      if (!existing) {
        throw new APIError(404, `${this.table} not found`);
      }

      await this.db(this.table).where(this.idField, id).delete();

      res.json({
        success: true,
        message: `${this.table} deleted successfully`,
        data: { id },
      });
    } catch (error) {
      if (error instanceof APIError) throw error;
      throw new APIError(500, `Error deleting ${this.table}: ${(error as Error).message}`);
    }
  }

  /**
   * Override in child class to implement search logic
   * Default: no search
   */
  protected applySearch(query: Knex.QueryBuilder, searchTerm: string): Knex.QueryBuilder {
    return query;
  }

  /**
   * Override in child class to validate data
   * Default: no validation
   */
  protected async validateData(data: any, isUpdate: boolean = false): Promise<void> {
    // Override in child class for custom validation
  }
}
