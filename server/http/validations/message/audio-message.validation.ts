import * as yup from 'yup';
import { InferType } from 'yup';

export const AudioMessageValidation = {
  body: yup.object({
    destination: yup.string().required(),
    ptt: yup.boolean().default(false),
  }),
};

export type AudioMessageValidationBody = InferType<typeof AudioMessageValidation.body>;
