import 'knex';

declare module 'knex/types/tables.js' {
  interface Tables {
    loads: {
      id: string;
      name?: string;
      script: string;
    };
    runs: {
      id: string;
      loadId: string;
      script: string;
      input?: string;
      error?: string;
      startedAt?: Date;
      endedAt?: Date;
      status: 'created' | 'running' | 'succeeded' | 'failed';
    };
    logs: {
      id: string;
      runId: string;
      loadId: string;
      severity: 'info' | 'warning' | 'error';
      message: string;
      data?: any;
      timestamp: Date;
    };
    artifacts: {
      id: string;
      name: string;
      runId: string;
      loadId: string;
      data: string;
    };
  }
}
