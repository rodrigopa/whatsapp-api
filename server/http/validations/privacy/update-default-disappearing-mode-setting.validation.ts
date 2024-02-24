import * as yup from 'yup';
import { InferType } from 'yup';

export const UpdateDefaultDisappearingModeSettingValidation = {
  body: yup.object({
    value: yup
      .string()
      .required()
      .test('isUpdateDefaultDisappearingModeValid', 'The value is invalid.', (value) =>
        ['0', '86400', '604800', '7776000'].includes(value),
      ),
  }),
};

export type UpdateDefaultDisappearingModeSettingValidationBody = InferType<
  typeof UpdateDefaultDisappearingModeSettingValidation.body
>;
