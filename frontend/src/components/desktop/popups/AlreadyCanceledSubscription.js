import React from "react";
import Modal from "react-responsive-modal";

const AlreadyCanceledSubscription = ({
  canceledSubscriptionPopup,
  onCloseHandler,
}) => {
  return (
    <div>
      <Modal
        open={canceledSubscriptionPopup}
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
          <div>
            <img
              className="payment-illustration-images"
              src={require("./../../../assets/img/payment/cancel-befor-5days.svg")}
              alt=""
            />
            <h3>Subscription Canceled</h3>

            <p>
              Your subscription has been cancelled as you canceled your
              subscription, but don't worry you can pay now to continue using
              your dominate workspace.
            </p>

            <div className={"text-center"}>
              <button onClick={onCloseHandler} className="go_to_dashboard">
                Okay
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AlreadyCanceledSubscription;
