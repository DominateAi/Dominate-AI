import React, { useState, useEffect } from "react";
import check from "../../../assets/img/sales-contact/check.svg";
import save from "../../../assets/img/sales-contact/save.svg";
import isEmpty from "./../../../store/validations/is-empty";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
import { connect } from "react-redux";
import store from "./../../../store/store";
import {
  SET_SELECTED_CONTACTS,
  SET_CONTACT_VALIDATION_ERROR,
} from "./../../../store/types";
// phone flags country code
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useSelector } from "react-redux";

function ImportToLeadsModelTwoCardEdit({ cardData }) {
  const phoneInput = React.useRef(null);
  React.useEffect(() => {
    phoneInput.current.focus();
  }, []);

  const [values, setValues] = useState({
    change: true,
    phone: "",
    email: "",
    contactsPhoneCountryNumber: "",
    selectedContacts: [],
  });

  const [errors, setErrors] = useState({});

  const selectedContacts = useSelector(
    (state) => state.contact.selectedContacts
  );

  const validationErrors = useSelector(
    (state) => state.contact.validationErrors
  );

  useEffect(() => {
    if (!isEmpty(selectedContacts)) {
      setValues({
        ...values,
        selectedContacts: selectedContacts,
      });
    }
  }, [selectedContacts]);

  useEffect(() => {
    if (!isEmpty(validationErrors)) {
      setErrors(validationErrors);
    } else {
      setErrors({});
    }
  }, [validationErrors]);

  //       const changeImage = () => {
  //     this.setState((state) => ({ change: !state.change }));
  //     console.log(this.state);
  //   };

  //   getImageName = () => (this.state.change ? "save" : "check");

  //   const handleDropdownChange = (e) => {
  //     th({ assignLead: e, statusLeadValue: e.value });
  //     console.log(`Option selected:`, e);
  //   };

  const onChangeEmailHanlder = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value,
    });

    // console.log(this.state.selectedContacts);
    const { selectedContacts } = values;
    let tempData = selectedContacts;
    if (!isEmpty(tempData)) {
      tempData.forEach((element) => {
        if (element._id === cardData._id) {
          element.email = e.target.value;
        }
      });
    }

    store.dispatch({
      type: SET_SELECTED_CONTACTS,
      payload: tempData,
    });
    store.dispatch({
      type: SET_CONTACT_VALIDATION_ERROR,
      payload: {},
    });
  };

  const onPhoneCodeChangeHandler = (code) => {
    const { selectedContacts } = values;
    let tempData = selectedContacts;

    setValues({ ...values, contactsPhoneCountryNumber: code });
    if (!isEmpty(tempData)) {
      tempData.forEach((element) => {
        console.log(element, cardData);
        if (element._id === cardData._id) {
          element.additionalInfo.phoneCode = "+" + code;
        }
      });
    }
    store.dispatch({
      type: SET_SELECTED_CONTACTS,
      payload: tempData,
    });
  };

  const phoneChangeHandler = (e) => {
    const { selectedContacts } = values;
    let tempData = selectedContacts;

    setValues({ ...values, phone: e.target.value });
    if (!isEmpty(tempData)) {
      tempData.forEach((element) => {
        console.log(element, cardData);
        if (element._id === cardData._id) {
          element.phone = e.target.value;
        }
      });
    }
    store.dispatch({
      type: SET_SELECTED_CONTACTS,
      payload: tempData,
    });
    store.dispatch({
      type: SET_CONTACT_VALIDATION_ERROR,
      payload: {},
    });
  };

  const removeContactHanlder = () => {
    const { selectedContacts } = values;
    let tempData = selectedContacts;

    let filteredData = tempData.filter((ele) => ele._id !== cardData._id);

    store.dispatch({
      type: SET_SELECTED_CONTACTS,
      payload: filteredData,
    });
  };

  return (
    <div className="import-to-lead-modal-two-card-inner-div">
      <div className="import-to-lead-modal-two-card-div">
        <h5 className="font-20-semibold import-to-lead-modal-lead-name">
          {cardData.name}
        </h5>

        <div className="row mx-0 import-to-leads-modal-two-card-row flex-nowrap align-items-end ">
          <div className="import-to-leads-modal-two-card-colm-two-card-edit mr-40 ml-30">
            <h5 className="import-to-leads-modal-two-card-subtitle import-to-leads-modal-two-card-subtitle--card-edit">
              phone number
            </h5>
            <div className="row mx-0 align-items-start flex-nowrap import-to-leads-modal-two-card-colm-phone-input">
              <PhoneInput
                country={"us"}
                value={values.contactsPhoneCountryNumber}
                onChange={
                  (contactsPhoneCountryNumber) =>
                    onPhoneCodeChangeHandler(contactsPhoneCountryNumber)
                  // this.setState({ contactsPhoneCountryNumber })
                }
              />
              <input
                type="number"
                name="phone"
                value={values.phone}
                onChange={phoneChangeHandler}
                ref={phoneInput}
                // autoFocus={true}
              />
            </div>
            {isEmpty(errors[cardData._id]) ||
              (errors[cardData._id] !== undefined && (
                <div className="is-invalid">{errors[cardData._id].phone}</div>
              ))}
            {/* <div className="import-to-leads-modal-two-card-text-div">
              <h5 className="font-16-semibold">
                {cardData.additionalInfo.phoneCode + cardData.phone}
              </h5>
            </div> */}
          </div>

          <div className="import-to-leads-modal-two-card-colm-two-card-edit">
            <h5 className="import-to-leads-modal-two-card-subtitle import-to-leads-modal-two-card-subtitle--card-edit">
              email address
            </h5>
            <input
              className="import-to-leads-modal-two-card-text-div--input"
              type="text"
              name="email"
              value={values.email}
              onChange={onChangeEmailHanlder}
            />
            {isEmpty(errors[cardData._id]) ||
              (errors[cardData._id] !== undefined && (
                <div className="is-invalid">{errors[cardData._id].email}</div>
              ))}
          </div>
          <div className="import-to-leads-modal-two-card-save-div">
            {/* <img
              className="import-to-leads-modal-two-card-save-img"
              src={imagesimport store from '../../../store/store';
Path[imageName]}
              alt={this.imageName}
              onClick={this.changeImage}
            /> */}
          </div>
        </div>
      </div>
      <div
        className="import-to-lead-modal-two-card-close-div"
        onClick={removeContactHanlder}
      >
        <img
          src={require("../../../../src/assets/img/accounts/accounts-contact-leads-remove.svg")}
          alt="remove"
        />
      </div>
    </div>
  );
}

export default ImportToLeadsModelTwoCardEdit;
