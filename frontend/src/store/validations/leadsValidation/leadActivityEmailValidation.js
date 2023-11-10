// import Validator from "validator";
import isEmpty from "../is-empty";

export const validateActivityEmail = (data, activityTabEmailModalBody) => {
  let errors = {};

  // let createTemplateMailSubject = JSON.parse(
  //   localStorage.getItem("createTemplateMailSubject")
  // );

  // let createTemplateMailBody = JSON.parse(
  //   localStorage.getItem("createTemplateMailBody")
  // );

  let createTemplateMailSubject = data.activityTabEmailModalSubject;

  let createTemplateMailBody = data.activityTabEmailModalBody;

  if (isEmpty(createTemplateMailSubject)) {
    errors.activityTabEmailModalSubject = "Subject is required";
  }

  if (
    isEmpty(createTemplateMailBody) ||
    createTemplateMailBody === "<p><br></p>"
  ) {
    errors.activityTabEmailModalBody = "Content is required";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
