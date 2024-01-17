import knex, { Knex } from 'knex';
import { Service, ContainerInstance } from 'typedi';

import { Config } from '../config/config.js';
import { source } from './migrations/migrations.source.js';
import { mkdir } from 'fs/promises';
import { dirname } from 'path';

const tableNames = {
  loads: 'loads',
};

@Service()
class Database {
  #instance?: Promise<Knex>;
  #config: Knex.Config;

  constructor(container: ContainerInstance) {
    const config = container.get(Config);
    this.#config = {
      ...config.database,
      migrations: {
        migrationSource: source,
      },
    };
  }

  #setup = async (config: Knex.Config) => {
    if (
      config.connection &&
      typeof config.connection !== 'string' &&
      'filename' in config.connection &&
      typeof config.connection.filename === 'string' &&
      config.connection.filename !== ':memory:'
    ) {
      await mkdir(dirname(config.connection.filename), { recursive: true });
    }
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
