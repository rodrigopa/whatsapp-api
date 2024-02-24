import * as yup from 'yup';
import { InferType } from 'yup';

export const GetCatalogValidation = {
  body: yup.object({
    destination: yup.string().required(),
  }),
};

export type GetCatalogValidationBody = InferType<typeof GetCatalogValidation.body>;
