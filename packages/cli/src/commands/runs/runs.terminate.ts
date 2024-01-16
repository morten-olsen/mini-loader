import { Command } from 'commander';
import { getApi } from '../../utils/command.js';

const terminate = new Command('terminate');

terminate
  .description('Terminate an in progress run')
  .argument('run-id', 'Run ID')
  .action(async (runId) => {
    const { step, client } = getApi(terminate);
    await step('Terminating run', async () => {
      await client.runs.terminate.mutate(runId);
    });
  });

export { terminate };
