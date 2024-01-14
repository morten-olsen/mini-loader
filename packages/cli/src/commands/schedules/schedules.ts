import { Command } from 'commander';
import { list } from './schedules.list.js';
import { remove } from './schedules.remove.js';
import { add } from './schedules.add.js';

const schedules = new Command('schedules');
schedules.addCommand(list);
schedules.addCommand(remove);
schedules.addCommand(add);

export { schedules };
