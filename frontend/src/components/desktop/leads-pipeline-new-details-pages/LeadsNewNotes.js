import React, { useState, useEffect } from "react";
import ActivityContentNotesButtonModal from "../activity/ActivityContentNotesButtonModal";
import DropdownIcon from "rc-dropdown";
import "rc-dropdown/assets/index.css";
import Menu, { Item as MenuItem, Divider } from "rc-menu";
import { useSelector } from "react-redux";
import isEmpty from "../../../store/validations/is-empty";
import { useDispatch } from "react-redux";
import {
  getNotesById,
  deleteNotesAction,
  updateNote,
} from "./../../../store/actions/leadsActivityAction";
import { format } from "date-fns";
import { validateLeadActivityEditNote } from "./../../../store/validations/leadsValidation/leadsActivityEditNoteValidation";
import { maxLengths } from "../../../store/validations/maxLengths/MaxLengths";

const dummyData = [
  { id: 0 },
  { id: 1 },
  { id: 3 },
  { id: 4 },
  { id: 5 },
  { id: 6 },
  { id: 7 },
];

export default function LeadsNewNotes() {
  const dispatch = useDispatch();

  const [activeIndex, setActiveIndex] = useState(null);
  const [isDetails, setIsDetails] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [values, setValues] = useState({
    noteSearch: "",
    noteName: "",
    noteDesc: "",
    errors: {},
  });
  const [notes, setNotes] = useState([]);
  const [notesDetails, setNotesDetails] = useState({});
  const [leadData, setLeadData] = useState({});

  const allNotes = useSelector((state) => state.leads.notes);
  const selectedNoteData = useSelector((state) => state.leads.selectedNoteData);
  const selectedLeadData = useSelector(
    (state) => state.leads.leadActivitySummary
  );

  useEffect(() => {
    if (!isEmpty(allNotes)) {
      setNotes(allNotes);
    } else {
      setNotes([]);
    }
  }, [allNotes]);

  useEffect(() => {
    if (!isEmpty(selectedNoteData)) {
      setNotesDetails(selectedNoteData);
    }
  }, [selectedNoteData]);

  useEffect(() => {
    if (!isEmpty(selectedLeadData)) {
      setLeadData(selectedLeadData);
    }
  }, [selectedLeadData]);

  /*==================================================
            
                      handlers

  ===================================================*/

  //const onVisibleChange = (visible) => {
  //  console.log(visible);
  //};

  const callBackDelete = () => {
    setIsDetails(false);
  };

  const handleDelete = () => {
    dispatch(deleteNotesAction(notesDetails._id, leadData._id, callBackDelete));
    console.log("Note is delete");
  };
  const handleIndexActive = (data) => {
    setActiveIndex(data._id);
    setIsDetails(true);
    dispatch(getNotesById(data._id));
  };

  const handleBack = () => {
    setIsDetails(false);
    setActiveIndex(null);
  };

  //const handleMenuEdit = (data) => {
  //  setActiveIndex(data.id);
  //  setIsEdit(!isEdit);
  //  setIsDetails(true);
  //};

  const handleEdit = () => {
    setValues({
      ...values,
      noteName: notesDetails.title,
      noteDesc: notesDetails.data,
    });
    setIsEdit(!isEdit);
  };

  const handleChange = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value,
    });
  };

  const callBackUpdate = () => {
    console.log(":sd");
    setIsEdit(false);
  };

  const handleSave = (e) => {
    e.preventDefault();
    console.log(values);
    //setIsEdit(!isEdit);
    const { errors, isValid } = validateLeadActivityEditNote(values);
    if (!isValid) {
      setValues({ ...values, errors });
    } else {
      const newNote = {
        entityType: "LEAD",
        entityId: leadData._id,
        title: values.noteName,
        data: values.noteDesc,
      };

      dispatch(
        updateNote(newNote, notesDetails._id, leadData._id, callBackUpdate)
      );
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    console.log(values.noteSearch);
  };

  /*==================================================
            
                    render drop down
                      
  ===================================================*/
  //const renderDropDown = (data) => {
  //  const menu = (
  //    <Menu>
  //      {/*<MenuItem onClick={() => this.onSelect("edit")}>Edit</MenuItem>*/}
  //      <MenuItem onClick={() => handleMenuEdit(data)}>Edit</MenuItem>
  //      <Divider />
  //      <MenuItem onClick={onSelect}>Delete</MenuItem>
  //    </Menu>
  //  );

  //  return (
  //    <>
  //      <DropdownIcon
  //        trigger={["click"]}
  //        overlay={menu}
  //        animation="none"
  //        onVisibleChange={onVisibleChange}
  //        overlayClassName="add-account-dropdown"
  //      >
  //        <img
  //          className="accounts-new-card-edit-card-img"
  //          src={require("./../../../assets/img/icons/edit-card-icon.svg")}
  //          alt=""
  //        />
  //      </DropdownIcon>
  //    </>
  //  );
  //};

  /*==================================================
            
                      renderNoteCard
                      
  ===================================================*/
  const renderNoteCard = (data) => {
    return (
      <>
        <div
          className={
            data._id === activeIndex
              ? "leads-new-notes-card leads-new-notes-card--active"
              : "leads-new-notes-card"
          }
          onClick={() => handleIndexActive(data)}
        >
          {console.log(activeIndex)}
          <div className="row justify-content-between mx-0 flex-nowrap">
            <h4 className="font-24-semibold leads-new-notes-text1">
              {data.title}
            </h4>
            {/*renderDropDown(data)*/}
          </div>
          <p className="leads-new-notes-text2"> {data.data}</p>
        </div>
      </>
    );
  };

  /*==================================================
            
                    renderEditNote
                      
  ===================================================*/
  const renderEditNote = () => {
    return (
      <>
        <div className="row justify-content-between mx-0 flex-nowrap">
          <div className="row mx-0 align-item-start">
            <button
              className="leads-new-notes-content-right-back-button"
              onClick={handleEdit}
            >
              <img
                src={require("../../../assets/img/icons/dominate-white-prev-arrow.png")}
                alt="back"
                className="leads-new-notes-content-right-back-div"
              />
            </button>
            <h4 className="leads-new-notes-details-title1">Edit Note</h4>
          </div>
          <button
            className="leads-new-notes-content-right-edit-icon-btn"
            onClick={handleSave}
          >
            <img
              src={require("../../../assets/img/icons/notes-save-icon.svg")}
              alt="save"
            />
          </button>
        </div>
        <div className="leads-new-notes-edit-input-outer-div">
          <form noValidate onSubmit={handleSave}>
            <div className="leads-new-notes-edit-input-div">
              <input
                name="noteName"
                value={values.noteName}
                onChange={handleChange}
                autoFocus={true}
                maxLength={maxLengths.char30}
              />
              {values.errors.noteName && (
                <div className="is-invalid add-lead-form-field-errors add-lead-form-field-errors--notes">
                  {values.errors.noteName}
                </div>
              )}
            </div>
            <div className="leads-new-notes-edit-input-div leads-new-notes-edit-input-div--textarea">
              <textarea
                name="noteDesc"
                value={values.noteDesc}
                onChange={handleChange}
                maxLength={maxLengths.char1000}
              />
              {values.errors.noteDesc && (
                <div className="is-invalid add-lead-form-field-errors add-lead-form-field-errors--notes">
                  {values.errors.noteDesc}
                </div>
              )}
            </div>
          </form>
        </div>
      </>
    );
  };

  /*==================================================
            
                     renderViewNote
                      
  ===================================================*/
  const renderViewNote = () => {
    console.log(notesDetails);
    return (
      <>
        <div className="row justify-content-between mx-0 flex-nowrap">
          <div className="row mx-0 align-item-start">
            <button
              className="leads-new-notes-content-right-back-button"
              onClick={handleBack}
            >
              <img
                src={require("../../../assets/img/icons/dominate-white-prev-arrow.png")}
                alt="back"
                className="leads-new-notes-content-right-back-div"
              />
            </button>
            <div>
              <h4 className="leads-new-notes-details-title1">
                {!isEmpty(notesDetails) && notesDetails.title}
              </h4>
              <p className="leads-new-notes-details-title2">
                {!isEmpty(notesDetails) &&
                  format(notesDetails.updatedAt, "Do MMM")}
              </p>
            </div>
          </div>
          <div className="row mx-0 align-items-center">
            <button
              className="leads-new-notes-content-right-edit-icon-btn"
              onClick={handleEdit}
            >
              <img
                src={require("../../../assets/img/accounts-new/edit-light-circle-icon.svg")}
                alt="edit"
              />
            </button>
            <button
              className="leads-new-notes-content-right-delete-icon-btn"
              onClick={handleDelete}
            >
              <img
                src={require("../../../assets/img/icons/notes-delete-icon.svg")}
                alt="delete"
              />
            </button>
          </div>
        </div>
        <div className="leads-new-notes-details-para-div">
          <p className="leads-new-notes-details-title2">
            {!isEmpty(notesDetails) && notesDetails.data}
          </p>
        </div>
      </>
    );
  };

  const renderSearch = () => {
    return (
      <>
        <form onSubmit={handleSearch}>
          <div className="leads-new-notes-search">
            <img
              src="/img/desktop-dark-ui/icons/search-icon.svg"
              alt="search"
              className="leads-new-notes-search-icon"
              onClick={handleSearch}
            />
            <input
              name={"noteSearch"}
              value={values.noteSearch}
              onChange={handleChange}
            />
          </div>
        </form>
      </>
    );
  };
  /*==================================================
            
                      render
                      
  ===================================================*/

  // Search
  let filtereddata = [];
  if (!isEmpty(values.noteSearch)) {
    let search = new RegExp(values.noteSearch, "i");
    filtereddata = notes.filter((getall) => {
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
    filtereddata = notes;
  }

  return (
    <>
      <div className="row mx-0 justify-content-between align-items-start">
        <h2 className="font-21-bold">All Notes</h2>
        <div className="row mx-0 align-items-center">
          {renderSearch()}
          <ActivityContentNotesButtonModal />
        </div>
      </div>
      <div className="leads-new-notes-content-div justify-content-between row mx-0 align-items-start flex-nowrap">
        {!isEmpty(filtereddata) ? (
          <div className="row mx-0 align-items-start">
            {filtereddata.map((data, index) => (
              <div key={index}>{renderNoteCard(data)}</div>
            ))}
          </div>
        ) : (
          <>
            <div className="row mx-0 justify-content-center align-items-start">
              <img
                // src={require("../../../../src/assets/img/illustrations/leads-new-no-mails.svg")}
                src="/img/desktop-dark-ui/illustrations/leads-new-no-notes.svg"
                alt="no notes"
                className="leads-new-no-data-illustration-div__no-mails-img"
              />
            </div>
            <p className="font-18-medium color-white-79 mb-30 text-center">
              No Notes Added yet
            </p>
          </>
        )}

        <div>
          {isDetails ? (
            <>
              <div className="leads-new-notes-content-right-div">
                {isEdit ? <>{renderEditNote()}</> : <>{renderViewNote()}</>}
              </div>
            </>
          ) : (
            <></>
          )}
        </div>
      </div>
    </>
  );
}
