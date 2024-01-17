import { nanoid } from 'nanoid';
import { Service } from 'typedi';

@Service()
class IdGenerator {
  public generate = () => nanoid();
}

export { IdGenerator };
