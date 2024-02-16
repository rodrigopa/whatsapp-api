"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startSocket = exports.processSubscriber = exports.waSocket = void 0;
const baileys_1 = require("@whiskeysockets/baileys");
const pino_1 = __importDefault(require("pino"));
const node_cache_1 = __importDefault(require("node-cache"));
const use_redis_multi_auth_1 = require("./common/use-redis-multi-auth");
const credsUpdate_1 = __importDefault(require("./actions/credsUpdate"));
const connectionUpdate_1 = __importDefault(require("./actions/connectionUpdate"));
const logger = (0, pino_1.default)({ level: 'silent' });
const msgRetryCounterCache = new node_cache_1.default();
function subscribe() {
    if (exports.processSubscriber) {
        return;
    }
    exports.processSubscriber = process.on('message', async (data) => {
        console.log('message');
    });
}
async function startSocket() {
    const connectionId = String(process.env.CONNECTION_ID);
    const { state, saveCreds, removeAll } = await (0, use_redis_multi_auth_1.useRedisMultiAuth)(connectionId);
    console.log(`iniciando conexao ${connectionId}`);
    exports.waSocket = (0, baileys_1.makeWASocket)({
        logger,
        msgRetryCounterCache,
        auth: {
            creds: state.creds,
            keys: (0, baileys_1.makeCacheableSignalKeyStore)(state.keys, logger),
        },
    });
    exports.waSocket.ev.on('creds.update', (0, credsUpdate_1.default)(saveCreds));
    exports.waSocket.ev.on('connection.update', (0, connectionUpdate_1.default)(connectionId, startSocket, removeAll, subscribe));
}
exports.startSocket = startSocket;
startSocket();
