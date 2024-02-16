import * as yup from 'yup';
import { InferType } from 'yup';

export const VideoMessageValidation = {
  body: yup.object({
    destination: yup.string().required(),
    text: yup.string(),
  }),
};

export type VideoMessageValidationBody = InferType<typeof VideoMessageValidation.body>;
