"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const routes = async (server) => {
    server.register(require('./routes/connection.routes'));
};
exports.default = routes;
