import { FastifyPluginAsync } from 'fastify';
import { container } from 'tsyringe';
import {
  EnsureConnectionIdValidation,
  EnsureConnectionIdValidationQuerystring,
} from '../validations/connection/ensure-connection-id.validation';
import { BusinessController } from '../controllers/business.controller';
import {
  CatalogMessageValidation,
  CatalogMessageValidationBody,
} from '../validations/business/catalog-message.validation';
import {
  ChargeMessageValidation,
  ChargeMessageValidationBody,
} from '../validations/business/charge-message.validation';
import {
  ChargeUpdateMessageValidation,
  ChargeUpdateMessageValidationBody,
} from '../validations/business/charge-update-message.validation';
import {
  ChargePaidMessageValidation,
  ChargePaidMessageValidationBody,
} from '../validations/business/charge-paid-message.validation';
import {
  GetCatalogValidation,
  GetCatalogValidationBody,
} from '../validations/business/get-catalog.validation';
import {
  SetProductVisibilityValidation,
  SetProductVisibilityValidationBody,
} from '../validations/business/set-product-visibility.validation';
import {
  ProductCreateValidation,
  ProductCreateValidationBody,
} from '../validations/business/product-create.validation';
import { File } from 'fastify-multer/lib/interfaces';
import { respondJSend } from '../../common/jsend';
import multer from 'fastify-multer';

const storage = multer.memoryStorage();
const upload = multer({ storage, limits: { fileSize: 1024 * 1024 * 10 } });

const businessRoutes: FastifyPluginAsync = async (server) => {
  const controller = container.resolve(BusinessController);

  server.post<{
    Querystring: EnsureConnectionIdValidationQuerystring;
    Body: CatalogMessageValidationBody;
  }>(
    '/business/sendCatalog',
    {
      schema: { ...EnsureConnectionIdValidation, ...CatalogMessageValidation },
    },
    (request, reply) => controller.sendCatalog(request, reply),
  );

  server.post<{
    Querystring: EnsureConnectionIdValidationQuerystring;
    Body: ChargeMessageValidationBody;
  }>(
    '/business/sendCharge',
    {
      schema: { ...EnsureConnectionIdValidation, ...ChargeMessageValidation },
    },
    (request, reply) => controller.sendCharge(request, reply),
  );

  server.post<{
    Querystring: EnsureConnectionIdValidationQuerystring;
    Body: ChargeUpdateMessageValidationBody;
  }>(
    '/business/sendChargeUpdate',
    {
      schema: { ...EnsureConnectionIdValidation, ...ChargeUpdateMessageValidation },
    },
    (request, reply) => controller.sendChargeUpdate(request, reply),
  );

  server.post<{
    Querystring: EnsureConnectionIdValidationQuerystring;
    Body: ChargePaidMessageValidationBody;
  }>(
    '/business/sendChargePaid',
    {
      schema: { ...EnsureConnectionIdValidation, ...ChargePaidMessageValidation },
    },
    (request, reply) => controller.sendChargePaid(request, reply),
  );

  server.get<{
    Querystring: EnsureConnectionIdValidationQuerystring;
  }>(
    '/business/getMyCatalog',
    {
      schema: EnsureConnectionIdValidation,
    },
    (request, reply) => controller.getMyCatalog(request, reply),
  );

  server.post<{
    Querystring: EnsureConnectionIdValidationQuerystring;
    Body: GetCatalogValidationBody;
  }>(
    '/business/getCatalog',
    {
      schema: { ...EnsureConnectionIdValidation, ...GetCatalogValidation },
    },
    (request, reply) => controller.getCatalog(request, reply),
  );

  server.get<{
    Querystring: EnsureConnectionIdValidationQuerystring;
  }>(
    '/business/getMyCollections',
    {
      schema: EnsureConnectionIdValidation,
    },
    (request, reply) => controller.getMyCollections(request, reply),
  );

  server.post<{
    Querystring: EnsureConnectionIdValidationQuerystring;
    Body: SetProductVisibilityValidationBody;
  }>(
    '/business/setProductVisibility',
    {
      schema: { ...EnsureConnectionIdValidation, ...SetProductVisibilityValidation },
    },
    (request, reply) => controller.setProductVisibility(request, reply),
  );

  server.post<{
    Querystring: EnsureConnectionIdValidationQuerystring;
    Body: ProductCreateValidationBody;
  }>(
    '/business/productCreate',
    {
      preValidation: upload.array('images', 10),
      preHandler: (request, reply, done) => {
        const typedRequest = request as typeof request & { files: File[] };
        if (!typedRequest.files) {
          return reply.status(400).send(respondJSend('fail', 'The images is required'));
        }
        return done();
      },
      schema: { ...EnsureConnectionIdValidation, ...ProductCreateValidation },
    },
    (request, reply) =>
      controller.productCreate(request as typeof request & { files: File[] }, reply),
  );
};

export default businessRoutes;
