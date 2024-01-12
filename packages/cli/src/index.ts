import { program } from 'commander';
import { loads } from './commands/loads/loads.js';
import { runs } from './commands/runs/runs.js';
import { logs } from './commands/logs/logs.js';
import { artifacts } from './commands/artifacts/artifacts.js';
import { secrets } from './commands/secrets/secrets.js';
import { local } from './commands/local/local.js';
import { auth } from './commands/auth/auth.js';
import { contexts } from './commands/contexts/contexts.js';

program.addCommand(loads);
program.addCommand(runs);
program.addCommand(logs);
program.addCommand(artifacts);
program.addCommand(secrets);
program.addCommand(local);
program.addCommand(auth);
program.addCommand(contexts);

await program.parseAsync();
