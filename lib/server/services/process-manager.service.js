"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pm2_promise_1 = __importDefault(require("pm2-promise"));
class ProcessManagerService {
    constructor() { }
    async start(id) {
        await pm2_promise_1.default.connect();
        await pm2_promise_1.default.start({
            name: id,
            script: '/usr/src/app/connection/index.ts',
            interpreter: '/usr/src/app/node_modules/.bin/ts-node',
            stop_exit_codes: '0',
            env: {
                CONNECTION_ID: id,
            },
        });
        await pm2_promise_1.default.dump();
        await pm2_promise_1.default.disconnect();
    }
    async restart(id) {
        await pm2_promise_1.default.connect();
        await pm2_promise_1.default.restart(id, {
            updateEnv: true,
        });
        await pm2_promise_1.default.disconnect();
    }
}
exports.default = ProcessManagerService;
