/**
 * Migration: Create assignments table
 * Creates the assignments table with assignment details
 */
exports.up = async function(knex) {
  return knex.schema.createTable('assignments', (table) => {
    table.increments('id').primary();
    table.integer('course_id').notNullable().unsigned().references('id').inTable('courses').onDelete('CASCADE');
    table.string('title').notNullable();
    table.string('description').nullable();
    table.string('type').notNullable().defaultTo('homework'); // homework, exam, project, quiz
    table.integer('max_score').notNullable();
    table.string('due_date').nullable();
    table.boolean('published').notNullable().defaultTo(true);
    table.timestamps(true, true);
  });
};

exports.down = async function(knex) {
  return knex.schema.dropTable('assignments');
};
