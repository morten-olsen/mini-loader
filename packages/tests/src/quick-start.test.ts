import { describe, it, beforeAll, afterAll, vi } from 'vitest';
import { TestEnv, createEnv } from './utils/env.js';
import { writeFile } from 'fs/promises';
import { resolve } from 'path';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

describe('Quick start', () => {
  let env: TestEnv;

  beforeAll(async () => {
    vi.mock('nanoid', () => {
      let currentId = 0;
      return {
        nanoid: () => `id-${currentId++}`,
      };
    });
    env = await createEnv();
  });

  afterAll(async () => {
    vi.clearAllMocks();
    await env.cleanup();
  });

  it('should be able to start the server', async () => {
    const { server, port } = env;
    await server.listen({ port });
  });

  it('should be able to login', async () => {
    const { clientRun, port, token } = env;
    await clientRun(['auth', 'login', '--host', `http://localhost:${port}`, '--token', token]);
  });

  it('should be able to push a load', async () => {
    const { clientRun, location } = env;
    const scriptPath = resolve(location, 'simple.js');
    await writeFile(scriptPath, 'console.log("hello world")', 'utf-8');
    await clientRun(['loads', 'push', scriptPath, '-i', 'demo', '-r']);

    await sleep(100);
  });

  it('should be able to get the run', async () => {
    const { clientRun } = env;
    await clientRun(['runs', 'ls', 'demo']);
  });

  it('should be able to get logs', async () => {
    const { clientRun, clientOutput } = env;
    await clientRun(['logs', 'ls', '-l', 'demo']);

    console.log(JSON.stringify(clientOutput, null, 2));
  });
});
