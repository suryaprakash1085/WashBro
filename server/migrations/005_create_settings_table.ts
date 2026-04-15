import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("settings", (table) => {
    table.increments("id").primary();
    table.string("key", 255).unique().notNullable();
    table.text("value").notNullable();
    table.string("description", 500);
    table.string("category", 100);
    table.boolean("is_active").defaultTo(true);
    table.string("updated_by", 255);
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists("settings");
}
