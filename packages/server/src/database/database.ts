import knex, { Knex } from 'knex';

import { source } from './migrations/migrations.source.js';

const tableNames = {
  loads: 'loads',
};

class Database {
  #instance?: Promise<Knex>;
  #config: Knex.Config;

  constructor(config: Knex.Config) {
    this.#config = {
      ...config,
      migrations: {
        migrationSource: source,
      },
    };
  }

  #setup = async (config: Knex.Config) => {
    const db = knex(config);
    await db.migrate.latest();
    return db;
  };

  public get instance() {
    if (!this.#instance) {
      this.#instance = this.#setup(this.#config);
    }
    return this.#instance;
  }
}

export { Database, tableNames };
