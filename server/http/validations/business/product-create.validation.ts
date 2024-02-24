import * as yup from 'yup';
import { InferType } from 'yup';

export const ProductCreateValidation = {
  body: yup.object({
    name: yup.string().required(),
    description: yup.string(),
    price: yup.number().required(),
  }),
};

export type ProductCreateValidationBody = InferType<typeof ProductCreateValidation.body>;
