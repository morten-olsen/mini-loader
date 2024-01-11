import { program } from 'commander';
import { loads } from './commands/loads/loads.js';
import { runs } from './commands/runs/runs.js';
import { logs } from './commands/logs/logs.js';
import { artifacts } from './commands/artifacts/artifacts.js';

program.addCommand(loads);
program.addCommand(runs);
program.addCommand(logs);
program.addCommand(artifacts);

await program.parseAsync();
