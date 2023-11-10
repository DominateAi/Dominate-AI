import Validator from "validator";
import isEmpty from "../is-empty";

export const validateEditAccount = (data) => {
  let errors = {};
  let accountName = data.accountsName.trim();
  let accountsLocation = data.accountsLocation.trim();
  let accountsShippingAddress = data.accountsShippingAddress.trim();
  let accountsBillingAddress = data.accountsBillingAddress.trim();
  let accountAbout = data.accountAbout.trim();

  //Account Name
  // if (
  //   !Validator.isLength(data.accountsName, { min: 2, max: 30 }) ||
  //   !Validator.matches(data.accountsName, /^[a-zA-Z\s]+$/)
  // ) {
  //   errors.accountsName =
  //     "Account name must be of 2 to 30 uppercase or lowercase characters";
  // }

  if (!Validator.matches(accountName, /^[a-zA-Z0-9\s]+$/)) {
    errors.accountsName =
      "Account name must be uppercase or lowercase characters";
  }

  if (Validator.isEmpty(accountName)) {
    errors.accountsName = "Account name is required";
  }

  //About Account
  if (!Validator.matches(accountAbout, /^[a-zA-Z0-9\s]+$/)) {
    errors.accountAbout =
      "Please enter a valid description using only a-z, A-Z 0-9";
  }

  if (Validator.isEmpty(data.accountAbout)) {
    errors.accountAbout = "Account description  is required";
  }

  //Account Location
  if (!Validator.matches(accountsLocation, /^[a-zA-Z0-9\s]+$/)) {
    errors.accountsLocation = "Please enter a valid location";
  }

  //if (Validator.isEmpty(data.accountsLocation)) {
  if (Validator.isEmpty(accountsLocation)) {
    errors.accountsLocation = "Account location is required";
  }

  //Account ShippingAddress
  if (!Validator.matches(accountsShippingAddress, /^[a-zA-Z0-9,-\s]+$/)) {
    errors.accountsShippingAddress =
      "Please enter a valid address using only a-z, A-Z 0-9, _-,";
  }

  //if (Validator.isEmpty(data.accountsShippingAddress)) {
  if (Validator.isEmpty(accountsShippingAddress)) {
    errors.accountsShippingAddress = "Account shipping address is required";
  }

  //Account BillingAddress
  if (!Validator.matches(accountsBillingAddress, /^[a-zA-Z0-9,-\s]+$/)) {
    errors.accountsBillingAddress =
      "Please enter a valid address using only a-z, A-Z 0-9, _-,";
  }

  //if (Validator.isEmpty(data.accountsBillingAddress)) {
  if (Validator.isEmpty(accountsBillingAddress)) {
    errors.accountsBillingAddress = "Account billing address is required";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
