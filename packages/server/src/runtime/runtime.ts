import { ContainerInstance, Service } from 'typedi';
import { Repos } from '../repos/repos.js';
import { Runner } from '../runner/runner.js';
import { Auth } from '../auth/auth.js';
import { Scheduler } from '../scheduler/scheduler.js';

@Service()
class Runtime {
  #repos: Repos;
  #runner: Runner;
  #auth: Auth;
  #scheduler: Scheduler;

  constructor(container: ContainerInstance) {
    this.#repos = container.get(Repos);
    this.#runner = container.get(Runner);
    this.#auth = container.get(Auth);
    this.#scheduler = container.get(Scheduler);
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
}

export { Runtime };
