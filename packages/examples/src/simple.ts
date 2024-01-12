import { artifacts, logger } from '@morten-olsen/mini-loader';

await logger.info('Hello world');

await artifacts.create('foo', 'bar');
