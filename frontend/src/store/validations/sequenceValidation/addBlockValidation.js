import Validator from "validator";
import isEmpty from "../is-empty";

export const validateAddBlock = (data, emailEditorValue) => {
  let errors = {};
  let sequenceMailBody = JSON.parse(localStorage.getItem("sequenceMailBody"));
  let sequenceStepTitle = JSON.parse(localStorage.getItem("sequenceStepTitle"));
  let sequenceStepSubject = JSON.parse(
    localStorage.getItem("sequenceStepSubject")
  );

  console.log(data);

  if (Validator.isEmpty(sequenceStepTitle)) {
    errors.blockName = "Step title is required";
  }

  // if (
  //   Validator.isEmpty(sequenceMailBody) ||
  //   sequenceMailBody === "<p><br></p>"
  // ) {
  //   errors.emailEditorValue = "Mail body is required";
  // }

  if (Validator.isEmpty(sequenceStepSubject)) {
    errors.subject = "subject is required";
  }

  //   if (Validator.isEmpty(data.email)) {
  //     errors.emailError = "Company email is required";
  //   }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
