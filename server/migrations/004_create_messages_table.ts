import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("messages", (table) => {
    table.increments("id").primary();
    table.string("name", 255).notNullable();
    table.string("email", 255).notNullable();
    table.string("phone", 20);
    table.text("message").notNullable();
    table.enum("status", ["unread", "read", "replied"]).defaultTo("unread");
    table.text("reply_message");
    table.timestamp("replied_at");
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists("messages");
}
