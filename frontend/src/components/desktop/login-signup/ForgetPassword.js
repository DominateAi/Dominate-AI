import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { sendForgetPasswordLink } from "./../../../store/actions/authAction";
import { withRouter } from "react-router-dom";
import { validateForgotPassword } from "../../../store/validations/workspaceValidation/forgotPasswordValidation";
import store from "./../../../store/store";
import { SET_EMAIL_IN_REDUCER } from "./../../../store/types";
export class ForgetPassword extends Component {
  constructor() {
    super();
    this.state = {
      email: "",
      errors: {},
    };
  }

  /*=========================
      Form event handlers
  ==========================*/

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  onSubmitHandler = (e) => {
    e.preventDefault();
    const { errors, isValid } = validateForgotPassword(this.state);
    if (!isValid) {
      this.setState({ errors });
    } else {
      let workspaceName = window.location.host.split(".")[0];
      this.props.sendForgetPasswordLink(
        this.state.email,
        this.props.history,
        workspaceName
      );
      store.dispatch({
        type: SET_EMAIL_IN_REDUCER,
        payload: this.state.email,
      });
      console.log(this.state.email);
    }
  };

  render() {
    return (
      <Fragment>
        <div className="container-fluid workspace-login-page-main-conatiner">
          <div className="row">
            <div className="col-md-3" />
            <div className="col-md-6">
              <div className="forget-password-block">
                <div className="forget-password-title-block">
                  {/*pb-16 font-18-regular*/}
                  <h1 className="font-24-semibold">Forgot Password</h1>
                  <p className="font-18-medium color-gray">
                    Please enter your registered email. We will send a link to
                    reset your password
                  </p>
                </div>

                <div className="forget-password-content-block">
                  <form noValidate onSubmit={this.onSubmitHandler}>
                    <div className="form-group ">
                      {/* <label htmlFor="email" className="mb-0">
                        Email
                      </label> */}
                      <LoginInputField
                        placeholder="Email"
                        name="email"
                        id="email"
                        type="email"
                        value={this.state.email}
                        onChange={this.handleChange}
                      />
                      {this.state.errors.emailError && (
                        <div className="is-invalid opacity-62">
                          {this.state.errors.emailError}
                        </div>
                      )}
                    </div>
                    <div className="display-inline-block text-right">
                      <Link to="/">
                        <button className="bg-white-btn mr-30">Back</button>
                      </Link>
                      <button
                        type="submit"
                        className="forget-password-send-btn"
                      >
                        Send
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
            <div className="col-md-3" />
          </div>
        </div>
      </Fragment>
    );
  }
}

export default connect(null, { sendForgetPasswordLink })(
  withRouter(ForgetPassword)
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
      />
    </Fragment>
  );
}
