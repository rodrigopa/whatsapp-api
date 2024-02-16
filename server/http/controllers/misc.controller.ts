import { inject, injectable } from 'tsyringe';
import RedisService from '../../services/redis.service';
import ProcessManagerService from '../../services/process-manager.service';
import { FastifyRequest } from 'fastify';
import { EnsureConnectionIdValidationQuerystring } from '../validations/connection/ensure-connection-id.validation';
import { respondJSend } from '../../common/jsend';
import { CheckNumberValidationBody } from '../validations/misc/check-number.validation';
import { GetStatusValidationBody } from '../validations/misc/get-status.validation';
import { GetProfilePictureValidationBody } from '../validations/misc/get-profile-picture.validation';
import { BlockNumberValidationBody } from '../validations/misc/block-number.validation';
import { UnblockNumberValidationBody } from '../validations/misc/unblock-number.validation';
import { PresenceUpdateValidationBody } from '../validations/misc/presence-update.validation';

@injectable()
export class MiscController {
  constructor(
    @inject(RedisService) public redisService: RedisService,
    @inject(ProcessManagerService) public processManagerService: ProcessManagerService,
  ) {}

  public async checkNumber(
    request: FastifyRequest<{
      Querystring: EnsureConnectionIdValidationQuerystring;
      Body: CheckNumberValidationBody;
    }>,
    reply,
  ) {
    const result = await this.processManagerService.sendMessageToConnection(
      request.query.connectionId,
      'checkNumber',
      {
        jid: request.body.jid,
      },
    );

    return respondJSend('success', result);
  }

  public async getStatus(
    request: FastifyRequest<{
      Querystring: EnsureConnectionIdValidationQuerystring;
      Body: GetStatusValidationBody;
    }>,
    reply,
  ) {
    const result = await this.processManagerService.sendMessageToConnection(
      request.query.connectionId,
      'getStatus',
      {
        jid: request.body.jid,
      },
    );

    return respondJSend('success', result);
  }

  public async getProfilePicture(
    request: FastifyRequest<{
      Querystring: EnsureConnectionIdValidationQuerystring;
      Body: GetProfilePictureValidationBody;
    }>,
    reply,
  ) {
    const result = await this.processManagerService.sendMessageToConnection(
      request.query.connectionId,
      'getProfilePicture',
      {
        jid: request.body.jid,
      },
    );

    return respondJSend('success', result);
  }

  public async getBusinessProfile(
    request: FastifyRequest<{
      Querystring: EnsureConnectionIdValidationQuerystring;
      Body: GetProfilePictureValidationBody;
    }>,
    reply,
  ) {
    const result = await this.processManagerService.sendMessageToConnection(
      request.query.connectionId,
      'getBusinessProfile',
      {
        jid: request.body.jid,
      },
    );

    return respondJSend('success', result);
  }

  public async presenceSubscribe(
    request: FastifyRequest<{
      Querystring: EnsureConnectionIdValidationQuerystring;
      Body: GetProfilePictureValidationBody;
    }>,
    reply,
  ) {
    this.processManagerService.sendMessageToConnection(
      request.query.connectionId,
      'getBusinessProfile',
      {
        jid: request.body.jid,
      },
    );
  }

  public async blockNumber(
    request: FastifyRequest<{
      Querystring: EnsureConnectionIdValidationQuerystring;
      Body: BlockNumberValidationBody;
    }>,
    reply,
  ) {
    this.processManagerService.sendMessageToConnection(request.query.connectionId, 'blockNumber', {
      jid: request.body.jid,
    });
  }

  public async unblockNumber(
    request: FastifyRequest<{
      Querystring: EnsureConnectionIdValidationQuerystring;
      Body: UnblockNumberValidationBody;
    }>,
    reply,
  ) {
    this.processManagerService.sendMessageToConnection(
      request.query.connectionId,
      'unblockNumber',
      {
        jid: request.body.jid,
      },
    );
  }

  public async presenceUpdate(
    request: FastifyRequest<{
      Querystring: EnsureConnectionIdValidationQuerystring;
      Body: PresenceUpdateValidationBody;
    }>,
    reply,
  ) {
    this.processManagerService.sendMessageToConnection(
      request.query.connectionId,
      'presenceUpdate',
      {
        jid: request.body.jid,
        presence: request.body.presence,
      },
    );
  }
}
