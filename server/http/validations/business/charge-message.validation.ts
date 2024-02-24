import * as yup from 'yup';
import { InferType } from 'yup';

export const ChargeMessageValidation = {
  body: yup.object({
    destination: yup.string().required(),
    text: yup.string(),
    orderId: yup.string().required(),
    orderToken: yup.string().required(),
  }),
};

export type ChargeMessageValidationBody = InferType<typeof ChargeMessageValidation.body>;
