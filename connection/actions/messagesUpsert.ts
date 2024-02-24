import { MessageUpsertType, WAMessage } from '@whiskeysockets/baileys/lib/Types/Message';
import { config } from '../../shared/config';
import { generateMessageID, isJidGroup, proto, WASocket } from '@whiskeysockets/baileys';
import { dispatchWebhook } from '../../shared/webhooks';
import { store, waSocket } from '../index';
import Long from 'long';
import Chat = proto.Message.Chat;

export default function onMessageUpsert(connectionId: string, waSocket: WASocket) {
  return async function (params: { messages: WAMessage[]; type: MessageUpsertType }) {
    for (const message of params.messages) {
      // if (config.AUTO_READ_MESSAGES) {
      //   await waSocket.readMessages([message.key]);
      // }
      console.log(JSON.stringify(message, null, 2));

      if (message.message?.conversation === 'status') {
        const chats = store.chats
          .all()
          .reduce<string[]>((acc, chat) => (isJidGroup(chat.id) ? acc : [...acc, chat.id]), []);

        // waSocket.
        // waSocket.sendMessage(
        //   'status@broadcast',
        //   { text: 'This is a test' },
        //   {
        //     backgroundColor: '#315575',
        //     font: 2,
        //     statusJidList: chats,
        //   },
        // );
        // waSocket.sendMessage(
        //   'status@broadcast',
        //   {
        //     delete: {
        //       remoteJid: 'status@broadcast',
        //       fromMe: true,
        //       id: '3AA9DE1D1430A762359C',
        //     },
        //   },
        //   {
        //     statusJidList: chats,
        //   },
        // );
      }
      if (!message.key.fromMe) {
        dispatchWebhook(connectionId, 'message_received', {
          id: connectionId,
          message,
        });
      }
    }
  };
}
