import envPaths from 'env-paths';
import { Service } from 'typedi';

const paths = envPaths('mini-loader');

@Service()
class Paths {
  public get config() {
    return paths.config;
  }

  public get cache() {
    return paths.cache;
  }
}

export { Paths };
