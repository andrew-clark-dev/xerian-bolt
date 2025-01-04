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
import { createSyncData } from "./graphql/mutations";
const client = generateClient();
export default function SyncDataCreateForm(props) {
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
    interface: "",
    total: "",
    lastSync: "",
  };
  const [interface1, setInterface1] = React.useState(initialValues.interface);
  const [total, setTotal] = React.useState(initialValues.total);
  const [lastSync, setLastSync] = React.useState(initialValues.lastSync);
  const [errors, setErrors] = React.useState({});
  const resetStateValues = () => {
    setInterface1(initialValues.interface);
    setTotal(initialValues.total);
    setLastSync(initialValues.lastSync);
    setErrors({});
  };
  const validations = {
    interface: [{ type: "Required" }],
    total: [],
    lastSync: [],
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
  const convertToLocal = (date) => {
    const df = new Intl.DateTimeFormat("default", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      calendar: "iso8601",
      numberingSystem: "latn",
      hourCycle: "h23",
    });
    const parts = df.formatToParts(date).reduce((acc, part) => {
      acc[part.type] = part.value;
      return acc;
    }, {});
    return `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}`;
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
          interface: interface1,
          total,
          lastSync,
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
            query: createSyncData.replaceAll("__typename", ""),
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
      {...getOverrideProps(overrides, "SyncDataCreateForm")}
      {...rest}
    >
      <SelectField
        label="Interface"
        placeholder="Please select an option"
        isDisabled={false}
        value={interface1}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              interface: value,
              total,
              lastSync,
            };
            const result = onChange(modelFields);
            value = result?.interface ?? value;
          }
          if (errors.interface?.hasError) {
            runValidationTasks("interface", value);
          }
          setInterface1(value);
        }}
        onBlur={() => runValidationTasks("interface", interface1)}
        errorMessage={errors.interface?.errorMessage}
        hasError={errors.interface?.hasError}
        {...getOverrideProps(overrides, "interface")}
      >
        <option
          children="Account"
          value="account"
          {...getOverrideProps(overrides, "interfaceoption0")}
        ></option>
        <option
          children="Item"
          value="item"
          {...getOverrideProps(overrides, "interfaceoption1")}
        ></option>
        <option
          children="Sales"
          value="sales"
          {...getOverrideProps(overrides, "interfaceoption2")}
        ></option>
        <option
          children="Category"
          value="category"
          {...getOverrideProps(overrides, "interfaceoption3")}
        ></option>
      </SelectField>
      <TextField
        label="Total"
        isRequired={false}
        isReadOnly={false}
        type="number"
        step="any"
        value={total}
        onChange={(e) => {
          let value = isNaN(parseInt(e.target.value))
            ? e.target.value
            : parseInt(e.target.value);
          if (onChange) {
            const modelFields = {
              interface: interface1,
              total: value,
              lastSync,
            };
            const result = onChange(modelFields);
            value = result?.total ?? value;
          }
          if (errors.total?.hasError) {
            runValidationTasks("total", value);
          }
          setTotal(value);
        }}
        onBlur={() => runValidationTasks("total", total)}
        errorMessage={errors.total?.errorMessage}
        hasError={errors.total?.hasError}
        {...getOverrideProps(overrides, "total")}
      ></TextField>
      <TextField
        label="Last sync"
        isRequired={false}
        isReadOnly={false}
        type="datetime-local"
        value={lastSync && convertToLocal(new Date(lastSync))}
        onChange={(e) => {
          let value =
            e.target.value === "" ? "" : new Date(e.target.value).toISOString();
          if (onChange) {
            const modelFields = {
              interface: interface1,
              total,
              lastSync: value,
            };
            const result = onChange(modelFields);
            value = result?.lastSync ?? value;
          }
          if (errors.lastSync?.hasError) {
            runValidationTasks("lastSync", value);
          }
          setLastSync(value);
        }}
        onBlur={() => runValidationTasks("lastSync", lastSync)}
        errorMessage={errors.lastSync?.errorMessage}
        hasError={errors.lastSync?.hasError}
        {...getOverrideProps(overrides, "lastSync")}
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
