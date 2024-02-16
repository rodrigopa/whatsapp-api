import { BaileysEventMap, DisconnectReason } from '@whiskeysockets/baileys';
import { redis } from '../../shared/redis';
import { dispatchWebhook } from '../../shared/webhooks';

export default function onConnectionUpdate(
  connectionId: string,
  startSocket: Function,
  removeAll: () => Promise<void>,
  subscribe: Function,
) {
  return async function (update: BaileysEventMap['connection.update']) {
    const { connection, lastDisconnect } = update;

    if (connection === 'close') {
      const shouldReconnect =
        (lastDisconnect?.error as any)?.output?.statusCode !== DisconnectReason.loggedOut;
      if (shouldReconnect) {
        redis.hdel(`connection_${connectionId}`, 'qrCode');
        redis.hset(`connection_${connectionId}`, 'status', 'connecting');
        dispatchWebhook(connectionId, 'connection_status_changed', {
          id: connectionId,
          status: 'connecting',
        });
        startSocket();
      } else {
        await removeAll();
        process.exit(1);
      }
    } else if (connection === 'open') {
      subscribe();
      redis.hdel(`connection_${connectionId}`, 'qrCode');
      redis.hset(`connection_${connectionId}`, 'status', 'connected');
      dispatchWebhook(connectionId, 'connection_status_changed', {
        id: connectionId,
        status: 'connected',
      });
    } else if (connection === 'connecting') {
      redis.hdel(`connection_${connectionId}`, 'qrCode');
      redis.hset(`connection_${connectionId}`, 'status', 'connecting');
      dispatchWebhook(connectionId, 'connection_status_changed', {
        id: connectionId,
        status: 'connecting',
      });
    } else if (update?.qr) {
      redis.hset(`connection_${connectionId}`, 'qrCode', update.qr, 'status', 'pending-qrcode');
      dispatchWebhook(connectionId, 'connection_status_changed', {
        id: connectionId,
        status: 'pending-qrcode',
      });
      dispatchWebhook(connectionId, 'qrcode_changed', {
        id: connectionId,
        qrCode: update.qr,
      });
    }
  };
}
