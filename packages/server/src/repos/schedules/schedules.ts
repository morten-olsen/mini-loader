import { EventEmitter } from 'eventemitter3';
import { Database } from '../../database/database.js';
import { AddScheduleOptions, FindSchedulesOptions } from './schedules.schemas.js';
import { createHash } from 'crypto';
import { ContainerInstance, Service } from 'typedi';
import { IdGenerator } from '../../id/id.js';

type ScheduleRepoEvents = {
  added: (id: string) => void;
  removed: (id: string) => void;
};

type ScheduleRepoOptions = {
  database: Database;
  idGenerator: IdGenerator;
};

@Service()
class ScheduleRepo extends EventEmitter<ScheduleRepoEvents> {
  #options: ScheduleRepoOptions;

  constructor(container: ContainerInstance) {
    super();
    this.#options = {
      database: container.get(Database),
      idGenerator: container.get(IdGenerator),
    };
  }

  public get = async (id: string) => {
    const { database } = this.#options;
    const db = await database.instance;
    const result = await db('schedules').where('id', id).first();
    return result;
  };

  public add = async (options: AddScheduleOptions) => {
    const { database, idGenerator } = this.#options;
    const db = await database.instance;
    const id = idGenerator.generate();

    await db('schedules').insert({
      id,
      name: options.name,
      description: options.description,
      cron: options.cron,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    this.emit('added', id);

    return id;
  };

  public prepareRemove = async (options: FindSchedulesOptions) => {
    const { database } = this.#options;
    const db = await database.instance;

    const query = db('schedules').select('id');

    if (options.ids) {
      query.whereIn('id', options.ids);
    }

    if (options.loadIds) {
      query.whereIn('loadId', options.loadIds);
    }

    const result = await query;
    const ids = result.map((row) => row.id);
    const token = ids.map((id) => Buffer.from(id).toString('base64')).join('|');
    const hash = createHash('sha256').update(token).digest('hex');
    return {
      ids,
      hash,
    };
  };

  public remove = async (hash: string, ids: string[]) => {
    const { database } = this.#options;
    const db = await database.instance;
    const token = ids.map((id) => Buffer.from(id).toString('base64')).join('|');
    const actualHash = createHash('sha256').update(token).digest('hex');

    if (hash !== actualHash) {
      throw new Error('Invalid hash');
    }

    await db('schedules').whereIn('id', ids).delete();
    ids.forEach((id) => {
      this.emit('removed', id);
    });
  };

  public find = async (options: FindSchedulesOptions) => {
    const { database } = this.#options;
    const db = await database.instance;

    const query = db('schedules');

    if (options.ids) {
      query.whereIn('id', options.ids);
    }

    if (options.loadIds) {
      query.whereIn('loadId', options.loadIds);
    }

    if (options.offset) {
      query.offset(options.offset);
    }

    if (options.limit) {
      query.limit(options.limit);
    }

    const results = await query;
    return results;
  };
}

export { addScheduleSchema, findSchedulesSchema } from './schedules.schemas.js';
export { ScheduleRepo };
