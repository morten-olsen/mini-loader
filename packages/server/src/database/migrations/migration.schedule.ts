import { Knex } from 'knex';

const name = 'schedule-support';

const up = async (knex: Knex) => {
  await knex.schema.createTable('schedules', (table) => {
    table.string('id').primary();
    table.string('name').nullable();
    table.string('description').nullable();
    table.string('load').notNullable();
    table.string('cron').notNullable();
    table.string('input').nullable();
    table.timestamp('createdAt').notNullable();
    table.timestamp('updatedAt').notNullable();
  });
};

const down = async (knex: Knex) => {
  await knex.schema.dropTable('schedule');
};

export { name, up, down };
