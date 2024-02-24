import {
  AnyMessageContent,
  generateMessageID,
  jidDecode,
  makeCacheableSignalKeyStore,
  makeWASocket,
  AnyMediaMessageContent,
  WASocket,
  makeInMemoryStore,
} from '@whiskeysockets/baileys';
import P from 'pino';
import NodeCache from 'node-cache';
import { useRedisMultiAuth } from './common/use-redis-multi-auth';
import onCredsUpdate from './actions/credsUpdate';
import onConnectionUpdate from './actions/connectionUpdate';
import { redis } from '../shared/redis';
import { dispatchWebhook } from '../shared/webhooks';
import onMessageUpsert from './actions/messagesUpsert';
import BeeQueue from 'bee-queue';
import onPresenceUpdate from './actions/presenceUpdate';
import patchStanzaChargeMessage from './common/patchChargeMessage';
import generateOrderUniqueId from '../server/common/generateOrderUniqueId';
import patchStanzaChargeUpdateMessage from './common/patchChargeUpdateMessage';
import patchStanzaChargePaidMessage from './common/patchChargePaidMessage';
import { Buffer } from 'buffer';

const logger = P({ level: 'silent' });
const msgRetryCounterCache = new NodeCache();

export let waSocket: WASocket;

const connectionId = String(process.env.CONNECTION_ID);

