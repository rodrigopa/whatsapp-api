import * as yup from 'yup';
import { InferType } from 'yup';

export const GetProfilePictureValidation = {
  body: yup.object({
    jid: yup.string().required(),
  }),
};

export type GetProfilePictureValidationBody = InferType<typeof GetProfilePictureValidation.body>;
