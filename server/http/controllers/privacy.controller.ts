import { inject, injectable } from 'tsyringe';
import RedisService from '../../services/redis.service';
import ProcessManagerService from '../../services/process-manager.service';
import { FastifyRequest } from 'fastify';
import { EnsureConnectionIdValidationQuerystring } from '../validations/connection/ensure-connection-id.validation';
import { respondJSend } from '../../common/jsend';
import { CheckNumberValidationBody } from '../validations/misc/check-number.validation';
import { GetStatusValidationBody } from '../validations/misc/get-status.validation';
import { GetProfilePictureValidationBody } from '../validations/misc/get-profile-picture.validation';
import { UpdateLastSeenSettingValidationBody } from '../validations/privacy/update-last-seen-setting.validation';

@injectable()
export class PrivacyController {
  constructor(
    @inject(RedisService) public redisService: RedisService,
    @inject(ProcessManagerService) public processManagerService: ProcessManagerService,
  ) {}

  public async getSettings(
    request: FastifyRequest<{
      Querystring: EnsureConnectionIdValidationQuerystring;
    }>,
    reply,
  ) {
    const result = await this.processManagerService.sendMessageToConnection(
      request.query.connectionId,
      'getPrivacySettings',
    );

    return respondJSend('success', result);
  }

  public async updateLastSeenSetting(
    request: FastifyRequest<{
      Querystring: EnsureConnectionIdValidationQuerystring;
      Body: UpdateLastSeenSettingValidationBody;
    }>,
    reply,
  ) {
    this.processManagerService.sendMessageToConnection(
      request.query.connectionId,
      'updateLastSeenSetting',
      request.body,
    );
  }

  public async updateOnlineSetting(
    request: FastifyRequest<{
      Querystring: EnsureConnectionIdValidationQuerystring;
      Body: UpdateLastSeenSettingValidationBody;
    }>,
    reply,
  ) {
    this.processManagerService.sendMessageToConnection(
      request.query.connectionId,
      'updateOnlineSetting',
      request.body,
    );
  }
}
