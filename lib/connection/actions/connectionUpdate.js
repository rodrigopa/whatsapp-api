"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const baileys_1 = require("@whiskeysockets/baileys");
const redis_1 = require("../../shared/redis");
const webhooks_1 = require("../../shared/webhooks");
function onConnectionUpdate(connectionId, startSocket, removeAll, subscribe) {
    return async function (update) {
        var _a, _b;
        const { connection, lastDisconnect } = update;
        if (connection === 'close') {
            const shouldReconnect = ((_b = (_a = lastDisconnect === null || lastDisconnect === void 0 ? void 0 : lastDisconnect.error) === null || _a === void 0 ? void 0 : _a.output) === null || _b === void 0 ? void 0 : _b.statusCode) !== baileys_1.DisconnectReason.loggedOut;
            if (shouldReconnect) {
                redis_1.redis.hdel(`connection_${connectionId}`, 'qrCode');
                redis_1.redis.hset(`connection_${connectionId}`, 'status', 'connecting');
                await (0, webhooks_1.dispatchWebhook)(connectionId, 'connection_status_changed', {
                    id: connectionId,
                    status: 'connecting',
                });
                startSocket();
            }
            else {
                await removeAll();
                process.exit(1);
            }
        }
        else if (connection === 'open') {
            subscribe();
            redis_1.redis.hdel(`connection_${connectionId}`, 'qrCode');
            redis_1.redis.hset(`connection_${connectionId}`, 'status', 'connected');
            await (0, webhooks_1.dispatchWebhook)(connectionId, 'connection_status_changed', {
                id: connectionId,
                status: 'connected',
            });
        }
        else if (connection === 'connecting') {
            redis_1.redis.hdel(`connection_${connectionId}`, 'qrCode');
            redis_1.redis.hset(`connection_${connectionId}`, 'status', 'connecting');
            await (0, webhooks_1.dispatchWebhook)(connectionId, 'connection_status_changed', {
                id: connectionId,
                status: 'connecting',
            });
        }
        else if (update === null || update === void 0 ? void 0 : update.qr) {
            redis_1.redis.hset(`connection_${connectionId}`, 'qrCode', update.qr, 'status', 'pending-qrcode');
            await (0, webhooks_1.dispatchWebhook)(connectionId, 'connection_status_changed', {
                id: connectionId,
                status: 'pending-qrcode',
            });
            await (0, webhooks_1.dispatchWebhook)(connectionId, 'qrcode_changed', {
                id: connectionId,
                qrCode: update.qr,
            });
        }
    };
}
exports.default = onConnectionUpdate;
