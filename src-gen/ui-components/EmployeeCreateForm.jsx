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
import { createEmployee } from "./graphql/mutations";
const client = generateClient();
export default function EmployeeCreateForm(props) {
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
    name: "",
    user: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postcode: "",
    status: "",
    startDate: "",
    endDate: "",
  };
  const [name, setName] = React.useState(initialValues.name);
  const [user, setUser] = React.useState(initialValues.user);
  const [addressLine1, setAddressLine1] = React.useState(
    initialValues.addressLine1
  );
  const [addressLine2, setAddressLine2] = React.useState(
    initialValues.addressLine2
  );
  const [city, setCity] = React.useState(initialValues.city);
  const [state, setState] = React.useState(initialValues.state);
  const [postcode, setPostcode] = React.useState(initialValues.postcode);
  const [status, setStatus] = React.useState(initialValues.status);
  const [startDate, setStartDate] = React.useState(initialValues.startDate);
  const [endDate, setEndDate] = React.useState(initialValues.endDate);
  const [errors, setErrors] = React.useState({});
  const resetStateValues = () => {
    setName(initialValues.name);
    setUser(initialValues.user);
    setAddressLine1(initialValues.addressLine1);
    setAddressLine2(initialValues.addressLine2);
    setCity(initialValues.city);
    setState(initialValues.state);
    setPostcode(initialValues.postcode);
    setStatus(initialValues.status);
    setStartDate(initialValues.startDate);
    setEndDate(initialValues.endDate);
    setErrors({});
  };
  const validations = {
    name: [{ type: "Required" }],
    user: [],
    addressLine1: [],
    addressLine2: [],
    city: [],
    state: [],
    postcode: [],
    status: [],
    startDate: [],
    endDate: [],
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
          name,
          user,
          addressLine1,
          addressLine2,
          city,
          state,
          postcode,
          status,
          startDate,
          endDate,
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
            query: createEmployee.replaceAll("__typename", ""),
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
      {...getOverrideProps(overrides, "EmployeeCreateForm")}
      {...rest}
    >
      <TextField
        label="Name"
        isRequired={true}
        isReadOnly={false}
        value={name}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name: value,
              user,
              addressLine1,
              addressLine2,
              city,
              state,
              postcode,
              status,
              startDate,
              endDate,
            };
            const result = onChange(modelFields);
            value = result?.name ?? value;
          }
          if (errors.name?.hasError) {
            runValidationTasks("name", value);
          }
          setName(value);
        }}
        onBlur={() => runValidationTasks("name", name)}
        errorMessage={errors.name?.errorMessage}
        hasError={errors.name?.hasError}
        {...getOverrideProps(overrides, "name")}
      ></TextField>
      <TextField
        label="User"
        isRequired={false}
        isReadOnly={false}
        value={user}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name,
              user: value,
              addressLine1,
              addressLine2,
              city,
              state,
              postcode,
              status,
              startDate,
              endDate,
            };
            const result = onChange(modelFields);
            value = result?.user ?? value;
          }
          if (errors.user?.hasError) {
            runValidationTasks("user", value);
          }
          setUser(value);
        }}
        onBlur={() => runValidationTasks("user", user)}
        errorMessage={errors.user?.errorMessage}
        hasError={errors.user?.hasError}
        {...getOverrideProps(overrides, "user")}
      ></TextField>
      <TextField
        label="Address line1"
        isRequired={false}
        isReadOnly={false}
        value={addressLine1}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name,
              user,
              addressLine1: value,
              addressLine2,
              city,
              state,
              postcode,
              status,
              startDate,
              endDate,
            };
            const result = onChange(modelFields);
            value = result?.addressLine1 ?? value;
          }
          if (errors.addressLine1?.hasError) {
            runValidationTasks("addressLine1", value);
          }
          setAddressLine1(value);
        }}
        onBlur={() => runValidationTasks("addressLine1", addressLine1)}
        errorMessage={errors.addressLine1?.errorMessage}
        hasError={errors.addressLine1?.hasError}
        {...getOverrideProps(overrides, "addressLine1")}
      ></TextField>
      <TextField
        label="Address line2"
        isRequired={false}
        isReadOnly={false}
        value={addressLine2}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name,
              user,
              addressLine1,
              addressLine2: value,
              city,
              state,
              postcode,
              status,
              startDate,
              endDate,
            };
            const result = onChange(modelFields);
            value = result?.addressLine2 ?? value;
          }
          if (errors.addressLine2?.hasError) {
            runValidationTasks("addressLine2", value);
          }
          setAddressLine2(value);
        }}
        onBlur={() => runValidationTasks("addressLine2", addressLine2)}
        errorMessage={errors.addressLine2?.errorMessage}
        hasError={errors.addressLine2?.hasError}
        {...getOverrideProps(overrides, "addressLine2")}
      ></TextField>
      <TextField
        label="City"
        isRequired={false}
        isReadOnly={false}
        value={city}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name,
              user,
              addressLine1,
              addressLine2,
              city: value,
              state,
              postcode,
              status,
              startDate,
              endDate,
            };
            const result = onChange(modelFields);
            value = result?.city ?? value;
          }
          if (errors.city?.hasError) {
            runValidationTasks("city", value);
          }
          setCity(value);
        }}
        onBlur={() => runValidationTasks("city", city)}
        errorMessage={errors.city?.errorMessage}
        hasError={errors.city?.hasError}
        {...getOverrideProps(overrides, "city")}
      ></TextField>
      <TextField
        label="State"
        isRequired={false}
        isReadOnly={false}
        value={state}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name,
              user,
              addressLine1,
              addressLine2,
              city,
              state: value,
              postcode,
              status,
              startDate,
              endDate,
            };
            const result = onChange(modelFields);
            value = result?.state ?? value;
          }
          if (errors.state?.hasError) {
            runValidationTasks("state", value);
          }
          setState(value);
        }}
        onBlur={() => runValidationTasks("state", state)}
        errorMessage={errors.state?.errorMessage}
        hasError={errors.state?.hasError}
        {...getOverrideProps(overrides, "state")}
      ></TextField>
      <TextField
        label="Postcode"
        isRequired={false}
        isReadOnly={false}
        value={postcode}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name,
              user,
              addressLine1,
              addressLine2,
              city,
              state,
              postcode: value,
              status,
              startDate,
              endDate,
            };
            const result = onChange(modelFields);
            value = result?.postcode ?? value;
          }
          if (errors.postcode?.hasError) {
            runValidationTasks("postcode", value);
          }
          setPostcode(value);
        }}
        onBlur={() => runValidationTasks("postcode", postcode)}
        errorMessage={errors.postcode?.errorMessage}
        hasError={errors.postcode?.hasError}
        {...getOverrideProps(overrides, "postcode")}
      ></TextField>
      <SelectField
        label="Status"
        placeholder="Please select an option"
        isDisabled={false}
        value={status}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name,
              user,
              addressLine1,
              addressLine2,
              city,
              state,
              postcode,
              status: value,
              startDate,
              endDate,
            };
            const result = onChange(modelFields);
            value = result?.status ?? value;
          }
          if (errors.status?.hasError) {
            runValidationTasks("status", value);
          }
          setStatus(value);
        }}
        onBlur={() => runValidationTasks("status", status)}
        errorMessage={errors.status?.errorMessage}
        hasError={errors.status?.hasError}
        {...getOverrideProps(overrides, "status")}
      >
        <option
          children="Normal"
          value="Normal"
          {...getOverrideProps(overrides, "statusoption0")}
        ></option>
        <option
          children="Inactive"
          value="Inactive"
          {...getOverrideProps(overrides, "statusoption1")}
        ></option>
        <option
          children="Competence center"
          value="CompetenceCenter"
          {...getOverrideProps(overrides, "statusoption2")}
        ></option>
        <option
          children="Provisional"
          value="Provisional"
          {...getOverrideProps(overrides, "statusoption3")}
        ></option>
        <option
          children="Partner"
          value="Partner"
          {...getOverrideProps(overrides, "statusoption4")}
        ></option>
        <option
          children="Owner"
          value="Owner"
          {...getOverrideProps(overrides, "statusoption5")}
        ></option>
      </SelectField>
      <TextField
        label="Start date"
        isRequired={false}
        isReadOnly={false}
        type="date"
        value={startDate}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name,
              user,
              addressLine1,
              addressLine2,
              city,
              state,
              postcode,
              status,
              startDate: value,
              endDate,
            };
            const result = onChange(modelFields);
            value = result?.startDate ?? value;
          }
          if (errors.startDate?.hasError) {
            runValidationTasks("startDate", value);
          }
          setStartDate(value);
        }}
        onBlur={() => runValidationTasks("startDate", startDate)}
        errorMessage={errors.startDate?.errorMessage}
        hasError={errors.startDate?.hasError}
        {...getOverrideProps(overrides, "startDate")}
      ></TextField>
      <TextField
        label="End date"
        isRequired={false}
        isReadOnly={false}
        type="date"
        value={endDate}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              name,
              user,
              addressLine1,
              addressLine2,
              city,
              state,
              postcode,
              status,
              startDate,
              endDate: value,
            };
            const result = onChange(modelFields);
            value = result?.endDate ?? value;
          }
          if (errors.endDate?.hasError) {
            runValidationTasks("endDate", value);
          }
          setEndDate(value);
        }}
        onBlur={() => runValidationTasks("endDate", endDate)}
        errorMessage={errors.endDate?.errorMessage}
        hasError={errors.endDate?.hasError}
        {...getOverrideProps(overrides, "endDate")}
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
