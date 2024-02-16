import { FastifyError } from '@fastify/error';
import { FastifyRequest } from 'fastify/types/request';
import { FastifyReply } from 'fastify/types/reply';
export declare const errorHandler: (error: FastifyError, request: FastifyRequest, reply: FastifyReply) => void;
