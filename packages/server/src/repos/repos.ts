import { Config } from '../config/config.js';
import { Database } from '../database/database.js';
import { ArtifactRepo } from './artifacts/artifacts.js';
import { LoadRepo } from './loads/loads.js';
import { LogRepo } from './logs/logs.js';
import { RunRepo } from './runs/runs.js';
import { SecretRepo } from './secrets/secrets.js';

type ReposOptions = {
  database: Database;
  config: Config;
};

class Repos {
  #loads: LoadRepo;
  #runs: RunRepo;
  #logs: LogRepo;
  #artifacts: ArtifactRepo;
  #secrets: SecretRepo;

  constructor({ database, config }: ReposOptions) {
    this.#loads = new LoadRepo({
      database,
      config,
    });
    this.#runs = new RunRepo({
      database,
      loads: this.#loads,
    });
    this.#logs = new LogRepo({
      database,
    });
    this.#artifacts = new ArtifactRepo({
      database,
    });
    this.#secrets = new SecretRepo({
      database,
    });
  }

  public get loads() {
    return this.#loads;
  }

  public get runs() {
    return this.#runs;
  }

  public get logs() {
    return this.#logs;
  }

  public get artifacts() {
    return this.#artifacts;
  }

  public get secrets() {
    return this.#secrets;
  }
}

export { findLogsSchema, addLogSchema } from './logs/logs.js';
export { setLoadSchema, findLoadsSchema } from './loads/loads.js';
export { createRunSchema, findRunsSchema } from './runs/runs.js';
export { addArtifactSchema, findArtifactsSchema } from './artifacts/artifacts.js';
export { Repos };
