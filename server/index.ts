import 'reflect-metadata';
import './ioc/register';

import Fastify from 'fastify';
import { validationCompiler } from './common/validationCompiler';
import { errorHandler } from './common/errorHandler';
import { authMiddleware } from './http/middlewares/auth.middleware';
import { config } from '../shared/config';
import multer from 'fastify-multer';
import configPlugin from './common/configPlugin';

export const server = Fastify({ logger: false });

server.register(configPlugin, { config });

server.register(multer.contentParser);

server.setErrorHandler(errorHandler);

server.setValidatorCompiler(validationCompiler);

server.addHook('preHandler', authMiddleware);

server.register(require('./http'));

server
  .listen({ port: config.SERVER_PORT, host: '0.0.0.0' })
  .then((value) => console.log(`Server started at ${value}`));
