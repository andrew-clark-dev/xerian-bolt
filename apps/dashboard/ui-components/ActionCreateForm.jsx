/* eslint-disable */
"use client";
import * as React from "react";
import {
  Button,
  Flex,
  Grid,
  SelectField,
  TextAreaField,
  TextField,
} from "@aws-amplify/ui-react";
import { fetchByPath, getOverrideProps, validateField } from "./utils";
import { generateClient } from "aws-amplify/api";
import { createAction } from "./graphql/mutations";
const client = generateClient();
export default function ActionCreateForm(props) {
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
    description: "",
    actor: "",
    modelName: "",
    refId: "",
    type: "",
    before: "",
    after: "",
  };
  const [description, setDescription] = React.useState(
    initialValues.description
  );
  const [actor, setActor] = React.useState(initialValues.actor);
  const [modelName, setModelName] = React.useState(initialValues.modelName);
  const [refId, setRefId] = React.useState(initialValues.refId);
  const [type, setType] = React.useState(initialValues.type);
  const [before, setBefore] = React.useState(initialValues.before);
  const [after, setAfter] = React.useState(initialValues.after);
  const [errors, setErrors] = React.useState({});
  const resetStateValues = () => {
    setDescription(initialValues.description);
    setActor(initialValues.actor);
    setModelName(initialValues.modelName);
    setRefId(initialValues.refId);
    setType(initialValues.type);
    setBefore(initialValues.before);
    setAfter(initialValues.after);
    setErrors({});
  };
  const validations = {
    description: [{ type: "Required" }],
    actor: [],
    modelName: [],
    refId: [],
    type: [],
    before: [{ type: "JSON" }],
    after: [{ type: "JSON" }],
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
          description,
          actor,
          modelName,
          refId,
          type,
          before,
          after,
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
            query: createAction.replaceAll("__typename", ""),
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
      {...getOverrideProps(overrides, "ActionCreateForm")}
      {...rest}
    >
      <TextField
        label="Description"
        isRequired={true}
        isReadOnly={false}
        value={description}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              description: value,
              actor,
              modelName,
              refId,
              type,
              before,
              after,
            };
            const result = onChange(modelFields);
            value = result?.description ?? value;
          }
          if (errors.description?.hasError) {
            runValidationTasks("description", value);
          }
          setDescription(value);
        }}
        onBlur={() => runValidationTasks("description", description)}
        errorMessage={errors.description?.errorMessage}
        hasError={errors.description?.hasError}
        {...getOverrideProps(overrides, "description")}
      ></TextField>
      <TextField
        label="Actor"
        isRequired={false}
        isReadOnly={false}
        value={actor}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              description,
              actor: value,
              modelName,
              refId,
              type,
              before,
              after,
            };
            const result = onChange(modelFields);
            value = result?.actor ?? value;
          }
          if (errors.actor?.hasError) {
            runValidationTasks("actor", value);
          }
          setActor(value);
        }}
        onBlur={() => runValidationTasks("actor", actor)}
        errorMessage={errors.actor?.errorMessage}
        hasError={errors.actor?.hasError}
        {...getOverrideProps(overrides, "actor")}
      ></TextField>
      <TextField
        label="Model name"
        isRequired={false}
        isReadOnly={false}
        value={modelName}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              description,
              actor,
              modelName: value,
              refId,
              type,
              before,
              after,
            };
            const result = onChange(modelFields);
            value = result?.modelName ?? value;
          }
          if (errors.modelName?.hasError) {
            runValidationTasks("modelName", value);
          }
          setModelName(value);
        }}
        onBlur={() => runValidationTasks("modelName", modelName)}
        errorMessage={errors.modelName?.errorMessage}
        hasError={errors.modelName?.hasError}
        {...getOverrideProps(overrides, "modelName")}
      ></TextField>
      <TextField
        label="Ref id"
        isRequired={false}
        isReadOnly={false}
        value={refId}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              description,
              actor,
              modelName,
              refId: value,
              type,
              before,
              after,
            };
            const result = onChange(modelFields);
            value = result?.refId ?? value;
          }
          if (errors.refId?.hasError) {
            runValidationTasks("refId", value);
          }
          setRefId(value);
        }}
        onBlur={() => runValidationTasks("refId", refId)}
        errorMessage={errors.refId?.errorMessage}
        hasError={errors.refId?.hasError}
        {...getOverrideProps(overrides, "refId")}
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
              description,
              actor,
              modelName,
              refId,
              type: value,
              before,
              after,
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
          children="Create"
          value="Create"
          {...getOverrideProps(overrides, "typeoption0")}
        ></option>
        <option
          children="Read"
          value="Read"
          {...getOverrideProps(overrides, "typeoption1")}
        ></option>
        <option
          children="Update"
          value="Update"
          {...getOverrideProps(overrides, "typeoption2")}
        ></option>
        <option
          children="Delete"
          value="Delete"
          {...getOverrideProps(overrides, "typeoption3")}
        ></option>
        <option
          children="Search"
          value="Search"
          {...getOverrideProps(overrides, "typeoption4")}
        ></option>
        <option
          children="Import"
          value="Import"
          {...getOverrideProps(overrides, "typeoption5")}
        ></option>
        <option
          children="Export"
          value="Export"
          {...getOverrideProps(overrides, "typeoption6")}
        ></option>
        <option
          children="Increment"
          value="Increment"
          {...getOverrideProps(overrides, "typeoption7")}
        ></option>
        <option
          children="Decrement"
          value="Decrement"
          {...getOverrideProps(overrides, "typeoption8")}
        ></option>
        <option
          children="Auth"
          value="Auth"
          {...getOverrideProps(overrides, "typeoption9")}
        ></option>
      </SelectField>
      <TextAreaField
        label="Before"
        isRequired={false}
        isReadOnly={false}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              description,
              actor,
              modelName,
              refId,
              type,
              before: value,
              after,
            };
            const result = onChange(modelFields);
            value = result?.before ?? value;
          }
          if (errors.before?.hasError) {
            runValidationTasks("before", value);
          }
          setBefore(value);
        }}
        onBlur={() => runValidationTasks("before", before)}
        errorMessage={errors.before?.errorMessage}
        hasError={errors.before?.hasError}
        {...getOverrideProps(overrides, "before")}
      ></TextAreaField>
      <TextAreaField
        label="After"
        isRequired={false}
        isReadOnly={false}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              description,
              actor,
              modelName,
              refId,
              type,
              before,
              after: value,
            };
            const result = onChange(modelFields);
            value = result?.after ?? value;
          }
          if (errors.after?.hasError) {
            runValidationTasks("after", value);
          }
          setAfter(value);
        }}
        onBlur={() => runValidationTasks("after", after)}
        errorMessage={errors.after?.errorMessage}
        hasError={errors.after?.hasError}
        {...getOverrideProps(overrides, "after")}
      ></TextAreaField>
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
