import Validator from "validator";
import isEmpty from "../is-empty";

export const validateAddTask = (data) => {
  let errors = {};

  if (!Validator.isLength(data.taskName, { min: 2, max: 30 })) {
    errors.taskName = "Task name must be of 2 to 30 characters";
  }

  if (Validator.isEmpty(data.taskName)) {
    errors.taskName = "Task name is required";
  }

  // if (Validator.isEmpty(data.taskAssignTo)) {
  //   errors.taskAssignTo = "Task assignment is required";
  // }

  // if (isEmpty(data.displayListSelected)) {
  //   errors.displayListSelected = "Task assignment is required";
  // }

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

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
