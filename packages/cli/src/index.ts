import { Command } from 'commander';
import { loads } from './commands/loads/loads.js';
import { runs } from './commands/runs/runs.js';
import { logs } from './commands/logs/logs.js';
import { artifacts } from './commands/artifacts/artifacts.js';
import { secrets } from './commands/secrets/secrets.js';
import { local } from './commands/local/local.js';
import { auth } from './commands/auth/auth.js';
import { contexts } from './commands/contexts/contexts.js';
import { schedules } from './commands/schedules/schedules.js';
import { ContainerInstance } from 'typedi';

const createClientCli = (container: ContainerInstance) => {
  const program = new Command();
  program.exitOverride();
  program.setOptionValue('_container', container);
  program.addCommand(loads);
  program.addCommand(runs);
  program.addCommand(logs);
  program.addCommand(artifacts);
  program.addCommand(secrets);
  program.addCommand(local);
  program.addCommand(auth);
  program.addCommand(contexts);
  program.addCommand(schedules);

  return program;
};

export { CliApi } from './api/api.js';
export { Context } from './context/context.js';
export { Terminal } from './api/output.js';
export { Paths } from './paths/paths.js';
export { createClientCli };
