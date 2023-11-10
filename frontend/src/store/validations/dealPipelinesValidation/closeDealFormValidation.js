import Validator from "validator";
import isEmpty from "../is-empty";

export const validateCloseDealForm = (data) => {
  let errors = {};

  if (Validator.isEmpty(data.city)) {
    errors.city = "City is required";
  }

  if (Validator.isEmpty(data.shippingAddress)) {
    errors.shippingAddress = "Shipping address is required";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
