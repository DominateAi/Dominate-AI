import React, { useState } from "react";
import Modal from "react-responsive-modal";
import "../common/CustomModalStyle.css";
import { connect } from "react-redux";
import { addLeadNotes } from "./../../../store/actions/leadsActivityAction";
import { validateLeadActivityAddNote } from "../../../store/validations/leadsValidation/leadActivityAddNoteValidation";
import { useDispatch, useSelector } from "react-redux";
import { maxLengths } from "../../../store/validations/maxLengths/MaxLengths";

function ActivityContentNotesButtonModal() {
  const dispatch = useDispatch();
  const [values, setValue] = useState({
    open: false,
    activityTabNotesModalTitle: "",
    activityTabNotesModalBody: "",
    errors: {},
    noteAddSuccess: false,
  });

  const leadActivityData = useSelector(
    (state) => state.leads.leadActivitySummary
  );

  /*=====================================
        handlers
    ===================================== */

  const handleOnChange = (e) => {
    setValue({
      ...values,
      [e.target.name]: e.target.value,
      errors: {},
    });
  };

  const handleOnSubmit = (e) => {
    e.preventDefault();
    console.log("Activity email modal : ", this.state);
  };

  /*=====================================
        modal handlers
    ===================================== */

  const onOpenModal = () => {
    setValue({
      ...values,
      open: true,
      noteAddSuccess: false,
      hasModelClose: false,
    });
  };

  const onCloseModal = () => {
    setValue({
      ...values,
      open: false,
      activityTabNotesModalTitle: "",
      activityTabNotesModalBody: "",
      errors: {},
    });
  };

  /*=====================================
       custom handlers
    ===================================== */

  const callBackAddNote = (status) => {
    if (status === 200) {
      onCloseModal();
    }
  };

  const handleOnClickSave = (e) => {
    e.preventDefault();
    // console.log(this.state);
    const { errors, isValid } = validateLeadActivityAddNote(values);
    if (!isValid) {
      setValue({ ...values, errors });
    } else {
      const newNote = {
        entityType: "LEAD",
        entityId: leadActivityData._id,
        title: values.activityTabNotesModalTitle,
        data: values.activityTabNotesModalBody,
      };
      dispatch(addLeadNotes(newNote, leadActivityData._id, callBackAddNote));
    }
  };

  /*=====================================
        render modal link
    ===================================== */
  const renderModalLink = () => {
    return (
      <button
        className="leads-title-block-btn-red-bg leads-title-block-btn-red-bg--notes"
        onClick={onOpenModal}
      >
        &#43; Add New Note
      </button>
    );
  };

  /*=====================================
        render modal content
    ===================================== */
  const renderModalContent = () => {
    return (
      <div className="ac-notes-modal-container">
        <form>
          {/* title */}
          <div className="mb-30">
            <input
              type="text"
              name="activityTabNotesModalTitle"
              placeholder="Name"
              value={values.activityTabNotesModalTitle}
              className="font-18-regular ac-email-modal-subject-input font-24-medium border-top-0 pl-30"
              onChange={handleOnChange}
              maxLength={maxLengths.char30}
            />
            {values.errors.activityTabNotesModalTitle && (
              <div className="is-invalid add-lead-form-field-errors ml-0">
                {values.errors.activityTabNotesModalTitle}
              </div>
            )}
          </div>
          {/* body */}
          <div className="mb-30">
            <textarea
              rows="10"
              name="activityTabNotesModalBody"
              className="font-18-regular ac-email-modal-subject-textarea p-30"
              placeholder="Type description here"
              value={values.activityTabNotesModalBody}
              onChange={handleOnChange}
              maxLength={maxLengths.char1000}
            />
            {values.errors.activityTabNotesModalBody && (
              <div className="is-invalid add-lead-form-field-errors ml-0">
                {values.errors.activityTabNotesModalBody}
              </div>
            )}
          </div>

          {/* buttons */}
          <div className="ac-files-buttons-container ac-files-buttons-container--notes">
            <button
              type="submit"
              className="btn-funnel-view btn-funnel-view--files"
              onClick={handleOnClickSave}
            >
              Save
            </button>
          </div>
        </form>
      </div>
    );
  };

  return (
    <>
      {renderModalLink()}

      {/* modal content */}
      <Modal
        open={values.open}
        onClose={onCloseModal}
        closeOnEsc={false}
        closeOnOverlayClick={false}
        center
        classNames={{
          overlay: "customOverlay",
          modal: "customModal customModal--addLead",
          closeButton: "customCloseButton",
        }}
      >
        {/* close modal */}
        <span className="closeIconInModal" onClick={onCloseModal} />
        <h2 className="font-30-bold mb-8 activity-text-border-bottom">
          Add Notes
        </h2>{" "}
        {renderModalContent()}
      </Modal>
    </>
  );
}

export default ActivityContentNotesButtonModal;
