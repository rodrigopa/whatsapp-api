import { BaileysEventEmitter, BaileysEventMap } from '@whiskeysockets/baileys';
import { dispatchWebhook } from '../../shared/webhooks';

export default function onPresenceUpdate(
  connectionId: string,
): (arg: BaileysEventMap['presence.update']) => void {
  return function ({ id, presences }) {
    dispatchWebhook(connectionId, 'presence_updated', presences);
  };
}
