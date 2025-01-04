import * as React from "react";
import { GridProps, SelectFieldProps, SwitchFieldProps, TextFieldProps } from "@aws-amplify/ui-react";
import { Account } from "./graphql/types";
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
export declare type AccountUpdateFormInputValues = {
    id?: string;
    number?: string;
    userId?: string;
    lastActivityBy?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    phoneNumber?: string;
    isMobile?: boolean;
    addressLine1?: string;
    addressLine2?: string;
    city?: string;
    state?: string;
    postcode?: string;
    comunicationPreferences?: string;
    status?: string;
    kind?: string;
    defaultSplit?: number;
    balance?: number;
    noSales?: number;
    noItems?: number;
    lastActivityAt?: string;
    lastItemAt?: string;
    lastSettlementAt?: string;
    tags?: string[];
    createdAt?: string;
    updatedAt?: string;
    deletedAt?: string;
};
export declare type AccountUpdateFormValidationValues = {
    id?: ValidationFunction<string>;
    number?: ValidationFunction<string>;
    userId?: ValidationFunction<string>;
    lastActivityBy?: ValidationFunction<string>;
    firstName?: ValidationFunction<string>;
    lastName?: ValidationFunction<string>;
    email?: ValidationFunction<string>;
    phoneNumber?: ValidationFunction<string>;
    isMobile?: ValidationFunction<boolean>;
    addressLine1?: ValidationFunction<string>;
    addressLine2?: ValidationFunction<string>;
    city?: ValidationFunction<string>;
    state?: ValidationFunction<string>;
    postcode?: ValidationFunction<string>;
    comunicationPreferences?: ValidationFunction<string>;
    status?: ValidationFunction<string>;
    kind?: ValidationFunction<string>;
    defaultSplit?: ValidationFunction<number>;
    balance?: ValidationFunction<number>;
    noSales?: ValidationFunction<number>;
    noItems?: ValidationFunction<number>;
    lastActivityAt?: ValidationFunction<string>;
    lastItemAt?: ValidationFunction<string>;
    lastSettlementAt?: ValidationFunction<string>;
    tags?: ValidationFunction<string>;
    createdAt?: ValidationFunction<string>;
    updatedAt?: ValidationFunction<string>;
    deletedAt?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type AccountUpdateFormOverridesProps = {
    AccountUpdateFormGrid?: PrimitiveOverrideProps<GridProps>;
    id?: PrimitiveOverrideProps<TextFieldProps>;
    number?: PrimitiveOverrideProps<TextFieldProps>;
    userId?: PrimitiveOverrideProps<TextFieldProps>;
    lastActivityBy?: PrimitiveOverrideProps<TextFieldProps>;
    firstName?: PrimitiveOverrideProps<TextFieldProps>;
    lastName?: PrimitiveOverrideProps<TextFieldProps>;
    email?: PrimitiveOverrideProps<TextFieldProps>;
    phoneNumber?: PrimitiveOverrideProps<TextFieldProps>;
    isMobile?: PrimitiveOverrideProps<SwitchFieldProps>;
    addressLine1?: PrimitiveOverrideProps<TextFieldProps>;
    addressLine2?: PrimitiveOverrideProps<TextFieldProps>;
    city?: PrimitiveOverrideProps<TextFieldProps>;
    state?: PrimitiveOverrideProps<TextFieldProps>;
    postcode?: PrimitiveOverrideProps<TextFieldProps>;
    comunicationPreferences?: PrimitiveOverrideProps<SelectFieldProps>;
    status?: PrimitiveOverrideProps<SelectFieldProps>;
    kind?: PrimitiveOverrideProps<SelectFieldProps>;
    defaultSplit?: PrimitiveOverrideProps<TextFieldProps>;
    balance?: PrimitiveOverrideProps<TextFieldProps>;
    noSales?: PrimitiveOverrideProps<TextFieldProps>;
    noItems?: PrimitiveOverrideProps<TextFieldProps>;
    lastActivityAt?: PrimitiveOverrideProps<TextFieldProps>;
    lastItemAt?: PrimitiveOverrideProps<TextFieldProps>;
    lastSettlementAt?: PrimitiveOverrideProps<TextFieldProps>;
    tags?: PrimitiveOverrideProps<TextFieldProps>;
    createdAt?: PrimitiveOverrideProps<TextFieldProps>;
    updatedAt?: PrimitiveOverrideProps<TextFieldProps>;
    deletedAt?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type AccountUpdateFormProps = React.PropsWithChildren<{
    overrides?: AccountUpdateFormOverridesProps | undefined | null;
} & {
    number?: string;
    account?: Account;
    onSubmit?: (fields: AccountUpdateFormInputValues) => AccountUpdateFormInputValues;
    onSuccess?: (fields: AccountUpdateFormInputValues) => void;
    onError?: (fields: AccountUpdateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: AccountUpdateFormInputValues) => AccountUpdateFormInputValues;
    onValidate?: AccountUpdateFormValidationValues;
} & React.CSSProperties>;
export default function AccountUpdateForm(props: AccountUpdateFormProps): React.ReactElement;
