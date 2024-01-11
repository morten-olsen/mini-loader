import { Command } from 'commander';
import { resolve } from 'path';
import { run } from '@morten-olsen/mini-loader-runner';
import { bundle } from '../../bundler/bundler.js';

const local = new Command('local');

local.argument('script').action(async (script) => {
  const location = resolve(script);
  const code = await bundle({ entry: location });
  const { promise, emitter } = await run({
    script: code,
  });
  emitter.addListener('message', (message) => {
    switch (message.type) {
      case 'log':
        console.log(message.payload);
        break;
      case 'artifact:create':
        console.log('artifact:create', message.payload.name);
        break;
    }
  });
  await promise;
});

export { local };
