import { ContainerInstance } from 'typedi';
import { createServerCli } from './index.js';

const program = createServerCli(new ContainerInstance('server'));

program.setOptionValue('output', (data: unknown) => {
  console.log('got data', data);
});

await program.parseAsync(process.argv);

process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
});
