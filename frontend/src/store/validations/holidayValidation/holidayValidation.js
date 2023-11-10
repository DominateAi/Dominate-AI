import Validator from "validator";
import isEmpty from "../is-empty";

export const validateAddHoliday = data => {
  let errors = {};

  if (!Validator.isLength(data.holiday, { min: 2, max: 30 })) {
    errors.holiday = "New holiday must be of 2 to 30 characters";
  }

  if (Validator.isEmpty(data.holiday)) {
    errors.holiday = "New holiday is required";
  }

  // if (data.holidayDate === null) {
  //   errors.holidayDate = "Please select valid date";
  // }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
