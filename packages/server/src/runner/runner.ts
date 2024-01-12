import { Config } from '../config/config.js';
import { Repos } from '../repos/repos.js';
import { RunnerInstance } from './runner.instance.js';

type RunnerOptions = {
  repos: Repos;
  config: Config;
};

class Runner {
  #options: RunnerOptions;
  #instances: Map<string, RunnerInstance> = new Map();

  constructor(options: RunnerOptions) {
    this.#options = options;
    const { repos } = options;
    repos.runs.on('created', this.#start);
  }

  #start = async (args: { id: string; loadId: string }) => {
    const { repos, config } = this.#options;
    if (this.#instances.has(args.id)) {
      return;
    }
    const instance = new RunnerInstance({
      id: args.id,
      loadId: args.loadId,
      repos,
      config,
    });

    instance.on('completed', () => {
      this.#instances.delete(args.id);
    });

    this.#instances.set(args.id, instance);
    await instance.start();
  };

  public getInstance = (id: string) => {
    return this.#instances.get(id);
  };
}

export { Runner };
