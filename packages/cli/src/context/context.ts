import envPaths from 'env-paths';
import { existsSync, readFileSync } from 'fs';
import { mkdir, readdir, writeFile } from 'fs/promises';
import { dirname, join } from 'path';
import { Config } from '../config/config.js';

type ContextValues = {
  host: string;
  token: string;
};

class Context {
  #location: string;
  #config?: ContextValues;

  constructor(config: Config) {
    this.#location = join(config.location, 'contexts', config.context);
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

  public saveLogin = async (host: string, token: string) => {
    this.#config = {
      ...(this.#config || {}),
      host,
      token,
    };
    await this.save();
  };

  public save = async () => {
    if (!this.#config) {
      return;
    }
    const json = JSON.stringify(this.#config);
    await mkdir(dirname(this.#location), { recursive: true });
    await writeFile(this.#location, json);
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
