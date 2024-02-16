export type JSendStatus = 'success' | 'fail' | 'error';
export type JSendSuccessResponse<T> = {
    status: 'success';
    data: T;
};
export type JSendFailResponse<T> = {
    status: 'fail';
    data?: T;
    message?: string;
};
export type JSendErrorResponse = {
    status: 'error';
    message: string;
};
export type JSendResponse<T> = JSendSuccessResponse<T> | JSendFailResponse<T> | JSendErrorResponse;
export declare function respondJSend<T>(status: 'success', data: T): JSendSuccessResponse<T>;
export declare function respondJSend(status: 'error', message: string): JSendErrorResponse;
export declare function respondJSend<T>(status: 'fail', data?: T, message?: string): JSendFailResponse<T>;
