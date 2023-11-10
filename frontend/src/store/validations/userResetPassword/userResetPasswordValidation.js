import Validator from "validator";
import isEmpty from "../is-empty";

export const validateUserResetPassword = data => {
  let errors = {};

  if (
    !Validator.matches(
      data.userPassword,
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])/
    )
  ) {
    errors.userPassword =
      "Password must contain at least 8 characters with a mix of special characters, numbers and both upper and lower case";
  }

  if (Validator.isEmpty(data.userPassword)) {
    errors.userPassword = "Password is required";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
