import knex, { Knex } from 'knex';

import { source } from './migrations/migrations.source.js';

const tableNames = {
  loads: 'loads',
};

class Database {
  #instance: Promise<Knex>;

  constructor(config: Knex.Config) {
    this.#instance = this.#setup({
      ...config,
      migrations: {
        migrationSource: source,
      },
    });
  }

  #setup = async (config: Knex.Config) => {
    const db = knex(config);
    await db.migrate.latest();
    process.on('SIGINT', () => db.destroy());
    return db;
  };

  public get instance() {
    return this.#instance;
  }
}

export { Database, tableNames };
