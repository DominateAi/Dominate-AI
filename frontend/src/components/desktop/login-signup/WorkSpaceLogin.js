import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { loginUser } from "./../../../store/actions/authAction";
import { validateWorkspaceLogin } from "../../../store/validations/workspaceValidation/workspaceValidation";
import isEmpty from "./../../../store/validations/is-empty";
import store from "./../../../store/store";
import { SET_EMPTY_ERRORS } from "./../../../store/types";
import cookie from "react-cookies";

export class WorkSpaceLogin extends Component {
  constructor() {
    super();
    this.state = {
      passwordVisible: false,
      email: "",
      password: "",
      errors: {},
      backendErrors: {},
    };
  }
  /*=============================
        Lifecycle Methods
  ===============================*/
  componentDidMount() {
    let allCookies = cookie.loadAll();
    // console.log(allCookies);
    if (!isEmpty(allCookies.socialLoginInfo)) {
      let parseData = JSON.parse(allCookies.socialLoginInfo);
      // const formData = {
      //   email: parseData.email,
      //   password: parseData.googleId,
      // };
      this.props.loginUser(parseData, this.props.history);
    }

    window.scrollTo(0, 0);
    var data = JSON.parse(localStorage.getItem("Data"));
    var currentDate = new Date();
    var currentTime = currentDate.getTime();
    if (
      this.props.isAuthenticated &&
      this.props.userRole.role.name !== "SuperAdmin" &&
      currentTime < data.tokenExpiresOn
    ) {
      this.props.history.push("/dashboard");
    } else if (
      this.props.isAuthenticated &&
      this.props.userRole.role.name === "SuperAdmin"
    ) {
      this.props.history.push("/organization");
    }
  }

  static getDerivedStateFromProps(nextProps, nextState) {
    if (
      !isEmpty(nextProps.backendErrors) &&
      nextProps.backendErrors !== nextState.backendErrors
    ) {
      return {
        backendErrors: nextProps.backendErrors,
      };
    }
    return null;
  }

  /*==================================
      on click password visible icon
  ===================================*/

  onClickPasswordVisible = () => {
    this.setState({
      passwordVisible: !this.state.passwordVisible,
    });
  };

  /*=========================
      Form event handlers
  ==========================*/

