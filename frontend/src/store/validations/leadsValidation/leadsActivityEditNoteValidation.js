// import Validator from "validator";
import isEmpty from "../is-empty";

export const validateLeadActivityEditNote = (data) => {
  let errors = {};
  let noteName = data.noteName;
  let noteDesc = data.noteDesc;

  if (isEmpty(noteName)) {
    errors.noteName = "Title is required";
  }

  if (isEmpty(noteDesc)) {
    errors.noteDesc = "Description is required";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
