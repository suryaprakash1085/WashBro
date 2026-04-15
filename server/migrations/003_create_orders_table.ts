import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("orders", (table) => {
    table.increments("id").primary();
    table.integer("customer_id").unsigned().notNullable();
    table.integer("service_id").unsigned().notNullable();
    table.string("service_name", 255).notNullable();
    table.decimal("price", 10, 2).notNullable();
    table.enum("status", ["pending", "confirmed", "in_progress", "completed", "cancelled"]).defaultTo("pending");
    table.dateTime("scheduled_date").notNullable();
    table.text("notes");
    table.decimal("total_amount", 10, 2).notNullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());

    // Foreign keys
    table.foreign("customer_id").references("id").inTable("users").onDelete("CASCADE");
    table.foreign("service_id").references("id").inTable("services").onDelete("RESTRICT");
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists("orders");
}
