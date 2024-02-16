import * as yup from 'yup';
import { InferType } from 'yup';

export const UnblockNumberValidation = {
  body: yup.object({
    jid: yup.string().required(),
  }),
};

export type UnblockNumberValidationBody = InferType<typeof UnblockNumberValidation.body>;
