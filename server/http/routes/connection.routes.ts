import { FastifyPluginAsync } from 'fastify';
import { container } from 'tsyringe';
import { ConnectionController } from '../controllers/connection.controller';
import {
  EnsureConnectionIdValidation,
  EnsureConnectionIdValidationQuerystring,
} from '../validations/connection/ensure-connection-id.validation';
import {
  StartConnectionValidation,
  StartConnectionValidationBody,
} from '../validations/connection/start-connection.validation';
import {
  AddConnectionHooksValidation,
  AddConnectionHooksValidationBody,
  RemoveConnectionHooksValidation,
  RemoveConnectionHooksValidationBody,
} from '../validations/connection/add-hooks.validation';
import {
  ChangeTitleConnectionValidation,
  ChangeTitleConnectionValidationBody,
} from '../validations/connection/change-title-connection.validation';
import {
  ChangeWebhookURLConnectionValidation,
  ChangeWebhookURLConnectionValidationBody,
} from '../validations/connection/change-webhook-url-connection.validation';

const connectionRoutes: FastifyPluginAsync = async (server) => {
  const controller = container.resolve(ConnectionController);

  server.get<{
    Querystring: EnsureConnectionIdValidationQuerystring;
  }>('/connection/status', { schema: EnsureConnectionIdValidation }, (request, reply) =>
    controller.status(request, reply),
  );

  server.post<{
    Body: StartConnectionValidationBody;
  }>('/connection/start', { schema: StartConnectionValidation }, (request, reply) =>
    controller.start(request, reply),
  );

  server.get<{
    Querystring: EnsureConnectionIdValidationQuerystring;
  }>('/connection/restart', { schema: EnsureConnectionIdValidation }, (request, reply) =>
    controller.restart(request, reply),
  );

  server.get<{
    Querystring: EnsureConnectionIdValidationQuerystring;
  }>('/connection/logout', { schema: EnsureConnectionIdValidation }, (request, reply) =>
    controller.logout(request, reply),
  );

  server.get<{
    Querystring: EnsureConnectionIdValidationQuerystring;
  }>('/connection/delete', { schema: EnsureConnectionIdValidation }, (request, reply) =>
    controller.delete(request, reply),
  );

  server.get<{
    Querystring: EnsureConnectionIdValidationQuerystring;
  }>('/connection/info', { schema: EnsureConnectionIdValidation }, (request, reply) =>
    controller.info(request, reply),
  );

  server.get('/connection/list', (request, reply) => controller.list(request, reply));

  server.get<{
    Querystring: EnsureConnectionIdValidationQuerystring;
  }>('/connection/qrCode', { schema: EnsureConnectionIdValidation }, (request, reply) =>
    controller.qrCode(request, reply),
  );

  server.get<{
    Querystring: EnsureConnectionIdValidationQuerystring;
  }>('/connection/qrCodeImage', { schema: EnsureConnectionIdValidation }, (request, reply) =>
    controller.qrCodeImage(request, reply),
  );

  server.get('/connection/hooks', (request, reply) => controller.hooks());

  server.post<{
    Body: AddConnectionHooksValidationBody;
    Querystring: EnsureConnectionIdValidationQuerystring;
  }>(
    '/connection/addHooks',
    { schema: { ...EnsureConnectionIdValidation, ...AddConnectionHooksValidation } },
    (request, reply) => controller.addHooks(request, reply),
  );

  server.post<{
    Body: RemoveConnectionHooksValidationBody;
    Querystring: EnsureConnectionIdValidationQuerystring;
  }>(
    '/connection/removeHooks',
    { schema: { ...EnsureConnectionIdValidation, ...RemoveConnectionHooksValidation } },
    (request, reply) => controller.removeHooks(request, reply),
  );

  server.post<{
    Body: ChangeTitleConnectionValidationBody;
    Querystring: EnsureConnectionIdValidationQuerystring;
  }>(
    '/connection/changeTitle',
    { schema: { ...EnsureConnectionIdValidation, ...ChangeTitleConnectionValidation } },
    (request, reply) => controller.changeTitle(request, reply),
  );

  server.post<{
    Body: ChangeWebhookURLConnectionValidationBody;
    Querystring: EnsureConnectionIdValidationQuerystring;
  }>(
    '/connection/changeWebhookURL',
    { schema: { ...EnsureConnectionIdValidation, ...ChangeWebhookURLConnectionValidation } },
    (request, reply) => controller.changeWebhookURL(request, reply),
  );
};

export default connectionRoutes;
