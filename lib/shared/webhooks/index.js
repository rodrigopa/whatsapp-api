"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dispatchWebhook = exports.callWebHook = void 0;
const redis_1 = require("../redis");
async function callWebHook(webhookURL, connectionId, hookName, data) {
    await fetch(webhookURL, {
        headers: {
            'content-type': 'application/json',
            accept: 'application/json',
        },
        method: 'post',
        body: JSON.stringify({ hookName, connectionId, ...data }),
    });
    console.log(`O webHook ${hookName} da URL ${webhookURL} com os dados ${JSON.stringify(data)} foi enviado.`);
}
exports.callWebHook = callWebHook;
async function dispatchWebhook(connectionId, hookName, data) {
    const { hooks, webhookURL } = (await redis_1.redis.hgetall(`connection_${connectionId}`));
    if (hooks.includes(hookName)) {
        await callWebHook(webhookURL, connectionId, hookName, data);
    }
}
exports.dispatchWebhook = dispatchWebhook;
