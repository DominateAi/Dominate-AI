import React from "react";
import Modal from "react-responsive-modal";

const CancelSubscriptionSuccess = ({
  cancelSubscriptionSuccess,
  logoutHandler,
}) => {
  return (
    <div>
      <Modal
        open={cancelSubscriptionSuccess}
        onClose={logoutHandler}
        closeOnEsc={true}
        closeOnOverlayClick={false}
        center
        classNames={{
          overlay: "customOverlay customOverlay--warning_before_five_days",
          modal:
            "customeModel_warning_befor_subscription_cancel warning_before_subscription_cancel",
          closeButton: "customCloseButton",
        }}
      >
        <span className="closeIconInModal" onClick={logoutHandler} />

        {/* logo */}
        <div className="warning_before_plan_expired_container text-center">
          <div>
            <img
              className="payment-illustration-images"
              src={require("./../../../assets/img/payment/cancel-befor-5days.svg")}
              alt=""
            />
            <h3>We are sad to see you go so soon!</h3>

            <p>
              Your subscription has now been cancelled and you will not be
              billed from next month.
            </p>

            <div className={"text-center"}>
              <button onClick={logoutHandler} className="go_to_dashboard">
                Exit
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CancelSubscriptionSuccess;
