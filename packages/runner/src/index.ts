import { Worker } from 'worker_threads';
import { setup } from './setup/setup.js';

type RunOptions = {
  script: string;
  input?: Buffer | string;
  secrets?: Record<string, string>;
  cacheLocation: string;
};

const run = async ({ script, input, secrets, cacheLocation }: RunOptions) => {
  const info = await setup({ script, input, secrets, cacheLocation });

  const worker = new Worker(info.scriptLocation, {
    stdin: false,
    stdout: false,
    stderr: false,
    env: info.env,
  });

  worker.stdout?.on('data', (data) => {
    info.emitter.emit('message', {
      type: 'log',
      payload: {
        severity: 'info',
        message: data.toString(),
      },
    });
  });

  worker.stderr?.on('data', (data) => {
    info.emitter.emit('message', {
      type: 'log',
      payload: {
        severity: 'error',
        message: data.toString(),
      },
    });
  });

  const promise = new Promise<void>((resolve, reject) => {
    worker.on('exit', async () => {
      await info.teardown();
      resolve();
    });
    worker.on('error', async (error) => {
      reject(error);
    });
  });

  return {
    ...info,
    teardown: async () => {
      worker.terminate();
    },
    promise,
  };
};

type RunInfo = Awaited<ReturnType<typeof run>>;

export type { RunInfo };
export { run };