  handleChange = (e) => {
    store.dispatch({
      type: SET_EMPTY_ERRORS,
      payload: {},
    });
    this.setState({
      backendErrors: {},
      errors: {},
    });
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  onSubmitHandler = (e) => {
    e.preventDefault();
    const { errors, isValid } = validateWorkspaceLogin(this.state);

    if (!isValid) {
      this.setState({ errors });
    } else {
      let workspaceName = window.location.host.split(".")[0];
      // if( process.env.NODE_ENV === "development" ){
      //   workspaceName = window.prompt("Running in development mode, so enter the workspace name manually.");
      // }
      const loginUser = {
        email: this.state.email.toLowerCase(),
        password: this.state.password,
      };
      // console.log(loginUser, this.props.history, workspaceName);
      this.props.loginUser(loginUser, this.props.history, workspaceName);
    }
  };

  redirectToSignup = () => {
    this.props.setDefaultTab("two");
    this.props.setdisplayLogin(false);
  };

  render() {
    const { errors, backendErrors, passwordVisible } = this.state;
    let workspaceName = window.location.host.split(".")[0];
    // console.log(this.props.userRole);
    return (
      <Fragment>
        <div className="workspace-login-page-main-conatiner">
          <div className="row workspace-login-page-main-conatiner__row m-0">
            <div>
              {/* <div className="workspace-login-page-main-conatiner__bg-text">
                LOGIN
              </div> */}

              <div className="col-12 p-0">
                {/* <div className="dominate-login-logo">
                  <a
                    href="https://www.dominate.ai"
                    target="_self"
                    rel="noopener noreferrer"
                  >
                    <img
                      src="/img/desktop-dark-ui/logo/logo-color-white.svg"
                      alt="logo"
                    />
                  </a>
                </div> */}

                <div className="workspcae-login-form">
                  {/* <div className="heading"> */}
                  {/* <h1>
                      Login
                      <span className="heading-divider-workspace"></span>
                    </h1>
                    <h5 className="font-24-bold font-24-bold--signup-login mb-0">
                      <img
                        src={require("../../../assets/img/auth/new-dummy-logo.svg")}
                        alt=""
                        className="new-dummy-logo-img"
                      />
                      Welcome to “{workspaceName}”
                    </h5> */}

                  {/*<p className="mb-0">{workspaceName}</p>*/}
                  <div className="is-invalid-login">
                    {errors.emailError ? (
                      errors.emailError
                    ) : errors.passwordError ? (
                      errors.passwordError
                    ) : backendErrors.statusText ? (
                      "Invalid email or password"
                    ) : (
                      <div className="invisible">Invalid email or password</div>
                    )}
                    {/* </div> */}
                  </div>

                  <form noValidate onSubmit={this.onSubmitHandler}>
                    <div className="form-group ">
                      {/* <label htmlFor="email">Email</label> */}
                      <LoginInputField
                        placeholder="Email"
                        name="email"
                        id="email"
                        type="email"
                        value={this.state.email}
                        onChange={this.handleChange}
                      />
                      {/* {errors.emailError && (
                        <div className="is-invalid">{errors.emailError}</div>
                      )} */}
                    </div>
                    <div className="form-group ">
                      {/* <label htmlFor="password">Password</label> */}
                      {passwordVisible ? (
                        <i
                          onClick={this.onClickPasswordVisible}
                          className="fa fa-eye-slash fa-lg"
                        ></i>
                      ) : (
                        <i
                          onClick={this.onClickPasswordVisible}
                          className="fa fa-eye fa-lg"
                        ></i>
                      )}
                      <LoginInputField
                        placeholder="Password"
                        name="password"
                        id="password"
                        type={passwordVisible ? "text" : "password"}
                        value={this.state.password}
                        onChange={this.handleChange}
                      />
                      {/* {errors.passwordError ? (
                        <div className="is-invalid">{errors.passwordError}</div>
                      ) : backendErrors.statusText ? (
                        <div className="is-invalid">
                          Please enter valid password
                        </div>
                      ) : (
                        ""
                      )} */}
                    </div>
                    <div className="pt-20">
                      <div className="forgot-password">
                        <Link to="/forget-password" className="outline-link">
                          <span> Forgot password ?</span>
                        </Link>
                        <br></br>

                        {/* <span
                          onClick={() =>
                            process.env.NODE_ENV === "development"
                              ? this.props.history.push("/")
                              : (window.location.href =
                                  "https://login.dominate.ai")
                          }
                          style={{ color: "gray" }}
                        >
                          {" "}
                          Change Workspace{" "}
                        </span> */}
                      </div>
                      <button type="submit" className="float-right">
                        Login
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
              <div className="col-12 p-0 text-center">
                <h6 className="updates-signup-text">
                  <span className="updates-signup-text__gray">New here ? </span>
                  {/* <a
                    href="https://login.dominate.ai"
                    rel="noopener noreferrer"
                    className="outline-link updates-signup-text__blue"
                  > */}
                  <span
                    onClick={this.redirectToSignup}
                    className="updates-signup-text__blue"
                  >
                    Sign Up
                  </span>
                  {/* </a> */}
                </h6>
                <p className="copyright_text_workspace">
                  © Copyrighted all rights reserved 2021
                </p>
              </div>
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  backendErrors: state.errors.errors,
  isAuthenticated: state.auth.isAuthenticated,
  userRole: state.auth.user,
});

export default connect(mapStateToProps, { loginUser })(
  withRouter(WorkSpaceLogin)
);

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
