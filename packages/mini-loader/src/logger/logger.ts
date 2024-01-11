import { send } from '../utils.js';

type LoggerEvent = {
  type: 'log';
  payload: {
    severity: 'info' | 'warning' | 'error';
    message: string;
    data?: unknown;
  };
};

const sendLog = (event: LoggerEvent['payload']) => {
  send({
    type: 'log',
    payload: event,
  });
};

const info = (message: string, data?: unknown) => {
  sendLog({
    severity: 'info',
    message,
    data,
  });
};

const warn = (message: string, data?: unknown) => {
  sendLog({
    severity: 'warning',
    message,
    data,
  });
};

const error = (message: string, data?: unknown) => {
  sendLog({
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
