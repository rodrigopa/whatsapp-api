import * as yup from 'yup';
import { InferType } from 'yup';

export const SetProductVisibilityValidation = {
  body: yup.object({
    productId: yup.number().required(),
    visible: yup.boolean().required(),
  }),
};

export type SetProductVisibilityValidationBody = InferType<
  typeof SetProductVisibilityValidation.body
>;
