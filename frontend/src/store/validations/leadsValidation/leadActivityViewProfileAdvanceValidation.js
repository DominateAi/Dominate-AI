import Validator from "validator";
import isEmpty from "../is-empty";

export const validateActivityViewProfileAdvance = data => {
  let errors = {};

  // state only characters
  if (
    Validator.isLength(data.state, { min: 1 }) &&
    !Validator.isAlpha(data.state)
  ) {
    errors.state = "Please enter valid state";
  }

  // city only character
  if (
    Validator.isLength(data.city, { min: 1 }) &&
    !Validator.isAlpha(data.city)
  ) {
    errors.city = "Please enter valid city";
  }
  return {
    errors,
    isValid: isEmpty(errors)
  };
};
