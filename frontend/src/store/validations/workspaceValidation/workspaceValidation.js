import Validator from "validator";
import isEmpty from "../is-empty";

export const validateWorkspaceLogin = (data) => {
  let errors = {};

  // Company Email Validation

  if (!Validator.isEmail(data.email)) {
    // errors.emailError = "Please enter valid company email";
    errors.emailError = "Invalid email or password";
  }

  if (Validator.isEmpty(data.email)) {
    // errors.emailError = "Company email is required";
    errors.emailError = "Invalid email or password";
  }

  // Password Validation

  // if (!Validator.isLength(data.password, { min: 8, max: 30 })) {
  //   errors.passwordError = "Password must be of 8 to 30 characters";
  // }

  if (Validator.isEmpty(data.password)) {
    // errors.passwordError = "Password is required";
    errors.passwordError = "Invalid email or password";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
