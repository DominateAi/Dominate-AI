import React, { useState, useEffect, useRef } from "react";
import { Component, Fragment } from "react";
import { Link, withRouter } from "react-router-dom";
import Alert from "react-s-alert";
import { connect } from "react-redux";
import {
  signUpAction,
  getWorkspace,
  getPlansAction,
  googleSignUpAction,
  loginUser,
} from "../../../store/actions/authAction";
import { PropTypes } from "prop-types";
import { validateSignUp } from "./../../../store/validations/signUpValidation.js/signUpValidation";
import SuccessMessage from "../popups/SuccessMessage";
import isEmpty from "./../../../store/validations/is-empty";
import { maxLengths } from "../../../store/validations/maxLengths/MaxLengths";
import { SET_EMPTY_ERRORS } from "./../../../store/types";
import store from "../../../store/store";
import ReactFlagsSelect from "react-flags-select";
import { getAllInfoByISO } from "iso-country-currency";
import GoogleSocial from "./GoogleSocial";
import FacebookSocial from "./FacebookSocial";
import { SET_LOADER, CLEAR_LOADER } from "./../../../store/types";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
// Requiring lodash library
import debounce from "lodash.debounce";
import { countryNameArray } from "./countryNameArray";
import {
  checkIfUserExist,
  getAllRolesPublic,
} from "./../../../store/actions/authAction";
import Select from "react-select";

