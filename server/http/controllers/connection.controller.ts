import { respondJSend } from '../../common/jsend';
import {
  DeleteConnectionResponse,
  HooksConnectionResponse,
  InfoConnectionResponse,
  ListConnectionsResponse,
  LogoutConnectionResponse,
  QRCodeResponse,
  RestartConnectionResponse,
  StartConnectionResponse,
  StatusConnectionResponse,
  SyncHooksResponse,
  TitleChangeConnectionResponse,
  WebhookURLChangeConnectionResponse,
} from '../../model/response/connection.responses';
import { inject, injectable } from 'tsyringe';
import RedisService from '../../services/redis.service';
import { FastifyRequest } from 'fastify';
import ProcessManagerService from '../../services/process-manager.service';
import { randomUUID } from 'crypto';
import { StartConnectionValidationBody } from '../validations/connection/start-connection.validation';
import { EnsureConnectionIdValidationQuerystring } from '../validations/connection/ensure-connection-id.validation';
import QR from 'yaqrcode';
import { dispatchWebhook } from '../../../shared/webhooks';
import { ConnectionWebHooks } from '../../../shared/webhooks/types';
import {
  AddConnectionHooksValidationBody,
  RemoveConnectionHooksValidationBody,
} from '../validations/connection/add-hooks.validation';
import { ChangeWebhookURLConnectionValidationBody } from '../validations/connection/change-webhook-url-connection.validation';
import { ChangeTitleConnectionValidationBody } from '../validations/connection/change-title-connection.validation';

@injectable()
export class ConnectionController {
  constructor(
    @inject(RedisService) public redisService: RedisService,
    @inject(ProcessManagerService) public processManagerService: ProcessManagerService,
  ) {}

  public async status(
    request: FastifyRequest<{ Querystring: EnsureConnectionIdValidationQuerystring }>,
    reply,
  ) {
    const status = await this.redisService.getConnectionStatus(request.query.connectionId);
    if (status === null) {
      return reply.status(404).send(respondJSend('fail', null, 'The connection does not exists.'));
    }

    return respondJSend<StatusConnectionResponse>('success', {
      status,
    });
  }

  public async start(request: FastifyRequest<{ Body: StartConnectionValidationBody }>, reply) {
    const id = randomUUID();
    await this.redisService.createConnection(
      id,
      request.body.title,
      request.body.webhookURL,
      request.body.hooks,
      'connecting',
    );
    dispatchWebhook(id, 'connection_created', { id });
    await this.processManagerService.startAsync(id);
    return respondJSend<StartConnectionResponse>('success', {
      id,
      title: request.body.title,
      webhookURL: request.body.webhookURL,
      hooks: request.body.hooks,
      status: 'connecting',
    });
  }

  public async restart(
    request: FastifyRequest<{ Querystring: EnsureConnectionIdValidationQuerystring }>,
    reply,
  ) {
    const status = await this.redisService.getConnectionStatus(request.query.connectionId);
    if (status === null) {
      return reply.status(404).send(respondJSend('fail', null, 'The connection does not exists.'));
    }
    await this.processManagerService.restartAsync(request.query.connectionId);
    return respondJSend<RestartConnectionResponse>('success', {
      id: request.query.connectionId,
    });
  }

  public async logout(
    request: FastifyRequest<{ Querystring: EnsureConnectionIdValidationQuerystring }>,
    reply,
  ) {
    const status = await this.redisService.getConnectionStatus(request.query.connectionId);
    if (status === null) {
      return reply.status(404).send(respondJSend('fail', null, 'The connection does not exists.'));
    }

    await this.redisService.logoutConnection(request.query.connectionId);
    this.processManagerService.restartAsync(request.query.connectionId);
    dispatchWebhook(request.query.connectionId, 'connection_logout', {
      id: request.query.connectionId,
    });
    return respondJSend<LogoutConnectionResponse>('success', {
      id: request.query.connectionId,
    });
  }

  public async delete(
    request: FastifyRequest<{ Querystring: EnsureConnectionIdValidationQuerystring }>,
    reply,
  ) {
    const status = await this.redisService.getConnectionStatus(request.query.connectionId);
    if (status === null) {
      return reply.status(404).send(respondJSend('fail', null, 'The connection does not exists.'));
    }

    dispatchWebhook(request.query.connectionId, 'connection_delete', {
      id: request.query.connectionId,
    });
    await this.redisService.deleteConnection(request.query.connectionId);
    return respondJSend<DeleteConnectionResponse>('success', {
      id: request.query.connectionId,
    });
  }

  public async info(
    request: FastifyRequest<{ Querystring: EnsureConnectionIdValidationQuerystring }>,
    reply,
  ) {
    const info = await this.redisService.infoConnection(request.query.connectionId);
    if (Object.keys(info).length === 0) {
      return reply.status(404).send(respondJSend('fail', null, 'The connection does not exists.'));
    }
    return respondJSend<InfoConnectionResponse>('success', {
      id: request.query.connectionId,
      title: info.title,
      webhookURL: info.webhookURL,
      hooks: info.hooks,
      status: info.status,
    });
  }

