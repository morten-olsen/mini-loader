import { join } from 'path';
import os from 'os';
import { nanoid } from 'nanoid';
import { chmod, mkdir, rm, writeFile } from 'fs/promises';
import { createServer } from 'net';
import { EventEmitter } from 'eventemitter3';

type SetupOptions = {
  input?: Buffer | string;
  script: string;
  secrets?: Record<string, string>;
};

type RunEvents = {
  message: (event: any) => void;
  error: (error: Error) => void;
  exit: () => void;
};

const setup = async (options: SetupOptions) => {
  const { input, script, secrets } = options;
  const emitter = new EventEmitter<RunEvents>();
  const dataDir = join(os.tmpdir(), 'mini-loader', nanoid());

  await mkdir(dataDir, { recursive: true });
  await chmod(dataDir, 0o700);
  const hostSocket = join(dataDir, 'host');
  const httpGatewaySocket = join(dataDir, 'socket');
  const server = createServer();
  const inputLocation = join(dataDir, 'input');
  const scriptLocation = join(dataDir, 'script.js');

  if (input) {
    await writeFile(inputLocation, input);
  }
  await writeFile(scriptLocation, script);
  const env = {
    HOST_SOCKET: hostSocket,
    SECRETS: JSON.stringify(secrets || {}),
    INPUT_PATH: inputLocation,
    HTTP_GATEWAY_PATH: httpGatewaySocket,
  };

  const teardown = async () => {
    server.close();
    await rm(dataDir, { recursive: true, force: true });
  };

  server.on('connection', (socket) => {
    socket.on('data', (data) => {
      const message = JSON.parse(data.toString());
      emitter.emit('message', message);
    });
  });

  server.listen(hostSocket);

  return {
    env,
    emitter,
    teardown,
    httpGatewaySocket,
    scriptLocation,
    hostSocket,
  };
};

type Setup = Awaited<ReturnType<typeof setup>>;

export type { Setup };
export { setup };
