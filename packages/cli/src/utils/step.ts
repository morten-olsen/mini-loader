import ora from 'ora';

const step = async <T>(message: string, fn: () => Promise<T>): Promise<T> => {
  const spinner = ora(message).start();
  try {
    const result = await fn();
    await spinner.succeed();
    return result;
  } catch (err) {
    await spinner.fail();
    throw err;
  }
};

export { step };
