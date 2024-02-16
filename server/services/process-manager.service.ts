import pm2 from 'pm2-promise';
import { execShellCommand } from '../common/execShellCommand';
import { singleton } from 'tsyringe';
import BeeQueue from 'bee-queue';

@singleton()
export default class ProcessManagerService {
  constructor() {}

  async start(id: string) {
    await pm2.connect();
    await pm2.start({
      name: id,
      script: '/usr/src/app/connection/index.ts',
      interpreter: '/usr/src/app/node_modules/.bin/ts-node',
      stop_exit_codes: '0',
      env: {
        CONNECTION_ID: id,
      },
    });
    await pm2.dump();
    await pm2.disconnect();
  }

  async startAsync(id: string) {
    execShellCommand(
      `CONNECTION_ID=${id} pm2 start /usr/src/app/connection/index.ts --name ${id} --interpreter /usr/src/app/node_modules/.bin/ts-node --stop-exit-codes 0`,
    ).then(() => {
      execShellCommand(`pm2 save`);
    });
  }

  async restart(id: string) {
    await pm2.connect();
    await pm2.restart(id, {
      updateEnv: true,
    });
    await pm2.disconnect();
  }

  async restartAsync(id: string) {
    execShellCommand(`pm2 restart ${id} --update-env`);
  }

  async sendMessageToConnection(connectionId: string, event: string, data?: any) {
    return new Promise((resolve, reject) => {
      (async () => {
        const queue = new BeeQueue(connectionId, {
          redis: {
            host: 'redis',
            password: process.env.REDIS_PASSWORD,
          },
        });
        const job = await queue.createJob({ event, data }).save();
        job.on('succeeded', resolve);
      })();
    });
  }
}
