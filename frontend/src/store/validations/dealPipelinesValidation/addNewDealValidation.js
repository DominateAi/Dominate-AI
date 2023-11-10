import Validator from "validator";
import isEmpty from "../is-empty";

export const validateAddNewDeal = (data) => {
  let errors = {};

  console.log(data);
  // if (
  //   !Validator.isLength(data.dealsName, { min: 2, max: 30 })
  // ||
  // !Validator.matches(data.dealsName, /^[a-zA-Z\s]+$/)
  // ) {
  //   errors.dealsName =
  //     "New deal name must be of 2 to 30 uppercase or lowercase characters";
  // }

  if (Validator.isEmpty(data.dealsName)) {
    errors.dealsName = "New deal name is required";
  }

  if (data.worthValueOfDeal !== null) {
    if (Validator.isEmpty(data.worthValueOfDeal.toString())) {
      errors.worthValueOfDeal = "Worth value($) of the new deal is required";
    }
  } else {
    errors.worthValueOfDeal = "Worth value($) of the new deal is required";
  }

  if (isEmpty(data.dealsAccountNameSelectedOption)) {
    errors.dealsAccountNameSelectedOption = "Please select account for deal";
  }

  // if (isEmpty(data.leadNameSelectedOption)) {
  //   errors.leadNameSelectedOption = "Please select lead for deal";
  // }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
