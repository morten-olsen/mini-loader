import { nanoid } from 'nanoid';
import { EventEmitter } from 'eventemitter3';
import { Database } from '../../database/database.js';
import { CreateRunOptions, FindRunsOptions, UpdateRunOptions } from './runs.schemas.js';
import { LoadRepo } from '../loads/loads.js';

type RunRepoEvents = {
  created: (args: { id: string; loadId: string }) => void;
  updated: (args: { id: string; loadId: string }) => void;
  failed: (args: { id: string; loadId: string }) => void;
  succeeded: (args: { id: string; loadId: string }) => void;
};

type RunRepoOptions = {
  database: Database;
  loads: LoadRepo;
};

class RunRepo extends EventEmitter<RunRepoEvents> {
  #options: RunRepoOptions;

  constructor(options: RunRepoOptions) {
    super();
    this.#options = options;
  }

  public getById = async (id: string) => {
    const { database } = this.#options;
    const db = await database.instance;

    const run = await db('runs').where({ id }).first();
    if (!run) {
      throw new Error('Run not found');
    }
    return run;
  };

  public getByLoadId = async (loadId: string) => {
    const { database } = this.#options;
    const db = await database.instance;

    const runs = await db('runs').where({ loadId });
    return runs;
  };

  public find = async (options: FindRunsOptions) => {
    const { database } = this.#options;
    const db = await database.instance;
    const query = db('runs').select(['id', 'status', 'startedAt', 'status', 'error', 'endedAt']);

    if (options.loadId) {
      query.where({ loadId: options.loadId });
    }
    if (options.offset) {
      query.offset(options.offset);
    }
    if (options.limit) {
      query.limit(options.limit);
    }

    const runs = await query;
    return runs;
  };

  public remove = async (options: FindRunsOptions) => {
    const { database } = this.#options;
    const db = await database.instance;
    const query = db('runs');

    if (options.loadId) {
      query.where({ loadId: options.loadId });
    }

    await query.del();
  };

  public started = async (id: string) => {
    const { database } = this.#options;
    const db = await database.instance;
    const current = await this.getById(id);
    if (!current) {
      throw new Error('Run not found');
    }
    const { loadId } = current;

    const runs = await db('runs').where({ id }).update({
      status: 'running',
      startedAt: new Date(),
    });
    this.emit('updated', { id, loadId });
    return runs;
  };

  public finished = async (id: string, options: UpdateRunOptions) => {
    const { database } = this.#options;
    const db = await database.instance;
    const { loadId } = await this.getById(id);

    const runs = await db('runs').where({ id }).update({
      status: options.status,
      error: options.error,
      endedAt: new Date(),
    });
    this.emit('updated', { id, loadId });
    switch (options.status) {
      case 'failed':
        this.emit('failed', { id, loadId });
        break;
      case 'succeeded':
        this.emit('succeeded', { id, loadId });
        break;
    }
    return runs;
  };

  public create = async (options: CreateRunOptions) => {
    const { database, loads } = this.#options;
    const id = nanoid();
    const db = await database.instance;

    const script = await loads.getScript(options.loadId);
    await db('runs').insert({
      id,
      script,
      loadId: options.loadId,
      status: 'created',
      createdAt: new Date(),
    });

    this.emit('created', {
      id,
      loadId: options.loadId,
    });

    return id;
  };
}

export { createRunSchema, findRunsSchema } from './runs.schemas.js';
export { RunRepo };
