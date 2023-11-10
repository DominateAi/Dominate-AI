import React, { useState } from "react";
import AddEmployeesFormFields from "../employees/AddEmployeesFormFields";
import AccountsTextarea from "../common/AccountsTextarea";
import { useDispatch } from "react-redux";
import { createProductOrService } from "./../../../store/actions/productAndSevicesAction";
import { maxLengths } from "./../../../store/validations/maxLengths/MaxLengths";
import { validateAddService } from "./../../../store/validations/productAndServiceValidation/addServiceValidation";

export default function AddServices({ setIsOpen }) {
  const dispatch = useDispatch();
  const [values, setValues] = useState({
    serviceTitle: "",
    serviceCode: "",
    serviceVendorName: "",
    serviceUnitPrice: "",
    serviceTax: "",
    serviceDesc: "",
    tax_prev_value: "",
  });

  const [errors, setErrors] = useState({});

  /*============================================================
      
                              handler
    
   ==============================================================*/
  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value,
    });
    setErrors({});
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

  const callBackAddProduct = (status) => {
    if (status === 200) {
      setIsOpen(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log(values);

    const { errors, isValid } = validateAddService(values);

    if (!isValid) {
      setErrors(errors);
    } else {
      const formData = {
        code: values.serviceCode,
        name: values.serviceTitle,
        type: "SERVICE",
        vendor: values.serviceVendorName,
        cost: parseInt(values.serviceUnitPrice),
        //tax: parseInt(values.serviceTax),
        tax: parseFloat(values.serviceTax),
        description: values.serviceDesc,
      };
      dispatch(
        createProductOrService(formData, callBackAddProduct, "Service Created")
      );
    }
  };

  return (
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
              //maxLength={maxLengths.char30}
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
              //maxLength={maxLengths.char30}
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
            />
          </div>
          <div className="col-6 p-0">
            <AddEmployeesFormFields
              checkboxClass="add-products-form-row"
              type="text"
              htmlFor={"serviceCode"}
              labelName={"Enter Service Code"}
              id={"serviceCode"}
              name={"serviceCode"}
              placeholder={"Ex. DE123"}
              onChange={handleChange}
              value={values.serviceCode}
              maxLength={maxLengths.char10}
              //maxLength={maxLengths.char30}
              error={errors.serviceCode}
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
              error={errors.serviceUnitPrice}
              pattern={"[0-9]*"}
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
  );
}
