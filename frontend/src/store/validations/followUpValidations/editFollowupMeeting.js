// import Validator from "validator";
import isEmpty from "../is-empty";

export const validateEditMeetingFollowup = data => {
  let errors = {};

  if (isEmpty(data.followUpLocation)) {
    errors.followUpLocation = "Location is required";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
