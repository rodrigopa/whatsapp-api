import { ConnectionStatus } from '../../../server/model/models/connection.models';
import { WAMessage } from '@whiskeysockets/baileys/lib/Types/Message';
import { PresenceData } from '@whiskeysockets/baileys/lib/Types/Chat';

export abstract class ConnectionWebHookMapper {
  abstract connection_status_changed: (params: {
    id: string;
    status: ConnectionStatus;
    qrCode?: string | null;
  }) => void;
  abstract qrcode_changed: (params: { id: string; qrCode: string }) => void;
  abstract connection_logout: (params: { id: string }) => void;
  abstract connection_delete: (params: { id: string }) => void;
  abstract connection_created: (params: { id: string }) => void;
  abstract connection_webhook_url_changed: (params: { id: string; url: string }) => void;
  abstract connection_title_changed: (params: { id: string; title: string }) => void;
  abstract message_received: (params: { id: string; message: WAMessage }) => void;
  abstract presence_updated: (params: { [participant: string]: PresenceData }) => void;
  abstract payment_received: (params: { id: string }) => void;
}

export const ConnectionWebHooks = [
  'connection_status_changed',
  'qrcode_changed',
  'connection_logout',
  'connection_delete',
  'connection_created',
  'connection_webhook_url_changed',
  'connection_title_changed',
  'message_received',
  'presence_updated',
];

export type ConnectionWebHook = keyof ConnectionWebHookMapper;
