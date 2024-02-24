import * as yup from 'yup';
import { InferType } from 'yup';

export const RequestPaymentMessageValidation = {
  body: yup.object({
    destination: yup.string().required(),
    amount: yup.number().required(),
  }),
};

export type RequestPaymentMessageValidationBody = InferType<
  typeof RequestPaymentMessageValidation.body
>;
