import { Knex } from "knex";
import { CRUDController } from "../utils/crudController.js";
import { APIError } from "../middleware/errorHandler.js";

export class MessageService extends CRUDController<any> {
  constructor(db: Knex) {
    super("messages", db, "id");
  }

  /**
   * Apply search to multiple fields
   */
  protected applySearch(query: Knex.QueryBuilder, searchTerm: string): Knex.QueryBuilder {
    return query
      .where("name", "like", `%${searchTerm}%`)
      .orWhere("email", "like", `%${searchTerm}%`)
      .orWhere("message", "like", `%${searchTerm}%`);
  }

  /**
   * Validate message data
   */
  protected async validateData(data: any, isUpdate: boolean = false): Promise<void> {
    // Name validation
    if (data.name && data.name.length < 2) {
      throw new APIError(400, "Name must be at least 2 characters");
    }

    // Email validation
    if (data.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.email)) {
        throw new APIError(400, "Invalid email format");
      }
    }

    // Message validation
    if (data.message && data.message.length < 5) {
      throw new APIError(400, "Message must be at least 5 characters");
    }

    // Status validation
    if (data.status && !["unread", "read", "replied"].includes(data.status)) {
      throw new APIError(400, "Invalid message status");
    }
  }

  /**
   * Get unread messages
   */
  async getUnreadMessages(): Promise<any[]> {
    return await this.db("messages")
      .where("status", "unread")
      .select()
      .orderBy("created_at", "desc");
  }

  /**
   * Get replied messages
   */
  async getRepliedMessages(): Promise<any[]> {
    return await this.db("messages")
      .where("status", "replied")
      .select()
      .orderBy("replied_at", "desc");
  }

  /**
   * Mark message as read
   */
  async markAsRead(messageId: number): Promise<any> {
    await this.db("messages")
      .where("id", messageId)
      .update({
        status: "read",
        updated_at: new Date(),
      });

    return await this.db("messages").where("id", messageId).first();
  }

  /**
   * Reply to message
   */
  async replyToMessage(messageId: number, replyMessage: string): Promise<any> {
    await this.db("messages")
      .where("id", messageId)
      .update({
        reply_message: replyMessage,
        status: "replied",
        replied_at: new Date(),
        updated_at: new Date(),
      });

    return await this.db("messages").where("id", messageId).first();
  }

  /**
   * Get message statistics
   */
  async getMessageStats(): Promise<any> {
    const stats = await this.db("messages")
      .select(
        this.db.raw("COUNT(*) as total"),
        this.db.raw("COUNT(CASE WHEN status = 'unread' THEN 1 END) as unread"),
        this.db.raw("COUNT(CASE WHEN status = 'read' THEN 1 END) as read"),
        this.db.raw("COUNT(CASE WHEN status = 'replied' THEN 1 END) as replied")
      )
      .first();

    return stats;
  }
}
