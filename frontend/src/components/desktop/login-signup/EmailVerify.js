import React, { Component, Fragment } from "react";
import Modal from "react-responsive-modal";
import isEmpty from "./../../../store/validations/is-empty";
import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import { connect } from "react-redux";
import { withRouter, Link } from "react-router-dom";
import {
  verifyEmailAuthcode,
  patchEmailVerify,
} from "./../../../store/actions/authAction";

export class EmailVerify extends Component {
  constructor() {
    super();
    this.state = {
      verifyEmployeeData: {},
    };
  }

  /*=================================
    Component Lifecycle Method
  ==================================*/
  componentDidMount() {
    // Get Authcode From Pathname
    let authCodePart = this.props.match.params.id;
    console.log(authCodePart);
    let workspaceName = window.location.host.split(".")[0];
    this.props.verifyEmailAuthcode(authCodePart);
  }

  static getDerivedStateFromProps(nextProps, nextState) {
    if (nextProps.verifyEmployeeData !== nextState.verifyEmployeeData) {
      return {
        verifyEmployeeData: nextProps.verifyEmployeeData,
      };
    }
    return null;
  }

  /*==================================
      Reset User Password model
  ===================================*/

  renderSetUserPasswordModel = () => {
    let workspaceName = window.location.host.split(".")[0];
    const { userPasswordModel, verifyEmployeeData } = this.state;
    return (
      <Modal
        open={true}
        onClose={() => console.log("unable to close")}
        closeOnEsc={true}
        closeOnOverlayClick={false}
        center
        classNames={{
          overlay: "customOverlay customOverlay--successMsg",
          modal: " customModal  customModal--verify-email-suggest",
          closeButton: "customCloseButton",
        }}
        /* set-password-modal  customModal--addLead */
      >
        {/* <span className="closeIconInModal" onClick={this.onCloseModal} /> */}
        <div className="set-employee-password email_verified">
          {/*<div className="heading">
            <h3>Email Verification</h3>
      </div>*/}
          <div className="email_verify_sucess_img">
            <img
              //src={require("./../../../assets/img/auth/email-verify.svg")}
              src={require("./../../../assets/img/auth/email-verify-new.svg")}
              alt={""}
            />
          </div>
          {/*<p className="text-center">Email Verified</p>*/}
          <h3 className="font-28-semibold">Verify your mail address</h3>
          <p className="font-18-regular">
            Congratulations! Your email is now succesfully verified
          </p>
          <Link to="/Dashboard">
            <button className="email-verified-go-to-dash" type="submit">
              {/*Back*/}
              Go to Dashboard
            </button>
          </Link>
        </div>
      </Modal>
    );
  };

  renderContent = () => {
    const { verifyEmployeeData, userPasswordModel } = this.state;
    if (isEmpty(verifyEmployeeData)) {
      return (
        <Loader type="Triangle" color="#00BFFF" className="dominate-loader" />
      );
    } else if (verifyEmployeeData.success === true) {
      return this.renderSetUserPasswordModel();
    } else {
      return (
        <Fragment>
          <Modal
            open={true}
            onClose={() => console.log("unable to close")}
            closeOnEsc={true}
            closeOnOverlayClick={false}
            center
            classNames={{
              overlay: "customOverlay customOverlay--successMsg",
              modal: "set-password-modal customModal customModal--addLead",
              closeButton: "customCloseButton",
            }}
          >
            {/* <span className="closeIconInModal" onClick={this.onCloseModal} /> */}
            <div className="set-password-broken-link">
              <div className="heading">
                <h3>Link expired or broken</h3>
              </div>
              <div className="password-content">
                <h3>Link expired or broken</h3>
                <p>
                  The link you have clicked has already been used previously or
                  has expired.
                </p>
                <Link to="/Dashboard">
                  <button type="submit">Back</button>
                </Link>
              </div>
            </div>
          </Modal>
        </Fragment>
      );
    }
  };

  render() {
    return <Fragment>{this.renderContent()}</Fragment>;
  }
}

const mapStateToProps = (state) => ({
  verifyEmployeeData: state.employee.verifyEmployee,
});

export default connect(mapStateToProps, {
  verifyEmailAuthcode,
  patchEmailVerify,
})(withRouter(EmailVerify));
