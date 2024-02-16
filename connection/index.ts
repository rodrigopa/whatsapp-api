import {
  AnyMessageContent,
  BinaryNode,
  generateForwardMessageContent,
  generateMessageID,
  generateWAMessage,
  makeCacheableSignalKeyStore,
  makeInMemoryStore,
  makeWASocket,
  prepareWAMessageMedia,
  proto,
  WASocket,
} from '@whiskeysockets/baileys';
import P from 'pino';
import NodeCache from 'node-cache';
import { useRedisMultiAuth } from './common/use-redis-multi-auth';
import onCredsUpdate from './actions/credsUpdate';
import onConnectionUpdate from './actions/connectionUpdate';
import { redis } from '../shared/redis';
import { dispatchWebhook } from '../shared/webhooks';
import onMessageUpsert from './actions/messagesUpsert';
import { ProcessSubscriberMessage } from '../shared/process-manager/types';
import {
  AnyMediaMessageContent,
  WAMessage,
  WAMessageContent,
} from '@whiskeysockets/baileys/lib/Types/Message';
import axon, { ReqSocket } from 'axon';
import BeeQueue from 'bee-queue';
import onPresenceUpdate from './actions/presenceUpdate';
import MessageKey = proto.MessageKey;

const logger = P({ level: 'silent' });
const msgRetryCounterCache = new NodeCache();

export let waSocket: WASocket;

const connectionId = String(process.env.CONNECTION_ID);

const queue = new BeeQueue(connectionId, {
  redis: {
    host: 'redis',
    password: process.env.REDIS_PASSWORD,
  },
});

function subscribe() {
  if (!queue.isRunning()) {
    return;
  }

  queue.process(async function (job) {
    switch (job.data.event) {
      case 'sendTextMessage':
        const textMessageContent: AnyMessageContent = {
          text: job.data.data.text,
        };

        waSocket.sendMessage(
          `${job.data.data.destination}@c.us`,
          job.data.data.forward
            ? {
                forward: await generateWAMessage(
                  `${job.data.data.destination}@c.us`,
                  textMessageContent,
                  {} as any,
                ),
                force: true,
              }
            : textMessageContent,
        );
        break;

      case 'sendImageMessage':
        const imageMessageContent: AnyMessageContent = {
          caption: job.data.data.text,
          image: Buffer.from(job.data.data.image, 'base64'),
        };

        console.log(job.data.data.forward);

        waSocket.sendMessage(`${job.data.data.destination}@c.us`, imageMessageContent);
        break;

      case 'sendVideoMessage':
        waSocket.sendMessage(`${job.data.data.destination}@c.us`, {
          caption: job.data.data.text,
          video: Buffer.from(job.data.data.video, 'base64'),
        });
        break;

      case 'sendAudioMessage':
        waSocket.sendMessage(`${job.data.data.destination}@c.us`, {
          caption: job.data.data.text,
          audio: Buffer.from(job.data.data.audio, 'base64'),
          ptt: job.data.data.ptt,
        });
        break;

      case 'sendMediaFromURLMessage':
        const type = job.data.data.type as 'audio' | 'video' | 'image' | 'document';
        const url = job.data.data.url;
        let waMessage: AnyMediaMessageContent | null = null;

        if (type === 'video') {
          waMessage = {
            video: { url },
            caption: job.data.data.text,
            mimetype: 'video/mp4',
          };
        } else if (type == 'document') {
          waMessage = {
            document: { url },
            caption: job.data.data.text,
            mimetype: job.data.data.mimeType,
          };
        } else if (type === 'image') {
          waMessage = {
            image: { url },
            caption: job.data.data.text,
          };
        } else if (type === 'audio') {
          waMessage = {
            audio: { url },
            caption: job.data.data.text,
            mimetype: 'audio/mp3',
          };
        }

        if (waMessage) {
          waSocket.sendMessage(`${job.data.data.destination}@c.us`, waMessage);
        }
        break;

      case 'reactMessage':
        waSocket.sendMessage(`${job.data.data.destination}@s.whatsapp.net`, {
          react: {
            key: {
              remoteJid: `${job.data.data.destination}@s.whatsapp.net`,
              fromMe: job.data.data.fromMe,
              id: job.data.data.key,
              participant: null,
            },
            text: job.data.data.text,
          },
        });
        break;

      case 'deleteMessage':
        waSocket.sendMessage(`${job.data.data.destination}@s.whatsapp.net`, {
          delete: {
            id: job.data.data.key,
            fromMe: true,
            remoteJid: `${job.data.data.destination}@s.whatsapp.net`,
          },
        });
        break;

      case 'updateMessage':
        waSocket.sendMessage(`${job.data.data.destination}@s.whatsapp.net`, {
          text: job.data.data.text,
          edit: {
            id: job.data.data.key,
            fromMe: true,
            remoteJid: `${job.data.data.destination}@s.whatsapp.net`,
          },
        });
        break;

      case 'checkNumber':
        const [{ exists, jid }] = await waSocket.onWhatsApp(`${job.data.data.jid}@c.us`);
        return { exists, jid };

      case 'getStatus':
        const { status, setAt } = (await waSocket.fetchStatus(`${job.data.data.jid}@c.us`))!;
        return { status, setAt };

      case 'getProfilePicture':
        return { image: await waSocket.profilePictureUrl(`${job.data.data.jid}@c.us`, 'image') };

      case 'getBusinessProfile':
        const profile = await waSocket.getBusinessProfile(`${job.data.data.jid}@c.us`);
        return !profile ? { message: 'Profile does not exists' } : profile;

      case 'blockNumber':
        waSocket.updateBlockStatus(`${job.data.data.jid}@c.us`, 'block');
        break;

      case 'unblockNumber':
        waSocket.updateBlockStatus(`${job.data.data.jid}@c.us`, 'unblock');
        break;

      case 'getPrivacySettings':
        return waSocket.fetchPrivacySettings(true);

      case 'updateLastSeenSetting':
        return waSocket.updateLastSeenPrivacy(job.data.data.value);

      case 'updateOnlineSetting':
        return waSocket.updateOnlinePrivacy(job.data.data.value);
    }
  });
}

export async function startSocket() {
  const { state, saveCreds, removeAll } = await useRedisMultiAuth(connectionId);

  console.log(`Iniciando conexão ${connectionId}`);

  waSocket = makeWASocket({
    logger,
    msgRetryCounterCache,
    auth: {
      creds: state.creds,
      keys: makeCacheableSignalKeyStore(state.keys, logger),
    },
  });

  waSocket.ev.on('creds.update', onCredsUpdate(saveCreds));

  waSocket.ev.on(
    'connection.update',
    onConnectionUpdate(connectionId, startSocket, removeAll, subscribe),
  );

  waSocket.ev.on('messages.upsert', onMessageUpsert(connectionId, waSocket));

  waSocket.ev.on('presence.update', onPresenceUpdate(connectionId));
}

startSocket();

['SIGINT', 'SIGTERM', 'SIGQUIT'].forEach((signal) =>
  process.on(signal, async () => {
    redis.hset(`connection_${connectionId}`, 'status', 'closed');
    await dispatchWebhook(connectionId, 'connection_status_changed', {
      id: connectionId,
      status: 'closed',
    });
    process.exit(0);
  }),
);
