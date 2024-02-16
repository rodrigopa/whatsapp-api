import { ConnectionStatus } from '../../../server/model/models/connection.models';
export declare abstract class ConnectionWebHookMapper {
    abstract connection_status_changed: (params: {
        id: string;
        status: ConnectionStatus;
        qrCode?: string | null;
    }) => void;
    abstract qrcode_changed: (params: {
        id: string;
        qrCode: string;
    }) => void;
    abstract connection_logout: (params: {
        id: string;
    }) => void;
    abstract connection_delete: (params: {
        id: string;
    }) => void;
    abstract connection_created: (params: {
        id: string;
    }) => void;
}
export declare const ConnectionWebHooks: string[];
export type ConnectionWebHook = keyof ConnectionWebHookMapper;
