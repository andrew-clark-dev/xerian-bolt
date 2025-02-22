import * as React from "react";
import { GridProps, SelectFieldProps, TextFieldProps } from "@aws-amplify/ui-react";
import { SyncData } from "./graphql/types";
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
export declare type SyncDataUpdateFormInputValues = {
    interface?: string;
    total?: number;
    lastSync?: string;
};
export declare type SyncDataUpdateFormValidationValues = {
    interface?: ValidationFunction<string>;
    total?: ValidationFunction<number>;
    lastSync?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type SyncDataUpdateFormOverridesProps = {
    SyncDataUpdateFormGrid?: PrimitiveOverrideProps<GridProps>;
    interface?: PrimitiveOverrideProps<SelectFieldProps>;
    total?: PrimitiveOverrideProps<TextFieldProps>;
    lastSync?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type SyncDataUpdateFormProps = React.PropsWithChildren<{
    overrides?: SyncDataUpdateFormOverridesProps | undefined | null;
} & {
    id?: string;
    syncData?: SyncData;
    onSubmit?: (fields: SyncDataUpdateFormInputValues) => SyncDataUpdateFormInputValues;
    onSuccess?: (fields: SyncDataUpdateFormInputValues) => void;
    onError?: (fields: SyncDataUpdateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: SyncDataUpdateFormInputValues) => SyncDataUpdateFormInputValues;
    onValidate?: SyncDataUpdateFormValidationValues;
} & React.CSSProperties>;
export default function SyncDataUpdateForm(props: SyncDataUpdateFormProps): React.ReactElement;
