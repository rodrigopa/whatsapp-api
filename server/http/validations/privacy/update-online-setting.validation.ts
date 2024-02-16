import * as yup from 'yup';
import { InferType } from 'yup';

export const UpdateOnlineSettingValidation = {
  body: yup.object({
    jid: yup.string().required(),
    value: yup
      .string()
      .required()
      .test('isUpdateOnlineValid', 'The online setting valid is invalid.', (value) =>
        ['match_last_seen', 'all'].includes(value),
      ),
  }),
};

export type UpdateOnlineSettingValidationBody = InferType<
  typeof UpdateOnlineSettingValidation.body
>;
