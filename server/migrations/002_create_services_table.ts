import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("services", (table) => {
    table.increments("id").primary();
    table.string("name", 255).notNullable();
    table.text("description");
    table.string("category", 100).notNullable();
    table.decimal("price", 10, 2).notNullable();
    table.integer("duration_minutes").notNullable();
    table.text("image_url");
    table.boolean("is_active").defaultTo(true);
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists("services");
}
