"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tsyringe_1 = require("tsyringe");
const process_manager_service_1 = __importDefault(require("../services/process-manager.service"));
const ioredis_1 = __importDefault(require("ioredis"));
const redis_1 = require("../../shared/redis");
const redis_service_1 = __importDefault(require("../services/redis.service"));
function registerDependencies() {
    tsyringe_1.container.register(ioredis_1.default, {
        useValue: redis_1.redis,
    });
    tsyringe_1.container.register(redis_service_1.default, { useClass: redis_service_1.default });
    tsyringe_1.container.register(process_manager_service_1.default, {
        useClass: process_manager_service_1.default,
    });
}
registerDependencies();
