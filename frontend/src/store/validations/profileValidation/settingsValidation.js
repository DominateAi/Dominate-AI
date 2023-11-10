import Validator from "validator";
import isEmpty from "../is-empty";

export const validateProfileSettings = data => {
  let errors = {};

  // fname
  if (
    !Validator.isLength(data.fname, { min: 2, max: 30 }) ||
    !Validator.isAlpha(data.fname)
  ) {
    errors.fname =
      "First name must be of 2 to 30 uppercase or lowercase characters";
  }

  if (Validator.isEmpty(data.fname)) {
    errors.fname = "First name is required";
  }

  // lname
  if (
    !Validator.isLength(data.lname, { min: 2, max: 30 }) ||
    !Validator.isAlpha(data.lname)
  ) {
    errors.lname =
      "Last name must be of 2 to 30 uppercase or lowercase characters";
  }

  if (Validator.isEmpty(data.lname)) {
    errors.lname = "Last name is required";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
