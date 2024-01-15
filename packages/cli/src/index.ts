import { Command, program } from 'commander';
import { createRequire } from 'module';
import { loads } from './commands/loads/loads.js';
import { runs } from './commands/runs/runs.js';
import { logs } from './commands/logs/logs.js';
import { artifacts } from './commands/artifacts/artifacts.js';
import { secrets } from './commands/secrets/secrets.js';
import { local } from './commands/local/local.js';
import { auth } from './commands/auth/auth.js';
import { contexts } from './commands/contexts/contexts.js';
import { schedules } from './commands/schedules/schedules.js';
import { readFile } from 'fs/promises';

const require = createRequire(import.meta.url);

const pkg = JSON.parse(await readFile(require.resolve('#pkg'), 'utf-8'));

program.addCommand(loads);
program.addCommand(runs);
program.addCommand(logs);
program.addCommand(artifacts);
program.addCommand(secrets);
program.addCommand(local);
program.addCommand(auth);
program.addCommand(contexts);
program.addCommand(schedules);

program.version(pkg.version);

const version = new Command('version');
version.action(() => {
  console.log(pkg.version);
});
program.addCommand(version);

await program.parseAsync();
