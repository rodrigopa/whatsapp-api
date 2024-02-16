import * as yup from 'yup';
import { InferType } from 'yup';

export const PresenceSubscribeValidation = {
  body: yup.object({
    jid: yup.string().required(),
  }),
};

export type PresenceSubscribeValidationBody = InferType<typeof PresenceSubscribeValidation.body>;
