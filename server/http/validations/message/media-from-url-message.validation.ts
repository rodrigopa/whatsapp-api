import * as yup from 'yup';
import { InferType } from 'yup';

export const MediaFromURLMessageValidation = {
  body: yup.object({
    destination: yup.string().required(),
    type: yup
      .string()
      .required()
      .test('validType', 'The type is invalid.', (value) =>
        ['image', 'video', 'audio', 'document'].includes(value),
      ),
    url: yup.string().url().required(),
    mimeType: yup.string().when('type', {
      is: 'document',
      then: (schema) => schema.required(),
    }),
    text: yup.string(),
  }),
};

export type MediaFromURLMessageValidationBody = InferType<
  typeof MediaFromURLMessageValidation.body
>;
