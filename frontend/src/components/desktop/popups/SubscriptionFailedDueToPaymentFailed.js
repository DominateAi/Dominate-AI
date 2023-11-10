import React, { Component, Fragment } from "react";
import Modal from "react-responsive-modal";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { logoutUser } from "./../../../store/actions/authAction";
import isEmpty from "../../../store/validations/is-empty";
import {
  afterPaymentSuccessAction,
  sendMenualRetry,
  cancelImmediateSubscription
} from "./../../../store/actions/paymentAction";

export class SubscriptionFailedDueToPaymentFailed extends Component {
  constructor() {
    super();
    this.state = {
      open: true,
      cancelSubscriptionWarning: false,
      menualRetryPopup: false,
      manualRetrySucess: false
    };
  }

  /*================================
    Cancel subscription handlers
  =================================*/
  cancelSubscriptionWarning = () => {
    console.log("dssd");
    this.setState({
      cancelSubscriptionWarning: true,
      open: false
    });
  };

  /*=============================
      Razorpay Handler
  ==============================*/
  addNewCardHandler = after => e => {
    let organisationData = JSON.parse(localStorage.getItem("oraganiationData"));

    e.preventDefault();
    console.log("clicked");
    let options = {
      key_id: "rzp_test_dHuLalQnzgiRoc",
      key_secret: "JhBfdBBMnrFya2jTFyH5qXcx",
      // key: "rzp_test_oOhCH5JNFeFkuI",
      subscription_id: organisationData.billingId,
      subscription_card_change: 1,
      amount: "1000", // 2000 paise = INR 20, amount in paisa
      currency: "INR",
      // order_id: this.state.orderIdData.id,
      name: "Dominate",
      description: "Billing",
      image:
        "https://res.cloudinary.com/myrltech/image/upload/v1578390114/Group_1546.svg",
      handler: function(response) {
        // window.location.href = "/payment-success";
        after(response);
        // alert(response.razorpay_payment_id);
        // alert(response.razorpay_order_id);
        // alert(response.razorpay_signature);
      },
      prefill: {
        name: "Harshil Mathur",
        email: "harshil@razorpay.com"
      },
      notes: {
        address: "Hello World"
      },
      theme: {
        color: "#502effab"
      }
    };

    let rzp = new window.Razorpay(options);
    rzp.open();
  };

  /*==================================
      After Payment Sucess Handler
====================================*/
  afterPyment = paymentResponse => {
    console.log(paymentResponse);
    let organisationData = JSON.parse(localStorage.getItem("oraganiationData"));
    console.log(paymentResponse);

    const { orderIdData } = this.state;
    if (paymentResponse) {
      const afterPayment = {
        workspaceId: organisationData.workspaceId,
        organizationId: organisationData._id,
        plan: organisationData.billingType,
        success: true,
        subscriptionId: organisationData.billingId,
        paymentId: paymentResponse.razorpay_payment_id
      };
      this.props.afterPaymentSuccessAction(afterPayment, this.props.history);
    } else {
      console.log("failsed");
    }
  };

  logoutHandler = () => {
    this.props.logoutUser();
    this.props.history.push("/login");
  };

  onCloseModal = () => {
    this.setState({
      cancelSubscriptionWarning: false,
      open: true,
      menualRetryPopup: false
    });
  };

  menualRetryHandle = () => {
    this.setState({
      menualRetryPopup: true
    });
  };

  manualRetryCallback = status => {
    if (status === 200) {
      this.setState({
        manualRetrySucess: true
      });
    }
  };

  sendMenualRetryHandler = () => {
    let organisationData = JSON.parse(localStorage.getItem("oraganiationData"));

    const formData = {
      organisation_id: organisationData._id
    };
    this.props.sendMenualRetry(
      formData,
      this.manualRetryCallback,
      organisationData.workspaceId
    );
  };

  logoutHandle = () => {
    this.props.logoutUser();
  };

  cancelSubscriptionHandler = () => {
    let organisationData = JSON.parse(localStorage.getItem("oraganiationData"));
    const formData = {
      organisation_id: organisationData._id
    };
    this.props.cancelImmediateSubscription(formData);
  };

  renderManualRetrySucess = () => {
    const { manualRetrySucess } = this.state;
    return (
      <Fragment>
        <Modal
          open={manualRetrySucess}
          onClose={this.onCloseModal}
          closeOnEsc={true}
          closeOnOverlayClick={false}
          center
          classNames={{
            overlay: "customOverlay free-triel-subscription-ended-section",
            modal: "customModal customModal--addLead menual_retry_warning",
            closeButton: "customCloseButton"
          }}
        >
          {/* <span className="closeIconInModal" onClick={this.onCloseModal} /> */}

          {/* logo */}
          <div className="subscription_ended_due_to_payment_failed text-center">
            <img
              src={require("./../../../assets/img/payment/manual-retry-sucess.svg")}
              alt=""
            />
            <h3>Your request has been sent.</h3>
            <p>
              If your payment is successful, you will receive confirmation by
              mail and subscription will turn into active state again.
            </p>
            <div className="button_section">
              <button onClick={this.logoutHandle} className="yes-btn">
                Logout
              </button>
            </div>
          </div>
        </Modal>
      </Fragment>
    );
  };

