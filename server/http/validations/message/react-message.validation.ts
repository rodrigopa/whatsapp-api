import * as yup from 'yup';
import { InferType } from 'yup';

export const ReactMessageValidation = {
  body: yup.object({
    destination: yup.string().required(),
    text: yup.string().required(),
    messageFromMe: yup.boolean().required(),
    messageKey: yup.string().required(),
  }),
};

export type ReactMessageValidationBody = InferType<typeof ReactMessageValidation.body>;
