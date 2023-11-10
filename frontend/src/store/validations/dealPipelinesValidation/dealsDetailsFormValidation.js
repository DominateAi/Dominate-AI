import Validator from "validator";
import isEmpty from "../is-empty";

export const validateDealsDetailsForm = (data) => {
  let errors = {};

  //if (
  //  !Validator.isLength(data.dealsName, { min: 2, max: 30 }) ||
  //  !Validator.matches(data.dealsName, /^[a-zA-Z\s]+$/)
  //) {
  //  errors.dealsName =
  //    "New deal name must be of 2 to 30 uppercase or lowercase characters";
  //}

  if (Validator.isEmpty(data.dealsName)) {
    errors.dealsName = "New deal name is required";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
