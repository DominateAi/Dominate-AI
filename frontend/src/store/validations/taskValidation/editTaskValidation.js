import Validator from "validator";
import isEmpty from "../is-empty";

export const validateEditTask = (data) => {
  let errors = {};

  if (!Validator.isLength(data.taskName, { min: 2, max: 30 })) {
    errors.taskName = "Task name must be of 2 to 30 characters";
  }

  if (Validator.isEmpty(data.taskName)) {
    errors.taskName = "Task name is required";
  }

  if (!Validator.isLength(data.taskDesc, { min: 2, max: 500 })) {
    errors.taskDesc = "Task description must be of 2 to 500 characters";
  }

  if (Validator.isEmpty(data.taskDesc)) {
    errors.taskDesc = "Task description is required";
  }

  // if (data.fromDate === null) {
  //   errors.fromDate = "Please select valid date";
  // }

  // if (data.toDate === null) {
  //   errors.toDate = "Please select valid date";
  // }

  if (isEmpty(data.selectedOption)) {
    errors.selectedOption = "Please select the task status";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
