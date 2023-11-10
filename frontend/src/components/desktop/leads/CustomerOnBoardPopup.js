import React from "react";
import Modal from "react-responsive-modal";

function CustomerOnBoardPopup({ customerOnBoardPopup, greatWorkHandler }) {
  return (
    <div>
      <Modal
        onClose={() => console.log("Unable to close")}
        open={customerOnBoardPopup}
        // open={true}
        // onClose={onCloseModal}
        closeOnEsc={true}
        closeOnOverlayClick={false}
        center
        classNames={{
          overlay: "customOverlay",
          modal: "customModal customModal--addLead",
          closeButton: "customCloseButton",
        }}
      >
        {/* <span className="closeIconInModal" onClick={this.logoutHandle} /> */}
        <div className="great_work_model text-center">
          <img
            src={require("./../../../assets/img/leads/great-work.svg")}
            alt=""
          />
          <h3>Great work!</h3>
          <p>
            {/* &ldquo;{leadDataOfStatusChanged.name}&rdquo; Is now onboard.
            <br />
            Lets Add the deal finalized to the workspace. */}
          </p>
          <button onClick={greatWorkHandler}>Add Deal</button>
        </div>
      </Modal>
    </div>
  );
}

export default CustomerOnBoardPopup;
