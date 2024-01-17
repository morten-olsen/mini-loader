import { ContainerInstance, Service } from 'typedi';
import { ArtifactRepo } from './artifacts/artifacts.js';
import { LoadRepo } from './loads/loads.js';
import { LogRepo } from './logs/logs.js';
import { RunRepo } from './runs/runs.js';
import { ScheduleRepo } from './schedules/schedules.js';
import { SecretRepo } from './secrets/secrets.js';

@Service()
class Repos {
  #container: ContainerInstance;

  constructor(container: ContainerInstance) {
    this.#container = container;
  }

  public get loads() {
    return this.#container.get(LoadRepo);
  }

  public get runs() {
    return this.#container.get(RunRepo);
  }

  public get logs() {
    return this.#container.get(LogRepo);
  }

  public get artifacts() {
    return this.#container.get(ArtifactRepo);
  }

  public get secrets() {
    return this.#container.get(SecretRepo);
  }

  public get schedules() {
    return this.#container.get(ScheduleRepo);
  }
}

export { findSchedulesSchema, addScheduleSchema } from './schedules/schedules.js';
export { findLogsSchema, addLogSchema } from './logs/logs.js';
export { setLoadSchema, findLoadsSchema } from './loads/loads.js';
export { createRunSchema, findRunsSchema } from './runs/runs.js';
export { addArtifactSchema, findArtifactsSchema } from './artifacts/artifacts.js';
export { Repos };
