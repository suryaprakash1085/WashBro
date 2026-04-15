import { Knex } from "knex";
import { CRUDController } from "../utils/crudController.js";
import { APIError } from "../middleware/errorHandler.js";

export class ServiceService extends CRUDController<any> {
  constructor(db: Knex) {
    super("services", db, "id");
  }

  /**
   * Apply search to multiple fields
   */
  protected applySearch(query: Knex.QueryBuilder, searchTerm: string): Knex.QueryBuilder {
    return query
      .where("name", "like", `%${searchTerm}%`)
      .orWhere("category", "like", `%${searchTerm}%`)
      .orWhere("description", "like", `%${searchTerm}%`);
  }

  /**
   * Validate service data
   */
  protected async validateData(data: any, isUpdate: boolean = false): Promise<void> {
    // Name validation
    if (data.name && data.name.length < 3) {
      throw new APIError(400, "Service name must be at least 3 characters");
    }

    // Price validation
    if (data.price !== undefined) {
      const price = parseFloat(data.price);
      if (isNaN(price) || price < 0) {
        throw new APIError(400, "Price must be a valid positive number");
      }
    }

    // Duration validation
    if (data.duration_minutes !== undefined) {
      const duration = parseInt(data.duration_minutes);
      if (isNaN(duration) || duration <= 0) {
        throw new APIError(400, "Duration must be a positive number");
      }
    }

    // Category validation
    if (data.category && data.category.length < 2) {
      throw new APIError(400, "Category must be at least 2 characters");
    }
  }

  /**
   * Get services by category
   */
  async getServicesByCategory(category: string): Promise<any[]> {
    return await this.db("services")
      .where("category", category)
      .where("is_active", true)
      .select();
  }

  /**
   * Get active services
   */
  async getActiveServices(): Promise<any[]> {
    return await this.db("services")
      .where("is_active", true)
      .select()
      .orderBy("category", "asc");
  }

  /**
   * Get service categories
   */
  async getCategories(): Promise<string[]> {
    const categories = await this.db("services")
      .distinct("category")
      .select("category")
      .where("is_active", true);

    return categories.map((cat) => cat.category);
  }

  /**
   * Get service statistics
   */
  async getServiceStats(): Promise<any> {
    const stats = await this.db("services")
      .select(
        this.db.raw("COUNT(*) as total"),
        this.db.raw("COUNT(CASE WHEN is_active = true THEN 1 END) as active"),
        this.db.raw("COUNT(CASE WHEN is_active = false THEN 1 END) as inactive"),
        this.db.raw("AVG(price) as avg_price"),
        this.db.raw("MIN(price) as min_price"),
        this.db.raw("MAX(price) as max_price")
      )
      .first();

    return stats;
  }
}
