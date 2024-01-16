import { Paths, Terminal, createClientCli } from '@morten-olsen/mini-loader-cli';
import { Runtime, createServer, Config } from '@morten-olsen/mini-loader-server';
import { FastifyInstance } from 'fastify';
import { ContainerInstance } from 'typedi';
import { join, resolve } from 'path';
import getPort from 'get-port';
import { rm } from 'fs/promises';

const cacheLocation = './e2e-tmp';

const getUniqueIdentifier = () => {
  return Math.random().toString(36).substr(2, 9);
};

type CliActionOutput =
  | {
      type: 'stdout';
      data: string;
    }
  | {
      type: 'stderr';
      data: string;
    }
  | {
      type: 'step';
      message: string;
      state: 'pending' | 'success' | 'error';
    }
  | {
      type: 'output';
      data: unknown;
    };

const createEnv = async () => {
  const location = resolve(cacheLocation, getUniqueIdentifier());
  const port = await getPort();

  let clientOutput: CliActionOutput[] = [];
  const serverContainer = new ContainerInstance(getUniqueIdentifier());

  const clientRun = async (params: string[]) => {
    const clientContainer = new ContainerInstance(getUniqueIdentifier());
    clientContainer.set(Paths, {
      config: join(location, 'client', 'config'),
      cache: join(location, 'client', 'cache'),
    });
    clientContainer.set(Terminal, {
      log: async (message: any) => {
        clientOutput.push({
          type: 'stdout',
          data: message,
        });
      },
      output: async (data: any) => {
        clientOutput.push({
          type: 'output',
          data,
        });
      },
      step: async (message: any, action: any) => {
        clientOutput.push({
          type: 'step',
          message,
          state: 'pending',
        });
        try {
          const result = await action();
          clientOutput.push({
            type: 'step',
            message,
            state: 'success',
          });
          return result;
        } catch (err) {
          clientOutput.push({
            type: 'step',
            message,
            state: 'error',
          });
          throw err;
        }
      },
    });
    const client = createClientCli(clientContainer);
    client.configureOutput({
      writeOut: (data) => {
        clientOutput.push({
          type: 'stdout',
          data,
        });
      },
      writeErr: (data) => {
        clientOutput.push({
          type: 'stderr',
          data,
        });
        throw new Error(`Error in client ${data}`);
      },
    });

    await client.parseAsync(['', '', ...params]);
  };

  serverContainer.set(Config, {
    database: {
      client: 'sqlite3',
      connection: {
        filename: join(location, 'server', 'data', 'db.sqlite'),
      },
      useNullAsDefault: true,
    },
    files: {
      data: join(location, 'server', 'data'),
      cache: join(location, 'server', 'cache'),
    },
  });
  const server = await createServer(serverContainer);
  const runtime = serverContainer.get(Runtime);
  const token = await runtime.auth.createToken({
    policy: {
      '*:*': ['*'],
    },
  });

  const cleanup = async () => {
    await server.close();
    await rm(location, { recursive: true, force: true });
  };

  return { clientRun, clientOutput, runtime, server, token, location, port, cleanup };
};

type TestEnv = Awaited<ReturnType<typeof createEnv>>;

export type { TestEnv, FastifyInstance };
export { createEnv };
