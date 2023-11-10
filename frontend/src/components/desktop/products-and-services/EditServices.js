import React, { useState, useEffect } from "react";
import AddEmployeesFormFields from "../employees/AddEmployeesFormFields";
import AccountsTextarea from "../common/AccountsTextarea";
import isEmpty from "../../../store/validations/is-empty";
import { updateProductOrServiceById } from "./../../../store/actions/productAndSevicesAction";
import { useDispatch } from "react-redux";
import { maxLengths } from "./../../../store/validations/maxLengths/MaxLengths";
import { validateEditService } from "./../../../store/validations/productAndServiceValidation/editServiceValidation";

export default function EditServices({ isEdit, itemData, setIsOpen }) {
  const dispatch = useDispatch();
  const [values, setValues] = useState({
    serviceTitle: "",
    serviceType: "",
    serviceVendorName: "",
    serviceUnitPrice: "",
    serviceTax: "",
    serviceDesc: "",
    tax_prev_value: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!isEmpty(itemData)) {
      setValues({
        serviceTitle: itemData.name,
        serviceType: itemData.code,
        serviceVendorName: itemData.vendor,
        serviceUnitPrice: itemData.cost,
        serviceTax: itemData.tax,
        serviceDesc: itemData.description,
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
      console.log(values.serviceTax);
    } else {
      e.target.value = input_value;
      values.tax_prev_value = e.target.value;
      setErrors({});
      setValues({
        ...values,
        [e.target.name]: e.target.value,
      });
      console.log(values.serviceTax, "from else");
    }
  };

  const callBackEditService = (status) => {
    if (status === 200) {
      setIsOpen(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const { errors, isValid } = validateEditService(values);

    if (!isValid) {
      setErrors(errors);
    } else {
      const formData = itemData;
      formData.name = values.serviceTitle;
      formData.code = values.serviceType;
      formData.vendor = values.serviceVendorName;
      formData.cost = values.serviceUnitPrice;
      formData.tax = values.serviceTax;
      formData.description = values.serviceDesc;
      dispatch(
        updateProductOrServiceById(formData, formData._id, callBackEditService)
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
                  htmlFor={"serviceTitle"}
                  labelName={"Enter Service Title"}
                  id={"serviceTitle"}
                  name={"serviceTitle"}
                  placeholder={"Ex. A Webpage"}
                  onChange={handleChange}
                  value={values.serviceTitle}
                  maxLength={maxLengths.char30}
                  error={errors.serviceTitle}
                />
                {/* <AddEmployeesFormFields
                  checkboxClass="add-products-form-row"
                  type="text"
                  htmlFor={"serviceVendorName"}
                  labelName={"Enter Vendor Name"}
                  id={"serviceVendorName"}
                  name={"serviceVendorName"}
                  placeholder={"Ex. SciTech Ltd."}
                  onChange={handleChange}
                  value={values.serviceVendorName}
                  maxLength={maxLengths.char30}
                  //error={errors.addTagInputValue}
                /> */}
                <AddEmployeesFormFields
                  checkboxClass="add-products-form-row"
                  //type="number"
                  type="text"
                  htmlFor={"serviceTax"}
                  labelName={"Enter TAX amount (if taxable) "}
                  id={"serviceTax"}
                  name={"serviceTax"}
                  placeholder={"Ex. 4.5%"}
                  //onChange={handleChange}
                  onChange={handleChangeTax}
                  value={values.serviceTax}
                  //maxLength={maxLengths.num2}
                  //error={errors.addTagInputValue}
                  pattern={"[0-9]*"}
                  error={errors.serviceTax}
                />
              </div>
              <div className="col-6 p-0">
                <AddEmployeesFormFields
                  checkboxClass="add-products-form-row"
                  type="text"
                  htmlFor={"serviceType"}
                  labelName={"Enter Service Code"}
                  id={"serviceType"}
                  name={"serviceType"}
                  placeholder={"Ex. DE123"}
                  onChange={handleChange}
                  value={values.serviceType}
                  maxLength={maxLengths.char10}
                  error={errors.serviceType}
                />
                <AddEmployeesFormFields
                  checkboxClass="add-products-form-row"
                  //type="number"
                  type="text"
                  htmlFor={"serviceUnitPrice"}
                  labelName={"Enter Cost of Service"}
                  id={"serviceUnitPrice"}
                  name={"serviceUnitPrice"}
                  placeholder={"Ex. 13000/-"}
                  onChange={handleChange}
                  value={values.serviceUnitPrice}
                  maxLength={maxLengths.num6}
                  pattern={"[0-9]*"}
                  error={errors.serviceUnitPrice}
                />
                <AccountsTextarea
                  checkboxClass="add-products-form-row"
                  htmlFor="serviceDesc"
                  labelName="Service Description"
                  value={values.serviceDesc}
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
                  htmlFor={"serviceTitle"}
                  labelName={"Service Title"}
                  id={"serviceTitle"}
                  name={"serviceTitle"}
                  placeholder={"Lorem Ipsum"}
                  onChange={handleChange}
                  value={values.serviceTitle}
                  //maxLength={maxLengths.char30}
                  //error={errors.addTagInputValue}
                  isDisable={true}
                />
                {/* <AddEmployeesFormFields
                  checkboxClass="add-products-form-row"
                  type="text"
                  htmlFor={"serviceVendorName"}
                  labelName={"Vendor Name"}
                  id={"serviceVendorName"}
                  name={"serviceVendorName"}
                  placeholder={"Lorem Ipsum"}
                  onChange={handleChange}
                  value={values.serviceVendorName}
                  //maxLength={maxLengths.char30}
                  //error={errors.addTagInputValue}
                  isDisable={true}
                /> */}
                <AddEmployeesFormFields
                  checkboxClass="add-products-form-row"
                  type="text"
                  htmlFor={"serviceTax"}
                  labelName={"TAX amount (if taxable) "}
                  id={"serviceTax"}
                  name={"serviceTax"}
                  placeholder={"Lorem Ipsum"}
                  onChange={handleChange}
                  value={values.serviceTax}
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
                  htmlFor={"serviceType"}
                  labelName={"Service Code"}
                  id={"serviceType"}
                  name={"serviceType"}
                  placeholder={"Lorem Ipsum"}
                  onChange={handleChange}
                  value={values.serviceType}
                  //maxLength={maxLengths.char30}
                  //error={errors.addTagInputValue}
                  isDisable={true}
                />
                <AddEmployeesFormFields
                  checkboxClass="add-products-form-row"
                  type="text"
                  htmlFor={"serviceUnitPrice"}
                  labelName={"Cost of Service"}
                  id={"serviceUnitPrice"}
                  name={"serviceUnitPrice"}
                  placeholder={"Lorem Ipsum"}
                  onChange={handleChange}
                  value={values.serviceUnitPrice}
                  maxLength={maxLengths.num6}
                  pattern={"[0-9]*"}
                  //error={errors.addTagInputValue}
                  isDisable={true}
                />
                <AccountsTextarea
                  checkboxClass="add-products-form-row"
                  htmlFor="serviceDesc"
                  labelName="Service Description"
                  value={values.serviceDesc}
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
