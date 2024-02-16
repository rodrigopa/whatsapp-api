import * as yup from 'yup';
import { InferType } from 'yup';
export declare const StartConnectionValidation: {
    body: yup.ObjectSchema<{
        title: string;
        webhookURL: string;
        hooks: string[];
    }, yup.AnyObject, {
        title: undefined;
        webhookURL: undefined;
        hooks: "";
    }, "">;
};
export type StartConnectionValidationBody = InferType<typeof StartConnectionValidation.body>;
