import { nanoid } from 'nanoid';
import { resolve } from 'path';
import { existsSync } from 'fs';
import { mkdir, readFile, writeFile } from 'fs/promises';
import jwt from 'jsonwebtoken';
import { Config } from '../config/config.js';
import { ContainerInstance, Service } from 'typedi';

type AuthOptions = {
  config: Config;
};

@Service()
class Auth {
  #options: AuthOptions;
  #data: Promise<{ secret: string }>;

  constructor(container: ContainerInstance) {
    this.#options = {
      config: container.get(Config),
    };
    this.#data = this.#setup();
  }

  #setup = async () => {
    const { config } = this.#options;
    const secretLocation = resolve(config.files.data, 'secret');
    let secret = '';
    await mkdir(config.files.data, { recursive: true });
    if (!existsSync(secretLocation)) {
      secret = nanoid();
      await writeFile(secretLocation, secret);
    } else {
      secret = await readFile(secretLocation, 'utf-8');
    }
    return {
      secret,
    };
  };

  public createToken = async (data: object) => {
    const { secret } = await this.#data;
    const token = jwt.sign(data, secret);
    return token;
  };

  public validateToken = async (token: string) => {
    const { secret } = await this.#data;
    const result = jwt.verify(token, secret);
    return result as object;
  };
}

export { Auth };
