import { Socket, createConnection } from 'net';

const connect = () =>
  new Promise<Socket>((resolve, reject) => {
    const current = createConnection(process.env.HOST_SOCKET!);

    current.on('connect', () => {
      resolve(current);
    });
    current.on('error', (error) => {
      reject(error);
    });
  });

const send = async (data: any) =>
  new Promise<void>(async (resolve, reject) => {
    const connection = await connect();
    const cleaned = JSON.parse(JSON.stringify(data));
    connection.write(JSON.stringify(cleaned), 'utf-8', (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });

export { send };
