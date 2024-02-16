import * as yup from 'yup';
import { InferType } from 'yup';

export const UpdateLastSeenSettingValidation = {
  body: yup.object({
    jid: yup.string().required(),
    value: yup
      .string()
      .required()
      .test('isUpdateLastSeenValid', 'The last seen valid is invalid.', (value) =>
        ['contacts', 'contact_blacklist', 'none', 'all'].includes(value),
      ),
  }),
};

export type UpdateLastSeenSettingValidationBody = InferType<
  typeof UpdateLastSeenSettingValidation.body
>;
