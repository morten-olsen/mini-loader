import { Command } from 'commander';
import { createClient } from '../../client/client.js';
import { step } from '../../utils/step.js';
import { Context } from '../../context/context.js';
import { Config } from '../../config/config.js';

const remove = new Command('remove');

remove
  .alias('rm')
  .argument('<id>')
  .action(async (id) => {
    const config = new Config();
    const context = new Context(config.context);
    const client = await step('Connecting to server', async () => {
      return createClient(context);
    });
    await step('Removing', async () => {
      await client.secrets.remove.mutate({
        id,
      });
    });
  });

export { remove };
