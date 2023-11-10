import Validator from "validator";
import isEmpty from "../is-empty";

export const validateAddService = (data) => {
  let errors = {};

  console.log(data);

  //   if (
  //     !Validator.isLength(data.accountsName, { min: 2, max: 30 }) ||
  //     !Validator.matches(data.accountsName, /^[a-zA-Z\s]+$/)
  //   ) {
  //     errors.accountsName =
  //       "Account name must be of 2 to 30 uppercase or lowercase characters";
  //   }

  if (Validator.isEmpty(data.serviceTitle)) {
    errors.serviceTitle = "Service title is required";
  }

  if (Validator.isEmpty(data.serviceCode)) {
    errors.serviceCode = "Service code is required";
  }

  if (Validator.isEmpty(data.serviceUnitPrice)) {
    errors.serviceUnitPrice = "Service unit price is required";
  }

  // if (Validator.isEmpty(data.accountsBillingAddress)) {
  //   errors.accountsBillingAddress = "Account billing address is required";
  // }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
