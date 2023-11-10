import Validator from "validator";
import isEmpty from "../is-empty";

export const validateAddNewCustomField = (data) => {
  let errors = {};

  if (
    !Validator.isLength(data.customFieldsName, { min: 2, max: 30 }) ||
    !Validator.matches(data.customFieldsName, /^[a-zA-Z\s]+$/)
  ) {
    errors.customFieldsName =
      "Field name must be of 2 to 30 uppercase or lowercase characters";
  }

  if (Validator.isEmpty(data.customFieldsName)) {
    errors.customFieldsName = "Field name is required";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
