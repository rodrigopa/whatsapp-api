import * as yup from 'yup';
import { InferType } from 'yup';

export const UpdateGroupsAddSettingValidation = {
  body: yup.object({
    value: yup
      .string()
      .required()
      .test('isUpdateGroupsAddValid', 'The groups add setting is invalid.', (value) =>
        ['contacts', 'contact_blacklist', 'none', 'all'].includes(value),
      ),
  }),
};

export type UpdateGroupsAddSettingValidationBody = InferType<
  typeof UpdateGroupsAddSettingValidation.body
>;
