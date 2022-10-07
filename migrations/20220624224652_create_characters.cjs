/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {

  return knex.schema.createTable('characters', (table) =>{
    table.increments('id').primary();
    table.integer('raid_team').references('id').inTable('raid_teams');
    table.string('name').notNullable().unique();
    table.integer('dkp').notNullable();
    table.string('class')
    table.string('role')
  })

};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {

  return knex.schema.dropTableIfExists('characters');

};
