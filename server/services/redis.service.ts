import Redis from 'ioredis';
import { inject, injectable } from 'tsyringe';
import { ConnectionStatus } from '../model/models/connection.models';

@injectable()
export default class RedisService {
  constructor(@inject(Redis) readonly instance: Redis) {}

  public getConnectionStatus(connectionId: string) {
    return this.instance.hget(`connection_${connectionId}`, 'status') as Promise<ConnectionStatus>;
  }

  public async createConnection(
    connectionId: string,
    title: string,
    webhookURL: string,
    hooks: string[],
    status: ConnectionStatus,
  ) {
    await this.instance.hset(
      `connection_${connectionId}`,
      'title',
      title,
      'webhookURL',
      webhookURL,
      'hooks',
      JSON.stringify(hooks),
      'status',
      status,
    );
  }

  public async logoutConnection(connectionId: string) {
    await this.instance.del(`connection-auth-data_${connectionId}`);
  }

  public async deleteConnection(connectionId: string) {
    await this.instance.del(`connection-auth-data_${connectionId}`);
    await this.instance.del(`connection_${connectionId}`);
  }

  public async infoConnection(connectionId: string) {
    const info = (await this.instance.hgetall(`connection_${connectionId}`)) as any;
    if (Object.keys(info).length > 0) {
      info.hooks = JSON.parse(info.hooks);
    }
    return info;
  }

  public listConnections() {
    return this.instance.keys('connection_*');
  }

  public async syncHooksConnection(connectionId: string, hooks: string[]) {
    await this.instance.hset(`connection_${connectionId}`, 'hooks', JSON.stringify(hooks));
  }

  public async changeTitleConnection(connectionId: string, title: string) {
    await this.instance.hset(`connection_${connectionId}`, 'title', title);
  }

  public async changeWebhookURLConnection(connectionId: string, webhookURL: string) {
    await this.instance.hset(`connection_${connectionId}`, 'webhookURL', webhookURL);
  }
}
