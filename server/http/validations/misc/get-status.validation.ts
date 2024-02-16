import * as yup from 'yup';
import { InferType } from 'yup';

export const GetStatusValidation = {
  body: yup.object({
    jid: yup.string().required(),
  }),
};

export type GetStatusValidationBody = InferType<typeof GetStatusValidation.body>;
