import Validator from "validator";
import isEmpty from "../is-empty";

export const validateAddCustomer = data => {
  let errors = {};

  // name
  if (
    !Validator.isLength(data.leadsName, { min: 2, max: 30 }) ||
    !Validator.matches(data.leadsName, /^[a-zA-Z\s]+$/)
  ) {
    errors.leadsName =
      "Customer name must be of 2 to 30 uppercase or lowercase characters";
  }

  if (Validator.isEmpty(data.leadsName)) {
    errors.leadsName = "Customer name is required";
  }

  // email
  if (!Validator.isEmail(data.leadsemail)) {
    errors.leadsemail = "Please enter valid email";
  }

  // email
  if (Validator.isEmpty(data.leadsemail)) {
    errors.leadsemail = "Email is required";
  }

  // phone number 10 digits
  // if (!Validator.isLength(data.leadsPhoneNumber, 10)) {
  //   errors.leadsPhoneNumber = "Phone number must be of 10 digits";
  // }

  // phone number
  // if (Validator.isEmpty(data.leadsPhoneNumber)) {
  //   errors.leadsPhoneNumber = "Phone number is required";
  // }

  // country code
  // if (data.leadsPhoneCountryNumber.charAt(0) !== "+") {
  //   errors.leadsPhoneCountryNumber = "Please add + in country code";
  // }

  // country code
  if (
    isNaN(data.leadsPhoneCountryNumber) ||
    data.leadsPhoneCountryNumber.length === 0
  ) {
    errors.leadsPhoneCountryNumber = "Country code invalid";
  }

  // address
  // if (Validator.isEmpty(data.leadsAddress)) {
  //   errors.leadsAddress = "Address is required";
  // }

  // company
  if (Validator.isEmpty(data.leadsWorkInCompanyName)) {
    errors.leadsWorkInCompanyName = "Company Name is required";
  }

  // // media accounts
  // if (
  //   data.leadMediaLinkedInCheckbox === true &&
  //   Validator.isEmpty(data.leadMediaLinkedInInput)
  // ) {
  //   errors.leadMediaLinkedInInput = "Value is required";
  // }
  // if (
  //   data.leadMediaFacebookCheckbox === true &&
  //   Validator.isEmpty(data.leadMediaFacebookInput)
  // ) {
  //   errors.leadMediaFacebookInput = "Value is required";
  // }
  // if (
  //   data.leadMediaInstagramCheckbox === true &&
  //   Validator.isEmpty(data.leadMediaInstagramInput)
  // ) {
  //   errors.leadMediaInstagramInput = "Value is required";
  // }

  // if (
  //   data.leadMediaOthersCheckbox === true &&
  //   Validator.isEmpty(data.leadMediaOthersInput)
  // ) {
  //   errors.leadMediaOthersInput = "Value is required";
  // }
  // // media accounts end

  // about
  // if (Validator.isEmpty(data.leadsAbout)) {
  //   errors.leadsAbout = "About Customer is required";
  // }

  // state only characters
  if (
    Validator.isLength(data.leadsShippingState, { min: 1 }) &&
    !Validator.isAlpha(data.leadsShippingState)
  ) {
    errors.leadsShippingState = "Please enter valid state";
  }

  // city only character
  if (
    Validator.isLength(data.leadsShippingCity, { min: 1 }) &&
    !Validator.isAlpha(data.leadsShippingCity)
  ) {
    errors.leadsShippingCity = "Please enter valid city";
  }

  // state
  // if (Validator.isEmpty(data.leadsShippingState)) {
  //   errors.leadsShippingState = "State is required";
  // }

  // city
  // if (Validator.isEmpty(data.leadsShippingCity)) {
  //   errors.leadsShippingCity = "City is required";
  // }

  // pincode
  // if (Validator.isEmpty(data.leadsShippingPinCode)) {
  //   errors.leadsShippingPinCode = "Pincode is required";
  // }

  // // website
  // if (Validator.isEmpty(data.leadsShippingWebsite)) {
  //   errors.leadsShippingWebsite = "Website is required";
  // }

  // billing;
  // if (!Validator.isLength(data.leadsShippingBilling, { min: 2, max: 50 })) {
  //   errors.leadsShippingBilling =
  //     "Billing Address must be of 2 to 50 characters";
  // }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
