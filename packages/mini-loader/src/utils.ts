import { parentPort } from 'worker_threads';

const send = (data: any) => {
  const cleaned = JSON.parse(JSON.stringify(data));
  parentPort?.postMessage(cleaned);
};

export { send };
