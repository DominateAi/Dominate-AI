// import Validator from "validator";
import isEmpty from "../is-empty";

export const validateAddFollowup = data => {
  let errors = {};

  if (isEmpty(data.selectedOption)) {
    errors.selectedOption = "Please select the purpose";
  }

  if (isEmpty(data.followUpLocation) && data.selectedOption === "Meeting") {
    errors.followUpLocation = "Please enter a valid location";
  }

  // if (data.startDate === null) {
  //   errors.startDate = "Please enter a valid date";
  // }

  // if (data.startTime === null) {
  //   errors.startTime = "Please enter a valid time";
  // }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
