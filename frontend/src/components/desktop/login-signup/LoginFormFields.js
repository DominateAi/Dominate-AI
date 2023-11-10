import React, { useState, useEffect, Fragment, useRef } from "react";
import { validateLogin } from "../../../store/validations/workspaceValidation/loginValidation";
import { useDispatch, useSelector } from "react-redux";
import { getWorkspace } from "./../../../store/actions/authAction";
import isEmpty from "../../../store/validations/is-empty";
import Alert from "react-s-alert";
import { maxLengths } from "../../../store/validations/maxLengths/MaxLengths";
import { SET_EMPTY_ERRORS } from "./../../../store/types";
import store from "../../../store/store";
import GoogleSocial from "./GoogleSocial";
import FacebookSocial from "./FacebookSocial";
import {
  loginUser,
  checkWorkspaceAndEmailConnectedOrNot,
} from "./../../../store/actions/authAction";
import cookie from "react-cookies";
import { useHistory } from "react-router-dom";
import { SET_LOADER, CLEAR_LOADER } from "./../../../store/types";
import debounce from "lodash.debounce";

function LoginFormFields() {
  const dispatch = useDispatch();
  const history = useHistory();
  const [values, setValues] = useState({
    workspaceName: "",
    email: "",
    password: "",
    errors: {},
    redirect: false,
    displayWorkspaceField: true,
    workspaceExist: "",
    proceed: false,
  });

  useEffect(() => {
    let workspaceName = window.location.host.split(".")[0];
    // console.log("asdasdasd", workspaceName);
    if (workspaceName !== "login" && process.env.NODE_ENV !== "development") {
      window.location.href = `https://${workspaceName}.dominate.ai/login`;
    } else {
      console.log("main page");
    }
  }, []);

  const workspaceExistStatus = useSelector(
    (state) => state.errors.errors.exist
  );

  const backendError = useSelector((state) => state.errors.errors);

  useEffect(() => {
    if (!isEmpty(workspaceExistStatus)) {
      setValues({
        ...values,
        workspaceExist: workspaceExistStatus,
      });
    } else {
      setValues({
        ...values,
        workspaceExist: "",
      });
    }
  }, [workspaceExistStatus]);

  useEffect(() => {
    if (
      !isEmpty(backendError.data) &&
      backendError.statusText !== undefined &&
      backendError.statusText === "Bad Request"
    ) {
      alert("Invalid credentials please try normal sign in");
      store.dispatch({
        type: CLEAR_LOADER,
      });
    }
  }, [backendError]);

  // debounce start
  const debouncedSave = useRef(
    debounce(
      (nextValue) => dispatch(getWorkspace(nextValue, callBackWorkspaceCheck)),
      1000
    )
    // will be created only once initially
  ).current;
  // debounce end

  /*=========================
      Form event handlers
  ==========================*/

  const handleChange = (e) => {
    const { workspaceName } = values;
    // clearTimeout(this.timer);
    store.dispatch({
      type: SET_EMPTY_ERRORS,
      payload: {},
    });
    setValues({
      ...values,
      errors: {},
      workspaceExist: "",
      proceed: false,
      [e.target.name]: e.target.value,
    });

    // this.timer = setTimeout(this.triggerChange, 1500);
    if (e.target.name === "workspaceName") {
      const { value: nextValue } = e.target;
      debouncedSave(nextValue);
    }
    // setValues({
    //   ...values,
    //   [e.target.name]: e.target.value,
    // });
  };

  const callBackWorkspaceCheck = (response) => {
    console.log(response);
    // setValues({
    //   ...values,
    //   proceed: true,
    // });
  };

  const handleOnClickNext = (e) => {
    e.preventDefault();
    const { workspaceName } = values;
    const { errors } = validateLogin(values);

    if (
      errors.workspaceName === undefined &&
      values.workspaceExist === true
      // &&
      // values.proceed === true
    ) {
      store.dispatch({
        type: SET_LOADER,
      });
      setTimeout(function () {
        store.dispatch({
          type: CLEAR_LOADER,
        });
      }, 1500);
      if (process.env.NODE_ENV === "development") {
        // this.props.history.push("/login");
        setValues({
          ...values,
          displayWorkspaceField: false,
        });
      } else {
        // window.location.href = `https://${workspaceName}.dominate.ai/login`;
        setValues({
          ...values,
          displayWorkspaceField: false,
        });
      }
    } else if (values.workspaceExist === false) {
      Alert.success("<h4>Workspace Not Exist</h4>", {
        position: "top-right",
        effect: "slide",
        beep: false,
        html: true,
        timeout: 5000,
        // offset: 100
      });
    }
    // else if (
    //   errors.workspaceName === undefined &&
    //   this.state.proceed === false
    // ) {
    //   Alert.success("<h4>Please wait for workspace check</h4>", {
    //     position: "top-right",
    //     effect: "slide",
    //     beep: false,
    //     html: true,
    //     timeout: 5000,
    //     // offset: 100
    //   });
    // }
    else {
      setValues({
        ...values,
        errors: {
          workspaceName: errors.workspaceName,
        },
      });
    }
  };

  const onSubmitHandler = (e) => {
    e.preventDefault();
    const { errors, isValid } = validateLogin(values);
    if (!isValid) {
      setValues({ ...values, errors });
    } else {
      setValues({
        ...values,
        redirect: true,
      });
      // this.props.history.push("/dashboard");
    }
  };

  /*=============================
      Render Login Form Fields
  ===============================*/

  const renderWorkSpace = () => {
    return (
      <>
        {/*<p className="login-new-desc-text">
          All your sales data at one place for your convenience.
    </p>*/}
        <h5 className="font-24-bold font-24-bold--signup-login">
          {/*social or email login screen*/}
          <img
            src={require("../../../assets/img/auth/new-dummy-logo.svg")}
            alt=""
            className="new-dummy-logo-img"
          />
          Hi, Welcome back
        </h5>
        <form
          noValidate
          onSubmit={onSubmitHandler}
          className="login-form-fields"
        >
          <div className="form-group">
            {/* <label htmlFor="workspaceName">Workspace name</label> */}
            <div className="workspace-name-div">
              <LoginInputField
                placeholder="Workspace Name"
                name="workspaceName"
                id="workspaceName"
                type="text"
                value={values.workspaceName}
                maxLength={maxLengths.char30}
                onChange={handleChange}
              />
              {/* <p className="d-none d-md-block">.dominate.ai</p> */}
            </div>
            {values.errors.workspaceName ? (
              <div className="is-invalid">{values.errors.workspaceName}</div>
            ) : values.workspaceExist === false &&
              !isEmpty(values.workspaceName) ? (
              <div className="is-invalid">
                This workspace not exist,please sign up
              </div>
            ) : (
              ""
            )}
          </div>
          <div className="text-right">
            <button onClick={handleOnClickNext}>Next</button>
          </div>
        </form>
      </>
    );
  };

  const redirectHandler = (e) => {
    const { workspaceName } = values;
    if (process.env.NODE_ENV === "development") {
      history.push("/login");
    } else {
      window.location.href = `https://${workspaceName}.dominate.ai/login`;
    }
  };

  const renderNextFields = () => {
    return (
      <Fragment>
        <h5 className="font-24-bold font-24-bold--signup-login">
          {/*social or email login screen*/}
          <img
            src={require("../../../assets/img/auth/new-dummy-logo.svg")}
            alt=""
            className="new-dummy-logo-img"
          />
          Hi, Welcome back
        </h5>
        <GoogleSocial responseGoogle={responseGoogle} />
        <FacebookSocial responseFacebook={responseFacebook} />
        <h3 className="login-font-24-regular-text">
          {" "}
          Or <span className="font-24-semibold">Continue </span>{" "}
        </h3>
        <div className="row mx-0 justify-content-center">
          <button onClick={redirectHandler} className="login-with-email-btn">
            {" "}
            Sign in Using Email
          </button>
        </div>
      </Fragment>
    );
  };

  const callBackCheckWorkspace = (res, socialRespone) => {
    console.log(res);
    const { workspaceName } = values;

    if (res === true) {
      if (process.env.NODE_ENV === "development") {
        dispatch(loginUser(socialRespone, history));
      } else {
        //variables
        // var LastReportGenerated = "Jul 11 2013",
        var baseDomain = ".dominate.ai";
        var expireAfter = new Date();

        //setting up  cookie expire date after a week
        expireAfter.setDate(expireAfter.getDate() + 7);

        //now setup cookie
        document.cookie =
          "socialLoginInfo=" +
          JSON.stringify(socialRespone) +
          "; domain=" +
          baseDomain +
          "; expires=" +
          expireAfter +
          "; path=/";

        window.location.href = `https://${workspaceName}.dominate.ai/social-login`;
      }
    } else if (res === false) {
      store.dispatch({
        type: CLEAR_LOADER,
      });
      alert("Email is not exist for this workspace");
      setValues({
        ...values,
        displayWorkspaceField: true,
      });
    }
  };

  const responseGoogle = (response) => {
    const { workspaceName } = values;
    // console.log(response.profileObj);
    if (!isEmpty(response.profileObj)) {
      const checkFormData = {
        workspaceId: values.workspaceName,
        email: response.profileObj.email,
      };
      let socialRespone = {
        email: response.profileObj.email,
        password: response.profileObj.googleId,
      };
      dispatch(
        checkWorkspaceAndEmailConnectedOrNot(
          checkFormData,
          socialRespone,
          callBackCheckWorkspace
        )
      );

      // console.log("set cookies and redirect ", workspaceName);
    }
    // console.log(response.profileObj);
    // setgoogleResponse(response.profileObj);
  };

  const responseFacebook = (response) => {
    if (!isEmpty(response.email)) {
      const checkFormData = {
        workspaceId: values.workspaceName,
        email: response.email,
      };
      let socialRespone = {
        email: response.email,
        password: response.userID,
      };
      dispatch(
        checkWorkspaceAndEmailConnectedOrNot(
          checkFormData,
          socialRespone,
          callBackCheckWorkspace
        )
      );
    } else {
      alert("Please add mailId to your facebook account");
    }
  };

  return (
    <div>
      {" "}
      <Fragment>
        {values.displayWorkspaceField ? renderWorkSpace() : renderNextFields()}
      </Fragment>
    </div>
  );
}

export default LoginFormFields;

// functinal component of login fields

function LoginInputField({ placeholder, name, id, type, value, onChange }) {
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
