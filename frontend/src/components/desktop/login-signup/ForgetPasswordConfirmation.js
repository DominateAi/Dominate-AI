import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

export class ForgetPasswordConfirmation extends Component {
  render() {
    return (
      <Fragment>
        <div className="container-fluid workspace-login-page-main-conatiner forget-password-confirmation">
          <div className="d-flex justify-content-center align-items-center h-100">
            <div className="width-587">
              <div className="forget-password-block">
                <div className="forget-password-title-block p-30-41">
                  <h1 className="font-24-semibold">Forgot Password</h1>
                </div>

                <div className="forget-password-content-block p-30">
                  <p className="font-18-regular color-gray width-370 mb-48">
                    A link has been sent to{" "}
                    <b>{`"${this.props.forgetPasswordMail}"`}</b>. Please reset
                    your password with that link.
                  </p>{" "}
                  <div className="display-inline-block text-right">
                    <Link to="/login">
                      <button>Okay</button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  forgetPasswordMail: state.auth.forgetPasswordMail
});

export default connect(mapStateToProps, {})(ForgetPasswordConfirmation);
