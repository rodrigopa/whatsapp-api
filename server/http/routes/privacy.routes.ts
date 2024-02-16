import { FastifyPluginAsync, FastifyRequest } from 'fastify';
import { container } from 'tsyringe';
import { ConnectionController } from '../controllers/connection.controller';
import {
  EnsureConnectionIdValidation,
  EnsureConnectionIdValidationQuerystring,
} from '../validations/connection/ensure-connection-id.validation';
import { MessageController } from '../controllers/message.controller';
import {
  GetStatusValidation,
  GetStatusValidationBody,
} from '../validations/misc/get-status.validation';
import { MiscController } from '../controllers/misc.controller';
import {
  CheckNumberValidation,
  CheckNumberValidationBody,
} from '../validations/misc/check-number.validation';
import {
  GetProfilePictureValidation,
  GetProfilePictureValidationBody,
} from '../validations/misc/get-profile-picture.validation';
import {
  GetBusinessProfileValidation,
  GetBusinessProfileValidationBody,
} from '../validations/misc/get-business-profile.validation';
import {
  PresenceSubscribeValidation,
  PresenceSubscribeValidationBody,
} from '../validations/misc/presence-subscribe.validation';
import { PrivacyController } from '../controllers/privacy.controller';
import {
  UpdateLastSeenSettingValidation,
  UpdateLastSeenSettingValidationBody,
} from '../validations/privacy/update-last-seen-setting.validation';
import {
  UpdateOnlineSettingValidation,
  UpdateOnlineSettingValidationBody,
} from '../validations/privacy/update-online-setting.validation';

const miscRoutes: FastifyPluginAsync = async (server) => {
  const controller = container.resolve(PrivacyController);

  server.get<{
    Querystring: EnsureConnectionIdValidationQuerystring;
  }>(
    '/privacy/getSettings',
    {
      schema: EnsureConnectionIdValidation,
    },
    (request, reply) => controller.getSettings(request, reply),
  );

  server.post<{
    Querystring: EnsureConnectionIdValidationQuerystring;
    Body: UpdateLastSeenSettingValidationBody;
  }>(
    '/privacy/updateLastSeen',
    {
      schema: { ...EnsureConnectionIdValidation, ...UpdateLastSeenSettingValidation },
    },
    (request, reply) => controller.updateLastSeenSetting(request, reply),
  );

  server.post<{
    Querystring: EnsureConnectionIdValidationQuerystring;
    Body: UpdateOnlineSettingValidationBody;
  }>(
    '/privacy/updateOnline',
    {
      schema: { ...EnsureConnectionIdValidation, ...UpdateOnlineSettingValidation },
    },
    (request, reply) => controller.updateOnlineSetting(request, reply),
  );
};

export default miscRoutes;
