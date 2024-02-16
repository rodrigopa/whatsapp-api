"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConnectionController = void 0;
const jsend_1 = require("../../common/jsend");
const tsyringe_1 = require("tsyringe");
const redis_service_1 = __importDefault(require("../../services/redis.service"));
const process_manager_service_1 = __importDefault(require("../../services/process-manager.service"));
const crypto_1 = require("crypto");
const yaqrcode_1 = __importDefault(require("yaqrcode"));
const webhooks_1 = require("../../../shared/webhooks");
let ConnectionController = class ConnectionController {
    constructor(redisService, processManagerService) {
        this.redisService = redisService;
        this.processManagerService = processManagerService;
    }
    async status(request, reply) {
        const status = await this.redisService.getConnectionStatus(request.query.connectionId);
        if (status === null) {
            return reply.status(404).send((0, jsend_1.respondJSend)('fail', null, 'The connection does not exists.'));
        }
        return (0, jsend_1.respondJSend)('success', {
            status,
        });
    }
    async start(request, reply) {
        const id = (0, crypto_1.randomUUID)();
        await this.redisService.createConnection(id, request.body.title, request.body.webhookURL, request.body.hooks, 'connecting');
        (0, webhooks_1.dispatchWebhook)(id, 'connection_created', { id });
        await this.processManagerService.start(id);
        return (0, jsend_1.respondJSend)('success', {
            id,
            title: request.body.title,
            webhookURL: request.body.webhookURL,
            hooks: request.body.hooks,
            status: 'connecting',
        });
    }
    async restart(request, reply) {
        const status = await this.redisService.getConnectionStatus(request.query.connectionId);
        if (status === null) {
            return reply.status(404).send((0, jsend_1.respondJSend)('fail', null, 'The connection does not exists.'));
        }
        await this.processManagerService.restart(request.query.connectionId);
        return (0, jsend_1.respondJSend)('success', {
            id: request.query.connectionId,
        });
    }
    async logout(request, reply) {
        const status = await this.redisService.getConnectionStatus(request.query.connectionId);
        if (status === null) {
            return reply.status(404).send((0, jsend_1.respondJSend)('fail', null, 'The connection does not exists.'));
        }
        await this.redisService.logoutConnection(request.query.connectionId);
        (0, webhooks_1.dispatchWebhook)(request.query.connectionId, 'connection_logout', {
            id: request.query.connectionId,
        });
        return (0, jsend_1.respondJSend)('success', {
            id: request.query.connectionId,
        });
    }
    async delete(request, reply) {
        const status = await this.redisService.getConnectionStatus(request.query.connectionId);
        if (status === null) {
            return reply.status(404).send((0, jsend_1.respondJSend)('fail', null, 'The connection does not exists.'));
        }
        (0, webhooks_1.dispatchWebhook)(request.query.connectionId, 'connection_delete', {
            id: request.query.connectionId,
        });
        await this.redisService.deleteConnection(request.query.connectionId);
        return (0, jsend_1.respondJSend)('success', {
            id: request.query.connectionId,
        });
    }
    async info(request, reply) {
        const info = await this.redisService.infoConnection(request.query.connectionId);
        if (Object.keys(info).length === 0) {
            return reply.status(404).send((0, jsend_1.respondJSend)('fail', null, 'The connection does not exists.'));
        }
        return (0, jsend_1.respondJSend)('success', {
            id: request.query.connectionId,
            title: info.title,
            webhookURL: info.webhookURL,
            hooks: info.hooks,
            status: info.status,
        });
    }
    async list(request, reply) {
        const list = await this.redisService.listConnections();
        const connections = [];
        for (const connectionId of list) {
            const info = await this.redisService.infoConnection(connectionId.replace('connection_', ''));
            connections.push({
                id: connectionId,
                title: info.title,
                webhookURL: info.webhookURL,
                hooks: info.hooks,
                status: info.status,
            });
        }
        return (0, jsend_1.respondJSend)('success', connections);
    }
    generateQrCode(qrCode) {
        return (0, yaqrcode_1.default)(qrCode, {
            size: 500,
        }).replace('data:image/gif;base64,', '');
    }
    async qrCode(request, reply) {
        const info = await this.redisService.infoConnection(request.query.connectionId);
        if (Object.keys(info).length === 0) {
            return reply.status(404).send((0, jsend_1.respondJSend)('fail', null, 'The connection does not exists.'));
        }
        if (!info.qrCode) {
            return reply
                .status(400)
                .send((0, jsend_1.respondJSend)('fail', null, 'No QRCode available to this connection.'));
        }
        return (0, jsend_1.respondJSend)('success', {
            id: request.query.connectionId,
            qrCode: info.qrCode,
            qrCodeBase64: this.generateQrCode(info.qrCode),
        });
    }
    async qrCodeImage(request, reply) {
        const info = await this.redisService.infoConnection(request.query.connectionId);
        if (Object.keys(info).length === 0) {
            return reply.status(404).send((0, jsend_1.respondJSend)('fail', null, 'The connection does not exists.'));
        }
        if (!info.qrCode) {
            return reply
                .status(400)
                .send((0, jsend_1.respondJSend)('fail', null, 'No QRCode available to this connection.'));
        }
        return reply
            .headers({ 'content-type': 'image/gif' })
            .send(Buffer.from(this.generateQrCode(info.qrCode), 'base64'));
    }
};
exports.ConnectionController = ConnectionController;
exports.ConnectionController = ConnectionController = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)(redis_service_1.default)),
    __param(1, (0, tsyringe_1.inject)(process_manager_service_1.default)),
    __metadata("design:paramtypes", [redis_service_1.default,
        process_manager_service_1.default])
], ConnectionController);
