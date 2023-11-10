import Validator from "validator";
import isEmpty from "../is-empty";

export const validateSalesAddNewContact = (data) => {
  let errors = {};
  let contactsName = data.contactsName.trim();

  // if (
  //   !Validator.isLength(data.contactsName, { min: 2, max: 30 }) ||
  //   !Validator.matches(data.contactsName, /^[a-zA-Z\s]+$/)
  //) {
  // errors.contactsName =
  //   "Contact name must be of 2 to 30 uppercase or lowercase characters";
  //}

  if (
    !Validator.isLength(contactsName, { min: 2 }) ||
    !Validator.matches(contactsName, /^[a-zA-Z\s]+$/)
  ) {
    errors.contactsName =
      "Contact name must be of uppercase or lowercase characters";
  }

  //if (!isEmpty(contactsName) && contactsName.includes(" ")) {
  //  errors.contactsName = "Space not allowed";
  //}

  if (Validator.isEmpty(contactsName)) {
    errors.contactsName = "Contact name is required";
  }

  if (!isEmpty(data.contactsEmail) && !Validator.isEmail(data.contactsEmail)) {
    errors.contactsEmail = "Please enter valid email";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
