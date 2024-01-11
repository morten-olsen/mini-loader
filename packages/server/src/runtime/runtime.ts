import { Knex } from 'knex';
import { Database } from '../database/database.js';
import { Repos } from '../repos/repos.js';
import { Runner } from '../runner/runner.js';

type RuntimeOptions = {
  database: Knex.Config;
};

class Runtime {
  #repos: Repos;
  #runner: Runner;

  constructor(options: RuntimeOptions) {
    const database = new Database(options.database);
    this.#repos = new Repos({ database });
    this.#runner = new Runner({ repos: this.#repos });
  }

  public get repos() {
    return this.#repos;
  }

  public get runner() {
    return this.#runner;
  }
}

export { Runtime };
