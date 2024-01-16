import { Knex } from 'knex';
import { Service } from 'typedi';
import envPaths from 'env-paths';
import { join } from 'path';

const paths = envPaths('mini-loader-server');

@Service()
class Config {
  database: Omit<Knex.Config, 'migrations'> = {
    client: 'sqlite3',
    connection: {
      filename: join(paths.data, 'db.sqlite'),
    },
    useNullAsDefault: true,
  };
  files = {
    data: paths.data,
    cache: paths.cache,
  };
  auth?: {
    oidc?: {
      issuer: string;
      login?: {
        clientId: string;
        clientSecret: string;
      };
    };
  };
}

export { Config };
