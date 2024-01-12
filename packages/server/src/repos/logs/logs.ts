import { EventEmitter } from 'eventemitter3';
import { Database } from '../../database/database.js';
import { AddLogOptions, FindLogsOptions } from './logs.schemas.js';
import { nanoid } from 'nanoid';
import { createHash } from 'crypto';

type LogRepoEvents = {};

type LogRepoOptions = {
  database: Database;
};

class LogRepo extends EventEmitter<LogRepoEvents> {
  #options: LogRepoOptions;

  constructor(options: LogRepoOptions) {
    super();
    this.#options = options;
  }

  public add = async (options: AddLogOptions) => {
    const { database } = this.#options;
    const db = await database.instance;
    const id = nanoid();

    await db('logs').insert({
      id,
      runId: options.runId,
      loadId: options.loadId,
      severity: options.severity,
      message: options.message,
      data: options.data,
      timestamp: new Date(),
    });
  };

  public prepareRemove = async (options: FindLogsOptions) => {
    const { database } = this.#options;
    const db = await database.instance;

    const query = db('logs').select('id');

    if (options.ids) {
      query.whereIn('id', options.ids);
    }

    if (options.runId) {
      query.where({ runId: options.runId });
    }

    if (options.loadId) {
      query.where({ loadId: options.loadId });
    }

    if (options.severities) {
      query.whereIn('severity', options.severities);
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

    await db('logs').whereIn('id', ids).delete();
  };

  public find = async (options: FindLogsOptions) => {
    const { database } = this.#options;
    const db = await database.instance;

    const query = db('logs');

    if (options.ids) {
      query.whereIn('id', options.ids);
    }

    if (options.runId) {
      query.where({ runId: options.runId });
    }

    if (options.loadId) {
      query.where({ loadId: options.loadId });
    }

    if (options.severities) {
      query.whereIn('severity', options.severities);
    }

    if (options.offset) {
      query.offset(options.offset);
    }

    if (options.limit) {
      query.limit(options.limit);
    }

    if (options.order) {
      query.orderBy('timestamp', options.order);
    }

    const logs = await query;

    return logs;
  };
}

export { addLogSchema, findLogsSchema } from './logs.schemas.js';
export { LogRepo };
