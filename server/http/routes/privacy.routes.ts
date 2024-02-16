import { FastifyPluginAsync } from 'fastify';
import { container } from 'tsyringe';
import {
  EnsureConnectionIdValidation,
  EnsureConnectionIdValidationQuerystring,
} from '../validations/connection/ensure-connection-id.validation';
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
