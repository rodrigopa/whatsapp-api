import * as yup from 'yup';
import { InferType } from 'yup';

export const CatalogMessageValidation = {
  body: yup.object({
    destination: yup.string().required(),
    text: yup.string(),
  }),
};

export type CatalogMessageValidationBody = InferType<typeof CatalogMessageValidation.body>;
