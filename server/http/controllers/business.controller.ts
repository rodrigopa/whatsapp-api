import { inject, injectable } from 'tsyringe';
import RedisService from '../../services/redis.service';
import ProcessManagerService from '../../services/process-manager.service';
import { FastifyRequest } from 'fastify';
import { EnsureConnectionIdValidationQuerystring } from '../validations/connection/ensure-connection-id.validation';
import { respondJSend } from '../../common/jsend';
import { CatalogMessageValidationBody } from '../validations/business/catalog-message.validation';
import { ChargeMessageValidationBody } from '../validations/business/charge-message.validation';
import { ChargeUpdateMessageValidationBody } from '../validations/business/charge-update-message.validation';
import { ChargePaidMessageValidationBody } from '../validations/business/charge-paid-message.validation';
import { GetCatalogValidationBody } from '../validations/business/get-catalog.validation';
import { SetProductVisibilityValidationBody } from '../validations/business/set-product-visibility.validation';
import { ProductCreateValidationBody } from '../validations/business/product-create.validation';
import { File } from 'fastify-multer/lib/interfaces';

@injectable()
export class BusinessController {
  constructor(
    @inject(RedisService) public redisService: RedisService,
    @inject(ProcessManagerService) public processManagerService: ProcessManagerService,
  ) {}

  public async sendCatalog(
    request: FastifyRequest<{
      Querystring: EnsureConnectionIdValidationQuerystring;
      Body: CatalogMessageValidationBody;
    }>,
    reply,
  ) {
    const result = await this.processManagerService.sendMessageToConnection(
      request.query.connectionId,
      'sendCatalogMessage',
      {
        destination: request.body.destination,
        text: request.body.text,
      },
    );

    return respondJSend('success', result);
  }

  public async sendCharge(
    request: FastifyRequest<{
      Querystring: EnsureConnectionIdValidationQuerystring;
      Body: ChargeMessageValidationBody;
    }>,
    reply,
  ) {
    const result = await this.processManagerService.sendMessageToConnection(
      request.query.connectionId,
      'sendChargeMessage',
      {
        destination: request.body.destination,
        text: request.body.text,
        orderId: request.body.orderId,
        orderToken: request.body.orderToken,
      },
    );

    return respondJSend('success', result);
  }

  public async sendChargeUpdate(
    request: FastifyRequest<{
      Querystring: EnsureConnectionIdValidationQuerystring;
      Body: ChargeUpdateMessageValidationBody;
    }>,
    reply,
  ) {
    const result = await this.processManagerService.sendMessageToConnection(
      request.query.connectionId,
      'sendChargeUpdateMessage',
      {
        destination: request.body.destination,
        referenceId: request.body.referenceId,
        status: request.body.status,
      },
    );

    return respondJSend('success', result);
  }

  public async sendChargePaid(
    request: FastifyRequest<{
      Querystring: EnsureConnectionIdValidationQuerystring;
      Body: ChargePaidMessageValidationBody;
    }>,
    reply,
  ) {
    const result = await this.processManagerService.sendMessageToConnection(
      request.query.connectionId,
      'sendChargePaidMessage',
      {
        destination: request.body.destination,
        referenceId: request.body.referenceId,
      },
    );

    return respondJSend('success', result);
  }

  public async getMyCatalog(
    request: FastifyRequest<{
      Querystring: EnsureConnectionIdValidationQuerystring;
    }>,
    reply,
  ) {
    const result = await this.processManagerService.sendMessageToConnection(
      request.query.connectionId,
      'getMyCatalog',
    );

    return respondJSend('success', result);
  }

  public async getCatalog(
    request: FastifyRequest<{
      Querystring: EnsureConnectionIdValidationQuerystring;
      Body: GetCatalogValidationBody;
    }>,
    reply,
  ) {
    const result = await this.processManagerService.sendMessageToConnection(
      request.query.connectionId,
      'getCatalog',
      {
        destination: request.body.destination,
      },
    );

    return respondJSend('success', result);
  }

  public async getMyCollections(
    request: FastifyRequest<{
      Querystring: EnsureConnectionIdValidationQuerystring;
    }>,
    reply,
  ) {
    const result = await this.processManagerService.sendMessageToConnection(
      request.query.connectionId,
      'getMyCollections',
    );

    return respondJSend('success', result);
  }

  public async setProductVisibility(
    request: FastifyRequest<{
      Querystring: EnsureConnectionIdValidationQuerystring;
      Body: SetProductVisibilityValidationBody;
    }>,
    reply,
  ) {
    this.processManagerService.sendMessageToConnection(
      request.query.connectionId,
      'setProductVisibility',
      {
        productId: request.body.productId,
        visible: request.body.visible,
      },
    );
  }

  public async productCreate(
    request: FastifyRequest<{
      Querystring: EnsureConnectionIdValidationQuerystring;
      Body: ProductCreateValidationBody;
    }> & { files: File[] },
    reply,
  ) {
    // console.log(request);
    this.processManagerService.sendMessageToConnection(
      request.query.connectionId,
      'productCreate',
      {
        name: request.body.name,
        description: request.body.description,
        price: request.body.price,
      },
    );
  }
}
