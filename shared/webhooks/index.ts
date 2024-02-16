import { InfoConnectionResponse } from '../../server/model/response/connection.responses';
import { redis } from '../redis';
import { ConnectionWebHookMapper } from './types';

export async function callWebHook<T extends keyof ConnectionWebHookMapper>(
  webhookURL: string,
  connectionId: string,
  hookName: T,
  data: Parameters<ConnectionWebHookMapper[T]>[0],
) {
  await fetch(webhookURL, {
    headers: {
      'content-type': 'application/json',
      accept: 'application/json',
    },
    method: 'post',
    body: JSON.stringify({ hookName, connectionId, ...data }),
  });
  console.log(
    `O webHook ${hookName} da URL ${webhookURL} com os dados ${JSON.stringify(data)} foi enviado.`,
  );
}

export async function dispatchWebhook<T extends keyof ConnectionWebHookMapper>(
  connectionId: string,
  hookName: T,
  data: Parameters<ConnectionWebHookMapper[T]>[0],
) {
  const { hooks, webhookURL } = (await redis.hgetall(
    `connection_${connectionId}`,
  )) as any as InfoConnectionResponse;
  if (hooks.includes(hookName)) {
    await callWebHook(webhookURL, connectionId, hookName, data);
  }
}
