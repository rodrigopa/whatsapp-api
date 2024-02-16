import * as yup from 'yup';
import { InferType } from 'yup';
import { ConnectionWebHooks } from '../../../../shared/webhooks/types';

export const StartConnectionValidation = {
  body: yup.object({
    title: yup.string().required(),
    webhookURL: yup.string().required().url(),
    hooks: yup
      .array()
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

export type StartConnectionValidationBody = InferType<typeof StartConnectionValidation.body>;
