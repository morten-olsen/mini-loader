import { Command } from 'commander';
import { createClient } from '../../client/client.js';
import { step } from '../../utils/step.js';
import { Context } from '../../context/context.js';
import { Config } from '../../config/config.js';

const terminate = new Command('terminate');

terminate
  .description('Terminate an in progress run')
  .argument('run-id', 'Run ID')
  .action(async (runId) => {
    const config = new Config();
    const context = new Context(config.context);
    const client = await step('Connecting to server', async () => {
      return createClient(context);
    });
    await step('Terminating run', async () => {
      await client.runs.terminate.mutate(runId);
    });
  });

export { terminate };
