import Validator from "validator";
import isEmpty from "./../is-empty";

export const validateAddMeeting = (data) => {
  let errors = {};

  // if (!Validator.isLength(data.followUpLocation, { min: 2, max: 30 })) {
  //   errors.followUpLocation = "Location name must be of 2 to 30 characters";
  // }

  // if (Validator.isEmpty(data.followUpLocation)) {
  //   errors.followUpLocation = "Location name is required";
  // }

  if (Validator.isEmpty(data.selectedOptionDropdown.toString())) {
    errors.selectedOptionDropdown = "Please add a lead";
  }

  if (Validator.isEmpty(data.followUpLocation)) {
    errors.followUpLocation = "Location is required";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
