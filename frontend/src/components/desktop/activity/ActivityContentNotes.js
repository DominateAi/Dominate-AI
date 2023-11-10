import React, { useState, useEffect } from "react";
import Modal from "react-responsive-modal";
import "../common/CustomModalStyle.css";
import DropdownIcon from "rc-dropdown";
import "rc-dropdown/assets/index.css";
import Menu, { Item as MenuItem, Divider } from "rc-menu";
import ActivityContentNotesButtonModal from "./ActivityContentNotesButtonModal";
import { connect } from "react-redux";
import {
  deleteNotesAction,
  updateNote,
} from "./../../../store/actions/leadsActivityAction";
import isEmpty from "./../../../store/validations/is-empty";
import { statusEmpty } from "./../../../store/actions/authAction";
import { validateLeadActivityAddNote } from "../../../store/validations/leadsValidation/leadActivityAddNoteValidation";
import { useDispatch, useSelector } from "react-redux";

// remove after integration
// const followUpData = [];

function ActivityContentNotes({ leadActivityData }) {
  const dispatch = useDispatch();
  const [values, setValues] = useState({
    leadSearch: "",
    searchBlockStyle: "",
    allNotes: "",
    // cards note edit modal
    open: false,
    activityTabNotesModalTitle: "",
    activityTabNotesModalBody: "",
    errors: {},
    noteUpdateSuccess: false,
    noteId: "",
  });

  const allNotes = useSelector((state) => state.leads.notes);

  useEffect(() => {
    if (!isEmpty(allNotes)) {
      setValues({
        ...values,
        allNotes: allNotes,
      });
    } else {
      setValues({
        ...values,
        allNotes: "",
      });
    }
  }, [allNotes]);

  /*=====================================
        handlers
    ===================================== */

  const handleOnChange = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value,
    });
  };

  const handleSearchClick = () => {
    setValues({
      ...values,
      searchBlockStyle: "searchBlockStyle",
    });
  };

  const handleOnSubmitSearch = (e) => {
    e.preventDefault();
    // alert(values.leadSearch);
    setValues({
      ...values,
      searchBlockStyle: "",
    });
  };

  /*=====================================
        render search
    ===================================== */
  const renderSearch = () => {
    return (
      <div className="lead-search-block mr-30">
        <form onSubmit={handleOnSubmitSearch}>
          <input
            type="text"
            name="leadSearch"
            /* className={`add-lead-input-field font-18-regular add-lead-input-field--lead-search ${this.state.searchBlockStyle}`} */
            className="add-lead-input-field font-18-regular add-lead-input-field--lead-search searchBlockStyle"
            placeholder=""
            onChange={handleOnChange}
            onClick={handleSearchClick}
            value={values.leadSearch}
          />
          <img
            src="/img/desktop-dark-ui/icons/search-icon.svg"
            alt="search"
            className="lead-search-block__icon"
            onClick={handleOnSubmitSearch}
          />
        </form>
      </div>
    );
  };

  /*=====================================
        modal handlers
    ===================================== */

  const onOpenModal = () => {
    setValues({
      ...values,
      open: true,
      noteUpdateSuccess: false,
      hasModelClose: false,
    });
  };

  const onCloseModal = () => {
    setValues({
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

  const handleOnClickSave = (e) => {
    e.preventDefault();
    // console.log(this.state);
    const { errors, isValid } = validateLeadActivityAddNote(values);
    if (!isValid) {
      setValues({ ...values, errors });
    }

    if (isValid) {
      setValues({
        ...values,
        open: false,
      });
      const newNote = {
        entityType: "LEAD",
        entityId: leadActivityData._id,
        title: values.activityTabNotesModalTitle,
        data: values.activityTabNotesModalBody,
      };
      dispatch(updateNote(newNote, values.noteId, leadActivityData._id));
      setValues({
        ...values,
        noteUpdateSuccess: true,
      });
    }
  };

  /*==========================================
              dropdown
============================================*/

  const onVisibleChange = (visible) => {
    console.log(visible);
  };

  const onSelect = (notesData, action) => {
    // console.log("onselect ", followUpData);
    if (action === "delete") {
      dispatch(deleteNotesAction(notesData._id, leadActivityData._id));
    } else if (action === "edit") {
      setValues({
        ...values,
        open: true,
        activityTabNotesModalTitle: notesData.title,
        activityTabNotesModalBody: notesData.data,
        noteId: notesData._id,
      });
    }
  };

  const renderNotesDropdown = (notesData) => {
    const menu = (
      <Menu>
        <MenuItem onClick={() => onSelect(notesData, "edit")}>Edit</MenuItem>
        <Divider />
        <MenuItem onClick={() => onSelect(notesData, "delete")}>
          Delete
        </MenuItem>
      </Menu>
    );

    return (
      <DropdownIcon
        trigger={["click"]}
        overlay={menu}
        animation="none"
        onVisibleChange={onVisibleChange}
      >
        <img
          className="ac-email-edit-dropdown-img notes-3-dots-img ml-70"
          src={require("./../../../assets/img/icons/Dominate-Icon_3dots.svg")}
          alt="dropdown menu"
        />
      </DropdownIcon>
    );
  };

  /*==========================================
            dropdown end
============================================*/

  /*=====================================
          render modal link
      ===================================== */
  const renderModalLink = (notesData, index) => {
    return (
      <div key={index} className="ac-notes-cards-container__card">
        <div className="ac-notes-cards-container__cardOverflowHidden">
          <div className="notes-3-dots-div">
            {renderNotesDropdown(notesData)}
          </div>
          <h6 className="font-21-regular mb-10">{notesData.title}</h6>
          <p className="font-18-regular">{notesData.data}</p>
        </div>
      </div>
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
              placeholder=""
              value={values.activityTabNotesModalTitle}
              className="font-18-regular ac-email-modal-subject-input font-24-medium border-top-0"
              onChange={handleOnChange}
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
              className="font-18-regular ac-email-modal-subject-textarea"
              placeholder=""
              value={values.activityTabNotesModalBody}
              onChange={handleOnChange}
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

  // console.log(this.state.allNotes);
  //   const { allNotes } = this.state;

  let filtereddata = [];
  if (!isEmpty(values.leadSearch)) {
    let search = new RegExp(values.leadSearch, "i");
    filtereddata = allNotes.filter((getall) => {
      if (search.test(getall.title)) {
        return getall;
      }
      // if (search.test(getall.company)) {
      //   return getall;
      // }
      // if (search.test(getall.email)) {
      //   return getall;
      // }
    });
    // console.log(filtereddata);
  } else {
    filtereddata = values.allNotes;
  }

  return (
    <>
      {/* title block */}
      <div className="justify-content-space-between pr-20">
        {/* title */}
        <h5 className="font-21-bold">All notes</h5>
        <div className="d-flex">
          {/* search block */}
          {renderSearch()}
          {/* add note button modal */}
          <ActivityContentNotesButtonModal
            leadActivityData={leadActivityData}
          />
        </div>
      </div>

      {/* cards */}
      <div className="ac-notes-cards-container">
        {!isEmpty(filtereddata) ? (
          filtereddata.map((notes, index) => {
            return renderModalLink(notes, index);
          })
        ) : (
          <div className="leads-new-no-data-illustration-div">
            <div className="row mx-0 justify-content-center align-items-start">
              <img
                className="leads-new-no-data-illustration-div__no-emails-img"
                src={require("../../../../src/assets/img/illustrations/leads-new-no-notes.svg")}
                alt="no notes"
              />
            </div>
            <h3 className="font-21-regular text-center mt-20 mb-30">
              No notes found
            </h3>
          </div>
        )}

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
          {renderModalContent()}
        </Modal>
      </div>
    </>
  );
}

export default ActivityContentNotes;
