import { send } from '../utils.js';

type LoggerEvent = {
  type: 'log';
  payload: {
    severity: 'info' | 'warning' | 'error';
    message: string;
    data?: unknown;
  };
};

const sendLog = async (event: LoggerEvent['payload']) => {
  await send({
    type: 'log',
    payload: event,
  });
};

const info = async (message: string, data?: unknown) => {
  await sendLog({
    severity: 'info',
    message,
    data,
  });
};

const warn = async (message: string, data?: unknown) => {
  await sendLog({
    severity: 'warning',
    message,
    data,
  });
};

const error = async (message: string, data?: unknown) => {
  await sendLog({
    severity: 'error',
    message,
    data,
  });
};

const logger = {
  info,
  warn,
  error,
};

export type { LoggerEvent };
export { logger };
