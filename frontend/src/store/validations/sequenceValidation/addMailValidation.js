import Validator from "validator";
import isEmpty from "../is-empty";

export const validateAddEmail = (data) => {
  let errors = {};

  console.log(data);

  if (Validator.isEmpty(data.emailAddress)) {
    errors.emailAddress = "Email address is required";
  }

  if (!Validator.isEmail(data.emailAddress)) {
    errors.emailAddress = "Valid email address is required";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
