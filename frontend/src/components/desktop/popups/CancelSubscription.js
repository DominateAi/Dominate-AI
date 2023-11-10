import React from "react";
import Modal from "react-responsive-modal";

const CancelSubscription = ({
  cancelSubscriptionPopup,
  onCloseHandler,
  cancelSubscriptionHandler,
}) => {
  return (
    <div>
      <Modal
        open={cancelSubscriptionPopup}
        onClose={onCloseHandler}
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
        <span className="closeIconInModal" onClick={onCloseHandler} />

        {/* logo */}
        <div className="warning_before_plan_expired_container text-center">
          <div className="text-center">
            <img
              className="payment-illustration-images"
              src={require("./../../../assets/img/payment/cancel-sub.svg")}
              alt=""
            />
            <h3>Are you sure you want to cancel your subscription?</h3>
            <p>We have more exciting stuff coming on the way!</p>
            <div className="button_section">
              <button onClick={onCloseHandler} className="later_button">
                No
              </button>

              <button
                onClick={cancelSubscriptionHandler}
                className="upgrade_button"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CancelSubscription;
