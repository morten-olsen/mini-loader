import { EventEmitter } from 'eventemitter3';
import { Database } from '../../database/database.js';
import { FindLoadsOptions, SetLoadOptions } from './loads.schemas.js';
import { nanoid } from 'nanoid';

type LoadRepoEvents = {
  created: (id: string) => void;
  updated: (id: string) => void;
  deleted: (id: string) => void;
};

type LoadRepoOptions = {
  database: Database;
};

class LoadRepo extends EventEmitter<LoadRepoEvents> {
  #options: LoadRepoOptions;

  constructor(options: LoadRepoOptions) {
    super();
    this.#options = options;
  }

  public getById = async (id: string) => {
    const { database } = this.#options;
    const db = await database.instance;

    const loads = await db('loads').where({ id }).first();
    return loads;
  };

  public getScript = async (id: string) => {
    const load = await this.getById(id);
    return load?.script;
  };

  public find = async (options: FindLoadsOptions) => {
    const { database } = this.#options;
    const db = await database.instance;

    const query = db('loads').select(['id', 'name']);

    if (options.offset) {
      query.offset(options.offset);
    }

    if (options.limit) {
      query.limit(options.limit);
    }

    const loads = await query;
    return loads;
  };

  public set = async (options: SetLoadOptions) => {
    const { database } = this.#options;
    const db = await database.instance;
    const id = options.id || nanoid();

    const current = await this.getById(id);
    if (current) {
      await db('loads').where({ id }).update(options);
      this.emit('updated', id);
      return id;
    } else {
      await db('loads').insert({
        ...options,
        id,
      });
    }

    this.emit('updated', id);
    return id;
  };
}

export { setLoadSchema, findLoadsSchema } from './loads.schemas.js';
export { LoadRepo };
