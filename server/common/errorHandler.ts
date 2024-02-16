import { respondJSend } from './jsend';
import { FastifyError } from '@fastify/error';
import { FastifyRequest } from 'fastify/types/request';
import { FastifyReply } from 'fastify/types/reply';

export function errorHandler(error: FastifyError, request: FastifyRequest, reply: FastifyReply) {
  const errorCode = error.statusCode ?? 500;

  if (errorCode === 500) {
    reply.status(errorCode).send(respondJSend('error', error.message));
  } else {
    reply.status(errorCode).send(respondJSend('fail', error.validation, error.message));
  }
}
