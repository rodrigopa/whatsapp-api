import * as yup from 'yup';
import { InferType } from 'yup';

export const UpdateStatusSettingValidation = {
  body: yup.object({
    value: yup
      .string()
      .required()
      .test('isUpdateProfilePictureValid', 'The last seen valid is invalid.', (value) =>
        ['contacts', 'contact_blacklist', 'none', 'all'].includes(value),
      ),
  }),
};

export type UpdateStatusSettingValidationBody = InferType<
  typeof UpdateStatusSettingValidation.body
>;
