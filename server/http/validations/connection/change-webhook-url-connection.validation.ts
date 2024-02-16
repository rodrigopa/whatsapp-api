import * as yup from 'yup';
import { InferType } from 'yup';
import { ConnectionWebHooks } from '../../../../shared/webhooks/types';

export const ChangeWebhookURLConnectionValidation = {
  body: yup.object({
    webhookURL: yup.string().url().required(),
  }),
};

export type ChangeWebhookURLConnectionValidationBody = InferType<
  typeof ChangeWebhookURLConnectionValidation.body
>;
