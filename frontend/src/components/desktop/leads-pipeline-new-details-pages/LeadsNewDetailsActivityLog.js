import React, { useState, useEffect, Fragment } from "react";
import isEmpty from "./../../../store/validations/is-empty";
import LeadsNewDetailsViewFileModal from "./LeadsNewDetailsViewFileModal";
import { connect } from "react-redux";
import {
  updateLogById,
  uploadFileToLog,
  getLeadActivityLog,
} from "./../../../store/actions/leadsActivityAction";
import dateFns from "date-fns";
import AddToLogModal from "./AddToLogModal";
import { maxLengths } from "./../../../store/validations/maxLengths/MaxLengths";
import Validator from "validator";
import { useDispatch, useSelector } from "react-redux";

const allLeadOptions = ["All activity", "Upcoming", "Completed"];

function LeadsNewDetailsActivityLog({ leadActivityData }) {
  const dispatch = useDispatch();
  const [values, setValues] = useState({
    allLeadDefaultOption: allLeadOptions[0],
    isAddNoteClicked: false,
    leadsNewActivityNoteTextarea: "",
    fileName: "",
    fileInfo: [],
    leadActivityLog: [],
    addNoteForActivity: "",
  });

  const leadActivityLog = useSelector((state) => state.leads.leadActivityLog);

  const leadActivitySummary = useSelector(
    (state) => state.leads.leadActivitySummary
  );

  useEffect(() => {
    if (!isEmpty(leadActivityLog)) {
      setValues({
        ...values,
        leadActivityLog: leadActivityLog,
      });
    }
  }, [leadActivityLog]);

  /*======================================================================
        handlers
  ======================================================================*/

  const handleOnChange = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value,
    });
  };

  const handleOnChangeFileUpload = (logData) => (e) => {
    const data = new FormData();

    data.append("file", e.target.files[0]);
    // this.setState({
    //   fileData: data,
    // });

    setValues({
      ...values,
      fileName:
        e.target.files.length > 0 ? e.target.files[0].name : e.target.value,
      fileInfo: e.target.files.length > 0 ? e.target.files[0] : e.target.value,
    });

    console.log(data);

    dispatch(uploadFileToLog(data, logData, leadActivitySummary._id));
  };

  const onAllLeadDropdownSelect = (data) => (e) => {
    e.preventDefault();
    setValues({
      ...values,
      allLeadDefaultOption: data,
    });

    if (data === "Upcoming") {
      const formData = {
        query: {
          lead: leadActivitySummary._id,
          status: "UPCOMING",
        },
      };
      dispatch(getLeadActivityLog(formData));
    } else if (data === "Completed") {
      const formData = {
        query: {
          lead: leadActivitySummary._id,
          status: "COMPLETED",
        },
      };
      dispatch(getLeadActivityLog(formData));
    } else {
      const formData = {
        query: {
          lead: leadActivitySummary._id,
        },
      };
      dispatch(getLeadActivityLog(formData));
    }

    console.log(data);
  };

  const handleOnClickProfileButton = (data) => (e) => {
    console.log("clicked on button ", data);
    let formData = data;
    formData.status = "COMPLETED";

    dispatch(
      updateLogById(
        data._id,
        formData,
        leadActivitySummary._id,
        updateLogCallback
      )
    );
  };

  const handleOnClickAddNote = (activityData) => (e) => {
    console.log(activityData);
    setValues({
      ...values,
      isAddNoteClicked: true,
      addNoteForActivity: activityData._id,
      leadsNewActivityNoteTextarea: activityData.notes[0],
    });
  };

  const handleOnClickGoBack = () => {
    setValues({
      ...values,
      isAddNoteClicked: false,
    });
  };
  const updateLogCallback = (status) => {
    if (status === 200) {
      setValues({
        ...values,
        isAddNoteClicked: false,
        // leadsNewActivityNoteTextarea: "",
      });
    }
  };

  const handleOnClickSaveNote = (data) => (e) => {
    console.log(data);
    let formData = data;
    formData.notes[0] = values.leadsNewActivityNoteTextarea;
    // console.log(formData);
    dispatch(
      updateLogById(
        data._id,
        formData,
        leadActivitySummary._id,
        updateLogCallback
      )
    );
  };

  /*======================================================================
        renderLogsCard
  ======================================================================*/
  const renderLogsCard = (data, index) => {
    // console.log(this.state.addNoteForActivity, this.state.isAddNoteClicked);
    const { isAddNoteClicked, addNoteForActivity } = values;
    return (
      <div className="row mx-0 flex-nowrap align-items-start">
        {index % 2 === 0 ? (
          <img
            src={require("../../../../src/assets/img/leads-new/notes-magenta-circle.svg")}
            alt=""
            className="leads-new-details-activity-log__circle-color"
          />
        ) : (
          <img
            src={require("../../../../src/assets/img/leads-new/notes-green-circle.svg")}
            alt=""
            className="leads-new-details-activity-log__circle-color"
          />
        )}
        <div className="row mx-0 align-items-center">
          <div
            id="leads-new-details-activity-log__card1"
            className="leads-new-details-activity-log__card"
          >
            <h4 className="font-26-semibold leads-new-details-activity-log__card-title">
              {data.logName}
            </h4>
            <div className="row mx-0 align-items-center justify-content-between">
              <p className="leads-new-details-activity-log__text-desc-1">
                {dateFns.format(data.createdAt, "DD MMM hh:mm a")}
              </p>
              {isAddNoteClicked && addNoteForActivity === data._id ? (
                <>
                  <div>
                    <button
                      className="leads-new-details-activity-log__go-back-btn"
                      onClick={handleOnClickGoBack}
                    >
                      Go Back
                    </button>
                    <button
                      className="leads-new-details-activity-log__save-btn"
                      onClick={handleOnClickSaveNote(data)}
                    >
                      Save
                    </button>
                  </div>
                </>
              ) : (
                <>
                  {/* mark as completed */}
                  <button
                    className="leads-new-inner-page-profile-row__colm2-btn"
                    onClick={handleOnClickProfileButton(data)}
                  >
                    {data.status !== "COMPLETED" ? (
                      <img
                        src={require("../../../../src/assets/img/leads-new/correct-gray-bg.svg")}
                        alt=""
                      />
                    ) : (
                      <img
                        src={require("../../../../src/assets/img/leads-new/correct-green-bg.svg")}
                        alt=""
                      />
                    )}
                    <b className="font-15-bold leads-new-details-activity-log__text-desc-2">
                      {data.status === "COMPLETED"
                        ? "COMPLETED"
                        : "mark as completed"}
                    </b>
                  </button>
                </>
              )}
            </div>
            <div className="leads-new-details-activity-log__card__border-bottom"></div>
            {!isAddNoteClicked || addNoteForActivity !== data._id ? (
              <>
                {addNoteForActivity !== data._id ? (
                  <p className="leads-new-details-activity-log__text-gray-light-italic">
                    {/* Write something about this meeting by clicking on "Add
                    Notes" */}
                    {!isEmpty(data.notes) ? data.notes[0] : "No notes found"}
                  </p>
                ) : (
                  <p className="leads-new-details-activity-log__text-gray-light-regular">
                    {values.leadsNewActivityNoteTextarea}
                  </p>
                )}
              </>
            ) : (
              <>
                <textarea
                  rows="3"
                  name="leadsNewActivityNoteTextarea"
                  className="font-18-regular ac-email-modal-subject-textarea"
                  placeholder=""
                  value={values.leadsNewActivityNoteTextarea}
                  onChange={handleOnChange}
                  maxLength={maxLengths.char1000}
                />
                {!isEmpty(values.leadsNewActivityNoteTextarea) &&
                  Validator.isLength(values.leadsNewActivityNoteTextarea, {
                    min: 1000,
                    max: 1000,
                  }) && (
                    <div className="is-invalid add-lead-form-field-errors ml-0">
                      <p>Notes should be in beetween 1000 characters</p>
                    </div>
                  )}

                {/* {this.state.errors.leadsNewActivityNoteTextarea && (
                  <div className="is-invalid add-lead-form-field-errors ml-0">
                    {this.state.errors.leadsNewActivityNoteTextarea}
                  </div>
                )} */}
              </>
            )}

            {(!isAddNoteClicked || addNoteForActivity !== data._id) && (
              <>
                {/* buttons upload add and view  mb-0*/}
                <div className="row mx-0 align-items-center justify-content-center">
                  <label className="leads-new-inner-page-profile-row__colm2-btn ">
                    <img
                      src={require("../../../../src/assets/img/leads-new/upload-files.svg")}
                      alt=""
                    />
                    <span className="font-15-bold">Upload File</span>
                    <input
                      type="file"
                      // accept=".csv"
                      name="fileName"
                      onChange={handleOnChangeFileUpload(data)}
                      className="domain-bulk-upload-list-button-text-div__input"
                    />
                  </label>

                  <LeadsNewDetailsViewFileModal logData={data} />

                  <button
                    className="leads-new-inner-page-profile-row__colm2-btn"
                    onClick={handleOnClickAddNote(data)}
                  >
                    <img
                      // src={require("../../../../src/assets/img/leads-new/note.svg")}
                      src="/img/desktop-dark-ui/icons/lead-add-logs.svg"
                      alt=""
                    />
                    <span className="font-15-bold">add notes</span>
                  </button>
                </div>
                {/* buttons upload add and view end */}
              </>
            )}
          </div>
          <div>
            <p className="leads-new-details-activity-log__text-gray-light">
              {dateFns.format(data.createdAt, "DD MMM YYYY ")}
            </p>
            <p className="leads-new-details-activity-log__text-gray-light">
              {dateFns.format(data.createdAt, "hh:mm a")}
            </p>
          </div>
        </div>
      </div>
    );
  };

  const addToLogButtonContent = (
    <>
      <span className="font-18-semibold">+ Add New Log</span>
    </>
  );

  return (
    <div className="leads-new-details-activity-log__container">
      <div className="leads-new-filter-button-block leads-new-filter-button-block--leads-new-details">
        {allLeadOptions.map((data, index) => (
          <button
            key={index}
            onClick={onAllLeadDropdownSelect(data)}
            className={
              allLeadOptions[index] === values.allLeadDefaultOption
                ? "leads-new-filter-button leads-new-filter-button--active"
                : "leads-new-filter-button"
            }
          >
            {data}
          </button>
        ))}
      </div>

      <AddToLogModal
        modalButtonContent={addToLogButtonContent}
        modalButtonClassName="leads-new-inner-page-add-new-activity-log-btn"
        leadActivityData={leadActivityData}
      />
      {!isEmpty(leadActivityLog) ? (
        leadActivityLog.map((data, index) => (
          <Fragment key={index}>
            <h3 className="font-18-bold leads-new-details-activity-log__text1">
              {dateFns.format(data.createdAt, "DD MMM YYYY")}
            </h3>
            {renderLogsCard(data, index)}
          </Fragment>
        ))
      ) : (
        <>
          <div className="row mx-0 justify-content-center align-items-start leads-new-no-data-illustration-div">
            <img
              // src={require("../../../../src/assets/img/illustrations/leads-new-no-activity.svg")}
              src="/img/desktop-dark-ui/illustrations/leads-new-no-activity.svg"
              alt="no activity"
              className="leads-new-no-data-illustration-div__no-activity-img"
            />
          </div>
          <p className="font-18-medium color-white-79 mb-30 text-center">
            No logs yet
          </p>
        </>
      )}
    </div>
  );
}

export default LeadsNewDetailsActivityLog;
