import * as React from "react";
import { GridProps, SelectFieldProps, TextFieldProps } from "@aws-amplify/ui-react";
import { Transaction } from "./graphql/types";
export declare type EscapeHatchProps = {
    [elementHierarchy: string]: Record<string, unknown>;
} | null;
export declare type VariantValues = {
    [key: string]: string;
};
export declare type Variant = {
    variantValues: VariantValues;
    overrides: EscapeHatchProps;
};
export declare type ValidationResponse = {
    hasError: boolean;
    errorMessage?: string;
};
export declare type ValidationFunction<T> = (value: T, validationResponse: ValidationResponse) => ValidationResponse | Promise<ValidationResponse>;
export declare type TransactionUpdateFormInputValues = {
    lastActivityBy?: string;
    type?: string;
    paymentType?: string;
    amount?: number;
    linkedTransaction?: string;
};
export declare type TransactionUpdateFormValidationValues = {
    lastActivityBy?: ValidationFunction<string>;
    type?: ValidationFunction<string>;
    paymentType?: ValidationFunction<string>;
    amount?: ValidationFunction<number>;
    linkedTransaction?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type TransactionUpdateFormOverridesProps = {
    TransactionUpdateFormGrid?: PrimitiveOverrideProps<GridProps>;
    lastActivityBy?: PrimitiveOverrideProps<TextFieldProps>;
    type?: PrimitiveOverrideProps<SelectFieldProps>;
    paymentType?: PrimitiveOverrideProps<SelectFieldProps>;
    amount?: PrimitiveOverrideProps<TextFieldProps>;
    linkedTransaction?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type TransactionUpdateFormProps = React.PropsWithChildren<{
    overrides?: TransactionUpdateFormOverridesProps | undefined | null;
} & {
    id?: string;
    transaction?: Transaction;
    onSubmit?: (fields: TransactionUpdateFormInputValues) => TransactionUpdateFormInputValues;
    onSuccess?: (fields: TransactionUpdateFormInputValues) => void;
    onError?: (fields: TransactionUpdateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: TransactionUpdateFormInputValues) => TransactionUpdateFormInputValues;
    onValidate?: TransactionUpdateFormValidationValues;
} & React.CSSProperties>;
export default function TransactionUpdateForm(props: TransactionUpdateFormProps): React.ReactElement;
