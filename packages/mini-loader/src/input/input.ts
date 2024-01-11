import { workerData } from 'worker_threads';

const get = <T>() => {
  return workerData as T;
};

const input = {
  get,
};

export { input };
