import envPaths from 'env-paths';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { mkdir } from 'fs/promises';
import { dirname } from 'path';

type ContextValues = {
  host: string;
  token: string;
};

class Context {
  #location: string;
  #config?: ContextValues;

  constructor() {
    const paths = envPaths('dws');
    this.#location = paths.config;
    if (existsSync(this.#location)) {
      this.#config = JSON.parse(readFileSync(this.#location, 'utf-8'));
    }
  }

  public get host() {
    return this.#config?.host;
  }

  public get token() {
    return this.#config?.token;
  }

  public saveLogin = (host: string, token: string) => {
    this.#config = {
      ...(this.#config || {}),
      host,
      token,
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

export { Context };
