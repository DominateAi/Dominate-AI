import React from "react";
import Modal from "react-responsive-modal";

const PaymentFailed = ({ paymentFailedPopup, onCloseHandler }) => {
  return (
    <div>
      <Modal
        open={paymentFailedPopup}
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
              src={require("./../../../assets/img/payment/free_trial_end.svg")}
              alt=""
            />
            <h3>Uh-oh!</h3>

            <p>
              Your subscription has been paused due to payment failure on your
              current card. Please add another card to retry payement
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

export default PaymentFailed;
