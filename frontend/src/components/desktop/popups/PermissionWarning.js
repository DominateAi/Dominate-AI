import React from "react";
import Modal from "react-responsive-modal";

function PermissionWarning({ permissionWarning, onCloseHandler }) {
  return (
    <Modal
      open={permissionWarning}
      onClose={onCloseHandler}
      closeOnEsc={true}
      closeOnOverlayClick={false}
      center
      classNames={{
        overlay: "customOverlay customOverlay--warning_before_five_days",
        modal: "customModal customModal--change-password",
        // customModal--cancel-subscription
        //customeModel_warning_befor_subscription_cancel warning_before_subscription_cancel
        closeButton: "customCloseButton",
      }}
    >
      <span className="closeIconInModal" onClick={onCloseHandler} />

      {/* logo */}
      {/* warning_before_plan_expired_container text-center */}
      <div className="permission-warning-div text-center">
        <img
          className="permission-warning-img"
          //src={require("./../../../assets/img/payment/cancel-sub.svg")}
          src={require("./../../../assets/img/illustrations/permission-warning.svg")}
          alt=""
        />
        <h2 className="font-30-bold">Hey there</h2>
        <h3 className="font-18-medium pt-10">
          It looks like you don’t have the required permissions to view this
          page
        </h3>
        <h4 className="permission-warning-text">
          {/* You do not have the required permissions to access this feature,
          please contact your admin */}
          Dont worry! You can get this sorted by contacting your admin
        </h4>{" "}
      </div>
    </Modal>
  );
}

export default PermissionWarning;
