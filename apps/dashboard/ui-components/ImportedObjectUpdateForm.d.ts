import * as React from "react";
import { GridProps, TextAreaFieldProps, TextFieldProps } from "@aws-amplify/ui-react";
import { ImportedObject } from "./graphql/types";
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
export declare type ImportedObjectUpdateFormInputValues = {
    externalId?: string;
    type?: string;
    userId?: string;
    data?: string;
};
export declare type ImportedObjectUpdateFormValidationValues = {
    externalId?: ValidationFunction<string>;
    type?: ValidationFunction<string>;
    userId?: ValidationFunction<string>;
    data?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type ImportedObjectUpdateFormOverridesProps = {
    ImportedObjectUpdateFormGrid?: PrimitiveOverrideProps<GridProps>;
    externalId?: PrimitiveOverrideProps<TextFieldProps>;
    type?: PrimitiveOverrideProps<TextFieldProps>;
    userId?: PrimitiveOverrideProps<TextFieldProps>;
    data?: PrimitiveOverrideProps<TextAreaFieldProps>;
} & EscapeHatchProps;
export declare type ImportedObjectUpdateFormProps = React.PropsWithChildren<{
    overrides?: ImportedObjectUpdateFormOverridesProps | undefined | null;
} & {
    externalId?: string;
    importedObject?: ImportedObject;
    onSubmit?: (fields: ImportedObjectUpdateFormInputValues) => ImportedObjectUpdateFormInputValues;
    onSuccess?: (fields: ImportedObjectUpdateFormInputValues) => void;
    onError?: (fields: ImportedObjectUpdateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: ImportedObjectUpdateFormInputValues) => ImportedObjectUpdateFormInputValues;
    onValidate?: ImportedObjectUpdateFormValidationValues;
} & React.CSSProperties>;
export default function ImportedObjectUpdateForm(props: ImportedObjectUpdateFormProps): React.ReactElement;
