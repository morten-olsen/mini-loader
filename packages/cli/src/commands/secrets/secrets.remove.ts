import { Command } from 'commander';
import { getApi } from '../../utils/command.js';

const remove = new Command('remove');

remove
  .alias('rm')
  .argument('<id>')
  .action(async (id) => {
    const { step, client } = getApi(remove);
    await step('Removing', async () => {
      await client.secrets.remove.mutate({
        id,
      });
    });
  });

export { remove };
