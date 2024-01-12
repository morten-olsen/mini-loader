import { Command } from 'commander';
import { list } from './contexts.list.js';
import { use } from './contexts.use.js';
import { current } from './contexts.current.js';

const contexts = new Command('contexts');
contexts.description('Manage contexts');
contexts.addCommand(list);
contexts.addCommand(use);
contexts.addCommand(current);

export { contexts };
