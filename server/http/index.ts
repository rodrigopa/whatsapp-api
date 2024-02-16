import { FastifyPluginAsync } from 'fastify';

const routes: FastifyPluginAsync = async (server) => {
  server.register(require('./routes/connection.routes'));
  server.register(require('./routes/message.routes'));
  server.register(require('./routes/misc.routes'));
  server.register(require('./routes/privacy.routes'));
};

export default routes;
