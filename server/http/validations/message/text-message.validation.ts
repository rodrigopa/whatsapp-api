import * as yup from 'yup';
import { InferType } from 'yup';

export const TextMessageValidation = {
  body: yup.object({
    destination: yup.string().required(),
    text: yup.string().required(),
  }),
};

export type TextMessageValidationBody = InferType<typeof TextMessageValidation.body>;
