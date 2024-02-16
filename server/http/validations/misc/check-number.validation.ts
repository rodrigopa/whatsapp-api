import * as yup from 'yup';
import { InferType } from 'yup';

export const CheckNumberValidation = {
  body: yup.object({
    jid: yup.string().required(),
  }),
};

export type CheckNumberValidationBody = InferType<typeof CheckNumberValidation.body>;
