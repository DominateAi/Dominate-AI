import React, { Component, Fragment } from "react";
import Modal from "react-responsive-modal";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { logoutUser } from "./../../../store/actions/authAction";
import isEmpty from "../../../store/validations/is-empty";

export class FreeTrielAndSubscriptionEnded extends Component {
  constructor() {
    super();
    this.state = {};
  }

  logoutHandler = () => {
    this.props.logoutUser();
    this.props.history.push("/login");
  };

  render() {
    const { open, heading, description, role } = this.props;
    let organisationData = JSON.parse(localStorage.getItem("oraganiationData"));
    let isRefundRequested =
      !isEmpty(organisationData) && organisationData.isRefundRequested;

    if (organisationData.planStatus === "TRIAL_OVER") {
      return (
        <Fragment>
          <Modal
            onClose={() => console.log("Unable to close")}
            open={open}
            // onClose={onCloseModal}
            closeOnEsc={true}
            closeOnOverlayClick={false}
            center
            classNames={{
              overlay: "free-triel-subscription-ended-section",
              modal: "customModal customModal--addLead",
              closeButton: "customCloseButton",
            }}
          >
            {/* <span className="closeIconInModal" onClick={onCloseModal} /> */}
            <div className="warning-popup-container text-center">
              <img
                src={require("./../../../assets/img/payment/free_trial_end.svg")}
                alt=""
              />
              <h1>{heading}</h1>
              <p className="mt-3 mb-3">{description}</p>

              <button onClick={this.logoutHandler} className="cancel">
                Logout
              </button>
              {role === "Support" ||
                (role === "Administrator" && (
                  <Link to="/payment">
                    <button className="proceed-payment">Proceed Payment</button>
                  </Link>
                ))}
            </div>
          </Modal>
        </Fragment>
      );
    } else if (organisationData.planStatus === "CANCELLED") {
      return (
        <Fragment>
          <Modal
            onClose={() => console.log("Unable to close")}
            open={open}
            // onClose={onCloseModal}
            closeOnEsc={true}
            closeOnOverlayClick={false}
            center
            classNames={{
              overlay: "free-triel-subscription-ended-section",
              modal: "customModal customModal--addLead",
              closeButton: "customCloseButton",
            }}
          >
            {/* <span className="closeIconInModal" onClick={onCloseModal} /> */}
            <div className="warning-popup-container text-center">
              {/* {description === "notProceedForPayment" ? ( */}
              {/* <img
                  src={require("./../../../assets/img/payment/subscription-end_1.svg")}
                  alt=""
                /> */}
              {/* ) : ( */}
              <img
                src={require("./../../../assets/img/payment/subscription-end_2.svg")}
                alt=""
              />
              {/* )} */}

              {/* {description === "notProceedForPayment" ? (
                <h1>Hi there!</h1>
              ) : ( */}
              <h1>Hello!</h1>
              {/* )} */}

              {/* {description === "notProceedForPayment" ? (
                <p className="mt-3 mb-3">
                  Your refund request post cancellation of free trial is under
                  process and will be completed in <span>1-2 days.</span> Don't
                  Worry! you will be able to subscribe for this workspace post
                  completion of the request. Meanwhile, you can
                </p>
              ) : ( */}
              <p className="mt-3 mb-3">
                Your subscription has ended, but don't worry you can pay now to
                continue using your dominate workspace.
              </p>
              {/* )} */}

              {/* Buttons should display if request is not approved from superadmin */}
              {/* {role === "Support" && isRefundRequested === true && (
                <button onClick={""} className="cancel">
                  Talk to us
                </button>
              )} */}

              {/* {role === "Support" && isRefundRequested === true && (
                <button className="proceed-payment">
                  Create new workspace
                </button>
              )} */}

              {/* Buttons should display if request is approved from superadmin */}

              {role === "Administrator" ||
                (role === "Support" && (
                  <button onClick={this.logoutHandler} className="cancel">
                    Cancel
                  </button>
                ))}

              {role === "Administrator" ||
                (role === "Support" && (
                  <Link to="/payment">
                    <button className="proceed-payment">Pay Now</button>
                  </Link>
                ))}
            </div>
          </Modal>
        </Fragment>
      );
    }
  }
}

export default connect(null, { logoutUser })(
  withRouter(FreeTrielAndSubscriptionEnded)
);
