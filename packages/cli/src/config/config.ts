import { existsSync, readFileSync } from 'fs';
import { mkdir, writeFile } from 'fs/promises';
import { join, dirname } from 'path';
import { ContainerInstance, Service } from 'typedi';
import { Paths } from '../paths/paths.js';

type ConfigValues = {
  context?: string;
};

@Service()
class Config {
  #paths: Paths;
  #location: string;
  #config?: ConfigValues;

  constructor(contianer: ContainerInstance) {
    this.#paths = contianer.get(Paths);
    this.#location = join(this.#paths.config, 'config.json');
    if (existsSync(this.#location)) {
      this.#config = JSON.parse(readFileSync(this.#location, 'utf-8'));
    }
  }

  public get context() {
    return this.#config?.context || 'default';
  }

  public get location() {
    return this.#paths.config;
  }

  public get cacheLocation() {
    return join(this.#paths.cache, this.context);
  }

  public setContext = (context: string) => {
    this.#config = {
      ...(this.#config || {}),
      context,
    };
    this.save();
  };

  public save = async () => {
    if (!this.#config) {
      return;
    }
    const json = JSON.stringify(this.#config);
    mkdir(dirname(this.#location), { recursive: true });
    writeFile(this.#location, json);
  };
}

export { Config };
