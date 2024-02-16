import * as yup from 'yup';
import { InferType } from 'yup';
import { ConnectionWebHooks } from '../../../../shared/webhooks/types';
export const AddConnectionHooksValidation = {
  body: yup.object({
    hooks: yup
      .array()
      .min(1, 'Type some 1 or more hooks.')
      .of(
        yup
          .string()
          .required()
          .test('isValidHooks', 'Your hooks is invalid.', (value) =>
            ConnectionWebHooks.includes(value),
          ),
      )
      .required(),
  }),
};
export const RemoveConnectionHooksValidation = AddConnectionHooksValidation;

export type AddConnectionHooksValidationBody = InferType<typeof AddConnectionHooksValidation.body>;
export type RemoveConnectionHooksValidationBody = InferType<
  typeof RemoveConnectionHooksValidation.body
>;
