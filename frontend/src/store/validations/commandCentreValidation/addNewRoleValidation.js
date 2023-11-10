import Validator from "validator";
import isEmpty from "../is-empty";

export const validateAddNewRole = (data) => {
  let errors = {};

  if (
    !Validator.isLength(data.memberRolesName, { min: 2, max: 30 }) ||
    !Validator.matches(data.memberRolesName, /^[a-zA-Z\s]+$/)
  ) {
    errors.memberRolesName =
      "Role name must be of 2 to 30 uppercase or lowercase characters";
  }

  if (Validator.isEmpty(data.memberRolesName)) {
    errors.memberRolesName = "Role name is required";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
