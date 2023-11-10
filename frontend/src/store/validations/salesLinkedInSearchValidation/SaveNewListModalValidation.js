import Validator from "validator";
import isEmpty from "../is-empty";

export const validateSaveNewListModal = (data) => {
  let errors = {};

  if (!Validator.isLength(data.listName, { min: 2, max: 30 })) {
    errors.listName = "List name must be of 2 to 30 letters";
  }

  if (Validator.isEmpty(data.listName)) {
    errors.listName = "List name is required";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
