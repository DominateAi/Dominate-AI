import React from "react";
import Modal from "react-responsive-modal";

const FreeTrialAlmostOver = ({
  freeTrialAlmostOverPopup,
  okayHandler,
  oncloseHandler,
}) => {
  return (
    <div>
      <Modal
        open={freeTrialAlmostOverPopup}
        onClose={oncloseHandler}
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
        <span className="closeIconInModal" onClick={oncloseHandler} />

        {/* logo */}
        <div className="warning_before_plan_expired_container text-center">
          <div>
            <img
              className="payment-illustration-images"
              src={require("./../../../assets/img/payment/cancel-befor-5days.svg")}
              alt=""
            />
            <h3>Your Free Trial is about to end</h3>

            <p>
              Your Dominate Free Trial is ending soon. To Continue using
              Dominate uninterrupted, please add your card details
            </p>

            <div className={"text-center"}>
              <button onClick={okayHandler} className="go_to_dashboard">
                Okay
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default FreeTrialAlmostOver;
