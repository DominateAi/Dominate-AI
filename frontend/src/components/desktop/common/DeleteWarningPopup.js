import React from "react";
import Modal from "react-responsive-modal";

function DeleteWarningPopup({
  deleteWarningPopup,
  yesHandlder,
  noHandler,
  title,
}) {
  return (
    <div>
      <Modal
        open={deleteWarningPopup}
        onClose={() => noHandler}
        closeOnEsc={true}
        closeOnOverlayClick={false}
        center
        classNames={{
          overlay: "customOverlay",
          modal:
            "customModal-warning customModal--addLead customModal--delete-popup",
          closeButton: "customCloseButton",
        }}
        /* warning-employee-model */
      >
        <span className="closeIconInModal" onClick={noHandler} />
        <div className="text-center delete-popup-div">
          <img
            src={require("./../../../assets/img/leads-new/delete-popup-img.svg")}
            alt="delete"
            className="delete-popup-img"
          />
          <h1 className="font-28-semibold delete-popup-text1">
            {title === "lead"
              ? "Are you sure want to archive ?"
              : " Are you sure want to delete ?"}
          </h1>
          <p className="font-18-regular delete-popup-text2">
            {title === "lead"
              ? "Yoc can retore it later"
              : `You will loose all data related to this ${title}`}
          </p>
          <div className="row mx-0 align-items-center justify-content-center">
            <button onClick={noHandler} className="delete-popup-no-btn">
              No, Dont
            </button>
            <button onClick={yesHandlder} className="delete-popup-yes-btn">
              Yes, {title === "lead" ? "Archive" : "Delete"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default DeleteWarningPopup;
