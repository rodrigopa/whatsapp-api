"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validationCompiler = void 0;
const validationCompiler = ({ schema, method, url, httpPart, }) => {
    return function (data) {
        try {
            const result = schema.validateSync(data, {
                strict: false,
                abortEarly: false,
                stripUnknown: true,
                recursive: true,
            });
            return { value: result };
        }
        catch (e) {
            return { error: e };
        }
    };
};
exports.validationCompiler = validationCompiler;
