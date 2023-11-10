import Validator from "validator";
import isEmpty from "../is-empty";

export const validateForgotPassword = data => {
  let errors = {};

  // Company Email Validation

  if (!Validator.isEmail(data.email)) {
    errors.emailError = "Please enter valid company email";
  }

  if (Validator.isEmpty(data.email)) {
    errors.emailError = "Company email is required";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
