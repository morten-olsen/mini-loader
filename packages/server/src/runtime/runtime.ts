import { Database } from '../database/database.js';
import { Repos } from '../repos/repos.js';
import { Runner } from '../runner/runner.js';
import { Config } from '../config/config.js';
import { Auth } from '../auth/auth.js';
import { resolve } from 'path';
import { Scheduler } from '../scheduler/scheduler.js';

class Runtime {
  #repos: Repos;
  #runner: Runner;
  #auth: Auth;
  #scheduler: Scheduler;

  constructor(options: Config) {
    const database = new Database(options.database);
    this.#repos = new Repos({ database, config: options });
    this.#runner = new Runner({ repos: this.#repos, config: options });
    this.#auth = new Auth({ config: options });
    this.#scheduler = new Scheduler({ runs: this.#repos.runs, schedules: this.#repos.schedules });
  }

  public get repos() {
    return this.#repos;
  }

  public get runner() {
    return this.#runner;
  }

  public get auth() {
    return this.#auth;
  }

  public get scheduler() {
    return this.#scheduler;
  }

  public static create = async () => {
    const runtime = new Runtime({
      database: {
        client: 'sqlite3',
        connection: {
          filename: resolve(process.cwd(), 'data', 'database.sqlite'),
        },
        useNullAsDefault: true,
      },
      files: {
        location: resolve(process.cwd(), 'data', 'files'),
      },
    });

    return runtime;
  };
}

export { Runtime };
