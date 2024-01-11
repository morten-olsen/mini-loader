import { EventEmitter } from 'eventemitter3';
import { Database } from '../../database/database.js';
import { FindSecretOptions, SetSecretOptions } from './secrets.schemas.js';

type LogRepoEvents = {};

type LogRepoOptions = {
  database: Database;
};

class SecretRepo extends EventEmitter<LogRepoEvents> {
  #options: LogRepoOptions;

  constructor(options: LogRepoOptions) {
    super();
    this.#options = options;
  }

  public set = async (options: SetSecretOptions) => {
    const { database } = this.#options;
    const db = await database.instance;
    const current = await db('secrets').where('id', options.id).first();

    if (current) {
      await db('secrets').where('id', options.id).update({
        value: options.value,
        updatedAt: new Date(),
      });
    } else {
      await db('secrets').insert({
        id: options.id,
        value: options.value,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
  };

  public remove = async (id: string) => {
    const { database } = this.#options;
    const db = await database.instance;
    await db('logs').where('id', id).delete();
  };

  public getAll = async () => {
    const { database } = this.#options;
    const db = await database.instance;
    const secrets = await db('secrets').select('id', 'value');
    return secrets.reduce((acc, secret) => {
      acc[secret.id] = secret.value;
      return acc;
    }, {} as Record<string, string>);
  };

  public find = async (options: FindSecretOptions) => {
    const { database } = this.#options;
    const db = await database.instance;

    const query = db('secrets').select('id');

    if (options.offset) {
      query.offset(options.offset);
    }

    if (options.limit) {
      query.limit(options.limit);
    }

    const secrets = await query;

    return secrets;
  };
}

export { findSecretsSchema, setSecretSchema } from './secrets.schemas.js';
export { SecretRepo };
