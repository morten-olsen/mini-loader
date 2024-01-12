import envPaths from 'env-paths';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { mkdir } from 'fs/promises';
import { join, dirname } from 'path';

type ConfigValues = {
  context?: string;
};

class Config {
  #location: string;
  #config?: ConfigValues;

  constructor() {
    const paths = envPaths('mini-loader');
    this.#location = join(paths.config, 'config.json');
    if (existsSync(this.#location)) {
      this.#config = JSON.parse(readFileSync(this.#location, 'utf-8'));
    }
  }

  public get context() {
    return this.#config?.context || 'default';
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
    writeFileSync(this.#location, json);
  };
}

export { Config };
