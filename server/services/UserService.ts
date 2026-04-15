import { Knex } from "knex";
import { CRUDController } from "../utils/crudController.js";
import { APIError } from "../middleware/errorHandler.js";

export class UserService extends CRUDController<any> {
  constructor(db: Knex) {
    super("users", db, "id");
  }

  /**
   * Apply search to multiple fields
   */
  protected applySearch(query: Knex.QueryBuilder, searchTerm: string): Knex.QueryBuilder {
    return query
      .where("name", "like", `%${searchTerm}%`)
      .orWhere("email", "like", `%${searchTerm}%`)
      .orWhere("phone", "like", `%${searchTerm}%`)
      .orWhere("city", "like", `%${searchTerm}%`);
  }

  /**
   * Validate user data
   */
  protected async validateData(data: any, isUpdate: boolean = false): Promise<void> {
    // Email validation
    if (data.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.email)) {
        throw new APIError(400, "Invalid email format");
      }

      // Check if email already exists (for create or if email is being updated)
      const existing = await this.db("users")
        .where("email", data.email)
        .whereNot("id", data.id || -1)
        .first();

      if (existing) {
        throw new APIError(400, "Email already exists");
      }
    }

    // Name validation
    if (data.name && data.name.length < 2) {
      throw new APIError(400, "Name must be at least 2 characters");
    }

    // Phone validation (optional but if provided, should be valid)
    if (data.phone && data.phone.length < 10) {
      throw new APIError(400, "Phone must be at least 10 digits");
    }

    // Role validation
    if (data.role && !["admin", "customer"].includes(data.role)) {
      throw new APIError(400, "Invalid role");
    }

    // Password validation for create
    if (!isUpdate && data.password && data.password.length < 6) {
      throw new APIError(400, "Password must be at least 6 characters");
    }
  }

  /**
   * Get user by email
   */
  async getUserByEmail(email: string): Promise<any> {
    return await this.db("users").where("email", email).first();
  }

  /**
   * Get active users only
   */
  async getActiveUsers(): Promise<any[]> {
    return await this.db("users").where("is_active", true).select();
  }

  /**
   * Get admin users
   */
  async getAdmins(): Promise<any[]> {
    return await this.db("users").where("role", "admin").select();
  }

  /**
   * Update user status
   */
  async updateUserStatus(userId: number, isActive: boolean): Promise<any> {
    await this.db("users").where("id", userId).update({
      is_active: isActive,
      updated_at: new Date(),
    });
    return await this.db("users").where("id", userId).first();
  }
}
