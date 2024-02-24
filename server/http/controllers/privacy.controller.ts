import { inject, injectable } from 'tsyringe';
import RedisService from '../../services/redis.service';
import ProcessManagerService from '../../services/process-manager.service';
import { FastifyRequest } from 'fastify';
import { EnsureConnectionIdValidationQuerystring } from '../validations/connection/ensure-connection-id.validation';
import { respondJSend } from '../../common/jsend';
import { UpdateLastSeenSettingValidationBody } from '../validations/privacy/update-last-seen-setting.validation';
import { UpdateProfilePictureSettingValidationBody } from '../validations/privacy/update-profile-picture-setting.validation';
import { UpdateStatusSettingValidationBody } from '../validations/privacy/update-status-setting.validation';
import { UpdateReadReceiptsSettingValidationBody } from '../validations/privacy/update-read-receipts-setting.validation';
import { UpdateGroupsAddSettingValidationBody } from '../validations/privacy/update-groups-add-setting.validation';

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

  public async updateProfilePictureSetting(
    request: FastifyRequest<{
      Querystring: EnsureConnectionIdValidationQuerystring;
      Body: UpdateProfilePictureSettingValidationBody;
    }>,
    reply,
  ) {
    this.processManagerService.sendMessageToConnection(
      request.query.connectionId,
      'updateProfilePictureSetting',
      request.body,
    );
  }

  public async updateStatusSetting(
    request: FastifyRequest<{
      Querystring: EnsureConnectionIdValidationQuerystring;
      Body: UpdateStatusSettingValidationBody;
    }>,
    reply,
  ) {
    this.processManagerService.sendMessageToConnection(
      request.query.connectionId,
      'updateStatusSetting',
      request.body,
    );
  }

  public async updateReadReceiptsSetting(
    request: FastifyRequest<{
      Querystring: EnsureConnectionIdValidationQuerystring;
      Body: UpdateReadReceiptsSettingValidationBody;
    }>,
    reply,
  ) {
    this.processManagerService.sendMessageToConnection(
      request.query.connectionId,
      'updateReadReceiptsSetting',
      request.body,
    );
  }

  public async updateGroupsAddSetting(
    request: FastifyRequest<{
      Querystring: EnsureConnectionIdValidationQuerystring;
      Body: UpdateGroupsAddSettingValidationBody;
    }>,
    reply,
  ) {
    this.processManagerService.sendMessageToConnection(
      request.query.connectionId,
      'updateGroupsAddSetting',
      request.body,
    );
  }

  public async updateDefaultDisappearingModeSetting(
    request: FastifyRequest<{
      Querystring: EnsureConnectionIdValidationQuerystring;
      Body: UpdateGroupsAddSettingValidationBody;
    }>,
    reply,
  ) {
    this.processManagerService.sendMessageToConnection(
      request.query.connectionId,
      'updateDefaultDisappearingModeSetting',
      request.body,
    );
  }
}
