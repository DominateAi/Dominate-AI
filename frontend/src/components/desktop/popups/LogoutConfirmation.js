import React from "react";
import Modal from "react-responsive-modal";

function LogoutConfirmation({
  logoutConfirmModel,
  onCloseHandler,
  yesHandler,
  openModel,
}) {
  return (
    <div>
      {/* <span onClick={this.logoutHandler} className="logout-btn">                
                  <img
                    src="/img/desktop-dark-ui/nav-icons/nav-logout-white.svg"
                    alt="logout-icons"
                  />
                </span> */}
      <span onClick={openModel} className="logout-btn">
        <img
          // src={require("./../../../assets/img/logo/dashboard-logout-icon.svg")}
          src="/img/desktop-dark-ui/nav-icons/nav-logout-white.svg"
          alt="logout-icons"
        />
      </span>
      <Modal
        open={logoutConfirmModel}
        onClose={onCloseHandler}
        closeOnEsc={true}
        closeOnOverlayClick={false}
        center
        classNames={{
          overlay: "customOverlay customOverlay--warning_before_five_days",
          modal:
            //"customeModel_warning_befor_subscription_cancel warning_before_subscription_cancel",
            "customModal customModal--addLead customModal--logout-confirmation",
          closeButton: "customCloseButton",
        }}
      >
        <span className="closeIconInModal" onClick={onCloseHandler} />

        {/* logo */}
        {/**warning_before_plan_expired_container text-center */}
        <div className="text-center delete-popup-div delete-popup-div--confirm-logout">
          <div className="text-center">
            <img
              //className="payment-illustration-images"
              className="user-logout-img"
              //src={require("./../../../assets/img/payment/cancel-sub.svg")}
              src={require("./../../../assets/img/illustrations/user-logout.svg")}
              alt=""
            />
            <h3 className="font-30-bold">Are you sure you want to Logout</h3>
            <div className="button_section">
              {/**later_button  upgrade_button*/}
              <button onClick={onCloseHandler} className="delete-popup-no-btn">
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

export default LogoutConfirmation;
