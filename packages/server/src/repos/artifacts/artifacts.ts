import { EventEmitter } from 'eventemitter3';
import { Database } from '../../database/database.js';
import { AddArtifactOptions, FindArtifactsOptions } from './artifacts.schemas.js';
import { createHash } from 'crypto';
import { ContainerInstance, Service } from 'typedi';
import { IdGenerator } from '../../id/id.js';

type ArtifactRepoEvents = {};

type ArtifactRepoOptions = {
  database: Database;
  idGenerator: IdGenerator;
};

@Service()
class ArtifactRepo extends EventEmitter<ArtifactRepoEvents> {
  #options: ArtifactRepoOptions;

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
    const result = await db('artifacts').where({ id }).first();
    return result || null;
  };

  public add = async (options: AddArtifactOptions) => {
    const { database, idGenerator } = this.#options;
    const db = await database.instance;
    const id = idGenerator.generate();

    await db('artifacts').insert({
      id,
      name: options.name,
      runId: options.runId,
      loadId: options.loadId,
      data: Buffer.from(options.data).toString('base64'),
      createdAt: new Date(),
    });
  };

  public prepareRemove = async (options: FindArtifactsOptions) => {
    const { database } = this.#options;
    const db = await database.instance;

    const query = db('artifacts').select('id');

    if (options.ids) {
      query.whereIn('id', options.ids);
    }

    if (options.runId) {
      query.where({ runId: options.runId });
    }

    if (options.loadId) {
      query.where({ loadId: options.loadId });
    }

    if (options.offset) {
      query.offset(options.offset);
    }

    if (options.limit) {
      query.limit(options.limit);
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

    await db('artifacts').whereIn('id', ids).delete();
  };

  public find = async (options: FindArtifactsOptions) => {
    const { database } = this.#options;
    const db = await database.instance;

    const query = db('artifacts').select(['id', 'name', 'runId', 'loadId']);

    if (options.ids) {
      query.whereIn('id', options.ids);
    }

    if (options.runId) {
      query.where({ runId: options.runId });
    }

    if (options.loadId) {
      query.where({ loadId: options.loadId });
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

export { addArtifactSchema, findArtifactsSchema } from './artifacts.schemas.js';
export { ArtifactRepo };
