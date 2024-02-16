import * as yup from 'yup';
import { InferType } from 'yup';

export const UpdateMessageValidation = {
  body: yup.object({
    destination: yup.string().required(),
    messageKey: yup.string().required(),
    text: yup.string().required(),
  }),
};

export type UpdateMessageValidationBody = InferType<typeof UpdateMessageValidation.body>;
