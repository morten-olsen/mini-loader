import { Command } from 'commander';
import { Context } from '../../context/context.js';

const list = new Command('list');
list.alias('ls').description('List contexts');
list.action(async () => {
  const contexts = await Context.list();
  console.table(contexts);
});

export { list };
