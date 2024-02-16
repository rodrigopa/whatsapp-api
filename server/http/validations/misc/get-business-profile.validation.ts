import * as yup from 'yup';
import { InferType } from 'yup';

export const GetBusinessProfileValidation = {
  body: yup.object({
    jid: yup.string().required(),
  }),
};

export type GetBusinessProfileValidationBody = InferType<typeof GetBusinessProfileValidation.body>;
