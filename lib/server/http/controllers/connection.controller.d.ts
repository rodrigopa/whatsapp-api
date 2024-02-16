import { ListConnectionsResponse, StartConnectionResponse } from '../../model/response/connection.responses';
import RedisService from '../../services/redis.service';
import { FastifyRequest } from 'fastify';
import ProcessManagerService from '../../services/process-manager.service';
import { StartConnectionValidationBody } from '../validations/connection/start-connection.validation';
import { EnsureConnectionIdValidationQuerystring } from '../validations/connection/ensure-connection-id.validation';
export declare class ConnectionController {
    redisService: RedisService;
    processManagerService: ProcessManagerService;
    constructor(redisService: RedisService, processManagerService: ProcessManagerService);
    status(request: FastifyRequest<{
        Querystring: EnsureConnectionIdValidationQuerystring;
    }>, reply: any): Promise<any>;
    start(request: FastifyRequest<{
        Body: StartConnectionValidationBody;
    }>, reply: any): Promise<import("../../common/jsend").JSendSuccessResponse<StartConnectionResponse>>;
    restart(request: FastifyRequest<{
        Querystring: EnsureConnectionIdValidationQuerystring;
    }>, reply: any): Promise<any>;
    logout(request: FastifyRequest<{
        Querystring: EnsureConnectionIdValidationQuerystring;
    }>, reply: any): Promise<any>;
    delete(request: FastifyRequest<{
        Querystring: EnsureConnectionIdValidationQuerystring;
    }>, reply: any): Promise<any>;
    info(request: FastifyRequest<{
        Querystring: EnsureConnectionIdValidationQuerystring;
    }>, reply: any): Promise<any>;
    list(request: any, reply: any): Promise<import("../../common/jsend").JSendSuccessResponse<ListConnectionsResponse>>;
    private generateQrCode;
    qrCode(request: FastifyRequest<{
        Querystring: EnsureConnectionIdValidationQuerystring;
    }>, reply: any): Promise<any>;
    qrCodeImage(request: FastifyRequest<{
        Querystring: EnsureConnectionIdValidationQuerystring;
    }>, reply: any): Promise<any>;
}
