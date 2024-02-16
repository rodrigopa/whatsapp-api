import { MessageUpsertType, WAMessage } from '@whiskeysockets/baileys/lib/Types/Message';
import { config } from '../../shared/config';
import { WASocket } from '@whiskeysockets/baileys';
import { dispatchWebhook } from '../../shared/webhooks';

export default function onMessageUpsert(connectionId: string, waSocket: WASocket) {
  return async function (params: { messages: WAMessage[]; type: MessageUpsertType }) {
    for (const message of params.messages) {
      // if (config.AUTO_READ_MESSAGES) {
      //   await waSocket.readMessages([message.key]);
      // }
      console.log(message);
      if (!message.key.fromMe) {
        dispatchWebhook(connectionId, 'message_received', {
          id: connectionId,
          message,
        });
      }
    }
  };
}
