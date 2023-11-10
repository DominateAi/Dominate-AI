import React, { Component, Fragment } from "react";
import Modal from "react-responsive-modal";
import isEmpty from "./../../../store/validations/is-empty";
import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import { connect } from "react-redux";
import { withRouter, Link } from "react-router-dom";
import { verifyEmailLinkSend } from "./../../../store/actions/authAction";
import { SET_WALKTHROUGH_PAGE } from "./../../../store/types";
import store from "../../../store/store";

export class EmailVerifySuggest extends Component {
  constructor() {
    super();
    this.state = {
      emailVerifySuggest: true,
    };
  }

  /*=================================
    Component Lifecycle Method
  ==================================*/
  componentDidMount() {
    // Get Authcode From Pathname
    let authCodePart = this.props.match.params.id;
    // console.log(authCodePart);
    let workspaceName = window.location.host.split(".")[0];
    // this.props.verifyUserAction(authCodePart, workspaceName);
  }

  /*==================================
      User Email Verify Suggestion
  ===================================*/

  callBackVerifyLinkSend = (data) => {
    this.setState({
      verifyStatus: data,
    });
  };

  doItLaterHandler = () => {
    let userData = JSON.parse(localStorage.getItem("Data"));
    localStorage.setItem("emailVerify", false);
    this.setState({
      emailVerifySuggest: false,
    });
    if (!isEmpty(userData) && userData.demo === true) {
      store.dispatch({
        type: SET_WALKTHROUGH_PAGE,
        payload: "dashboard-1",
      });
    }
  };

  verifyLinkSendHandler = () => {
    this.props.verifyEmailLinkSend(this.callBackVerifyLinkSend);
  };

  onCloseModal = () => {
    let userData = JSON.parse(localStorage.getItem("Data"));
    localStorage.setItem("emailVerify", false);
    this.setState({
      emailVerifySuggest: false,
    });
    if (!isEmpty(userData) && userData.demo === true) {
      store.dispatch({
        type: SET_WALKTHROUGH_PAGE,
        payload: "dashboard-1",
      });
    }
  };

  renderEmailVerifySuggestion = () => {
    const { emailVerifySuggest, verifyStatus } = this.state;
    return (
      <Modal
        open={emailVerifySuggest}
        onClose={() => console.log("unable to close")}
        closeOnEsc={true}
        closeOnOverlayClick={false}
        center
        classNames={{
          overlay: "customOverlay",
          modal: "customModal customModal--verify-email-suggest",
          closeButton: "customCloseButton",
        }}
      >
        <span className="closeIconInModal" onClick={this.onCloseModal} />
        {/* <div className="set-employee-password"> */}
        {!isEmpty(verifyStatus) && verifyStatus.success ? (
          <div className="email_suggestion_popup">
            {/*<div className="heading">
              <h3>Verify your mail address</h3>
        </div>*/}
            <div>
              {" "}
              <img
                //src={require("./../../../assets/img/auth/email2.svg")}
                src={require("./../../../assets/img/auth/email2-new.svg")}
                alt={""}
              />
            </div>
            {/*<div className="d-flex justify-content-center">*/}
            <h3 className="font-28-semibold">Verify your mail address</h3>
            {/*<p>
                verification mail has been sent to your registered mail. Please
                check your inbox to verify
              </p>*/}
            <p className="font-18-regular">
              A Verification mail has been sent to your mail address. Kindly
              Verify
              <br />
              to start using Dominate.
            </p>
            {/*</div>*/}
            <button
              className="verify_email_btn verify_email_btn--got-it"
              onClick={this.onCloseModal}
            >
              Got it
            </button>
          </div>
        ) : (
          <>
            <div className="email_suggestion_popup">
              {/*<div className="heading">
                <h3>Verify your email i.d</h3>
          </div>*/}
              <div>
                {" "}
                <img
                  //src={require("./../../../assets/img/auth/email1.svg")}
                  src={require("./../../../assets/img/auth/email1-new.svg")}
                  alt={""}
                />
              </div>
              <h3 className="font-28-semibold">Verify your mail address</h3>
              <p className="font-18-regular">
                Do you want to verify your mail address right now?
              </p>
              <div className="d-flex justify-content-center">
                <button
                  className="do_it_later_btn"
                  onClick={this.doItLaterHandler}
                >
                  No, do it later
                  {/*Do It Later/*/}
                </button>
                <button
                  className="verify_email_btn"
                  onClick={this.verifyLinkSendHandler}
                >
                  Yes, Verify
                  {/*Verify Email*/}
                </button>
              </div>
            </div>
          </>
        )}

        {/* </div> */}
      </Modal>
    );
  };

  render() {
    return <Fragment>{this.renderEmailVerifySuggestion()}</Fragment>;
  }
}

export default connect(null, { verifyEmailLinkSend })(
  withRouter(EmailVerifySuggest)
);