  renderCancelSubscriptionWarning = () => {
    const { cancelSubscriptionWarning } = this.state;
    return (
      <Fragment>
        <Modal
          open={cancelSubscriptionWarning}
          onClose={this.onCloseModal}
          closeOnEsc={true}
          closeOnOverlayClick={false}
          center
          classNames={{
            overlay:
              "customOverlay customOverlay--warning_before_five_days free-triel-subscription-ended-section",
            modal:
              "customeModel_warning_befor_subscription_cancel_payment_failed",
            closeButton: "customCloseButton"
          }}
        >
          {/* <span className="closeIconInModal" onClick={this.onCloseModal} /> */}

          {/* logo */}
          <div className="warning_before_plan_expired_container">
            <div>
              <img
                className="cancel_subscription_img"
                src={require("./../../../assets/img/payment/cancel-sub.svg")}
                alt=""
              />
              <h3>Are you sure you want to cancel your subscription?</h3>
              <p>
                Please note that this cancellation will be effective
                immediately.
              </p>
              <div className="button_section">
                <button onClick={this.onCloseModal} className="no_btn">
                  No,go back
                </button>

                <button
                  onClick={this.cancelSubscriptionHandler}
                  className="yes-btn"
                >
                  Yes,Continue
                </button>
              </div>
            </div>
          </div>
        </Modal>
      </Fragment>
    );
  };

  renderMenualRetryWarning = () => {
    const { menualRetryPopup } = this.state;
    return (
      <Fragment>
        <Modal
          open={menualRetryPopup}
          onClose={this.onCloseModal}
          closeOnEsc={true}
          closeOnOverlayClick={false}
          center
          classNames={{
            overlay: "customOverlay free-triel-subscription-ended-section",
            modal: "customModal customModal--addLead menual_retry_warning",
            closeButton: "customCloseButton"
          }}
        >
          {/* <span className="closeIconInModal" onClick={this.onCloseModal} /> */}

          {/* logo */}
          <div className="subscription_ended_due_to_payment_failed text-center">
            <div className="payment-popup-alert">
              <p>
                <i className="fa fa-exclamation-triangle"></i> Payment failure
              </p>
            </div>
            <img
              src={require("./../../../assets/img/payment/manual-retry.svg")}
              alt=""
            />
            <h3>
              Are you sure you want to request for manual retry? you can only
              try once.{" "}
            </h3>
            <p>
              Please check if your credit/debit card is active and has
              sufficient balance before proceeding.
            </p>
            <div className="button_section">
              <button onClick={this.onCloseModal} className="no_btn">
                No,go back
              </button>
              <button onClick={this.sendMenualRetryHandler} className="yes-btn">
                Yes,Continue
              </button>
            </div>
          </div>
        </Modal>
      </Fragment>
    );
  };

  render() {
    const { open, heading, description, role } = this.props;
    let organisationData = JSON.parse(localStorage.getItem("oraganiationData"));
    let billingInfo =
      !isEmpty(organisationData) && organisationData.billingInfo;
    return (
      <Fragment>
        {this.renderCancelSubscriptionWarning()}
        {this.renderMenualRetryWarning()}
        {this.renderManualRetrySucess()}
        <Modal
          onClose={() => console.log("Unable to close")}
          open={this.state.open}
          // onClose={onCloseModal}
          closeOnEsc={true}
          closeOnOverlayClick={false}
          center
          classNames={{
            overlay: "customOverlay free-triel-subscription-ended-section",
            modal: "customModal customModal--addLead",
            closeButton: "customCloseButton"
          }}
        >
          <span className="closeIconInModal" onClick={this.logoutHandle} />
          <div className="subscription_ended_due_to_payment_failed text-center">
            <div className="payment-popup-alert">
              <p>
                <i className="fa fa-exclamation-triangle"></i> Payment failure
              </p>
            </div>
            <img
              src={require("./../../../assets/img/payment/payment-failed.svg")}
              alt=""
            />
            <h3>Uh-oh!</h3>
            <p>
              Looks like your subscription has paused due to payment failure
            </p>
            <span>Would you like to</span>
            <div className="button_section">
              <button
                className="add_new_card"
                onClick={this.addNewCardHandler(this.afterPyment)}
              >
                Add new card
              </button>
              {billingInfo.isManualRequestGenerated === false && (
                <button
                  className="request_manual_retry"
                  onClick={this.menualRetryHandle}
                >
                  Request manual Retry
                </button>
              )}

              <p
                className="cancel_subscription"
                onClick={this.cancelSubscriptionWarning}
              >
                Cancel Subscription
              </p>
              <hr></hr>
            </div>
            {billingInfo.isManualRequestGenerated === true &&
            billingInfo.isManualRequestFailed === false ? (
              <p className="text-left please_note">
                Please note: You are not seeing the manual retry option because{" "}
                <br></br>your previous request for payment is in progress.
                <br></br> Kindly wait for its completion.
              </p>
            ) : billingInfo.isManualRequestGenerated === true &&
              billingInfo.isManualRequestFailed === true ? (
              <p className="text-left please_note">
                Please note: You are not seeing the manual retry option because
                <br></br>your previous request for payment has failed.
              </p>
            ) : (
              <p className="text-left please_note">
                Please note: If you don't take any action and close this page,
                we will retry auto-debit for 3 days<br></br> from the day first
                payment failure occurred.
              </p>
            )}
          </div>
        </Modal>
      </Fragment>
    );
  }
}

export default connect(null, {
  logoutUser,
  afterPaymentSuccessAction,
  sendMenualRetry,
  cancelImmediateSubscription
})(withRouter(SubscriptionFailedDueToPaymentFailed));
