import Validator from "validator";
import isEmpty from "../is-empty";

export const validateLogin = (data) => {
  let errors = {};

  // workspace email validation

  if (!Validator.isLength(data.workspaceName, { min: 2, max: 30 })) {
    errors.workspaceName = "Workspace name must be of 2 to 30 characters";
  }

  if (!isEmpty(data.workspaceName) && data.workspaceName.includes(" ")) {
    console.log("space error");
    errors.workspaceName = "Space not allowed";
  }

  if (Validator.isEmpty(data.workspaceName)) {
    errors.workspaceName = "Workspace name is required";
  }

  // Company Email Validation

  if (!Validator.isEmail(data.email)) {
    errors.email = "Please enter valid company email";
  }

  if (Validator.isEmpty(data.email)) {
    errors.email = "Company email is required";
  }

  // Password Validation

  // if (!Validator.isLength(data.password, { min: 8, max: 30 })) {
  //   errors.password = "Password must be of 8 to 30 characters";
  // }

  if (Validator.isEmpty(data.password)) {
    errors.password = "Password is required";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
