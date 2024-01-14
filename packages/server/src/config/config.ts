import { Knex } from 'knex';

type Config = {
  database: Omit<Knex.Config, 'migrations'>;
  files: {
    data: string;
    cache: string;
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
};

export type { Config };
