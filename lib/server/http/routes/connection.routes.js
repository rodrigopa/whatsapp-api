"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tsyringe_1 = require("tsyringe");
const connection_controller_1 = require("../controllers/connection.controller");
const ensure_connection_id_validation_1 = require("../validations/connection/ensure-connection-id.validation");
const start_connection_validation_1 = require("../validations/connection/start-connection.validation");
const connectionRoutes = async (server) => {
    const controller = tsyringe_1.container.resolve(connection_controller_1.ConnectionController);
    server.get('/connection/status', { schema: ensure_connection_id_validation_1.EnsureConnectionIdValidation }, (request, reply) => controller.status(request, reply));
    server.post('/connection/start', { schema: start_connection_validation_1.StartConnectionValidation }, (request, reply) => controller.start(request, reply));
    server.get('/connection/restart', { schema: ensure_connection_id_validation_1.EnsureConnectionIdValidation }, (request, reply) => controller.restart(request, reply));
    server.get('/connection/logout', { schema: ensure_connection_id_validation_1.EnsureConnectionIdValidation }, (request, reply) => controller.logout(request, reply));
    server.get('/connection/delete', { schema: ensure_connection_id_validation_1.EnsureConnectionIdValidation }, (request, reply) => controller.delete(request, reply));
    server.get('/connection/info', { schema: ensure_connection_id_validation_1.EnsureConnectionIdValidation }, (request, reply) => controller.info(request, reply));
    server.get('/connection/list', (request, reply) => controller.list(request, reply));
    server.get('/connection/qrCode', { schema: ensure_connection_id_validation_1.EnsureConnectionIdValidation }, (request, reply) => controller.qrCode(request, reply));
    server.get('/connection/qrCodeImage', { schema: ensure_connection_id_validation_1.EnsureConnectionIdValidation }, (request, reply) => controller.qrCodeImage(request, reply));
};
exports.default = connectionRoutes;
