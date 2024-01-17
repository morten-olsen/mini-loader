import { ContainerInstance, Service } from 'typedi';
import { Context } from '../context/context.js';
import { Config } from '../config/config.js';
import { Client, createClient } from '../client/client.js';
import type { Runtime } from '@morten-olsen/mini-loader-server';
import { Terminal } from './output.js';

@Service()
class CliApi {
  #container: ContainerInstance;
  #client?: Client;

  constructor(container: ContainerInstance) {
    this.#container = container;
  }

  public get log() {
    return this.#container.get(Terminal).log;
  }

  public get step() {
    return this.#container.get(Terminal).step;
  }

  public get output() {
    return this.#container.get(Terminal).output;
  }

  public get config() {
    return this.#container.get(Config);
  }

  public get client() {
    if (!this.#client) {
      this.#client = createClient(this.context);
    }
    return this.#client;
  }

  public get context() {
    return new Context(this.config);
  }
}

export type { Runtime };
export { CliApi };
