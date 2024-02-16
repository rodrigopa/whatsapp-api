import { AuthenticationState } from '@whiskeysockets/baileys';
export declare function useRedisMultiAuth(connectionId: string): Promise<{
    state: AuthenticationState;
    saveCreds: () => Promise<void>;
    removeAll: () => Promise<void>;
}>;
