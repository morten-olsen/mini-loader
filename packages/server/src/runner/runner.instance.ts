import { EventEmitter } from 'eventemitter3';
import { RunInfo, run } from '@morten-olsen/mini-loader-runner';
import { Repos } from '../repos/repos.js';
import { LoggerEvent } from '../../../mini-loader/dist/esm/logger/logger.js';
import { ArtifactCreateEvent } from '../../../mini-loader/dist/esm/artifacts/artifacts.js';
import { Config } from '../config/config.js';
import { resolve } from 'path';
import { readFile } from 'fs/promises';

type RunnerInstanceEvents = {
  completed: (args: { id: string }) => void;
};

type RunnerInstanceOptions = {
  id: string;
  loadId: string;
  repos: Repos;
  config: Config;
};

class RunnerInstance extends EventEmitter<RunnerInstanceEvents> {
  #options: RunnerInstanceOptions;
  #run?: RunInfo;

  constructor(options: RunnerInstanceOptions) {
    super();
    this.#options = options;
  }

  public get run() {
    return this.#run;
  }

  #addLog = async (event: LoggerEvent['payload']) => {
    const { repos, id, loadId } = this.#options;
    const { logs } = repos;
    await logs.add({
      runId: id,
      loadId,
      severity: event.severity,
      message: event.message,
      data: event.data,
    });
  };

  #addArtifact = async (event: ArtifactCreateEvent['payload']) => {
    const { repos, id, loadId } = this.#options;
    const { artifacts } = repos;
    await artifacts.add({
      name: event.name,
      runId: id,
      loadId,
      data: event.data,
    });
  };

  public start = async () => {
    const { repos, id, config } = this.#options;
    const { runs, secrets } = repos;
    try {
      const { script: scriptHash, input } = await runs.getById(id);
      const scriptLocation = resolve(config.files.location, 'scripts', `${scriptHash}.js`);
      const script = await readFile(scriptLocation, 'utf-8');
      const allSecrets = await secrets.getAll();
      await runs.started(id);
      const current = await run({
        script,
        secrets: allSecrets,
        input,
      });
      this.#run = current;
      const { promise, emitter } = current;
      emitter.on('message', (message) => {
        switch (message.type) {
          case 'log': {
            this.#addLog(message.payload);
            break;
          }
          case 'artifact:create': {
            this.#addArtifact(message.payload);
            break;
          }
        }
      });
      await promise;
      await runs.finished(id, { status: 'succeeded' });
    } catch (error) {
      let errorMessage = 'Unknown error';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      await runs.finished(id, { status: 'failed', error: errorMessage });
    } finally {
      this.#run = undefined;
      this.emit('completed', { id });
    }
  };
}

export type { RunInfo };
export { RunnerInstance };
