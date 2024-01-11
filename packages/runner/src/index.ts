import { Worker } from 'worker_threads';
import { EventEmitter } from 'eventemitter3';
import { Event } from '@morten-olsen/mini-loader';

type RunEvents = {
  message: (event: Event) => void;
  error: (error: Error) => void;
  exit: () => void;
};

type RunOptions = {
  script: string;
  input?: unknown;
  secrets?: Record<string, string>;
};

const run = async ({ script, input, secrets }: RunOptions) => {
  const emitter = new EventEmitter<RunEvents>();
  const worker = new Worker(script, {
    eval: true,
    workerData: {
      input,
      secrets,
    },
  });

  const promise = new Promise<void>((resolve, reject) => {
    worker.on('message', (message: Event) => {
      emitter.emit('message', message);
    });
    worker.on('exit', () => {
      resolve();
    });
    worker.on('error', (error) => {
      reject(error);
    });
  });

  return {
    emitter,
    promise,
  };
};

export { run };
