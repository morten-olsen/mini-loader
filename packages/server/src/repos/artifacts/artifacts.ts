import { EventEmitter } from 'eventemitter3';
import { Database } from '../../database/database.js';
import { nanoid } from 'nanoid';
import { AddArtifactOptions, FindArtifactsOptions } from './artifacts.schemas.js';

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

  public remove = async (options: FindArtifactsOptions) => {
    const { database } = this.#options;
    const db = await database.instance;

    const query = db('artifacts');

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

    await query.del();
  };

  public find = async (options: FindArtifactsOptions) => {
    const { database } = this.#options;
    const db = await database.instance;

    const query = db('artifacts').select(['id', 'name', 'runId', 'loadId']);

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
