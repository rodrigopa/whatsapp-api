import { BaileysEventMap } from '@whiskeysockets/baileys';
export default function onConnectionUpdate(connectionId: string, startSocket: Function, removeAll: () => Promise<void>, subscribe: Function): (update: BaileysEventMap['connection.update']) => Promise<void>;
