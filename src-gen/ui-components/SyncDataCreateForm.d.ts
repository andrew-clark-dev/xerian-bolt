import * as React from "react";
import { GridProps, SelectFieldProps, TextFieldProps } from "@aws-amplify/ui-react";
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
export declare type SyncDataCreateFormInputValues = {
    interface?: string;
    total?: number;
    lastSync?: string;
};
export declare type SyncDataCreateFormValidationValues = {
    interface?: ValidationFunction<string>;
    total?: ValidationFunction<number>;
    lastSync?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type SyncDataCreateFormOverridesProps = {
    SyncDataCreateFormGrid?: PrimitiveOverrideProps<GridProps>;
    interface?: PrimitiveOverrideProps<SelectFieldProps>;
    total?: PrimitiveOverrideProps<TextFieldProps>;
    lastSync?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type SyncDataCreateFormProps = React.PropsWithChildren<{
    overrides?: SyncDataCreateFormOverridesProps | undefined | null;
} & {
    clearOnSuccess?: boolean;
    onSubmit?: (fields: SyncDataCreateFormInputValues) => SyncDataCreateFormInputValues;
    onSuccess?: (fields: SyncDataCreateFormInputValues) => void;
    onError?: (fields: SyncDataCreateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: SyncDataCreateFormInputValues) => SyncDataCreateFormInputValues;
    onValidate?: SyncDataCreateFormValidationValues;
} & React.CSSProperties>;
export default function SyncDataCreateForm(props: SyncDataCreateFormProps): React.ReactElement;
