import * as yup from 'yup';
import { InferType } from 'yup';
import { ConnectionWebHooks } from '../../../../shared/webhooks/types';

export const ChangeTitleConnectionValidation = {
  body: yup.object({
    title: yup.string().required(),
  }),
};

export type ChangeTitleConnectionValidationBody = InferType<
  typeof ChangeTitleConnectionValidation.body
>;
