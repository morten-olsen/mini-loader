import { artifacts, logger } from '@morten-olsen/mini-loader';

const run = async () => {
  await logger.info('Hello world');
  await artifacts.create('foo', 'bar');
  process.exit(0);
};

run();
