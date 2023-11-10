import Validator from "validator";
import isEmpty from "./../is-empty";

export const validateQuotationItems = (data) => {
  const dataArray = data;
  const errorArray = {};
  let isValid = true;

  console.log(data);
  dataArray.forEach((element, index) => {
    let errorObj = {};

    if (Validator.isEmpty(element.productItem)) {
      errorObj.productItem = "Product item is required";
    }
    if (Validator.isEmpty(element.itemDescription)) {
      errorObj.itemDescription = "Item description is required";
    }
    // select lead
    if (Validator.isEmpty(element.itemQuantity)) {
      errorObj.itemQuantity = "Item quantity is required";
    }
    // select lead
    if (Validator.isEmpty(element.itemRate.toString())) {
      errorObj.itemRate = "Item rate is required";
    }
    errorArray[index] = errorObj;
    if (!isEmpty(errorObj)) {
      isValid = false;
    }
  });

  return {
    errors: errorArray,
    isValid: isValid,
  };
};
