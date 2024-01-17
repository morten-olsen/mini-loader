import ora from 'ora';
import { Service } from 'typedi';

@Service()
class Terminal {
  public log = (message: string) => {
    console.log(message);
  };

  public output = (data: unknown) => {
    console.table(data);
  };

  public step = async <T>(message: string, action: () => Promise<T>) => {
    const spinner = ora(message).start();
    try {
      const result = await action();
      await spinner.succeed();
      return result;
    } catch (err) {
      await spinner.fail();
      throw err;
    }
  };
}

export { Terminal };
