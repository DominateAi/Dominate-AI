import Validator from "validator";
import isEmpty from "../is-empty";

export const validateAddNewPipeline = (data) => {
  let errors = {};

  //if (
  //  !Validator.isLength(data.pipelinesName, { min: 2, max: 30 }) ||
  //  !Validator.matches(data.pipelinesName, /^[a-zA-Z\s]+$/)
  //) {
  //  errors.pipelinesName =
  //    "New deal pipeline name must be of 2 to 30 uppercase or lowercase characters";
  //}

  if (Validator.isEmpty(data.pipelinesName)) {
    errors.pipelinesName = "New deal pipeline name is required";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
