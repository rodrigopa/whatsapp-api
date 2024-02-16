import * as yup from 'yup';
import { InferType } from 'yup';

export const ImageMessageValidation = {
  body: yup.object({
    destination: yup.string().required(),
    text: yup.string(),
    forward: yup.boolean().default(false),
  }),
};

export type ImageMessageValidationBody = InferType<typeof ImageMessageValidation.body>;
