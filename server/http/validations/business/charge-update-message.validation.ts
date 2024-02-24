import * as yup from 'yup';
import { InferType } from 'yup';

export const ChargeUpdateMessageValidation = {
  body: yup.object({
    destination: yup.string().required(),
    referenceId: yup.string().required(),
    status: yup
      .string()
      .required()
      .test('isChargeUpdateStatusValid', 'The status is not valid.', (value) =>
        ['shipped', 'payment_requested', 'canceled', 'preparing_to_ship', 'delivered'].includes(
          value,
        ),
      ),
  }),
};

export type ChargeUpdateMessageValidationBody = InferType<
  typeof ChargeUpdateMessageValidation.body
>;
