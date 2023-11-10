// import Validator from "validator";
import isEmpty from "../is-empty";

export const validateLeadActivityAddNote = data => {
  let errors = {};

  if (isEmpty(data.activityTabNotesModalTitle)) {
    errors.activityTabNotesModalTitle = "Title is required";
  }

  if (isEmpty(data.activityTabNotesModalBody)) {
    errors.activityTabNotesModalBody = "Description is required";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