  public async list(request, reply) {
    const list = await this.redisService.listConnections();
    const connections: ListConnectionsResponse = [];
    for (const connectionId of list) {
      const info = await this.redisService.infoConnection(connectionId.replace('connection_', ''));
      connections.push({
        id: connectionId.replace('connection_', ''),
        title: info.title,
        webhookURL: info.webhookURL,
        hooks: info.hooks,
        status: info.status,
      });
    }

    return respondJSend<ListConnectionsResponse>('success', connections);
  }

  private generateQrCode(qrCode: string) {
    return QR(qrCode, {
      size: 500,
    }).replace('data:image/gif;base64,', '');
  }

  public async qrCode(
    request: FastifyRequest<{ Querystring: EnsureConnectionIdValidationQuerystring }>,
    reply,
  ) {
    const info = await this.redisService.infoConnection(request.query.connectionId);
    if (Object.keys(info).length === 0) {
      return reply.status(404).send(respondJSend('fail', null, 'The connection does not exists.'));
    }
    if (!info.qrCode) {
      return reply
        .status(400)
        .send(respondJSend('fail', null, 'No QRCode available to this connection.'));
    }
    return respondJSend<QRCodeResponse>('success', {
      id: request.query.connectionId,
      qrCode: info.qrCode,
      qrCodeBase64: this.generateQrCode(info.qrCode),
    });
  }

  public async qrCodeImage(
    request: FastifyRequest<{ Querystring: EnsureConnectionIdValidationQuerystring }>,
    reply,
  ) {
    const info = await this.redisService.infoConnection(request.query.connectionId);
    if (Object.keys(info).length === 0) {
      return reply.status(404).send(respondJSend('fail', null, 'The connection does not exists.'));
    }
    if (!info.qrCode) {
      return reply
        .status(400)
        .send(respondJSend('fail', null, 'No QRCode available to this connection.'));
    }
    return reply
      .headers({ 'content-type': 'image/gif' })
      .send(Buffer.from(this.generateQrCode(info.qrCode), 'base64'));
  }

  public hooks() {
    return respondJSend<HooksConnectionResponse>('success', ConnectionWebHooks);
  }

  public async addHooks(
    request: FastifyRequest<{
      Body: AddConnectionHooksValidationBody;
      Querystring: EnsureConnectionIdValidationQuerystring;
    }>,
    reply,
  ) {
    const info = await this.redisService.infoConnection(request.query.connectionId);
    if (Object.keys(info).length === 0) {
      return reply.status(404).send(respondJSend('fail', null, 'The connection does not exists.'));
    }
    const hooks = [...new Set([...info.hooks, ...request.body.hooks])];
    await this.redisService.syncHooksConnection(request.query.connectionId, hooks);
    return respondJSend<SyncHooksResponse>('success', {
      id: request.query.connectionId,
      hooks,
    });
  }

  public async removeHooks(
    request: FastifyRequest<{
      Body: RemoveConnectionHooksValidationBody;
      Querystring: EnsureConnectionIdValidationQuerystring;
    }>,
    reply,
  ) {
    const info = await this.redisService.infoConnection(request.query.connectionId);
    if (Object.keys(info).length === 0) {
      return reply.status(404).send(respondJSend('fail', null, 'The connection does not exists.'));
    }
    const toRemove = new Set(request.body.hooks);
    const hooks = [...new Set(info.hooks.filter((x) => !toRemove.has(x)))] as string[];
    await this.redisService.syncHooksConnection(request.query.connectionId, hooks);
    return respondJSend<SyncHooksResponse>('success', {
      id: request.query.connectionId,
      hooks,
    });
  }

  public async changeTitle(
    request: FastifyRequest<{
      Body: ChangeTitleConnectionValidationBody;
      Querystring: EnsureConnectionIdValidationQuerystring;
    }>,
    reply,
  ) {
    const info = await this.redisService.infoConnection(request.query.connectionId);
    if (Object.keys(info).length === 0) {
      return reply.status(404).send(respondJSend('fail', null, 'The connection does not exists.'));
    }
    await this.redisService.changeTitleConnection(request.query.connectionId, request.body.title);
    dispatchWebhook(request.query.connectionId, 'connection_title_changed', {
      id: request.query.connectionId,
      title: request.body.title,
    });
    return respondJSend<TitleChangeConnectionResponse>('success', {
      id: request.query.connectionId,
      title: request.body.title,
    });
  }

  public async changeWebhookURL(
    request: FastifyRequest<{
      Body: ChangeWebhookURLConnectionValidationBody;
      Querystring: EnsureConnectionIdValidationQuerystring;
    }>,
    reply,
  ) {
    const info = await this.redisService.infoConnection(request.query.connectionId);
    if (Object.keys(info).length === 0) {
      return reply.status(404).send(respondJSend('fail', null, 'The connection does not exists.'));
    }
    await this.redisService.changeWebhookURLConnection(
      request.query.connectionId,
      request.body.webhookURL,
    );
    dispatchWebhook(request.query.connectionId, 'connection_webhook_url_changed', {
      id: request.query.connectionId,
      url: request.body.webhookURL,
    });
    return respondJSend<WebhookURLChangeConnectionResponse>('success', {
      id: request.query.connectionId,
      webhookURL: request.body.webhookURL,
    });
  }
}
