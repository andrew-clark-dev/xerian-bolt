import * as React from "react";
import { GridProps, TextAreaFieldProps, TextFieldProps } from "@aws-amplify/ui-react";
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
export declare type ImportedObjectCreateFormInputValues = {
    externalId?: string;
    type?: string;
    userId?: string;
    data?: string;
};
export declare type ImportedObjectCreateFormValidationValues = {
    externalId?: ValidationFunction<string>;
    type?: ValidationFunction<string>;
    userId?: ValidationFunction<string>;
    data?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type ImportedObjectCreateFormOverridesProps = {
    ImportedObjectCreateFormGrid?: PrimitiveOverrideProps<GridProps>;
    externalId?: PrimitiveOverrideProps<TextFieldProps>;
    type?: PrimitiveOverrideProps<TextFieldProps>;
    userId?: PrimitiveOverrideProps<TextFieldProps>;
    data?: PrimitiveOverrideProps<TextAreaFieldProps>;
} & EscapeHatchProps;
export declare type ImportedObjectCreateFormProps = React.PropsWithChildren<{
    overrides?: ImportedObjectCreateFormOverridesProps | undefined | null;
} & {
    clearOnSuccess?: boolean;
    onSubmit?: (fields: ImportedObjectCreateFormInputValues) => ImportedObjectCreateFormInputValues;
    onSuccess?: (fields: ImportedObjectCreateFormInputValues) => void;
    onError?: (fields: ImportedObjectCreateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: ImportedObjectCreateFormInputValues) => ImportedObjectCreateFormInputValues;
    onValidate?: ImportedObjectCreateFormValidationValues;
} & React.CSSProperties>;
export default function ImportedObjectCreateForm(props: ImportedObjectCreateFormProps): React.ReactElement;
