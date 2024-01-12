import envPaths from 'env-paths';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { mkdir, readdir } from 'fs/promises';
import { dirname, join } from 'path';

type ContextValues = {
  host: string;
  token: string;
};

class Context {
  #location: string;
  #config?: ContextValues;

  constructor(name: string) {
    const paths = envPaths('mini-loader');
    this.#location = join(paths.config, 'contexts', name);
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

  public static list = async () => {
    const paths = envPaths('mini-loader');
    const location = join(paths.config, 'contexts');
    if (!existsSync(location)) {
      return [];
    }
    return await readdir(location);
  };
}

export { Context };
