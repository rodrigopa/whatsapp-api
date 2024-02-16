import { FastifyInstance, FastifyRequest } from 'fastify';
import type { Config } from '../../shared/config';
import FastifyPlugin from 'fastify-plugin';

function configPlugin(fastify: FastifyInstance, options: { config: Config }, done: () => void) {
  fastify.decorate('config', options.config);
  fastify.addHook('onRequest', (request: FastifyRequest, reply, done) => {
    (request as any).config = options.config;
    done();
  });

  done();
}

export default FastifyPlugin(configPlugin);
