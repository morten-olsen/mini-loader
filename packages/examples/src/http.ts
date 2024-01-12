import { http } from '@morten-olsen/mini-loader';
import fastify from 'fastify';

const server = fastify();

server.all('*', async (req) => {
  return req.url;
});

server.listen({
  path: http.getPath(),
});
