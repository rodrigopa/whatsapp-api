import * as yup from 'yup';
import { InferType } from 'yup';

export const ChangeTitleConnectionValidation = {
  body: yup.object({
    title: yup.string().required(),
  }),
};

export type ChangeTitleConnectionValidationBody = InferType<
  typeof ChangeTitleConnectionValidation.body
>;
