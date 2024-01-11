import { EventEmitter } from 'eventemitter3';
import { run } from '@morten-olsen/mini-loader-runner';
import { Repos } from '../repos/repos.js';
import { LoggerEvent } from '../../../mini-loader/dist/esm/logger/logger.js';
import { ArtifactCreateEvent } from '../../../mini-loader/dist/esm/artifacts/artifacts.js';

type RunnerInstanceEvents = {
  completed: (args: { id: string }) => void;
};

type RunnerInstanceOptions = {
  id: string;
  loadId: string;
  repos: Repos;
};

class RunnerInstance extends EventEmitter<RunnerInstanceEvents> {
  #options: RunnerInstanceOptions;

  constructor(options: RunnerInstanceOptions) {
    super();
    this.#options = options;
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
    console.log('evt', event);
    await artifacts.add({
      name: event.name,
      runId: id,
      loadId,
      data: event.data,
    });
  };

  public start = async () => {
    const { repos, id } = this.#options;
    const { runs } = repos;
    const { script } = await runs.getById(id);
    try {
      await runs.started(id);
      const { promise, emitter } = await run({ script });
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
      this.emit('completed', { id });
    }
  };
}

export { RunnerInstance };
