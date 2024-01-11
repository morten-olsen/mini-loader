import { Database } from '../database/database.js';
import { ArtifactRepo } from './artifacts/artifacts.js';
import { LoadRepo } from './loads/loads.js';
import { LogRepo } from './logs/logs.js';
import { RunRepo } from './runs/runs.js';

type ReposOptions = {
  database: Database;
};

class Repos {
  #loads: LoadRepo;
  #runs: RunRepo;
  #logs: LogRepo;
  #artifacts: ArtifactRepo;

  constructor({ database }: ReposOptions) {
    this.#loads = new LoadRepo({
      database,
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
}

export { findLogsSchema, addLogSchema } from './logs/logs.js';
export { setLoadSchema, findLoadsSchema } from './loads/loads.js';
export { createRunSchema, findRunsSchema } from './runs/runs.js';
export { addArtifactSchema, findArtifactsSchema } from './artifacts/artifacts.js';
export { Repos };
