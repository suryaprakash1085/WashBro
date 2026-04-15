import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("homepage_content", (table) => {
    table.increments("id").primary();
    table.string("title", 255).notNullable();
    table.text("description");
    table.string("section", 100).notNullable();
    table.text("content");
    table.string("image_url", 500);
    table.integer("display_order").defaultTo(0);
    table.boolean("is_active").defaultTo(true);
    table.string("updated_by", 255);
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists("homepage_content");
}
