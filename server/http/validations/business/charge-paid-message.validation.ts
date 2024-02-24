import * as yup from 'yup';
import { InferType } from 'yup';

export const ChargePaidMessageValidation = {
  body: yup.object({
    destination: yup.string().required(),
    referenceId: yup.string().required(),
  }),
};

export type ChargePaidMessageValidationBody = InferType<typeof ChargePaidMessageValidation.body>;
