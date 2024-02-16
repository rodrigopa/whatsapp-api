import * as yup from 'yup';
import { InferType } from 'yup';

export const PresenceUpdateValidation = {
  body: yup.object({
    jid: yup.string().required(),
    presence: yup
      .string()
      .required()
      .test('isPresenceValid', 'The presence is not valid.', (value) =>
        ['unavailable', 'available', 'composing', 'recording', 'paused'].includes(value),
      ),
  }),
};

export type PresenceUpdateValidationBody = InferType<typeof PresenceUpdateValidation.body>;
