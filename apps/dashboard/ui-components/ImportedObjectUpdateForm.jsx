/* eslint-disable */
"use client";
import * as React from "react";
import {
  Button,
  Flex,
  Grid,
  TextAreaField,
  TextField,
} from "@aws-amplify/ui-react";
import { fetchByPath, getOverrideProps, validateField } from "./utils";
import { generateClient } from "aws-amplify/api";
import { getImportedObject } from "./graphql/queries";
import { updateImportedObject } from "./graphql/mutations";
const client = generateClient();
export default function ImportedObjectUpdateForm(props) {
  const {
    externalId: externalIdProp,
    importedObject: importedObjectModelProp,
    onSuccess,
    onError,
    onSubmit,
    onValidate,
    onChange,
    overrides,
    ...rest
  } = props;
  const initialValues = {
    externalId: "",
    type: "",
    userId: "",
    data: "",
  };
  const [externalId, setExternalId] = React.useState(initialValues.externalId);
  const [type, setType] = React.useState(initialValues.type);
  const [userId, setUserId] = React.useState(initialValues.userId);
  const [data, setData] = React.useState(initialValues.data);
  const [errors, setErrors] = React.useState({});
  const resetStateValues = () => {
    const cleanValues = importedObjectRecord
      ? { ...initialValues, ...importedObjectRecord }
      : initialValues;
    setExternalId(cleanValues.externalId);
    setType(cleanValues.type);
    setUserId(cleanValues.userId);
    setData(
      typeof cleanValues.data === "string" || cleanValues.data === null
        ? cleanValues.data
        : JSON.stringify(cleanValues.data)
    );
    setErrors({});
  };
  const [importedObjectRecord, setImportedObjectRecord] = React.useState(
    importedObjectModelProp
  );
  React.useEffect(() => {
    const queryData = async () => {
      const record = externalIdProp
        ? (
            await client.graphql({
              query: getImportedObject.replaceAll("__typename", ""),
              variables: { externalId: externalIdProp },
            })
          )?.data?.getImportedObject
        : importedObjectModelProp;
      setImportedObjectRecord(record);
    };
    queryData();
  }, [externalIdProp, importedObjectModelProp]);
  React.useEffect(resetStateValues, [importedObjectRecord]);
  const validations = {
    externalId: [{ type: "Required" }],
    type: [{ type: "Required" }],
    userId: [],
    data: [{ type: "JSON" }],
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
          externalId,
          type,
          userId: userId ?? null,
          data: data ?? null,
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
            query: updateImportedObject.replaceAll("__typename", ""),
            variables: {
              input: {
                externalId: importedObjectRecord.externalId,
                ...modelFields,
              },
            },
          });
          if (onSuccess) {
            onSuccess(modelFields);
          }
        } catch (err) {
          if (onError) {
            const messages = err.errors.map((e) => e.message).join("\n");
            onError(modelFields, messages);
          }
        }
      }}
      {...getOverrideProps(overrides, "ImportedObjectUpdateForm")}
      {...rest}
    >
      <TextField
        label="External id"
        isRequired={true}
        isReadOnly={true}
        value={externalId}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              externalId: value,
              type,
              userId,
              data,
            };
            const result = onChange(modelFields);
            value = result?.externalId ?? value;
          }
          if (errors.externalId?.hasError) {
            runValidationTasks("externalId", value);
          }
          setExternalId(value);
        }}
        onBlur={() => runValidationTasks("externalId", externalId)}
        errorMessage={errors.externalId?.errorMessage}
        hasError={errors.externalId?.hasError}
        {...getOverrideProps(overrides, "externalId")}
      ></TextField>
      <TextField
        label="Type"
        isRequired={true}
        isReadOnly={false}
        value={type}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              externalId,
              type: value,
              userId,
              data,
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
      ></TextField>
      <TextField
        label="User id"
        isRequired={false}
        isReadOnly={false}
        value={userId}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              externalId,
              type,
              userId: value,
              data,
            };
            const result = onChange(modelFields);
            value = result?.userId ?? value;
          }
          if (errors.userId?.hasError) {
            runValidationTasks("userId", value);
          }
          setUserId(value);
        }}
        onBlur={() => runValidationTasks("userId", userId)}
        errorMessage={errors.userId?.errorMessage}
        hasError={errors.userId?.hasError}
        {...getOverrideProps(overrides, "userId")}
      ></TextField>
      <TextAreaField
        label="Data"
        isRequired={false}
        isReadOnly={false}
        value={data}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              externalId,
              type,
              userId,
              data: value,
            };
            const result = onChange(modelFields);
            value = result?.data ?? value;
          }
          if (errors.data?.hasError) {
            runValidationTasks("data", value);
          }
          setData(value);
        }}
        onBlur={() => runValidationTasks("data", data)}
        errorMessage={errors.data?.errorMessage}
        hasError={errors.data?.hasError}
        {...getOverrideProps(overrides, "data")}
      ></TextAreaField>
      <Flex
        justifyContent="space-between"
        {...getOverrideProps(overrides, "CTAFlex")}
      >
        <Button
          children="Reset"
          type="reset"
          onClick={(event) => {
            event.preventDefault();
            resetStateValues();
          }}
          isDisabled={!(externalIdProp || importedObjectModelProp)}
          {...getOverrideProps(overrides, "ResetButton")}
        ></Button>
        <Flex
          gap="15px"
          {...getOverrideProps(overrides, "RightAlignCTASubFlex")}
        >
          <Button
            children="Submit"
            type="submit"
            variation="primary"
            isDisabled={
              !(externalIdProp || importedObjectModelProp) ||
              Object.values(errors).some((e) => e?.hasError)
            }
            {...getOverrideProps(overrides, "SubmitButton")}
          ></Button>
        </Flex>
      </Flex>
    </Grid>
  );
}
