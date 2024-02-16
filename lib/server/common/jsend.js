"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.respondJSend = void 0;
function respondJSend(status, data, message) {
    return {
        status,
        ...(data ? { data } : {}),
        ...(message ? { message } : {}),
    };
}
exports.respondJSend = respondJSend;
