import { Command } from 'commander';
import { ContainerInstance } from 'typedi';
import { CliApi } from '../api/api.js';

const getApi = (command: Command) => {
  const { _container } = command.optsWithGlobals() as { _container: ContainerInstance };
  const api = _container.get(CliApi);
  return api;
};

export { getApi };
