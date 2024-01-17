import { EventEmitter } from 'eventemitter3';
import { Database } from '../../database/database.js';
import { CreateRunOptions, FindRunsOptions, UpdateRunOptions } from './runs.schemas.js';
import { LoadRepo } from '../loads/loads.js';
import { createHash } from 'crypto';
import { ContainerInstance, Service } from 'typedi';
import { IdGenerator } from '../../id/id.js';

type RunRepoEvents = {
  created: (args: { id: string; loadId: string }) => void;
  updated: (args: { id: string; loadId: string }) => void;
  failed: (args: { id: string; loadId: string }) => void;
  succeeded: (args: { id: string; loadId: string }) => void;
};

type RunRepoOptions = {
  database: Database;
  loads: LoadRepo;
  idGenerator: IdGenerator;
};

@Service()
class RunRepo extends EventEmitter<RunRepoEvents> {
  #options: RunRepoOptions;
  #isSetup?: Promise<void>;

  constructor(container: ContainerInstance) {
    super();
    this.#options = {
      database: container.get(Database),
      loads: container.get(LoadRepo),
      idGenerator: container.get(IdGenerator),
    };
  }

  #setup = async () => {
    const { database } = this.#options;
    const db = await database.instance;
    await db('runs').update({ status: 'failed', error: 'server was shut down' }).where({ status: 'running' });
  };

  get #isReady() {
    if (!this.#isSetup) {
      this.#isSetup = this.#setup();
    }
    return this.#isSetup;
  }

  public getById = async (id: string) => {
    await this.#isReady;
    const { database } = this.#options;
    const db = await database.instance;

    const run = await db('runs').where({ id }).first();
    if (!run) {
      throw new Error('Run not found');
    }
    return run;
  };

  public getByLoadId = async (loadId: string) => {
    await this.#isReady;
    const { database } = this.#options;
    const db = await database.instance;

    const runs = await db('runs').where({ loadId });
    return runs;
  };

  public find = async (options: FindRunsOptions) => {
    await this.#isReady;
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

  public prepareRemove = async (options: FindRunsOptions) => {
    await this.#isReady;
    const { database } = this.#options;
    const db = await database.instance;
    const query = db('runs').select('id');

    if (options.loadId) {
      query.where({ loadId: options.loadId });
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

    await db('runs').whereIn('id', ids).delete();
  };

  public started = async (id: string) => {
    await this.#isReady;
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
    await this.#isReady;
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
    await this.#isReady;
    const { database, loads, idGenerator } = this.#options;
    const id = idGenerator.generate();
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
