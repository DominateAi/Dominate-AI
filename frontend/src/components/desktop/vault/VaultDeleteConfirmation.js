import React from "react";
import Modal from "react-responsive-modal";
import isEmpty from "../../../store/validations/is-empty";
function VaultDeleteConfirmation({
  confirmDeleteModel,
  onCloseHandler,
  yesHandler,
  openModel,
  customText,
  buttonClassName,
}) {
  return (
    <div>
      <button className={buttonClassName} onClick={openModel}>
        {customText ? <>{customText}</> : <i className="fa fa-trash"></i>}
      </button>
      <Modal
        open={confirmDeleteModel}
        onClose={onCloseHandler}
        closeOnEsc={true}
        closeOnOverlayClick={false}
        center
        classNames={{
          overlay: "customOverlay customOverlay--warning_before_five_days",
          modal:
            //"customeModel_warning_befor_subscription_cancel warning_before_subscription_cancel",
            "customModal customModal--addLead customModal--delete-template",
          closeButton: "customCloseButton",
        }}
      >
        <span className="closeIconInModal" onClick={onCloseHandler} />

        {/* logo */}
        {/*warning_before_plan_expired_container text-center */}
        <div className="text-center delete-popup-div delete-popup-div--delete-template">
          <div className="text-center">
            <img
              //className="payment-illustration-images"
              className="delete-template-illustration-images"
              //src={require("./../../../assets/img/payment/cancel-sub.svg")}
              src={require("./../../../assets/img/illustrations/delete-template.svg")}
              alt=""
            />
            {/* email template*/}
            <h3 className="font-30-bold">
              Are you sure you want to{" "}
              {!isEmpty(customText) ? customText : "Delete"} ?
            </h3>
            <p className="font-18-regular">
              {customText === "Inactive"
                ? "You can active it later"
                : "You wont be able retrive it again once deleted"}
            </p>
            <div className="button_section upgrade_button">
              {/** later_button */}
              <button onClick={onCloseHandler} className=" delete-popup-no-btn">
                No
              </button>

              <button onClick={yesHandler} className="delete-popup-yes-btn">
                Yes
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default VaultDeleteConfirmation;
