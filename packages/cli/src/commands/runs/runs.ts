import { Command } from 'commander';
import { create } from './runs.create.js';
import { list } from './runs.list.js';

const runs = new Command('runs');
runs.description('Manage runs').addCommand(create).addCommand(list);

export { runs };
