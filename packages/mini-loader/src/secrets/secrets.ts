import { workerData } from 'worker_threads';

const get = (id: string) => {
  const items = workerData?.secrets ?? {};
  return items[id];
};

const secrets = {
  get,
};

export { secrets };
