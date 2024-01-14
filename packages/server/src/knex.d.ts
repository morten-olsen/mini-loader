import 'knex';

declare module 'knex/types/tables.js' {
  interface Tables {
    loads: {
      id: string;
      name?: string;
      script: string;
      createdAt: Date;
      updatedAt: Date;
    };
    runs: {
      id: string;
      loadId: string;
      script: string;
      input?: string;
      error?: string;
      createdAt: Date;
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
      createdAt: Date;
      runId: string;
      loadId: string;
      data: string;
    };
    secrets: {
      id: string;
      value: string;
      createdAt: Date;
      updatedAt: Date;
    };
    schedules: {
      id: string;
      name?: string;
      description?: string;
      load: string;
      cron: string;
      input?: string;
      createdAt: Date;
      updatedAt: Date;
    };
  }
}
