import Validator from "validator";
import isEmpty from "../is-empty";

export const validateEditProduct = (data) => {
  let errors = {};

  console.log(data);

  //   if (
  //     !Validator.isLength(data.accountsName, { min: 2, max: 30 }) ||
  //     !Validator.matches(data.accountsName, /^[a-zA-Z\s]+$/)
  //   ) {
  //     errors.accountsName =
  //       "Account name must be of 2 to 30 uppercase or lowercase characters";
  //   }

  if (Validator.isEmpty(data.productTitle)) {
    errors.productTitle = "Product title is required";
  }

  if (Validator.isEmpty(data.productCode)) {
    errors.productCode = "Product code is required";
  }

  if (Validator.isEmpty(data.unitPrice.toString())) {
    errors.unitPrice = "Product unit price is required";
  }

  // if (Validator.isEmpty(data.accountsBillingAddress)) {
  //   errors.accountsBillingAddress = "Account billing address is required";
  // }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
