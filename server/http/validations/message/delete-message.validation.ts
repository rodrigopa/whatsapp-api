import * as yup from 'yup';
import { InferType } from 'yup';

export const DeleteMessageValidation = {
  body: yup.object({
    destination: yup.string().required(),
    messageKey: yup.string().required(),
  }),
};

export type DeleteMessageValidationBody = InferType<typeof DeleteMessageValidation.body>;
