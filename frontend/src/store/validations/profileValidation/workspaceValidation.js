import Validator from "validator";
import isEmpty from "../is-empty";

export const validateProfileWorkspaceInfo = data => {
  let errors = {};

  if (isEmpty(data.fileName)) {
    errors.fileName = "Logo is required";
  }

  // state only characters
  if (!Validator.isAlpha(data.state)) {
    errors.state = "Please enter valid state";
  }

  // city only character
  if (!Validator.isAlpha(data.city)) {
    errors.city = "Please enter valid city";
  }

  // country only character
  if (!Validator.isAlpha(data.country)) {
    errors.country = "Please enter valid country";
  }

  if (Validator.isEmpty(data.state)) {
    errors.state = "State is required";
  }

  if (Validator.isEmpty(data.city)) {
    errors.city = "City is required";
  }

  if (Validator.isEmpty(data.pincode)) {
    errors.pincode = "Pincode is required";
  }

  if (Validator.isEmpty(data.country)) {
    errors.country = "Country is required";
  }

  if (Validator.isEmpty(data.companyAddress)) {
    errors.companyAddress = "Company address is required";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
