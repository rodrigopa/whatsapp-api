import { FastifyRequest, HookHandlerDoneFunction } from 'fastify';
import { respondJSend } from '../../common/jsend';
import { FastifyReply } from 'fastify/types/reply';

export function authMiddleware(
  request: FastifyRequest<{ Querystring: { apiToken?: string } }>,
  reply: FastifyReply,
  done: HookHandlerDoneFunction,
) {
  const apiToken = request.headers.authorization ?? request.query?.apiToken;

  if (!apiToken || apiToken !== (request as any).config.API_TOKEN) {
    return reply.status(401).send(respondJSend('fail', null, 'Unauthorized.'));
  }

  done();
}
