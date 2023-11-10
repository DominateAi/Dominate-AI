import React, { useState, useEffect } from "react";
import AddEmployeesFormFields from "../employees/AddEmployeesFormFields";
import AccountsTextarea from "../common/AccountsTextarea";
import isEmpty from "../../../store/validations/is-empty";
import { useDispatch } from "react-redux";
import { updateProductOrServiceById } from "./../../../store/actions/productAndSevicesAction";
import { validateEditProduct } from "./../../../store/validations/productAndServiceValidation/editProductValidation";
import { maxLengths } from "./../../../store/validations/maxLengths/MaxLengths";

export default function EditProducts({ isEdit, itemData, setIsOpen }) {
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

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!isEmpty(itemData)) {
      setValues({
        productTitle: itemData.name,
        productCode: itemData.code,
        vendorName: itemData.vendor,
        unitPrice: itemData.cost,
        tax: itemData.tax,
        productDesc: itemData.description,
      });
    }
  }, [itemData]);
  /*============================================================
      
                              handler
    
      ============================================================*/
  const handleChange = (event) => {
    setErrors({});
    setValues({
      ...values,
      [event.target.name]: event.target.value,
    });
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

  const callBackEditProduct = (status) => {
    if (status === 200) {
      setIsOpen(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { errors, isValid } = validateEditProduct(values);

    if (!isValid) {
      setErrors(errors);
    } else {
      const formData = itemData;
      formData.name = values.productTitle;
      formData.code = values.productCode;
      formData.vendor = values.vendorName;
      formData.cost = values.unitPrice;
      formData.tax = values.tax;
      formData.description = values.productDesc;
      dispatch(
        updateProductOrServiceById(formData, formData._id, callBackEditProduct)
      );
    }
  };

  return (
    <>
      {isEdit === "edit" ? (
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
                  error={errors.productTitle}
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
                  //error={errors.addTagInputValue}
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
                  //error={errors.addTagInputValue}
                  pattern={"[0-9]*"}
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
                  error={errors.productCode}
                />
                <AddEmployeesFormFields
                  checkboxClass="add-products-form-row"
                  //type="number"
                  type="text"
                  htmlFor={"unitPrice"}
                  labelName={"Enter Unit Price"}
                  id={"unitPrice"}
                  name={"unitPrice"}
                  placeholder={"Ex. 13000/-"}
                  onChange={handleChange}
                  value={values.unitPrice}
                  maxLength={maxLengths.num6}
                  pattern={"[0-9]*"}
                  error={errors.unitPrice}
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
            <div className="pt-25 text-right">
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
      ) : (
        <>
          {/**======================================
              
                     form disply
              
            *=========================================*/}
          <form noValidate>
            <div className="row mx-0">
              <div className="col-6 px-0">
                <AddEmployeesFormFields
                  checkboxClass="add-products-form-row"
                  type="text"
                  htmlFor={"productTitle"}
                  labelName={"Product Title"}
                  id={"productTitle"}
                  name={"productTitle"}
                  placeholder={"Lorem Ipsum"}
                  onChange={handleChange}
                  value={values.productTitle}
                  //maxLength={maxLengths.char30}
                  //error={errors.addTagInputValue}
                  isDisable={true}
                />
                <AddEmployeesFormFields
                  checkboxClass="add-products-form-row"
                  type="text"
                  htmlFor={"vendorName"}
                  labelName={"Vendor Name"}
                  id={"vendorName"}
                  name={"vendorName"}
                  placeholder={"Lorem Ipsum"}
                  onChange={handleChange}
                  value={values.vendorName}
                  //maxLength={maxLengths.char30}
                  //error={errors.addTagInputValue}
                  isDisable={true}
                />
                <AddEmployeesFormFields
                  checkboxClass="add-products-form-row"
                  type="text"
                  htmlFor={"tax"}
                  labelName={"TAX amount (if taxable) "}
                  id={"tax"}
                  name={"tax"}
                  placeholder={"Lorem Ipsum"}
                  onChange={handleChange}
                  value={values.tax}
                  maxLength={maxLengths.num2}
                  pattern={"[0-9]*"}
                  //error={errors.addTagInputValue}
                  isDisable={true}
                />
              </div>
              <div className="col-6 p-0">
                <AddEmployeesFormFields
                  checkboxClass="add-products-form-row"
                  type="text"
                  htmlFor={"productCode"}
                  labelName={"Product Code"}
                  id={"productCode"}
                  name={"productCode"}
                  placeholder={"Lorem Ipsum"}
                  onChange={handleChange}
                  value={values.productCode}
                  //maxLength={maxLengths.char30}
                  //error={errors.addTagInputValue}
                  isDisable={true}
                />
                <AddEmployeesFormFields
                  checkboxClass="add-products-form-row"
                  type="text"
                  htmlFor={"unitPrice"}
                  labelName={"Unit Price"}
                  id={"unitPrice"}
                  name={"unitPrice"}
                  placeholder={"Lorem Ipsum"}
                  onChange={handleChange}
                  value={values.unitPrice}
                  maxLength={maxLengths.num6}
                  pattern={"[0-9]*"}
                  //error={errors.addTagInputValue}
                  isDisable={true}
                />
                <AccountsTextarea
                  checkboxClass="add-products-form-row"
                  htmlFor="productDesc"
                  labelName="Product Description"
                  value={values.productDesc}
                  onChange={handleChange}
                  //error={errors.accountsBillingAddress}
                  isDisabled={true}
                />
              </div>
            </div>{" "}
            {/*<div className="pt-25 text-right">
              <button
                // type="submit"
                onClick={handleSubmit}
                className="new-save-btn-blue"
              >
                Save
              </button>
      </div>*/}
          </form>
        </>
      )}
    </>
  );
}
