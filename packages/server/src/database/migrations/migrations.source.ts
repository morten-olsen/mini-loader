import { Knex } from 'knex';

import * as init from './migration.init.js';
import * as scheduleSupport from './migration.schedule.js';

type Migration = {
  name: string;
  up: (knex: Knex) => Promise<void>;
  down: (knex: Knex) => Promise<void>;
};

const migrations = [init, scheduleSupport] satisfies Migration[];

const source: Knex.MigrationSource<Migration> = {
  getMigrations: async () => migrations,
  getMigration: async (migration) => migration,
  getMigrationName: (migration) => migration.name,
};

export { source };
