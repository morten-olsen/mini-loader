import { Command } from 'commander';
import { resolve } from 'path';
import { run as runLoad } from '@morten-olsen/mini-loader-runner';
import { bundle } from '../../bundler/bundler.js';
import { readSecrets } from './local.utils.js';
import { getApi } from '../../utils/command.js';

const run = new Command('run');

run
  .option('-ai, --auto-install', 'Auto install dependencies', false)
  .argument('script')
  .action(async (script) => {
    const { step, config } = getApi(run);
    const location = resolve(script);
    const { autoInstall } = run.opts();
    const secrets = await readSecrets();

    const code = await step('Bundling', async () => {
      return await bundle({ entry: location, autoInstall });
    });
    const { promise, emitter } = await runLoad({
      script: code,
      secrets,
      cacheLocation: config.cacheLocation,
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

export { run };