function SignUpFormFilds() {
  const dispatch = useDispatch();
  const history = useHistory();
  const [values, setValues] = useState({
    passwordVisible: false,
    nextIndex: 1,

    firstName: "",
    lastName: "",
    companyEmail: "",
    password: "",
    confirmPassword: "",
    displayConfirmPassword: false,

    errors: {},
    status: "",
    signUpUserInfo: {},
    selectedCountry: "IN",
  });

  const [userExist, setUserExist] = useState(false);
  const [rolesOption, setRolesOption] = useState([]);
  const [selectedRole, setSelectedRole] = useState({});

  const workspaceError = useSelector(
    (state) => !isEmpty(state.errors.errors) && state.errors.errors.exist
  );

  const countryData = countryNameArray;

  // for sorting country accorinding to their country code

  const countryArray = countryData.sort((a, b) => a.localeCompare(b));

  //console.log(countryArray.length,"contry array length");

  useEffect(() => {
    async function fetchMyAPI() {
      let response = await dispatch(checkIfUserExist());
      let rolesResponse = await dispatch(getAllRolesPublic());

      if (!isEmpty(response.data.data)) {
        setUserExist(true);
      } else {
        setUserExist(false);
      }

      if (!isEmpty(rolesResponse.data)) {
        let rolesOption = [];
        rolesResponse.data.forEach((ele) => {
          rolesOption.push({ value: ele._id, label: ele.name });
        });
        setRolesOption(rolesOption);
      }
    }
    fetchMyAPI();
  }, []);

  useEffect(() => {
    if (!isEmpty(workspaceError)) {
      setValues({
        ...values,
        workspaceError: workspaceError,
      });
    } else {
      setValues({
        ...values,
        workspaceError: "",
      });
    }
  }, [workspaceError]);

  const onSelectRoleDropdownSelect = (e) => {
    setSelectedRole(e);
  };

  // debounce start
  // const debouncedSave = useRef(
  //   debounce(
  //     (nextValue) => dispatch(getWorkspace(nextValue, callBackWorkspaceCheck)),
  //     1000
  //   )
  //   // will be created only once initially
  // ).current;
  // debounce end

  /*==================================
      on click password visible icon
  ===================================*/

  const onClickPasswordVisible = () => {
    setValues({
      ...values,
      passwordVisible: !values.passwordVisible,
    });
  };

  /*====================================
      Forms Event Handlers
=====================================*/

  const handleChange = (e) => {
    store.dispatch({
      type: SET_EMPTY_ERRORS,
      payload: {},
    });

    setValues({
      ...values,
      [e.target.name]: e.target.value,
      errors: {},
      proceed: false,
    });

    if (e.target.name === "password") {
      setValues({
        ...values,
        displayConfirmPassword: true,
        [e.target.name]: e.target.value,
      });
    }
  };

  const onSubmitHandler = (e) => {
    e.preventDefault();
    var pass = document.getElementById("password").value;
    var confirmPass = document.getElementById("confirmPassword").value;

    const { errors, isValid } = validateSignUp(values, pass, confirmPass);
    // if (!isValid) {
    //   setValues({ ...values, errors });
    // } else if (isValid) {
    console.log(values);

    const newUser = {
      defaultUserEmailId: values.companyEmail.toLowerCase(),
      defaultUserPassword: values.password,
      defaultUserFirstName: values.firstName,
      defaultUserLastName: values.lastName,
      defaultUserCurrency: getAllInfoByISO(
        values.selectedCountry
      ).currency.toLowerCase(),
      features: ["call"],
      role: selectedRole.value,
    };

    dispatch(signUpAction(newUser, userExist, history));
    // }
  };

  // handle next on key enter
  const onFormKeyDown = (e) => {
    e.stopPropagation();
    console.log(values.nextIndex);
    if (e.keyCode === 13 && values.nextIndex !== 6) {
      e.preventDefault();
      handleNext();
    } else if (e.keyCode === 13 && values.nextIndex === 6) {
      e.preventDefault();
      var pass = document.getElementById("password").value;
      var confirmPass = document.getElementById("confirmPassword").value;

      const { errors, isValid } = validateSignUp(values, pass, confirmPass);
      if (!isValid) {
        setValues({ ...values, errors });
      } else if (isValid) {
        console.log(values);

        const newUser = {
          defaultUserEmailId: values.companyEmail,
          defaultUserPassword: values.password,
          defaultUserFirstName: values.firstName,
          defaultUserLastName: values.lastName,
          defaultUserCurrency: getAllInfoByISO(
            values.selectedCountry
          ).currency.toLowerCase(),
          features: ["call"],
        };
        dispatch(signUpAction(newUser, history));
      }
    }
  };

  const handleNext = () => {
    const {
      errors,
      // , isValid
    } = validateSignUp(values);

    if (values.nextIndex === 1) {
      if (errors.firstName) {
        setValues({
          ...values,
          errors,
          nextIndex: values.nextIndex,
        });
      } else {
        setValues({
          ...values,
          nextIndex: values.nextIndex + 1,
          errors: {},
        });
      }
    } else if (values.nextIndex === 2) {
      if (errors.lastName) {
        setValues({
          ...values,
          errors,
          nextIndex: values.nextIndex,
        });
      } else {
        setValues({
          ...values,
          nextIndex: values.nextIndex + 1,
          errors: {},
        });
      }
    } else if (values.nextIndex === 3) {
      if (errors.companyEmail) {
        setValues({
          ...values,
          errors,
          nextIndex: values.nextIndex,
        });
      } else {
        setValues({
          ...values,
          nextIndex: values.nextIndex + 1,
          errors: {},
        });
      }
    } else if (values.nextIndex === 4) {
      if (errors.password || errors.confirmPassword) {
        setValues({
          ...values,
          errors,
          nextIndex: values.nextIndex,
        });
      } else {
        setValues({
          ...values,
          nextIndex: values.nextIndex + 1,
          errors: {},
        });
      }
    } else {
      setValues({
        ...values,
        nextIndex: values.nextIndex + 1,
        errors: {},
      });
    }
  };

  const handleBack = (e) => {
    e.preventDefault();
    const { nextIndex } = values;
    if (nextIndex > 1) {
      setValues({
        ...values,
        nextIndex: nextIndex - 1,
      });
    }
  };

  const backbutton = () => {
    return (
      <button
        onClick={handleBack}
        type="button"
        className="float-left back-btn"
      >
        Back
      </button>
    );
  };

  const finishbutton = () => {
    return (
      <div className="text-right">
        <button onClick={onSubmitHandler} type="button">
          Finish
        </button>
      </div>
    );
  };

  const nextbutton = () => {
    return (
      <div className="text-right">
        <button onClick={handleNext} type="button">
          Next
        </button>
      </div>
    );
  };

  /*===========================
    Render First name field
  ============================*/

  const renderFirstNameField = () => {
    const { errors } = values;
    return (
      <Fragment>
        <div className="form-group">
          {/* <label htmlFor="firstName">First Name*</label> */}
          <h5 className="font-24-bold font-24-bold--signup-login">
            <img
              src={require("../../../assets/img/auth/new-dummy-logo.svg")}
              alt=""
              className="new-dummy-logo-img"
            />
            Enter Your First Name
          </h5>
          <div className="workspace-name-div">
            <SignUpInputField
              placeholder="First Name"
              name="firstName"
              id="firstName"
              type="text"
              value={values.firstName}
              onChange={handleChange}
              maxLength={maxLengths.char30}
              autoFocus={true}
            />
          </div>
          {errors.firstName && (
            <div className="is-invalid">{errors.firstName}</div>
          )}
        </div>
      </Fragment>
    );
  };

  /*============================
      Render Last Name Field
  ==============================*/

  const renderlastNameField = () => {
    const { errors } = values;
    return (
      <Fragment>
        <div className="form-group">
          {/* <label htmlFor="lastName">Last Name*</label> */}
          <h5 className="font-24-bold font-24-bold--signup-login">
            <img
              src={require("../../../assets/img/auth/new-dummy-logo.svg")}
              alt=""
              className="new-dummy-logo-img"
            />
            Enter Your Last Name
          </h5>
          <div className="workspace-name-div">
            <SignUpInputField
              placeholder="Last Name"
              name="lastName"
              id="lastName"
              type="text"
              value={values.lastName}
              onChange={handleChange}
              autoFocus={true}
            />
          </div>
          {errors.lastName && (
            <div className="is-invalid">{errors.lastName}</div>
          )}
        </div>
      </Fragment>
    );
  };

  /*================================
          Render Company Emial
  =================================*/

  const renderCompanyEmailField = () => {
    const { errors } = values;
    return (
      <Fragment>
        <div className="form-group">
          {/* <label htmlFor="companyEmail">Company Email *</label> */}
          <h5 className="font-24-bold font-24-bold--signup-login">
            <img
              src={require("../../../assets/img/auth/new-dummy-logo.svg")}
              alt=""
              className="new-dummy-logo-img"
            />
            Enter Your Email
          </h5>

          <div className="workspace-name-div">
            <SignUpInputField
              placeholder="Company Email"
              name="companyEmail"
              id="companyEmail"
              type="email"
              value={values.companyEmail}
              onChange={handleChange}
              autoFocus={true}
            />
          </div>
          {errors.companyEmail && (
            <div className="is-invalid">{errors.companyEmail}</div>
          )}
        </div>
      </Fragment>
    );
  };

  const renderCountryDropdown = () => {
    return (
      <Fragment>
        {/* <label htmlFor="password">Password*</label> */}
        <h5 className="font-24-bold font-24-bold--signup-login">
          <img
            src={require("../../../assets/img/auth/new-dummy-logo.svg")}
            alt=""
            className="new-dummy-logo-img"
          />
          Enter Your Country Code
        </h5>
        <div className="workspace-name-div">
          <div style={{ width: "100%" }} className="pl-0 form-group">
            {/* <label className="country-label" htmlFor="country">
              Country
            </label> */}
            <ReactFlagsSelect
              selected={values.selectedCountry}
              countries={countryArray}
              onSelect={(code) =>
                setValues({
                  ...values,
                  selectedCountry: code,
                })
              }
              searchable
            />
          </div>
        </div>
        {/* {errors.password && (
        <div className="is-invalid">{errors.password}</div>
      )} */}
      </Fragment>
    );
  };

  const renderRolesField = () => {
    return (
      <Fragment>
        {/* <label htmlFor="password">Password*</label> */}
        <h5 className="font-24-bold font-24-bold--signup-login">
          <img
            src={require("../../../assets/img/auth/new-dummy-logo.svg")}
            alt=""
            className="new-dummy-logo-img"
          />
          Select Role In This Organization
        </h5>
        <div className="workspace-name-div">
          <div style={{ width: "100%" }} className="pl-0 form-group">
            {/* <label className="country-label" htmlFor="country">
              Country
            </label> */}
            <Select
              className="react-select-follow-up-form-container"
              classNamePrefix="react-select-follow-up-form"
              isSearchable={false}
              options={rolesOption}
              value={selectedRole}
              onChange={(e) => onSelectRoleDropdownSelect(e)}
              placeholder="Select"
            />
          </div>
        </div>
        {/* {errors.password && (
        <div className="is-invalid">{errors.password}</div>
      )} */}
      </Fragment>
    );
  };

  /*==============================
         Render Password Field 
  ===============================*/

  const renderPasswordField = () => {
    const { errors, passwordVisible } = values;
    return (
      <Fragment>
        <div className="form-group">
          {/* <label htmlFor="password">Password*</label> */}
          <h5 className="font-24-bold font-24-bold--signup-login font-24-bold--signup-login--pswd">
            <img
              src={require("../../../assets/img/auth/new-dummy-logo.svg")}
              alt=""
              className="new-dummy-logo-img"
            />
            Enter Your Password
          </h5>
          <div className="workspace-name-div">
            {passwordVisible ? (
              <i
                onClick={onClickPasswordVisible}
                className="fa fa-eye-slash fa-lg"
              ></i>
            ) : (
              <i
                onClick={onClickPasswordVisible}
                className="fa fa-eye fa-lg"
              ></i>
            )}

            <SignUpInputField
              placeholder="Password"
              name="password"
              id="password"
              type={values.passwordVisible ? "text" : "password"}
              // value={this.state.password}
              onChange={handleChange}
              autoFocus={true}
            />
          </div>
          {errors.password && (
            <div className="is-invalid">{errors.password}</div>
          )}
        </div>
        {values.displayConfirmPassword && (
          <div className="form-group">
            {/* <label htmlFor="confirmPassword">Confirm Password*</label> */}
            <div className="workspace-name-div">
              <SignUpInputField
                placeholder="Confirm Password"
                name="confirmPassword"
                id="confirmPassword"
                type={values.passwordVisible ? "text" : "password"}
                // value={this.state.confirmPassword}
                onChange={handleChange}
                autoFocus={false}
              />
            </div>
            {errors.confirmPassword && (
              <div className="is-invalid">{errors.confirmPassword}</div>
            )}
          </div>
        )}
      </Fragment>
    );
  };

  // console.log(getAllInfoByISO(values.selectedCountry).currency.toLowerCase());

  const fields =
    values.nextIndex === 1
      ? renderFirstNameField()
      : values.nextIndex === 2
      ? renderlastNameField()
      : // : values.nextIndex === 3
      // ? renderSocialSignupButtons()
      values.nextIndex === 3
      ? renderCompanyEmailField()
      : values.nextIndex === 4
      ? renderPasswordField()
      : renderPasswordField();

  const newFields =
    values.nextIndex === 1
      ? renderFirstNameField()
      : values.nextIndex === 2
      ? renderlastNameField()
      : // : values.nextIndex === 3
      // ? renderSocialSignupButtons()
      values.nextIndex === 3
      ? renderCompanyEmailField()
      : values.nextIndex === 4
      ? renderRolesField()
      : values.nextIndex === 5
      ? renderPasswordField()
      : renderPasswordField();

  const totalFields = userExist ? 5 : 4;

  return (
    <Fragment>
      <form
        className="login-form-fields mt-0"
        noValidate
        onKeyDown={onFormKeyDown}
      >
        {userExist ? newFields : fields}
        {/* {this.renderWorkSpaceField()}
          {this.renderFirstNameField()}
          {this.renderlastNameField()} */}
        <div className={`form-progress-bar form-progress-${values.nextIndex}`}>
          <p>
            (0{values.nextIndex}/{userExist ? "05" : "04"} ){" "}
          </p>
        </div>
        <div>
          {values.nextIndex === totalFields ? (
            <Fragment>
              {backbutton()}
              {finishbutton()}
            </Fragment>
          ) : values.nextIndex >= 2 ? (
            <Fragment>
              {backbutton()}
              {nextbutton()}
            </Fragment>
          ) : (
            <Fragment>
              {/* {referralCodeBtn()}  */}
              {nextbutton()}
            </Fragment>
          )}
        </div>
      </form>
    </Fragment>
  );
}

export default SignUpFormFilds;

/*=====================================
  functinal component of Sign Up fields
========================================*/

function SignUpInputField({
  placeholder,
  name,
  id,
  type,
  value,
  onChange,
  autoFocus,
}) {
  return (
    <Fragment>
      <input
        placeholder={placeholder}
        name={name}
        id={id}
        type={type}
        className="form-control-new"
        value={value}
        onChange={onChange}
        autoFocus={autoFocus}
        autoComplete="off"
      />
    </Fragment>
  );
}
