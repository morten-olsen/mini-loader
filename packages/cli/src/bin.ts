import { ContainerInstance } from 'typedi';
import { createClientCli } from './index.js';

const container = new ContainerInstance('client');
const program = createClientCli(container);

await program.parseAsync();
