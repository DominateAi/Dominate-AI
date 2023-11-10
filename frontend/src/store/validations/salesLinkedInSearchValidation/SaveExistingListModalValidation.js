import Validator from "validator";
import isEmpty from "../is-empty";

export const validateSaveExistingListModal = (data) => {
  let errors = {};

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
