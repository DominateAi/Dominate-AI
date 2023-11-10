import React from "react";
import Modal from "react-responsive-modal";
import { useState } from "react";
import ReactFlagsSelect from "react-flags-select";
import { countryNameArray } from "../login-signup/countryNameArray";

const AddPaymentAddress = ({
  addPaymentAddresspopup,
  onCloseModal,
  saveAddressHandler,
}) => {
  const [values, setValues] = useState({
    companyAddress: "",
    state: "",
    city: "",
    pincode: "",
  });

  const [selectedCountry, setSelected] = useState("US");

  const [showDetailForm, setshowDetailForm] = useState(false);

  const countryData = countryNameArray;

  /*==================================================
                   handler
  ==================================================*/
  const onchangeHandler = (e) => {
    e.preventDefault();
    setValues({
      ...values,
      [e.target.name]: e.target.value,
    });
  };

  const addDetailsHanlder = () => {
    setshowDetailForm(true);
  };

  // for sorting country accorinding to their country code

  const countryArray = countryData.sort((a, b) => a.localeCompare(b));

  //console.log(countryArray.length,"contry array length");

  const renderAddressForm = () => {
    return (
      <div>
        {/*<div className="justify-content-space-between">*/}
        <div className="add_address_form">
          <h3>Add Address Details</h3>
          <div className="add_address_form_input">
            <form noValidate>
              <div className="row mx-0">
                {/* company address */}
                {/* <div className="col-10 px-0 form-group"> */}
                <div className="col-12 px-0 form-group">
                  <label htmlFor="companyAddress">Company Address</label>
                  <input
                    type="text"
                    name="companyAddress"
                    onChange={onchangeHandler}
                    value={values.companyAddress}
                  />
                </div>
              </div>

              <div className="row mx-0">
                {/* state */}
                <div className="col-10 col-md-6 pl-0 form-group">
                  <label htmlFor="state">State</label>
                  <input
                    type="text"
                    name="state"
                    onChange={onchangeHandler}
                    value={values.state}
                  />
                </div>

                {/* city */}
                <div className="col-10 col-md-6 px-0 form-group">
                  <label htmlFor="city">City</label>
                  <input
                    type="text"
                    name="city"
                    onChange={onchangeHandler}
                    value={values.city}
                  />
                </div>
              </div>

              <div className="row mx-0">
                {/* pincode */}
                <div className="col-10 col-md-6 pl-0 form-group">
                  <label htmlFor="pincode">Pincode</label>
                  <input
                    type="text"
                    pattern="[0-9]*"
                    name="pincode"
                    onChange={onchangeHandler}
                    value={values.pincode}
                    maxLength={6}
                  />
                </div>

                {/* country */}
                <div className="col-10 col-md-6 px-0 form-group">
                  <label htmlFor="country">Country</label>
                  <ReactFlagsSelect
                    selected={selectedCountry}
                    onSelect={(code) => setSelected(code)}
                    countries={countryArray}
                    searchable
                  />
                  {/* <label htmlFor="country">Country</label>
                <input
                  type="text"
                  name="country"
                  onChange={onchangeHandler}
                  value={values.country}
                /> */}
                </div>
              </div>
              <div className="row mx-0 justify-content-end pt-60">
                <button
                  className="save_address"
                  onClick={saveAddressHandler(values, selectedCountry)}
                  type="submit"
                >
                  Save &amp; Pay now
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  };

  const renderWarningMessage = () => {
    return (
      <div className="warning_before_plan_expired_container text-center">
        <div>
          <img
            className="payment-illustration-images"
            src={require("./../../../assets/img/payment/add-address.svg")}
            alt=""
          />

          <p>
            Before proceeding with payment kindly fill your address details!!
          </p>

          <div className={"text-center"}>
            <button onClick={addDetailsHanlder} className="add_address_button">
              Add Details
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      <Modal
        open={addPaymentAddresspopup}
        onClose={onCloseModal}
        closeOnEsc={true}
        closeOnOverlayClick={false}
        center
        classNames={{
          overlay: "customOverlay customOverlay--warning_before_five_days",
          modal:
            "customeModel_warning_befor_subscription_cancel customeModel_warning_befor_subscription_cancel--add-payment warning_before_subscription_cancel",
          closeButton: "customCloseButton",
        }}
      >
        <span className="closeIconInModal" onClick={onCloseModal} />

        {/* logo */}
        {showDetailForm === false
          ? renderWarningMessage()
          : renderAddressForm()}
      </Modal>
    </div>
  );
};

export default AddPaymentAddress;
