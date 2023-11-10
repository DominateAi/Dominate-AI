import Validator from "validator";
import isEmpty from "../is-empty";

export const validateSignUp = (data, pass, confirmPass) => {
  let errors = {};

  // Company Email Validation

  if (!Validator.isEmail(data.companyEmail)) {
    errors.companyEmail = "Please enter valid Company email";
  }

  if (Validator.isEmpty(data.companyEmail)) {
    errors.companyEmail = "Company email is required";
  }

  // First Name Validation

  if (
    !Validator.isLength(data.firstName, { min: 2, max: 30 }) ||
    !Validator.matches(data.firstName, /^[a-zA-Z\s]+$/)
  ) {
    errors.firstName =
      "First name must be of 2 to 30 uppercase or lowercase characters";
  }

  if (!isEmpty(data.firstName) && data.firstName.includes(" ")) {
    console.log("space error");
    errors.firstName = "Space not allowed";
  }

  if (Validator.isEmpty(data.firstName)) {
    errors.firstName = "First name is required";
  }

  // Last Name Validation

  if (
    !Validator.isLength(data.lastName, { min: 2, max: 30 }) ||
    !Validator.matches(data.lastName, /^[a-zA-Z\s]+$/)
  ) {
    errors.lastName =
      "Last name must be of 2 to 30 uppercase or lowercase characters";
  }

  if (!isEmpty(data.lastName) && data.lastName.includes(" ")) {
    console.log("space error");
    errors.lastName = "Space not allowed";
  }

  if (Validator.isEmpty(data.lastName)) {
    errors.lastName = "Last name is required";
  }

  // Password Validation
  if (pass !== undefined) {
    if (!Validator.isLength(pass, { min: 8, max: 30 })) {
      errors.password = "Password must be of 8 to 30 characters";
    }
  }

  if (pass !== undefined) {
    if (
      !Validator.matches(
        pass,
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])/
      )
    ) {
      errors.password =
        "Password must contain at least 8 characters with a mix of special characters, numbers and both upper and lower case";
    }
  }

  if (pass !== undefined) {
    if (Validator.isEmpty(pass)) {
      errors.password = "Password is required";
    }
  }

  // Confirm Password Validation

  if (confirmPass !== undefined) {
    if (!Validator.equals(pass, confirmPass)) {
      errors.confirmPassword = "Confirm password did not match";
    }
  }

  if (confirmPass !== undefined) {
    if (Validator.isEmpty(confirmPass)) {
      errors.confirmPassword = "please confirm your password";
    }
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
