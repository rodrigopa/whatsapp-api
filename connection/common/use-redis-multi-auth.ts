import {
  AuthenticationCreds,
  AuthenticationState,
  BufferJSON,
  initAuthCreds,
  proto,
  SignalDataTypeMap,
} from '@whiskeysockets/baileys';
import { redis } from '../../shared/redis';

export async function useRedisMultiAuth(connectionId: string): Promise<{
  state: AuthenticationState;
  saveCreds: () => Promise<void>;
  removeAll: () => Promise<void>;
}> {
  const writeData = async (data: any, file: string) => {
    await redis.hset(
      `connection-auth-data_${connectionId}`,
      fixFileName(file)!,
      JSON.stringify(data, BufferJSON.replacer),
    );
  };

  const readData = async (file: string) => {
    try {
      const data = await redis.hget(`connection-auth-data_${connectionId}`, fixFileName(file)!);
      return JSON.parse(data!, BufferJSON.reviver);
    } catch (error) {
      return null;
    }
  };

  const removeData = async (file: string) => {
    try {
      await redis.hdel(`connection-auth-data_${connectionId}`, fixFileName(file)!);
    } catch {}
  };

  const listAll = async (pattern: string = ''): Promise<string[]> => {
    const all = await redis.hgetall(`connection-auth-data_${connectionId}`);
    const keys = Object.keys(all);

    try {
      return keys.reduce((p, c) => (c.startsWith(pattern) ? [...p, c] : p), [] as any[]);
    } catch (error) {
      return [];
    }
  };

  const fixFileName = (file?: string) => file?.replace(/\//g, '__')?.replace(/:/g, '-');

  const creds: AuthenticationCreds = (await readData('creds')) || initAuthCreds();

  return {
    state: {
      creds,
      keys: {
        get: async (type, ids) => {
          const data: { [_: string]: SignalDataTypeMap[typeof type] } = {};
          await Promise.all(
            ids.map(async (id) => {
              let value = await readData(`${type}-${id}`);
              if (type === 'app-state-sync-key' && value) {
                value = proto.Message.AppStateSyncKeyData.fromObject(value);
              }

              data[id] = value;
            }),
          );

          return data;
        },
        set: async (data) => {
          const tasks: Promise<void>[] = [];
          for (const category in data) {
            for (const id in data[category as keyof typeof data]) {
              const value = data[category as keyof typeof data]![id];
              const file = `${category}-${id}`;
              tasks.push(value ? writeData(value, file) : removeData(file));
            }
          }

          await Promise.all(tasks);
        },
      },
    },
    saveCreds: () => {
      return writeData(creds, 'creds');
    },
    async removeAll() {
      const promises: any[] = [];
      for (let item of await listAll()) {
        promises.push(removeData(item));
      }
      await Promise.all(promises);
    },
  };
}
