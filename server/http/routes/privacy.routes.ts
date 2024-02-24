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
import {
  UpdateProfilePictureSettingValidation,
  UpdateProfilePictureSettingValidationBody,
} from '../validations/privacy/update-profile-picture-setting.validation';
import {
  UpdateStatusSettingValidation,
  UpdateStatusSettingValidationBody,
} from '../validations/privacy/update-status-setting.validation';
import {
  UpdateGroupsAddSettingValidation,
  UpdateGroupsAddSettingValidationBody,
} from '../validations/privacy/update-groups-add-setting.validation';
import { UpdateReadReceiptsSettingValidation } from '../validations/privacy/update-read-receipts-setting.validation';
import {
  UpdateDefaultDisappearingModeSettingValidation,
  UpdateDefaultDisappearingModeSettingValidationBody,
} from '../validations/privacy/update-default-disappearing-mode-setting.validation';

const privacyRoutes: FastifyPluginAsync = async (server) => {
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

  server.post<{
    Querystring: EnsureConnectionIdValidationQuerystring;
    Body: UpdateProfilePictureSettingValidationBody;
  }>(
    '/privacy/updateProfilePicture',
    {
      schema: { ...EnsureConnectionIdValidation, ...UpdateProfilePictureSettingValidation },
    },
    (request, reply) => controller.updateProfilePictureSetting(request, reply),
  );

  server.post<{
    Querystring: EnsureConnectionIdValidationQuerystring;
    Body: UpdateStatusSettingValidationBody;
  }>(
    '/privacy/updateStatus',
    {
      schema: { ...EnsureConnectionIdValidation, ...UpdateStatusSettingValidation },
    },
    (request, reply) => controller.updateStatusSetting(request, reply),
  );

  server.post<{
    Querystring: EnsureConnectionIdValidationQuerystring;
    Body: UpdateStatusSettingValidationBody;
  }>(
    '/privacy/updateReadReceipts',
    {
      schema: { ...EnsureConnectionIdValidation, ...UpdateReadReceiptsSettingValidation },
    },
    (request, reply) => controller.updateReadReceiptsSetting(request, reply),
  );

  server.post<{
    Querystring: EnsureConnectionIdValidationQuerystring;
    Body: UpdateGroupsAddSettingValidationBody;
  }>(
    '/privacy/updateGroupsAdd',
    {
      schema: { ...EnsureConnectionIdValidation, ...UpdateGroupsAddSettingValidation },
    },
    (request, reply) => controller.updateGroupsAddSetting(request, reply),
  );

  server.post<{
    Querystring: EnsureConnectionIdValidationQuerystring;
    Body: UpdateDefaultDisappearingModeSettingValidationBody;
  }>(
    '/privacy/updateDefaultDisappearingMode',
    {
      schema: {
        ...EnsureConnectionIdValidation,
        ...UpdateDefaultDisappearingModeSettingValidation,
      },
    },
    (request, reply) => controller.updateDefaultDisappearingModeSetting(request, reply),
  );
};

export default privacyRoutes;
