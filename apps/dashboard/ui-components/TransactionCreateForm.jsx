/* eslint-disable */
"use client";
import * as React from "react";
import {
  Button,
  Flex,
  Grid,
  SelectField,
  TextField,
} from "@aws-amplify/ui-react";
import { fetchByPath, getOverrideProps, validateField } from "./utils";
import { generateClient } from "aws-amplify/api";
import { createTransaction } from "./graphql/mutations";
const client = generateClient();
export default function TransactionCreateForm(props) {
  const {
    clearOnSuccess = true,
    onSuccess,
    onError,
    onSubmit,
    onValidate,
    onChange,
    overrides,
    ...rest
  } = props;
  const initialValues = {
    lastActivityBy: "",
    type: "",
    paymentType: "",
    amount: "",
    linkedTransaction: "",
  };
  const [lastActivityBy, setLastActivityBy] = React.useState(
    initialValues.lastActivityBy
  );
  const [type, setType] = React.useState(initialValues.type);
  const [paymentType, setPaymentType] = React.useState(
    initialValues.paymentType
  );
  const [amount, setAmount] = React.useState(initialValues.amount);
  const [linkedTransaction, setLinkedTransaction] = React.useState(
    initialValues.linkedTransaction
  );
  const [errors, setErrors] = React.useState({});
  const resetStateValues = () => {
    setLastActivityBy(initialValues.lastActivityBy);
    setType(initialValues.type);
    setPaymentType(initialValues.paymentType);
    setAmount(initialValues.amount);
    setLinkedTransaction(initialValues.linkedTransaction);
    setErrors({});
  };
  const validations = {
    lastActivityBy: [{ type: "Required" }],
    type: [],
    paymentType: [],
    amount: [{ type: "Required" }],
    linkedTransaction: [],
  };
  const runValidationTasks = async (
    fieldName,
    currentValue,
    getDisplayValue
  ) => {
    const value =
      currentValue && getDisplayValue
        ? getDisplayValue(currentValue)
        : currentValue;
    let validationResponse = validateField(value, validations[fieldName]);
    const customValidator = fetchByPath(onValidate, fieldName);
    if (customValidator) {
      validationResponse = await customValidator(value, validationResponse);
    }
    setErrors((errors) => ({ ...errors, [fieldName]: validationResponse }));
    return validationResponse;
  };
  return (
    <Grid
      as="form"
      rowGap="15px"
      columnGap="15px"
      padding="20px"
      onSubmit={async (event) => {
        event.preventDefault();
        let modelFields = {
          lastActivityBy,
          type,
          paymentType,
          amount,
          linkedTransaction,
        };
        const validationResponses = await Promise.all(
          Object.keys(validations).reduce((promises, fieldName) => {
            if (Array.isArray(modelFields[fieldName])) {
              promises.push(
                ...modelFields[fieldName].map((item) =>
                  runValidationTasks(fieldName, item)
                )
              );
              return promises;
            }
            promises.push(
              runValidationTasks(fieldName, modelFields[fieldName])
            );
            return promises;
          }, [])
        );
        if (validationResponses.some((r) => r.hasError)) {
          return;
        }
        if (onSubmit) {
          modelFields = onSubmit(modelFields);
        }
        try {
          Object.entries(modelFields).forEach(([key, value]) => {
            if (typeof value === "string" && value === "") {
              modelFields[key] = null;
            }
          });
          await client.graphql({
            query: createTransaction.replaceAll("__typename", ""),
            variables: {
              input: {
                ...modelFields,
              },
            },
          });
          if (onSuccess) {
            onSuccess(modelFields);
          }
          if (clearOnSuccess) {
            resetStateValues();
          }
        } catch (err) {
          if (onError) {
            const messages = err.errors.map((e) => e.message).join("\n");
            onError(modelFields, messages);
          }
        }
      }}
      {...getOverrideProps(overrides, "TransactionCreateForm")}
      {...rest}
    >
      <TextField
        label="Last activity by"
        isRequired={true}
        isReadOnly={false}
        value={lastActivityBy}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              lastActivityBy: value,
              type,
              paymentType,
              amount,
              linkedTransaction,
            };
            const result = onChange(modelFields);
            value = result?.lastActivityBy ?? value;
          }
          if (errors.lastActivityBy?.hasError) {
            runValidationTasks("lastActivityBy", value);
          }
          setLastActivityBy(value);
        }}
        onBlur={() => runValidationTasks("lastActivityBy", lastActivityBy)}
        errorMessage={errors.lastActivityBy?.errorMessage}
        hasError={errors.lastActivityBy?.hasError}
        {...getOverrideProps(overrides, "lastActivityBy")}
      ></TextField>
      <SelectField
        label="Type"
        placeholder="Please select an option"
        isDisabled={false}
        value={type}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              lastActivityBy,
              type: value,
              paymentType,
              amount,
              linkedTransaction,
            };
            const result = onChange(modelFields);
            value = result?.type ?? value;
          }
          if (errors.type?.hasError) {
            runValidationTasks("type", value);
          }
          setType(value);
        }}
        onBlur={() => runValidationTasks("type", type)}
        errorMessage={errors.type?.errorMessage}
        hasError={errors.type?.hasError}
        {...getOverrideProps(overrides, "type")}
      >
        <option
          children="Sale"
          value="Sale"
          {...getOverrideProps(overrides, "typeoption0")}
        ></option>
        <option
          children="Refund"
          value="Refund"
          {...getOverrideProps(overrides, "typeoption1")}
        ></option>
        <option
          children="Payout"
          value="Payout"
          {...getOverrideProps(overrides, "typeoption2")}
        ></option>
        <option
          children="Reversal"
          value="Reversal"
          {...getOverrideProps(overrides, "typeoption3")}
        ></option>
      </SelectField>
      <SelectField
        label="Payment type"
        placeholder="Please select an option"
        isDisabled={false}
        value={paymentType}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              lastActivityBy,
              type,
              paymentType: value,
              amount,
              linkedTransaction,
            };
            const result = onChange(modelFields);
            value = result?.paymentType ?? value;
          }
          if (errors.paymentType?.hasError) {
            runValidationTasks("paymentType", value);
          }
          setPaymentType(value);
        }}
        onBlur={() => runValidationTasks("paymentType", paymentType)}
        errorMessage={errors.paymentType?.errorMessage}
        hasError={errors.paymentType?.hasError}
        {...getOverrideProps(overrides, "paymentType")}
      >
        <option
          children="Cash"
          value="Cash"
          {...getOverrideProps(overrides, "paymentTypeoption0")}
        ></option>
        <option
          children="Card"
          value="Card"
          {...getOverrideProps(overrides, "paymentTypeoption1")}
        ></option>
        <option
          children="Gift card"
          value="GiftCard"
          {...getOverrideProps(overrides, "paymentTypeoption2")}
        ></option>
        <option
          children="Account"
          value="Account"
          {...getOverrideProps(overrides, "paymentTypeoption3")}
        ></option>
        <option
          children="Other"
          value="Other"
          {...getOverrideProps(overrides, "paymentTypeoption4")}
        ></option>
      </SelectField>
      <TextField
        label="Amount"
        isRequired={true}
        isReadOnly={false}
        type="number"
        step="any"
        value={amount}
        onChange={(e) => {
          let value = isNaN(parseInt(e.target.value))
            ? e.target.value
            : parseInt(e.target.value);
          if (onChange) {
            const modelFields = {
              lastActivityBy,
              type,
              paymentType,
              amount: value,
              linkedTransaction,
            };
            const result = onChange(modelFields);
            value = result?.amount ?? value;
          }
          if (errors.amount?.hasError) {
            runValidationTasks("amount", value);
          }
          setAmount(value);
        }}
        onBlur={() => runValidationTasks("amount", amount)}
        errorMessage={errors.amount?.errorMessage}
        hasError={errors.amount?.hasError}
        {...getOverrideProps(overrides, "amount")}
      ></TextField>
      <TextField
        label="Linked transaction"
        isRequired={false}
        isReadOnly={false}
        value={linkedTransaction}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              lastActivityBy,
              type,
              paymentType,
              amount,
              linkedTransaction: value,
            };
            const result = onChange(modelFields);
            value = result?.linkedTransaction ?? value;
          }
          if (errors.linkedTransaction?.hasError) {
            runValidationTasks("linkedTransaction", value);
          }
          setLinkedTransaction(value);
        }}
        onBlur={() =>
          runValidationTasks("linkedTransaction", linkedTransaction)
        }
        errorMessage={errors.linkedTransaction?.errorMessage}
        hasError={errors.linkedTransaction?.hasError}
        {...getOverrideProps(overrides, "linkedTransaction")}
      ></TextField>
      <Flex
        justifyContent="space-between"
        {...getOverrideProps(overrides, "CTAFlex")}
      >
        <Button
          children="Clear"
          type="reset"
          onClick={(event) => {
            event.preventDefault();
            resetStateValues();
          }}
          {...getOverrideProps(overrides, "ClearButton")}
        ></Button>
        <Flex
          gap="15px"
          {...getOverrideProps(overrides, "RightAlignCTASubFlex")}
        >
          <Button
            children="Submit"
            type="submit"
            variation="primary"
            isDisabled={Object.values(errors).some((e) => e?.hasError)}
            {...getOverrideProps(overrides, "SubmitButton")}
          ></Button>
        </Flex>
      </Flex>
    </Grid>
  );
}
