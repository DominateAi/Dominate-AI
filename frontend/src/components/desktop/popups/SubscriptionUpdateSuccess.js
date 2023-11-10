import React from "react";
import Modal from "react-responsive-modal";

const SubscriptionUpdateSuccess = ({
  subscriptionUpdateSuccess,
  onCloseHandler,
}) => {
  return (
    <div>
      <Modal
        open={subscriptionUpdateSuccess}
        onClose={onCloseHandler}
        closeOnEsc={true}
        closeOnOverlayClick={false}
        center
        classNames={{
          overlay: "customOverlay customOverlay--warning_before_five_days",
          modal: "customeModel_success_after_subscription_update",
          closeButton: "customCloseButton",
        }}
      >
        <span className="closeIconInModal" onClick={onCloseHandler} />
        <div className="warning_before_plan_expired_container">
          <div>
            <p>
              You have updated your plan and will be charged for new plan
              starting next month as your current plan is in progress.
            </p>
            <div className="button_section">
              <button onClick={onCloseHandler} className="okay_button">
                Okay
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default SubscriptionUpdateSuccess;
