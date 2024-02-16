import * as yup from 'yup';
import { InferType } from 'yup';

export const BlockNumberValidation = {
  body: yup.object({
    jid: yup.string().required(),
  }),
};

export type BlockNumberValidationBody = InferType<typeof BlockNumberValidation.body>;
