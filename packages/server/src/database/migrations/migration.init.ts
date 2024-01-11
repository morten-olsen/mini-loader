import { Knex } from 'knex';

const name = 'init';

const up = async (knex: Knex) => {
  await knex.schema.createTable('loads', (table) => {
    table.string('id').primary();
    table.string('name').nullable();
    table.string('script').notNullable();
  });

  await knex.schema.createTable('runs', (table) => {
    table.string('id').primary();
    table.string('loadId').notNullable();
    table.string('status').notNullable();
    table.string('script').notNullable();
    table.string('input').nullable();
    table.string('error').nullable();
    table.timestamp('startedAt').nullable();
    table.timestamp('endedAt').nullable();

    table.index('loadId');
    table.index('status');
  });

  await knex.schema.createTable('logs', (table) => {
    table.string('id').primary();
    table.string('runId').notNullable();
    table.string('loadId').notNullable();
    table.string('severity').notNullable();
    table.string('message').notNullable();
    table.jsonb('data').nullable();
    table.timestamp('timestamp').notNullable();

    table.index('runId');
  });

  await knex.schema.createTable('artifacts', (table) => {
    table.string('id').primary();
    table.string('name').notNullable();
    table.string('runId').notNullable();
    table.string('loadId').notNullable();
    table.text('data').notNullable();

    table.index('runId');
  });

  await knex.schema.createTable('secrets', (table) => {
    table.string('id').primary();
    table.string('value').notNullable();
  });
};

const down = async (knex: Knex) => {
  await knex.schema.dropTable('loads');
  await knex.schema.dropTable('runs');
  await knex.schema.dropTable('logs');
  await knex.schema.dropTable('artifacts');
  await knex.schema.dropTable('secrets');
};

export { name, up, down };
