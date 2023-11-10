import Validator from "validator";
import isEmpty from "../is-empty";

export const validateActivityViewProfileBasic = (data) => {
  let errors = {};

  // if (
  //   !Validator.isLength(data.name, { min: 2, max: 30 }) ||
  //   !Validator.matches(data.name, /^[a-zA-Z\s]+$/)
  // ) {
  //   errors.name =
  //     "Lead name must be of 2 to 30 uppercase or lowercase characters";
  // }

  if (Validator.isEmpty(data.name)) {
    errors.name = "Lead name is required";
  }

  if (!Validator.isEmail(data.email)) {
    errors.email = "Please enter valid email";
  }

  if (Validator.isEmpty(data.email)) {
    errors.email = "Email is required";
  }

  // if (Validator.isEmpty(data.company)) {
  //   errors.company = "Company name is required";
  // }

  // phone number 10 digits
  if (!Validator.isLength(data.phoneNumber, 10)) {
    errors.phoneNumber = "Phone number must be of 10 digits";
  }

  // phone number
  if (Validator.isEmpty(data.phoneNumber)) {
    errors.phoneNumber = "Phone number is required";
  }

  // if (data.countryCode.charAt(0) !== "+") {
  //   errors.countryCode = "Please add + in country code";
  // }

  if (isNaN(data.countryCode) || data.countryCode.length === 0) {
    errors.countryCode = "Country code invalid";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
