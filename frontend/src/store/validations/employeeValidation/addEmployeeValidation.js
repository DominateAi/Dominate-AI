import Validator from "validator";
import isEmpty from "../is-empty";

export const validateAddEmployee = (data) => {
  let errors = {};

  //Employee first name validation

  if (
    !Validator.isLength(data.employeesFirstName, { min: 2, max: 30 }) ||
    !Validator.isAlpha(data.employeesFirstName)
  ) {
    errors.employeesFirstName =
      "Member first name must be of 2 to 30 uppercase or lowercase characters";
  }

  if (Validator.isEmpty(data.employeesFirstName)) {
    errors.employeesFirstName = "Member first name is required";
  }

  //Employee Last name validation

  if (
    !Validator.isLength(data.employeesLastName, { min: 2, max: 30 }) ||
    !Validator.isAlpha(data.employeesLastName)
  ) {
    errors.employeesLastName =
      "Member last name must be of 2 to 30 uppercase or lowercase characters";
  }

  if (Validator.isEmpty(data.employeesLastName)) {
    errors.employeesLastName = "Member last name is required";
  }

  //Employee Email validation

  if (!Validator.isEmail(data.employeesEmailId)) {
    errors.employeesEmailId = "Please enter valid email";
  }

  if (Validator.isEmpty(data.employeesEmailId)) {
    errors.employeesEmailId = "Email is required";
  }

  //Employee Job Title validation

  if (
    !Validator.isLength(data.employeesJobTitle, { min: 2, max: 30 }) ||
    !Validator.matches(data.employeesJobTitle, /^[a-zA-Z0-9\s]+$/)
  ) {
    errors.employeesJobTitle = "Job title must be of 2 to 30 characters";
  }

  if (Validator.isEmpty(data.employeesJobTitle)) {
    errors.employeesJobTitle = "Job title is required";
  }

  // Employee worth amount

  // if (Validator.isEmpty(data.empMonthlyTarget)) {
  //   errors.empMonthlyTarget = "Monthly target is required";
  // }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
