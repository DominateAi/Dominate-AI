// import Validator from "validator";
import isEmpty from "../is-empty";

export const validateLeadActivityFile = data => {
  let errors = {};

  if (isEmpty(data.fileName)) {
    errors.fileName = "File name is required";
  }

  if (isEmpty(data.description)) {
    errors.description = "Description is required";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
