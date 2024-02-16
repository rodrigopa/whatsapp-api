import * as yup from 'yup';
import { InferType } from 'yup';
export declare const EnsureConnectionIdValidation: {
    querystring: yup.ObjectSchema<{
        connectionId: string;
    }, yup.AnyObject, {
        connectionId: undefined;
    }, "">;
};
export type EnsureConnectionIdValidationQuerystring = InferType<typeof EnsureConnectionIdValidation.querystring>;
