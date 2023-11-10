import Validator from "validator";
import isEmpty from "./../is-empty";

export const validateAddQuotation = (data) => {
  let errors = {};

  // title
  if (
    !Validator.isLength(data.leadsName, { min: 2, max: 30 }) ||
    !Validator.matches(data.leadsName, /^[a-zA-Z0-9\s]+$/)
  ) {
    //errors.leadsName = "Title must be of 2 to 30 characters";
    errors.leadsName =
      "Please enter a valid title, special characters not allowed";
  }

  if (Validator.isEmpty(data.leadsName)) {
    errors.leadsName = "Title is required";
  }

  // select lead
  // if (
  //   !Validator.isLength(data.leadAssignRepresentative, { min: 2, max: 50 }) ||
  //   !Validator.matches(data.leadAssignRepresentative, /^[a-zA-Z\s]+$/)
  // ) {
  //   errors.leadAssignRepresentative =
  //     "Lead name must be of 2 to 30 uppercase or lowercase characters";
  // }

  // if (Validator.isEmpty(data.leadAssignRepresentative)) {
  //   errors.leadAssignRepresentative = "Lead name is required";
  // }

  // select lead
  if (Validator.isEmpty(data.leadAssignRepresentative)) {
    errors.leadAssignRepresentative = "Lead is required";
  }

  // billing
  // state only characters
  // if (!Validator.isAlpha(data.leadsShippingState)) {
  //   errors.leadsShippingState = "Please enter valid state";
  // }

  // city only character
  // if (!Validator.isAlpha(data.leadsShippingCity)) {
  //   errors.leadsShippingCity = "Please enter valid city";
  // }

  // if (Validator.isEmpty(data.leadsShippingState)) {
  //   errors.leadsShippingState = "State is required";
  // }

  // if (Validator.isEmpty(data.leadsShippingCity)) {
  //   errors.leadsShippingCity = "City is required";
  // }

  // if (Validator.isEmpty(data.leadsShippingPinCode)) {
  //   errors.leadsShippingPinCode = "Pincode is required";
  // }

  // if (Validator.isEmpty(data.leadsShippingBilling)) {
  //   errors.leadsShippingBilling = "Billing address is required";
  // }
  // billing end

  // company details
  // state only characters
  // if (!Validator.isAlpha(data.quotationCompanyState)) {
  //   errors.quotationCompanyState = "Please enter valid state";
  // }

  // // city only character
  // if (!Validator.isAlpha(data.quotationCompanyCity)) {
  //   errors.quotationCompanyCity = "Please enter valid city";
  // }

  // if (Validator.isEmpty(data.quotationCompanyState)) {
  //   errors.quotationCompanyState = "State is required";
  // }

  // if (Validator.isEmpty(data.quotationCompanyCity)) {
  //   errors.quotationCompanyCity = "City is required";
  // }

  // if (Validator.isEmpty(data.quotationCompanyPinCode)) {
  //   errors.quotationCompanyPinCode = "Pincode is required";
  // }

  // if (Validator.isEmpty(data.quotationCompanyBilling)) {
  //   errors.quotationCompanyBilling = "Billing address is required";
  // }
  // company details end

  // if (isEmpty(data.fileName)) {
  //   errors.fileName = "Logo is required";
  // }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
