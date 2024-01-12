import { Command } from 'commander';
import { createClient } from '../../client/client.js';
import { step } from '../../utils/step.js';
import { Context } from '../../context/context.js';
import { Config } from '../../config/config.js';

const set = new Command('set');

set
  .argument('<id>')
  .argument('[value]')
  .action(async (id, value) => {
    const config = new Config();
    const context = new Context(config.context);
    const client = await step('Connecting to server', async () => {
      return createClient(context);
    });
    await step('Setting secret', async () => {
      await client.secrets.set.mutate({
        id,
        value,
      });
    });
  });

export { set };
