"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.server = void 0;
require("reflect-metadata");
require("./ioc/register");
const fastify_1 = __importDefault(require("fastify"));
const validationCompiler_1 = require("./common/validationCompiler");
const errorHandler_1 = require("./common/errorHandler");
const auth_middleware_1 = require("./http/middlewares/auth.middleware");
exports.server = (0, fastify_1.default)({ logger: false });
exports.server.setErrorHandler(errorHandler_1.errorHandler);
exports.server.setValidatorCompiler(validationCompiler_1.validationCompiler);
exports.server.addHook('preHandler', auth_middleware_1.authMiddleware);
exports.server.register(require('./http'));
exports.server
    .listen({ port: 3000, host: '0.0.0.0' })
    .then(() => console.log('Server started at port 3000'));
