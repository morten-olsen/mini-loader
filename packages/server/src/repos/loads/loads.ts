import { EventEmitter } from 'eventemitter3';
import { Database } from '../../database/database.js';
import { FindLoadsOptions, SetLoadOptions } from './loads.schemas.js';
import { nanoid } from 'nanoid';
import { createHash } from 'crypto';
import { Config } from '../../config/config.js';
import { mkdir, writeFile } from 'fs/promises';
import { resolve } from 'path';

type LoadRepoEvents = {
  created: (id: string) => void;
  updated: (id: string) => void;
  deleted: (id: string) => void;
};

type LoadRepoOptions = {
  database: Database;
  config: Config;
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
    const script = createHash('sha256').update(options.script).digest('hex');
    const scriptDir = resolve(this.#options.config.files.data, 'scripts');
    await mkdir(scriptDir, { recursive: true });
    await writeFile(resolve(scriptDir, `${script}.js`), options.script);

    const current = await this.getById(id);
    if (current) {
      await db('loads').where({ id }).update({
        name: options.name,
        script,
        updatedAt: new Date(),
      });
      this.emit('updated', id);
      return id;
    } else {
      await db('loads').insert({
        id,
        name: options.name,
        updatedAt: new Date(),
        createdAt: new Date(),
        script,
      });
    }

    this.emit('updated', id);
    return id;
  };
}

export { setLoadSchema, findLoadsSchema } from './loads.schemas.js';
export { LoadRepo };
