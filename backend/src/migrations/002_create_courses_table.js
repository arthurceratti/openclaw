/**
 * Migration: Create courses table
 * Creates the courses table with basic course information
 */
exports.up = async function(knex) {
  return knex.schema.createTable('courses', (table) => {
    table.increments('id').primary();
    table.string('code').notNullable().unique();
    table.string('name').notNullable();
    table.string('description').nullable();
    table.string('instructor').notNullable();
    table.string('semester').nullable();
    table.boolean('active').notNullable().defaultTo(true);
    table.timestamps(true, true);
  });
};

exports.down = async function(knex) {
  return knex.schema.dropTable('courses');
};
