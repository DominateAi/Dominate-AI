import Validator from "validator";
import isEmpty from "../is-empty";

export const validateAddNewStack = (data) => {
  let errors = {};

  //if (
  //  !Validator.isLength(data.stackName, { min: 2, max: 30 }) ||
  //  !Validator.matches(data.stackName, /^[a-zA-Z\s]+$/)
  //) {
  //  errors.stackName =
  //    "New stack name must be of 2 to 30 uppercase or lowercase characters";
  //}

  if (Validator.isEmpty(data.stackName)) {
    errors.stackName = "New stack name is required";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
