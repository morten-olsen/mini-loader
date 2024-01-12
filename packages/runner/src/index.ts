import { Worker } from 'worker_threads';
import os from 'os';
import { EventEmitter } from 'eventemitter3';
import { Event } from '@morten-olsen/mini-loader';
import { join } from 'path';
import { createServer } from 'http';
import { nanoid } from 'nanoid';
import { chmod, mkdir, rm, writeFile } from 'fs/promises';

type RunEvents = {
  message: (event: Event) => void;
  error: (error: Error) => void;
  exit: () => void;
};

type RunOptions = {
  script: string;
  input?: Buffer | string;
  secrets?: Record<string, string>;
};

const run = async ({ script, input, secrets }: RunOptions) => {
  const dataDir = join(os.tmpdir(), 'mini-loader', nanoid());
  await mkdir(dataDir, { recursive: true });
  await chmod(dataDir, 0o700);
  const hostSocket = join(dataDir, 'host');
  const server = createServer();
  const inputLocation = join(dataDir, 'input');

  if (input) {
    await writeFile(inputLocation, input);
  }

  const emitter = new EventEmitter<RunEvents>();

  server.on('connection', (socket) => {
    socket.on('data', (data) => {
      const message = JSON.parse(data.toString());
      emitter.emit('message', message);
    });
  });
  server.listen(hostSocket);

  const worker = new Worker(script, {
    eval: true,
    stdin: false,
    stdout: false,
    stderr: false,
    env: {
      HOST_SOCKET: hostSocket,
      SECRETS: JSON.stringify(secrets),
      INPUT_PATH: inputLocation,
    },
    workerData: {
      input,
    },
  });

  worker.stdout?.on('data', (data) => {
    emitter.emit('message', {
      type: 'log',
      payload: {
        severity: 'info',
        message: data.toString(),
      },
    });
  });

  worker.stderr?.on('data', (data) => {
    emitter.emit('message', {
      type: 'log',
      payload: {
        severity: 'error',
        message: data.toString(),
      },
    });
  });

  const promise = new Promise<void>((resolve, reject) => {
    worker.on('exit', async () => {
      server.close();
      await rm(dataDir, { recursive: true, force: true });
      resolve();
    });
    worker.on('error', async (error) => {
      server.close();
      reject(error);
    });
  });

  return {
    emitter,
    promise,
  };
};

export { run };
