/**
 * Migration: Create students table
 * Creates the students table with student information
 */
exports.up = async function(knex) {
  return knex.schema.createTable('students', (table) => {
    table.increments('id').primary();
    table.string('email').notNullable().unique().index();
    table.string('password').notNullable();
    table.string('name').notNullable();
    table.string('student_id').notNullable().unique();
    table.string('course_id').notNullable().unsigned().references('id').inTable('courses').onDelete('CASCADE');
    table.string('enrollment_status').notNullable().defaultTo('active'); // active, inactive, graduated
    table.decimal('gpa', 3, 2).defaultTo('0.00');
    table.timestamps(true, true);
  });
};

exports.down = async function(knex) {
  return knex.schema.dropTable('students');
};
