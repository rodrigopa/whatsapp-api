/// <reference types="node" />
import { FastifyRequest, HookHandlerDoneFunction } from 'fastify';
import { FastifyReply } from 'fastify/types/reply';
export declare function authMiddleware(request: FastifyRequest<{
    Querystring: {
        apiToken?: string;
    };
}>, reply: FastifyReply, done: HookHandlerDoneFunction): FastifyReply<import("fastify").RawServerDefault, import("http").IncomingMessage, import("http").ServerResponse<import("http").IncomingMessage>, import("fastify").RouteGenericInterface, unknown, import("fastify").FastifySchema, import("fastify").FastifyTypeProviderDefault, unknown> | undefined;
