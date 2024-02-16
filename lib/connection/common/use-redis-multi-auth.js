"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useRedisMultiAuth = void 0;
const baileys_1 = require("@whiskeysockets/baileys");
const redis_1 = require("../../shared/redis");
async function useRedisMultiAuth(connectionId) {
    const writeData = async (data, file) => {
        await redis_1.redis.hset(`connection-auth-data_${connectionId}`, fixFileName(file), JSON.stringify(data, baileys_1.BufferJSON.replacer));
    };
    const readData = async (file) => {
        try {
            const data = await redis_1.redis.hget(`connection-auth-data_${connectionId}`, fixFileName(file));
            return JSON.parse(data, baileys_1.BufferJSON.reviver);
        }
        catch (error) {
            return null;
        }
    };
    const removeData = async (file) => {
        try {
            await redis_1.redis.hdel(`connection-auth-data_${connectionId}`, fixFileName(file));
        }
        catch (_a) { }
    };
    const listAll = async (pattern = '') => {
        const all = await redis_1.redis.hgetall(`connection-auth-data_${connectionId}`);
        const keys = Object.keys(all);
        try {
            return keys.reduce((p, c) => (c.startsWith(pattern) ? [...p, c] : p), []);
        }
        catch (error) {
            return [];
        }
    };
    const fixFileName = (file) => { var _a; return (_a = file === null || file === void 0 ? void 0 : file.replace(/\//g, '__')) === null || _a === void 0 ? void 0 : _a.replace(/:/g, '-'); };
    const creds = (await readData('creds')) || (0, baileys_1.initAuthCreds)();
    return {
        state: {
            creds,
            keys: {
                get: async (type, ids) => {
                    const data = {};
                    await Promise.all(ids.map(async (id) => {
                        let value = await readData(`${type}-${id}`);
                        if (type === 'app-state-sync-key' && value) {
                            value = baileys_1.proto.Message.AppStateSyncKeyData.fromObject(value);
                        }
                        data[id] = value;
                    }));
                    return data;
                },
                set: async (data) => {
                    const tasks = [];
                    for (const category in data) {
                        for (const id in data[category]) {
                            const value = data[category][id];
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
            const promises = [];
            for (let item of await listAll()) {
                promises.push(removeData(item));
            }
            await Promise.all(promises);
        },
    };
}
exports.useRedisMultiAuth = useRedisMultiAuth;
