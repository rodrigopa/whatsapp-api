import { FastifyPluginAsync } from 'fastify';
import { container } from 'tsyringe';
import {
  EnsureConnectionIdValidation,
  EnsureConnectionIdValidationQuerystring,
} from '../validations/connection/ensure-connection-id.validation';
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
import {
  BlockNumberValidation,
  BlockNumberValidationBody,
} from '../validations/misc/block-number.validation';
import {
  UnblockNumberValidation,
  UnblockNumberValidationBody,
} from '../validations/misc/unblock-number.validation';
import {
  PresenceUpdateValidation,
  PresenceUpdateValidationBody,
} from '../validations/misc/presence-update.validation';

const miscRoutes: FastifyPluginAsync = async (server) => {
  const controller = container.resolve(MiscController);

  server.post<{
    Querystring: EnsureConnectionIdValidationQuerystring;
    Body: CheckNumberValidationBody;
  }>(
    '/misc/checkNumber',
    {
      schema: { ...EnsureConnectionIdValidation, ...CheckNumberValidation },
    },
    (request, reply) => controller.checkNumber(request, reply),
  );

  server.post<{
    Querystring: EnsureConnectionIdValidationQuerystring;
    Body: GetStatusValidationBody;
  }>(
    '/misc/getStatus',
    {
      schema: { ...EnsureConnectionIdValidation, ...GetStatusValidation },
    },
    (request, reply) => controller.getStatus(request, reply),
  );

  server.post<{
    Querystring: EnsureConnectionIdValidationQuerystring;
    Body: GetProfilePictureValidationBody;
  }>(
    '/misc/getProfilePicture',
    {
      schema: { ...EnsureConnectionIdValidation, ...GetProfilePictureValidation },
    },
    (request, reply) => controller.getProfilePicture(request, reply),
  );

  server.post<{
    Querystring: EnsureConnectionIdValidationQuerystring;
    Body: GetBusinessProfileValidationBody;
  }>(
    '/misc/getBusinessProfile',
    {
      schema: { ...EnsureConnectionIdValidation, ...GetBusinessProfileValidation },
    },
    (request, reply) => controller.getBusinessProfile(request, reply),
  );

  server.post<{
    Querystring: EnsureConnectionIdValidationQuerystring;
    Body: PresenceSubscribeValidationBody;
  }>(
    '/misc/presenceSubscribe',
    {
      schema: { ...EnsureConnectionIdValidation, ...PresenceSubscribeValidation },
    },
    (request, reply) => controller.presenceSubscribe(request, reply),
  );

  server.post<{
    Querystring: EnsureConnectionIdValidationQuerystring;
    Body: BlockNumberValidationBody;
  }>(
    '/misc/blockNumber',
    {
      schema: { ...EnsureConnectionIdValidation, ...BlockNumberValidation },
    },
    (request, reply) => controller.blockNumber(request, reply),
  );

  server.post<{
    Querystring: EnsureConnectionIdValidationQuerystring;
    Body: UnblockNumberValidationBody;
  }>(
    '/misc/unblockNumber',
    {
      schema: { ...EnsureConnectionIdValidation, ...UnblockNumberValidation },
    },
    (request, reply) => controller.unblockNumber(request, reply),
  );

  server.post<{
    Querystring: EnsureConnectionIdValidationQuerystring;
    Body: PresenceUpdateValidationBody;
  }>(
    '/misc/presenceUpdate',
    {
      schema: { ...EnsureConnectionIdValidation, ...PresenceUpdateValidation },
    },
    (request, reply) => controller.presenceUpdate(request, reply),
  );
};

export default miscRoutes;
