const secretData = JSON.parse(process.env.SECRETS || '{}');

const get = (id: string) => {
  return secretData[id];
};

const secrets = {
  get,
};

export { secrets };
