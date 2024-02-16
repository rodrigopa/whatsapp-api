import Redis from 'ioredis';
import { InfoConnectionResponse } from '../model/response/connection.responses';
import { ConnectionStatus } from '../model/models/connection.models';
export default class RedisService {
    readonly instance: Redis;
    constructor(instance: Redis);
    getConnectionStatus(connectionId: string): Promise<ConnectionStatus>;
    createConnection(connectionId: string, title: string, webhookURL: string, hooks: string[], status: ConnectionStatus): Promise<void>;
    logoutConnection(connectionId: string): Promise<void>;
    deleteConnection(connectionId: string): Promise<void>;
    infoConnection(connectionId: string): Promise<InfoConnectionResponse>;
    listConnections(): Promise<string[]>;
}
