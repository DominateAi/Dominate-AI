import Validator from "validator";
import isEmpty from "./../is-empty";

export const validateImportToLead = (data) => {
  const dataArray = data;
  const errorArray = {};
  let isValid = true;

  let incompleteContacts = [];
  if (!isEmpty(data)) {
    data.forEach((ele) => {
      if (isEmpty(ele.phone) || isEmpty(ele.email)) {
        incompleteContacts.push(ele);
      } else {
      }
    });
  }

  //   console.log(incompleteContacts);
  incompleteContacts.forEach((element, index) => {
    let errorObj = {};
    if (Validator.isEmpty(element.email)) {
      errorObj.email = "Contact email is required";
    } else if (!isEmpty(element.email)) {
      errorObj.email = "";
    }
    if (Validator.isEmpty(element.phone)) {
      errorObj.phone = "Contact phone is required";
    } else if (!isEmpty(element.phone)) {
      errorObj.phone = "";
    }
    // // select lead
    // if (Validator.isEmpty(element.itemQuantity)) {
    //   errorObj.itemQuantity = "Item quantity is required";
    // }
    // // select lead
    // if (Validator.isEmpty(element.itemRate.toString())) {
    //   errorObj.itemRate = "Item rate is required";
    // }
    errorArray[element._id] = errorObj;
    if (!isEmpty(errorObj)) {
      isValid = false;
    }
  });

  return {
    errors: errorArray,
    isValid: isValid,
  };
};
