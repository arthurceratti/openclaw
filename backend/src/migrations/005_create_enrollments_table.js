/**
 * Migration: Create enrollments table
 * Creates the enrollments table to link students with assignments
 */
exports.up = async function(knex) {
  return knex.schema.createTable('enrollments', (table) => {
    table.increments('id').primary();
    table.integer('student_id').notNullable().unsigned().references('id').inTable('students').onDelete('CASCADE');
    table.integer('assignment_id').notNullable().unsigned().references('id').inTable('assignments').onDelete('CASCADE');
    table.string('status').notNullable().defaultTo('pending'); // pending, submitted, graded
    table.string('submission_date').nullable();
    table.string('feedback').nullable();
    table.integer('score').nullable();
    table.boolean('submitted').notNullable().defaultTo(false);
    table.timestamps(true, true);
    table.unique(['student_id', 'assignment_id']);
  });
};

exports.down = async function(knex) {
  return knex.schema.dropTable('enrollments');
};