export const store = makeInMemoryStore({});
store.readFromFile(`${__dirname}/store/${connectionId}.json`);
setInterval(() => {
  store.writeToFile(`${__dirname}/store/${connectionId}.json`);
}, 5_000);

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

        waSocket.sendMessage(`${job.data.data.destination}@c.us`, textMessageContent);
        break;

      case 'sendImageMessage':
        const imageMessageContent: AnyMessageContent = {
          caption: job.data.data.text,
          image: Buffer.from(job.data.data.image, 'base64'),
        };

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

      case 'sendLocationMessage':
        waSocket.sendMessage(`${job.data.data.destination}@c.us`, {
          location: {
            degreesLatitude: job.data.data.latitude,
            degreesLongitude: job.data.data.longitude,
          },
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

      case 'updateProfilePictureSetting':
        return waSocket.updateProfilePicturePrivacy(job.data.data.value);

      case 'updateStatusSetting':
        return waSocket.updateStatusPrivacy(job.data.data.value);

      case 'updateReadReceiptsSetting':
        return waSocket.updateReadReceiptsPrivacy(job.data.data.value);

      case 'updateGroupsAddSetting':
        return waSocket.updateGroupsAddPrivacy(job.data.data.value);

      case 'updateDefaultDisappearingModeSetting':
        return waSocket.updateDefaultDisappearingMode(job.data.data.value);

      case 'sendCatalogMessage':
        const meId = jidDecode(waSocket.authState.creds.me?.id);
        const catalogUrl = `https://wa.me/c/${meId?.user}`;
        const message = {
          extendedTextMessage: {
            text: `${job.data.data.text ? `${job.data.data.text}\n` : ''}${catalogUrl}`,
            matchedText: catalogUrl,
            canonicalUrl: '',
            description: '',
            title: 'Catálogo',
            inviteLinkGroupTypeV2: 0,
          },
        };
        waSocket.relayMessage(`${job.data.data.destination}@c.us`, message, {
          messageId: generateMessageID(),
        });
        break;

      case 'sendChargeMessage':
        const referenceId = generateOrderUniqueId();
        const messageId = generateMessageID();
        const order = await waSocket.getOrderDetails(
          job.data.data.orderId,
          job.data.data.orderToken,
        );
        const shipping = 0;
        const items = order.products.map((product) => ({
          quantity: product.quantity,
          product_id: product.id,
          amount: { offset: 1000, value: product.price },
          name: product.name,
          retailer_id: product.id,
        }));
        const total = order.price.total;
        const buttonParamsJson = JSON.stringify({
          external_payment_configurations: [
            { payment_instruction: 'Pagar com pix', type: 'payment_instruction' },
          ],
          currency: 'BRL',
          additional_note: '',
          total_amount: { value: total + shipping, offset: 1000 },
          type: 'physical-goods',
          payment_settings: [{ type: 'cards', cards: { enabled: true } }],
          reference_id: referenceId,
          order: {
            subtotal: { value: total + shipping, offset: 1000 },
            status: 'payment_requested',
            order_type: 'ORDER',
            shipping: { value: shipping, offset: 1000 },
            items,
          },
        });
        waSocket.relayMessage(
          `${job.data.data.destination}@c.us`,
          {
            interactiveMessage: {
              // header: {
              //   hasMediaAttachment: true,
              //   jpegThumbnail: Buffer.from(
              //     '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',
              //     'base64',
              //   ),
              // },
              nativeFlowMessage: {
                buttons: [
                  {
                    name: 'review_and_pay',
                    buttonParamsJson,
                  },
                ],
              },
            },
          },
          {
            messageId,
            patchStanza: patchStanzaChargeMessage,
          } as any,
        );
        break;

      case 'sendChargeUpdateMessage':
        waSocket.relayMessage(
          `${job.data.data.destination}@c.us`,
          {
            interactiveMessage: {
              nativeFlowMessage: {
                buttons: [
                  {
                    name: 'review_order',
                    buttonParamsJson: JSON.stringify({
                      reference_id: job.data.data.referenceId,
                      order: {
                        status: job.data.data.status,
                      },
                    }),
                  },
                ],
              },
            },
          },
          {
            messageId: generateMessageID(),
            patchStanza: patchStanzaChargeUpdateMessage,
          } as any,
        );
        break;

      case 'sendChargePaidMessage':
        waSocket.relayMessage(
          `${job.data.data.destination}@c.us`,
          {
            interactiveMessage: {
              nativeFlowMessage: {
                buttons: [
                  {
                    name: 'payment_status',
                    buttonParamsJson: JSON.stringify({
                      reference_id: job.data.data.referenceId,
                      payment_timestamp: Math.round(+Date.now()),
                      payment_status: 'captured',
                    }),
                  },
                ],
              },
            },
          },
          {
            messageId: generateMessageID(),
            patchStanza: patchStanzaChargePaidMessage,
          } as any,
        );
        break;

      case 'getMyCatalog':
        return waSocket.getCatalog({ jid: waSocket.authState.creds.me?.id });

      case 'getCatalog':
        return waSocket.getCatalog({ jid: `${job.data.data.destination}@c.us` });

      case 'getMyCollections':
        return waSocket.getCollections(waSocket.authState.creds.me?.id, 20);

      case 'setProductVisibility':
        waSocket.query({
          tag: 'iq',
          attrs: {
            to: 's.whatsapp.net',
            type: 'set',
            xmlns: 'w:biz:catalog',
            smax_id: '23',
          },
          content: [
            {
              tag: 'product_visibility_update',
              attrs: { v: '1' },
              content: [
                {
                  tag: 'product',
                  attrs: {
                    is_hidden: `${!job.data.data.visible}`,
                  },
                  content: [
                    {
                      tag: 'id',
                      attrs: {},
                      content: Buffer.from(`${job.data.data.productId}`),
                    },
                  ],
                },
              ],
            },
          ],
        });
        break;

      case 'productCreate':
        waSocket.productCreate({
          name: job.data.data.name,
          isHidden: false,
          currency: 'BRL',
          description: job.data.data.description,
          images: job.data.data.images.map((item: string) => Buffer.from(item, 'base64')),
          originCountryCode: 'BR',
          price: job.data.data.price,
        });
        break;

      case 'sendRequestPaymentMessage':
        const requestPaymentMessage = {
          amount: {
            currencyCode: 'BRL',
            offset: 0,
            value: 9.99,
          },
          expiryTimestamp: 0,
          amount1000: 9.99 * 1000,
          currencyCodeIso4217: 'BRL',
          requestFrom: '0@s.whatsapp.net',
          noteMessage: {
            extendedTextMessage: {
              text: 'Example Payment Message',
            },
          },
          background: undefined,
        };
        waSocket.relayMessage(
          '558596835002@s.whatsapp.net',
          { requestPaymentMessage },
          { messageId: generateMessageID() },
        );
        break;
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

  store.bind(waSocket.ev);

  waSocket.ev.on('creds.update', onCredsUpdate(saveCreds));

  waSocket.ev.on(
    'connection.update',
    onConnectionUpdate(connectionId, waSocket, startSocket, removeAll, subscribe),
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
