import { FastifySchemaCompiler } from 'fastify';
import { FastifySchema } from 'fastify/types/schema';

export const validationCompiler: FastifySchemaCompiler<FastifySchema> = ({
  schema,
  method,
  url,
  httpPart,
}) => {
  return function (data) {
    try {
      const result = (schema as any).validateSync(data, {
        strict: false,
        abortEarly: false,
        stripUnknown: true,
        recursive: true,
      });
      return { value: result };
    } catch (e) {
      return { error: e };
    }
  };
};
