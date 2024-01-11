import { EventEmitter } from 'eventemitter3';
import { Database } from '../../database/database.js';
import { AddLogOptions, FindLogsOptions } from './logs.schemas.js';
import { nanoid } from 'nanoid';

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

  public remove = async (options: FindLogsOptions) => {
    const { database } = this.#options;
    const db = await database.instance;

    const query = db('logs');

    if (options.runId) {
      query.where({ runId: options.runId });
    }

    if (options.loadId) {
      query.where({ loadId: options.loadId });
    }

    if (options.severities) {
      query.whereIn('severity', options.severities);
    }

    await query.del();
  };

  public find = async (options: FindLogsOptions) => {
    const { database } = this.#options;
    const db = await database.instance;

    const query = db('logs');

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
