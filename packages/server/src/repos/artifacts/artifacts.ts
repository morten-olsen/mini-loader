import { EventEmitter } from 'eventemitter3';
import { Database } from '../../database/database.js';
import { nanoid } from 'nanoid';
import { AddArtifactOptions, FindArtifactsOptions } from './artifacts.schemas.js';
import { createHash } from 'crypto';

type ArtifactRepoEvents = {};

type ArtifactRepoOptions = {
  database: Database;
};

class ArtifactRepo extends EventEmitter<ArtifactRepoEvents> {
  #options: ArtifactRepoOptions;

  constructor(options: ArtifactRepoOptions) {
    super();
    this.#options = options;
  }

  public add = async (options: AddArtifactOptions) => {
    const { database } = this.#options;
    const db = await database.instance;
    const id = nanoid();

    await db('artifacts').insert({
      id,
      name: options.name,
      runId: options.runId,
      loadId: options.loadId,
      data: Buffer.from(options.data).toString('base64'),
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

    const ids = await query;
    const token = ids.map((id) => Buffer.from(id.id).toString('base64')).join('|');
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
