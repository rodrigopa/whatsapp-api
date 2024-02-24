import { ConnectionStatus } from '../models/connection.models';
import { UUID } from 'crypto';
import { ConnectionWebHook, ConnectionWebHooks } from '../../../shared/webhooks/types';

export type StatusConnectionResponse = {
  status: ConnectionStatus;
};

export type StartConnectionResponse = {
  id: UUID;
  title: string;
  webhookURL: string;
  hooks: string[];
  status: ConnectionStatus;
  qrCode?: string;
};

export type DeleteConnectionResponse = {
  id: string;
};

export type LogoutConnectionResponse = {
  id: string;
};

export type RestartConnectionResponse = {
  id: string;
};

export type InfoConnectionResponse = {
  id: string;
  title: string;
  hooks: ConnectionWebHook[];
  webhookURL: string;
  status: ConnectionStatus;
  qrCode?: string;
  phone?: string;
  devicePlatform?: string;
};

export type ListConnectionsResponse = {
  id: string;
  title: string;
  hooks: ConnectionWebHook[];
  webhookURL: string;
  status: ConnectionStatus;
  qrCode?: string;
}[];

export type QRCodeResponse = {
  id: string;
  qrCode: string;
  qrCodeBase64: string;
};

export type HooksConnectionResponse = typeof ConnectionWebHooks;

export type SyncHooksResponse = {
  id: string;
  hooks: Partial<typeof ConnectionWebHooks>;
};

export type TitleChangeConnectionResponse = {
  id: string;
  title: string;
};

export type WebhookURLChangeConnectionResponse = {
  id: string;
  webhookURL: string;
};
