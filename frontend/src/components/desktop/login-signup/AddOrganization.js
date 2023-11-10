import React, { useState, useEffect, Fragment } from "react";
import {
  createOrganization,
  loginUserAfterSignup,
} from "./../../../store/actions/authAction";
import isEmpty from "./../../../store/validations/is-empty";
import { useDispatch } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";

function AddOrganization() {
  const location = useLocation();
  const dispatch = useDispatch();
  const history = useHistory();
  const [values, setValues] = useState({
    organizationName: "",
    emailId: "",
    companyAddress: "",
    city: "",
    state: "",
    pincode: "",
    country: "",
  });

  useEffect(() => {
    if (!isEmpty(location)) {
      console.log("location", location);
      const {
        state: { signupInfo = {} },
      } = location;
      let payload = {
        email: signupInfo.email,
        password: signupInfo.password,
      };
      dispatch(loginUserAfterSignup(payload));
    }
  }, [location]);

  /*=========================
      Form event handlers
  ==========================*/

  const handleChange = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value,
    });
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    const payload = {
      organizationName: values.organizationName,
      logo: "dsfdfsd",
      defaultUserEmailId: values.emailId,
      address: {
        city: values.city,
        state: values.state,
        pincode: values.pincode,
        line1: values.companyAddress,
        country: values.country,
      },
    };

    let response = await dispatch(createOrganization(payload));
    const { status, data = {} } = response || {};

    if (status === 200) {
      history.push("/");
    }
  };

  return (
    <Fragment>
      <div
        style={{ marginTop: "70px" }}
        className="workspace-login-page-main-conatiner"
      >
        <div className="row workspace-login-page-main-conatiner__row m-0">
          <div>
            <div className="col-12 p-0">
              <div className="workspcae-login-form">
                <form noValidate onSubmit={onSubmitHandler}>
                  <div className="form-group ">
                    <InputField
                      placeholder="Organization Name"
                      name="organizationName"
                      id="organizationName"
                      type="organizationName"
                      value={values.organizationName}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group ">
                    <InputField
                      placeholder="User Email Id"
                      name="emailId"
                      id="emailId"
                      type={"text"}
                      value={values.emailId}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group ">
                    <InputField
                      placeholder="Company Address"
                      name="companyAddress"
                      id="companyAddress"
                      type={"text"}
                      value={values.companyAddress}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group ">
                    <InputField
                      placeholder="City"
                      name="city"
                      id="city"
                      type={"text"}
                      value={values.city}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group ">
                    <InputField
                      placeholder="State"
                      name="state"
                      id="state"
                      type={"text"}
                      value={values.state}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group ">
                    <InputField
                      placeholder="Pincode"
                      name="pincode"
                      id="pincode"
                      type={"number"}
                      value={values.pincode}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group ">
                    <InputField
                      placeholder="Country"
                      name="country"
                      id="country"
                      type={"text"}
                      value={values.country}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="pt-20">
                    <button type="submit" className="float-right">
                      Save Details
                      <img
                        src={require("../../../assets/img/icons/workspace-login-arrow-icon.svg")}
                        alt="next"
                        className="workspace-login-arrow-img"
                      />
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}

export default AddOrganization;

// FUNCTIONAL COMPONENT FOR FIELDSs

function InputField({ placeholder, name, id, type, value, onChange }) {
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
        autoComplete="off"
      />
    </Fragment>
  );
}
