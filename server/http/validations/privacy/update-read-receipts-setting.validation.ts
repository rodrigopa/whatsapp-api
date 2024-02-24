import * as yup from 'yup';
import { InferType } from 'yup';

export const UpdateReadReceiptsSettingValidation = {
  body: yup.object({
    value: yup
      .string()
      .required()
      .test('isUpdateReadReceiptsValid', 'The update read receipts valid is invalid.', (value) =>
        ['none', 'all'].includes(value),
      ),
  }),
};

export type UpdateReadReceiptsSettingValidationBody = InferType<
  typeof UpdateReadReceiptsSettingValidation.body
>;
