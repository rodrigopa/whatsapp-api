"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jsend_1 = require("../../common/jsend");
function authMiddleware(request, reply, done) {
    var _a, _b;
    const apiToken = (_a = request.headers.authorization) !== null && _a !== void 0 ? _a : (_b = request.query) === null || _b === void 0 ? void 0 : _b.apiToken;
    if (!apiToken || apiToken !== process.env.API_TOKEN) {
        return reply.status(401).send((0, jsend_1.respondJSend)('fail', null, 'Unauthorized.'));
    }
    done();
}
exports.authMiddleware = authMiddleware;
