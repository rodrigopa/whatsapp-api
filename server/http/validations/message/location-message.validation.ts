import * as yup from 'yup';
import { InferType } from 'yup';

export const LocationMessageValidation = {
  body: yup.object({
    destination: yup.string().required(),
    latitude: yup.number().required(),
    longitude: yup.number().required(),
  }),
};

export type LocationMessageValidationBody = InferType<typeof LocationMessageValidation.body>;
