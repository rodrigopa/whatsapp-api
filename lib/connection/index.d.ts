/// <reference types="node" />
import { WASocket } from '@whiskeysockets/baileys';
export declare let waSocket: WASocket;
export declare let processSubscriber: NodeJS.Process | null;
export declare function startSocket(): Promise<void>;
