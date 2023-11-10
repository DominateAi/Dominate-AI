import Validator from "validator";
import isEmpty from "../is-empty";

export const validateClosedDealsDetailsForm = (data) => {
  let errors = {};

  if (
    !Validator.isLength(data.dealsName, { min: 2, max: 30 }) ||
    !Validator.matches(data.dealsName, /^[a-zA-Z\s]+$/)
  ) {
    errors.dealsName =
      "New deal name must be of 2 to 30 uppercase or lowercase characters";
  }

  if (Validator.isEmpty(data.dealsName)) {
    errors.dealsName = "New deal name is required";
  }

  if (Validator.isEmpty(data.worthValueOfDeal.toString())) {
    errors.worthValueOfDeal = "Worth value($) of the new deal is required";
  }

  // if (Validator.isEmpty(data.city)) {
  //   errors.city = "City is required";
  // }

  // if (Validator.isEmpty(data.shippingAddress)) {
  //   errors.shippingAddress = "Shipping address is required";
  // }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
