/**
 * Migration: Create users table
 * Creates the main users table with authentication fields
 */
exports.up = async function(knex) {
  return knex.schema.createTable('users', (table) => {
    table.increments('id').primary();
    table.string('email').notNullable().unique().index();
    table.string('password').notNullable();
    table.string('name').notNullable();
    table.string('role').notNullable().defaultTo('user').index(); // user, admin
    table.timestamps(true, true);
  });
};

exports.down = async function(knex) {
  return knex.schema.dropTable('users');
};
