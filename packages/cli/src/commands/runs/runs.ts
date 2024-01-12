import { Command } from 'commander';
import { create } from './runs.create.js';
import { list } from './runs.list.js';
import { remove } from './runs.remove.js';
import { terminate } from './runs.terminate.js';

const runs = new Command('runs');
runs.description('Manage runs');
runs.addCommand(create);
runs.addCommand(list);
runs.addCommand(remove);
runs.addCommand(terminate);

export { runs };
