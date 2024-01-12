import { send } from '../utils.js';

type ArtifactCreateEvent = {
  type: 'artifact:create';
  payload: {
    name: string;
    data: string;
  };
};

const create = async (name: string, data: Buffer | string) => {
  await send({
    type: 'artifact:create',
    payload: {
      name,
      data: data.toString('base64'),
    },
  });
};

const artifacts = {
  create,
};

export type { ArtifactCreateEvent };
export { artifacts };
