import { ConnectionWebHookMapper } from './types';
export declare function callWebHook<T extends keyof ConnectionWebHookMapper>(webhookURL: string, connectionId: string, hookName: T, data: Parameters<ConnectionWebHookMapper[T]>[0]): Promise<void>;
export declare function dispatchWebhook<T extends keyof ConnectionWebHookMapper>(connectionId: string, hookName: T, data: Parameters<ConnectionWebHookMapper[T]>[0]): Promise<void>;
