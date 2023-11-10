import React, { Fragment } from "react";
import Modal from "react-responsive-modal";
import "../common/CustomModalStyle.css";
import { connect } from "react-redux";
import { useState } from "react";
import { Link } from "react-router-dom";

function UserDashboardFreePlanWarning({
  isActive,
  commandCenter,
  dashboard,
  member,
  dashboardScorBoard,
}) {
  const [values, setValues] = useState({ open: false });

  /*===============================
      Model Open Handlers
  =================================*/

  const onOpenModal = () => {
    setValues({ open: true });
  };

  const onCloseModal = () => {
    setValues({ open: false });
  };

  const onNoHandler = () => {
    console.log("handle close");
    setValues({ open: false });
  };

  const renderfreePlanWarning = () => {
    const { open } = values;
    return (
      <Modal
        open={open}
        onClose={onCloseModal}
        closeOnEsc={true}
        closeOnOverlayClick={false}
        center
        classNames={{
          overlay: "customOverlay",
          modal:
            "customModal customModal--addLead customModal--member-log-limit-reached",
          closeButton: "customCloseButton",
        }}
      >
        <span className="closeIconInModal" onClick={onCloseModal} />
        <div className="text-center delete-popup-div delete-popup-div--member">
          <img
            src={require("../../../assets/img/employees/member-log-upgrade.svg")}
            alt="member plan upgrade"
            className="member-log-upgrade-img"
          />
          {/*<h1>You are not allow to add member as you are in free plan lorem</h1>*/}
          <h1 className="font-28-semibold delete-popup-text1">Uh-oh</h1>
          <h2 className="font-18-regular delete-popup-text1">
            Looks like you have reached member limit of your plan
          </h2>
          <h5 className="font-18-semibold">Do you want to upgrade?</h5>
          <div className="row mx-0 align-items-center justify-content-center pt-20">
            <button className="delete-popup-no-btn" onClick={onNoHandler}>
              No, I dont
            </button>
            <Link to="/profile">
              <button className="delete-popup-yes-btn delete-popup-yes-btn--member">
                Yes, Upgrade
              </button>
            </Link>
          </div>
        </div>
      </Modal>
    );
  };

  var userData = JSON.parse(localStorage.getItem("Data"));

  const classNameInMobile = isActive
    ? "font-24-bold floating-btn-options-block__link"
    : "resp-font-12-regular floating-btn-options-block__link";

  return (
    <div>
      <Fragment>
        {userData.role.name === "Administrator" && commandCenter === true && (
          <button className="cmd-centre-block__blue-btn" onClick={onOpenModal}>
            Add Members
          </button>
        )}

        {userData.role.name === "Administrator" && dashboard === true && (
          <div className="new-dashboard-rc-option" onClick={onOpenModal}>
            Member
          </div>
        )}

        {userData.role.name === "Administrator" && member === true && (
          <button
            className="leads-title-block-btn-red-bg mr-30 ml-30"
            onClick={onOpenModal}
          >
            &#43; New Member
          </button>
        )}
        {userData.role.name === "Administrator" && dashboardScorBoard === true && (
          <button className="add-form-btn" onClick={onOpenModal}>
            &#43; New Member
          </button>
        )}
        {renderfreePlanWarning()}
      </Fragment>
    </div>
  );
}

export default UserDashboardFreePlanWarning;
