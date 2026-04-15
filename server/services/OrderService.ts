import { Knex } from "knex";
import { CRUDController } from "../utils/crudController.js";
import { APIError } from "../middleware/errorHandler.js";

export class OrderService extends CRUDController<any> {
  constructor(db: Knex) {
    super("orders", db, "id");
  }

  /**
   * Apply search to multiple fields
   */
  protected applySearch(query: Knex.QueryBuilder, searchTerm: string): Knex.QueryBuilder {
    return query
      .where("service_name", "like", `%${searchTerm}%`)
      .orWhere("status", "like", `%${searchTerm}%`)
      .orWhereRaw(`customer_id IN (SELECT id FROM users WHERE name LIKE ?)`, [`%${searchTerm}%`]);
  }

  /**
   * Validate order data
   */
  protected async validateData(data: any, isUpdate: boolean = false): Promise<void> {
    // Customer ID validation
    if (data.customer_id !== undefined) {
      const customer = await this.db("users")
        .where("id", data.customer_id)
        .first();

      if (!customer) {
        throw new APIError(400, "Customer not found");
      }
    }

    // Service ID validation
    if (data.service_id !== undefined) {
      const service = await this.db("services")
        .where("id", data.service_id)
        .first();

      if (!service) {
        throw new APIError(400, "Service not found");
      }
    }

    // Price validation
    if (data.price !== undefined) {
      const price = parseFloat(data.price);
      if (isNaN(price) || price < 0) {
        throw new APIError(400, "Price must be a valid positive number");
      }
    }

    // Total amount validation
    if (data.total_amount !== undefined) {
      const total = parseFloat(data.total_amount);
      if (isNaN(total) || total < 0) {
        throw new APIError(400, "Total amount must be a valid positive number");
      }
    }

    // Status validation
    if (data.status && !["pending", "confirmed", "in_progress", "completed", "cancelled"].includes(data.status)) {
      throw new APIError(400, "Invalid order status");
    }

    // Scheduled date validation
    if (data.scheduled_date) {
      const date = new Date(data.scheduled_date);
      if (isNaN(date.getTime())) {
        throw new APIError(400, "Invalid scheduled date");
      }
      if (date < new Date() && !isUpdate) {
        throw new APIError(400, "Scheduled date cannot be in the past");
      }
    }
  }

  /**
   * Get orders by customer
   */
  async getOrdersByCustomer(customerId: number): Promise<any[]> {
    return await this.db("orders")
      .where("customer_id", customerId)
      .select()
      .orderBy("created_at", "desc");
  }

  /**
   * Get orders by status
   */
  async getOrdersByStatus(status: string): Promise<any[]> {
    return await this.db("orders")
      .where("status", status)
      .select()
      .orderBy("scheduled_date", "asc");
  }

  /**
   * Get pending orders
   */
  async getPendingOrders(): Promise<any[]> {
    return await this.db("orders")
      .where("status", "pending")
      .orWhere("status", "confirmed")
      .select()
      .orderBy("scheduled_date", "asc");
  }

  /**
   * Get order with customer details
   */
  async getOrderWithDetails(orderId: number): Promise<any> {
    return await this.db("orders")
      .where("orders.id", orderId)
      .join("users", "orders.customer_id", "users.id")
      .select(
        "orders.*",
        "users.name as customer_name",
        "users.email as customer_email",
        "users.phone as customer_phone",
        "users.address as customer_address"
      )
      .first();
  }

  /**
   * Get order statistics
   */
  async getOrderStats(): Promise<any> {
    const stats = await this.db("orders")
      .select(
        this.db.raw("COUNT(*) as total"),
        this.db.raw("COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending"),
        this.db.raw("COUNT(CASE WHEN status = 'confirmed' THEN 1 END) as confirmed"),
        this.db.raw("COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed"),
        this.db.raw("COUNT(CASE WHEN status = 'cancelled' THEN 1 END) as cancelled"),
        this.db.raw("SUM(total_amount) as total_revenue")
      )
      .first();

    return stats;
  }

  /**
   * Update order status
   */
  async updateOrderStatus(orderId: number, status: string): Promise<any> {
    await this.db("orders")
      .where("id", orderId)
      .update({
        status,
        updated_at: new Date(),
      });

    return await this.db("orders").where("id", orderId).first();
  }
}
