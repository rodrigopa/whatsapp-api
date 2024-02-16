import * as yup from 'yup';
import { InferType } from 'yup';

export const EnsureConnectionIdValidation = {
  querystring: yup.object({
    connectionId: yup.string().required().uuid(),
  }),
};

export type EnsureConnectionIdValidationQuerystring = InferType<
  typeof EnsureConnectionIdValidation.querystring
>;
