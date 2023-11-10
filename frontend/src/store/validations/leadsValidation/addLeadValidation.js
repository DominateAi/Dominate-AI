import Validator from "validator";
import isEmpty from "../is-empty";

export const validateAddLead = (data) => {
  let errors = {};
  let leadsName = data.leadsName.trim();
  let leadsAbout = data.leadsAbout.trim();
  let leadMediaLinkedInInput = data.leadMediaLinkedInInput.trim();
  let leadMediaFacebookInput = data.leadMediaFacebookInput.trim();
  let leadMediaInstagramInput = data.leadMediaInstagramInput.trim();
  let leadsSkypeAddress = data.leadsSkypeAddress.trim();

  if (
    !Validator.isLength(leadsName, { min: 2, max: 30 }) ||
    !Validator.matches(leadsName, /^[a-zA-Z\s]+$/)
  ) {
    errors.leadsName =
      "Lead name must be of 2 to 30 uppercase or lowercase characters";
  }

  if (Validator.isEmpty(leadsName)) {
    errors.leadsName = "Lead name is required";
  }

  // if (!Validator.isEmail(data.leadsEmail)) {
  //   errors.leadsEmail = "Please enter valid email";
  // }

  // if (Validator.isEmpty(data.leadsEmail)) {
  //   errors.leadsEmail = "Email is required";
  // }

  // phone number 10 digits
  // if (!Validator.isLength(data.leadsPhoneNumber, 20)) {
  //   errors.leadsPhoneNumber = "Phone number must be of 20 digits";
  // }

  // phone number
  // if (Validator.isEmpty(data.leadsPhoneNumber)) {
  //   errors.leadsPhoneNumber = "Phone number is required";
  // }

  // if (data.leadsPhoneCountryNumber.charAt(0) !== "+") {
  //   errors.leadsPhoneCountryNumber = "Please add + in country code";
  // }

  if (
    isNaN(data.leadsPhoneCountryNumber) ||
    data.leadsPhoneCountryNumber.length === 0
  ) {
    errors.leadsPhoneCountryNumber = "Country code invalid";
  }

  // if (
  //   !Validator.isLength(data.leadAssignRepresentative.toString().trim(), {
  //     min: 2,
  //     max: 30,
  //   })
  // ) {
  //   errors.leadAssignRepresentative =
  //     "Representative name must be of 2 to 30 characters";
  // }

  if (Validator.isEmpty(data.leadAssignRepresentative)) {
    errors.leadAssignRepresentative = "Representative name is required";
  }

  if (isEmpty(data.displayListSelected)) {
    errors.displayListSelected = "At least one account is required";
  }

  // if (isEmpty(data.leadsWorthAmount)) {
  //   errors.leadsWorthAmount = "Worth amount is required";
  // }

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

  // // state
  // if (Validator.isEmpty(data.leadsShippingState)) {
  //   errors.leadsShippingState = "State is required";
  // }

  // // city
  // if (Validator.isEmpty(data.leadsShippingCity)) {
  //   errors.leadsShippingCity = "City is required";
  // }

  // // pincode
  // if (Validator.isEmpty(data.leadsShippingPinCode)) {
  //   errors.leadsShippingPinCode = "Pincode is required";
  // }

  // // // website
  // // if (Validator.isEmpty(data.leadsShippingWebsite)) {
  // //   errors.leadsShippingWebsite = "Website is required";
  // // }

  // // billing
  // if (!Validator.isLength(data.leadsShippingBilling, { min: 2, max: 30 })) {
  //   errors.leadsShippingBilling = "Billing Address must be of 2 to 30 characters";
  // }

  //about
  if (!Validator.isEmpty(leadsAbout)) {
    if (
      !Validator.isLength(data.leadsAbout, { min: 2, max: 200 }) ||
      !Validator.matches(data.leadsAbout, /^[a-zA-Z0-9\s]+$/)
    ) {
      errors.leadsAbout =
        "Lead description must be of 2 to 30 uppercase or lowercase characters";
    }
  }

  //media
  //linkedIn

  if (!Validator.isEmpty(leadMediaLinkedInInput)) {
    if (!Validator.isLength(leadMediaLinkedInInput, { min: 2 })) {
      errors.leadMediaLinkedInInput =
        "LinkedIn link  must be more than 2 characters";
    }
  }
  //if (Validator.isEmpty(leadMediaLinkedInInput)) {
  //  errors.leadMediaLinkedInInput = "LinkedIn link required";
  //}

  //faceBook
  if (!Validator.isEmpty(leadMediaFacebookInput)) {
    if (!Validator.isLength(leadMediaFacebookInput, { min: 2 })) {
      errors.leadMediaFacebookInput =
        "Facebook link  must be more than 2 characters";
    }
  }
  //if (Validator.isEmpty(leadMediaFacebookInput)) {
  //  errors.leadMediaFacebookInput = "Facebook link required";
  //}

  //instagram
  if (!Validator.isEmpty(leadMediaInstagramInput)) {
    if (!Validator.isLength(leadMediaInstagramInput, { min: 2 })) {
      errors.leadMediaInstagramInput =
        "Instagram link  must be more than 2 characters";
    }
  }
  ///if (Validator.isEmpty(leadMediaInstagramInput)) {
  //  errors.leadMediaInstagramInput = "Instagram link is required";
  //}

  //skapAddress
  if (!Validator.isEmpty(leadsSkypeAddress)) {
    if (!Validator.isLength(leadsSkypeAddress, { min: 2 })) {
      errors.leadsSkypeAddress = "Skype address must be more than 2 characters";
    }
  }
  //if (Validator.isEmpty(leadsSkypeAddress)) {
  //  errors.leadsSkypeAddress = "Skype address is required";
  //}

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
