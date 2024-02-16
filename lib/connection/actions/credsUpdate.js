"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function onCredsUpdate(saveCreds) {
    return function () {
        saveCreds();
    };
}
exports.default = onCredsUpdate;
