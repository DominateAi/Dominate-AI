import Validator from "validator";
import isEmpty from "../is-empty";

export const validateAddSequence = (data) => {
  let errors = {};

  console.log(data);

  if (Validator.isEmpty(data.title)) {
    errors.title = "Sequence title is required";
  }

  //   if (Validator.isEmpty(data.email)) {
  //     errors.emailError = "Company email is required";
  //   }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
