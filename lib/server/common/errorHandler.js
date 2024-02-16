"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const jsend_1 = require("./jsend");
const errorHandler = (error, request, reply) => {
    var _a;
    const errorCode = (_a = error.statusCode) !== null && _a !== void 0 ? _a : 500;
    if (errorCode === 500) {
        reply.status(errorCode).send((0, jsend_1.respondJSend)('error', error.message));
    }
    else {
        reply.status(errorCode).send((0, jsend_1.respondJSend)('fail', error.validation, error.message));
    }
};
exports.errorHandler = errorHandler;
