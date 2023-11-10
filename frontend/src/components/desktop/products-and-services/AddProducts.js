import React, { useState, useRef, useEffect } from "react";
import AddEmployeesFormFields from "../employees/AddEmployeesFormFields";
import AccountsTextarea from "../common/AccountsTextarea";
import { useDispatch } from "react-redux";
import {
  createProductOrService,
  checkProductOrServiceIsExist,
} from "./../../../store/actions/productAndSevicesAction";
import { maxLengths } from "./../../../store/validations/maxLengths/MaxLengths";
import { validateAddProduct } from "./../../../store/validations/productAndServiceValidation/addProductValidation";
import debounce from "lodash.debounce";
import isEmpty from "../../../store/validations/is-empty";

export default function AddProducts({ setIsOpen }) {
  const dispatch = useDispatch();

  const [values, setValues] = useState({
    productTitle: "",
    productCode: "",
    vendorName: "",
    unitPrice: "",
    tax: "",
    productDesc: "",
    tax_prev_value: "",
  });

  const [validationErrors, setErrors] = useState({});

  /*============================================================
  
                          handler

  ============================================================*/
  const handleChange = (event) => {
    setErrors({});
    // setDebounceError({});
    const { value: nextValue } = event.target;
    if (event.target.name === "productTitle") {
      const { value: nextValue } = event.target;
      if (!isEmpty(nextValue)) {
        debouncedSave(nextValue);
      }
    }
    if (!isEmpty(values.productTitle)) {
      debouncedSave(values.productTitle);
    }
    setValues({
      ...values,
      [event.target.name]: event.target.value,
    });
  };

  const callBackProductExist = (isExist) => {
    if (isExist === true) {
      validationErrors.productTitle = "Product alredy exist";
      setErrors(validationErrors);
    } else {
      setErrors({});
    }
  };

  // debounce start
  const debouncedSave = useRef(
    debounce(
      (nextValue) =>
        dispatch(
          checkProductOrServiceIsExist(
            { query: { name: nextValue } },
            callBackProductExist
          )
        ),
      1000
    )
    // will be created only once initially
  ).current;
  // debounce end

  const callBackAddProduct = (status) => {
    if (status === 200) {
      console.log("close popup");
      setIsOpen(false);
    }
  };

  const handleOnKeyPress = (event) => {
    const keyCode = event.keyCode || event.which;
    const keyValue = String.fromCharCode(keyCode);
    if (!new RegExp("[0-9]").test(keyValue)) {
      event.preventDefault();
      console.log("Wrong input");
    }
    return;
  };

  const handleChangeTax = (e) => {
    let input_value = e.target.value.replace(/(\.\%)/, ""); //takes care of '.%' case

    if (
      (input_value.search(/^[0]{1,}[\d]/) !== -1 || // takes care of leading zeroes
        input_value.search(/^(\d+)([\.])?([\d]{1,2})?([\%])?$/) === -1) && //main pattern
      input_value !== ""
    ) {
      e.target.value = values.tax_prev_value;
      setErrors({});
      setValues({
        ...values,
        [e.target.name]: e.target.value,
      });
      console.log(values.tax);
    } else {
      e.target.value = input_value;
      values.tax_prev_value = e.target.value;
      setErrors({});
      setValues({
        ...values,
        [e.target.name]: e.target.value,
      });
      console.log(values.tax, "from else");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { errors, isValid } = validateAddProduct(values);

    if (!isValid) {
      setErrors(errors);
    } else if (!isEmpty(validationErrors)) {
      errors.productTitle = "Product already exist";
      setErrors(errors);
    } else {
      const formData = {
        code: values.productCode,
        name: values.productTitle,
        type: "PRODUCT",
        vendor: values.vendorName,
        cost: parseInt(values.unitPrice),
        //tax: parseInt(values.tax),
        tax: parseFloat(values.tax),
        description: values.productDesc,
      };
      dispatch(
        createProductOrService(formData, callBackAddProduct, "Product Created")
      );
    }
    // console.log(values);
  };

  return (
    <>
      <form noValidate>
        <div className="row mx-0">
          <div className="col-6 pl-0">
            <AddEmployeesFormFields
              checkboxClass="add-products-form-row"
              type="text"
              htmlFor={"productTitle"}
              labelName={"Enter Product Title"}
              id={"productTitle"}
              name={"productTitle"}
              placeholder={"Ex. A Webpage"}
              onChange={handleChange}
              value={values.productTitle}
              maxLength={maxLengths.char30}
              error={validationErrors.productTitle}
            />
            <AddEmployeesFormFields
              checkboxClass="add-products-form-row"
              type="text"
              htmlFor={"vendorName"}
              labelName={"Enter Vendor Name"}
              id={"vendorName"}
              name={"vendorName"}
              placeholder={"Ex. SciTech Ltd."}
              onChange={handleChange}
              value={values.vendorName}
              maxLength={maxLengths.char30}
              //error={validationErrors.addTagInputValue}
            />
            <AddEmployeesFormFields
              checkboxClass="add-products-form-row"
              //type="number"
              type="text"
              htmlFor={"tax"}
              labelName={"Enter TAX amount (if taxable) "}
              id={"tax"}
              name={"tax"}
              placeholder={"Ex. 4.5%"}
              //onChange={handleChange}
              onChange={handleChangeTax}
              value={values.tax}
              //maxLength={maxLengths.num2}
              //error={validationErrors.addTagInputValue}
              pattern={"[0-9]*"}
              //onKeyPress={handleOnKeyPress}
            />
          </div>
          <div className="col-6 p-0">
            <AddEmployeesFormFields
              checkboxClass="add-products-form-row"
              type="text"
              htmlFor={"productCode"}
              labelName={"Enter Product Code"}
              id={"productCode"}
              name={"productCode"}
              placeholder={"Ex. DE123"}
              onChange={handleChange}
              value={values.productCode}
              maxLength={maxLengths.char10}
              error={validationErrors.productCode}
            />
            <AddEmployeesFormFields
              checkboxClass="add-products-form-row"
              type="text"
              //type="number"
              htmlFor={"unitPrice"}
              labelName={"Enter Unit Price"}
              id={"unitPrice"}
              name={"unitPrice"}
              placeholder={"Ex. 13000/-"}
              onChange={handleChange}
              value={values.unitPrice}
              maxLength={maxLengths.num6}
              error={validationErrors.unitPrice}
              pattern={"[0-9]*"}
              onKeyPress={handleOnKeyPress}
            />
            <AccountsTextarea
              checkboxClass="add-products-form-row"
              htmlFor="productDesc"
              labelName="Product Description"
              value={values.productDesc}
              onChange={handleChange}
              maxLength={maxLengths.char1000}
              //error={errors.accountsBillingAddress}
            />
          </div>
        </div>{" "}
        <div className="pt-25 text-right add-product-save-btn">
          <button
            // type="submit"
            onClick={handleSubmit}
            className="new-save-btn-blue"
          >
            Save
          </button>
        </div>
      </form>
    </>
  );
}
