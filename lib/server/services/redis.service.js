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
const ioredis_1 = __importDefault(require("ioredis"));
const tsyringe_1 = require("tsyringe");
let RedisService = class RedisService {
    constructor(instance) {
        this.instance = instance;
    }
    getConnectionStatus(connectionId) {
        return this.instance.hget(`connection_${connectionId}`, 'status');
    }
    async createConnection(connectionId, title, webhookURL, hooks, status) {
        await this.instance.hset(`connection_${connectionId}`, 'title', title, 'webhookURL', webhookURL, 'hooks', JSON.stringify(hooks), 'status', status);
    }
    async logoutConnection(connectionId) {
        await this.instance.del(`connection-auth-data_${connectionId}`);
    }
    async deleteConnection(connectionId) {
        await this.instance.del(`connection-auth-data_${connectionId}`);
        await this.instance.del(`connection_${connectionId}`);
    }
    infoConnection(connectionId) {
        return this.instance.hgetall(`connection_${connectionId}`);
    }
    listConnections() {
        return this.instance.keys('connection_*');
    }
};
RedisService = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)(ioredis_1.default)),
    __metadata("design:paramtypes", [ioredis_1.default])
], RedisService);
exports.default = RedisService;
