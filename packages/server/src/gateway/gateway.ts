import { FastifyPluginAsync } from 'fastify';
import FastifyReplyFrom from '@fastify/reply-from';
import { escape } from 'querystring';
import { Runtime } from '../runtime/runtime.js';

type Options = {
  runtime: Runtime;
};

const gateway: FastifyPluginAsync<Options> = async (fastify, { runtime }) => {
  await fastify.register(FastifyReplyFrom, {
    http: {},
  });

  fastify.all('/gateway/*', (req, res) => {
    const [runId, ...pathSegments] = (req.params as any)['*'].split('/').filter(Boolean);
    const run = runtime.runner.getInstance(runId);
    if (!run) {
      res.statusCode = 404;
      res.send({ error: 'Run not found' });
      return;
    }
    const socketPath = run.run?.httpGatewaySocket;
    if (!socketPath) {
      res.statusCode = 404;
      res.send({ error: 'No socket path to run' });
      return;
    }
    const path = pathSegments.join('/');
    res.from(`unix+http://${escape(socketPath)}/${path}`);
  });
};

export { gateway };
