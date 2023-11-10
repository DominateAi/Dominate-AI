import React, { useState, useEffect } from "react";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import ActivitySummaryCreateMailModal from "../activity/ActivitySummaryCreateMailModal";
import ActivitySummaryFollowUpModal from "../activity/ActivitySummaryFollowUpModal";
// api
import isEmpty from "./../../../store/validations/is-empty";
import {
  updateLeadLevelAction,
  // updateLeadAction,
  deleteLead,
} from "./../../../store/actions/leadAction";
import { deletePipelineLead } from "./../../../store/actions/leadsPipelineAction";
import {
  updateLeadAction,
  updateKanBanLeadOfPipelineAction,
} from "./../../../store/actions/leadsPipelineAction";
import AddToLogModal from "./AddToLogModal";
import DeleteWarningPopup from "./../common/DeleteWarningPopup";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

const emojiOption = ["🌋", "☀️", "☕", "❄️️"];

// const statusOptionsRow = [
//   "New Lead",
//   "Qualified Lead",
//   "On Hold Lead",
//   "Contacted Lead",
//   "Opportunity Lead",
//   "Converted Lead",
// ];

// const optionsAssignedTo = ["John Doe", "Anna Mull", "Paul Molive"];

function LeadsNewDetailsProfile({ leadActivityData, leadActivitySummary }) {
  const dispatch = useDispatch();
  const history = useHistory();
  const [values, setValues] = useState({
    deleteWarningPopup: false,
    allEmployees: [],
    deleteId: "",
  });

  const [statusOptionsRow, setStatusOptionsRow] = useState([]);

  const allEmployees = useSelector((state) => state.employee.allEmployees);
  const userId = useSelector((state) => state.auth.user.id);
  const allPipelineStage = useSelector(
    (state) => state.leadsPipeline.allPipelineStages
  );
  const leadFilterName = useSelector((state) => state.filterName.filterName);

  useEffect(() => {
    if (!isEmpty(allEmployees)) {
      setValues({
        ...values,
        allEmployees: allEmployees,
      });
    }
  }, [allEmployees]);

  useEffect(() => {
    if (!isEmpty(allPipelineStage)) {
      let newArray = [];
      allPipelineStage.forEach((element) => {
        newArray.push(element.leadStageName);
      });

      setStatusOptionsRow(newArray);
    } else {
      setStatusOptionsRow([]);
    }
  }, [allPipelineStage]);

  /*======================================================================
        handlers
  ======================================================================*/

  const onAssignedToClick = (e) => {
    // this.setState({
    //   defaultAssignedToOption: e.value,
    // });
    const { allEmployees } = values;

    let filterEmp =
      !isEmpty(allEmployees) &&
      allEmployees.filter(function (allEmployees) {
        return allEmployees.name === e.value;
      });
    console.log(filterEmp[0]._id);
    let leadAllData = leadActivityData;
    leadAllData.assigned = filterEmp[0]._id;

    dispatch(updateLeadAction(leadActivityData._id, leadAllData, userId));
  };
  /*======================================================================
        onAllLeadDropdownSelect
  ======================================================================*/
  const onAllLeadDropdownSelect = (e) => {
    if (e.value === "🌋") {
      leadActivityData.degree = "SUPER_HOT";
      dispatch(
        updateKanBanLeadOfPipelineAction(
          leadActivityData._id,
          { degree: "SUPER_HOT" },
          "",
          userId
        )
      );
    } else if (e.value === "☀️") {
      leadActivityData.degree = "HOT";
      dispatch(
        updateKanBanLeadOfPipelineAction(
          leadActivityData._id,
          { degree: "HOT" },
          "",
          userId
        )
      );
    } else if (e.value === "☕") {
      leadActivityData.degree = "WARM";
      dispatch(
        updateKanBanLeadOfPipelineAction(
          leadActivityData._id,
          { degree: "WARM" },
          "",
          userId
        )
      );
    } else {
      dispatch(
        updateKanBanLeadOfPipelineAction(
          leadActivityData._id,
          { degree: "COLD" },
          "",
          userId
        )
      );
    }
  };

  /*======================================================================
        onStatusOptionsRowClick
  ======================================================================*/
  const onStatusOptionsRowClick = (e) => {
    var userData = JSON.parse(localStorage.getItem("Data"));
    if (!isEmpty(allPipelineStage)) {
      let selectedStage = allPipelineStage.filter(
        (stage) => stage.leadStageName === e.value
      );
      let leadAllData = leadActivitySummary;
      leadAllData.stage = selectedStage[0]._id;
      dispatch(
        updateKanBanLeadOfPipelineAction(
          leadAllData._id,
          leadAllData,
          userData.id,
          leadFilterName
        )
      );
    }
    if (e.value === "New Lead") {
      let leadAllData = leadActivityData;
      leadAllData.status = "NEW_LEAD";

      dispatch(updateLeadAction(leadActivityData._id, leadAllData, userId, ""));
    } else if (e.value === "Qualified Lead") {
      let leadAllData = leadActivityData;
      leadAllData.status = "QUALIFIED_LEADS";

      dispatch(updateLeadAction(leadActivityData._id, leadAllData, userId, ""));
    } else if (e.value === "On Hold Lead") {
      let leadAllData = leadActivityData;
      leadAllData.status = "ON_HOLD";

      dispatch(updateLeadAction(leadActivityData._id, leadAllData, userId, ""));
    } else if (e.value === "Contacted Lead") {
      let leadAllData = leadActivityData;
      leadAllData.status = "CONTACTED_LEADS";

      dispatch(updateLeadAction(leadActivityData._id, leadAllData, userId, ""));
    } else if (e.value === "Opportunity Lead") {
      let leadAllData = leadActivityData;
      leadAllData.status = "OPPORTUNITIES";

      dispatch(updateLeadAction(leadActivityData._id, leadAllData, userId, ""));
    } else if (e.value === "Converted lead") {
      let leadAllData = leadActivityData;
      leadAllData.status = "CONVERTED";

      dispatch(updateLeadAction(leadActivityData._id, leadAllData, userId, ""));
    }
  };

  /*======================================================================
        renderProfileImgBlock
  ======================================================================*/
  const renderProfileImgBlock = () => {
    return (
      <div className="leads-new-details-main-profile">
        <div className="leads-new-details-main-profile__img-block">
          <img
            src={require("../../../assets/img/leads/lead_default_img.svg")}
            alt="person"
            className="leads-new-details-main-profile__img"
          />
        </div>
        <div>
          <h3 className="font-24-semibold leads-new-details-main-profile__title">
            {leadActivitySummary.name}
          </h3>
          {/* <div className="row mx-0 align-items-center">
            <div className="leads-new-graph-level-block__circular-graph-block">
              <CircularProgressbar value={45} strokeWidth={10} text={"45%"} />
            </div>
            <p className="leads-new-details-main-profile__circular-desc">
              Leads detail completed
            </p>
          </div> */}
        </div>
      </div>
    );
  };

  /*======================================================================
        renderDropdownsRow
  ======================================================================*/
  const renderCurrentStageName = (leadData) => {
    let filteredStage = "";
    if (!isEmpty(allPipelineStage)) {
      filteredStage = allPipelineStage.filter(
        (stage) => stage._id === leadData.stage
      );
    }
    return !isEmpty(filteredStage) ? filteredStage[0].leadStageName : "";
  };

  const renderDropdownsRow = () => {
    const { allEmployees } = values;
    let allEmployeesData = [];
    if (!isEmpty(allEmployees)) {
      Object.keys(allEmployees).forEach(function (key) {
        // console.log(allEmployees[key].name);
        allEmployeesData.push(allEmployees[key].name);
      });
    }

    const optionsAssignedTo = allEmployeesData;

    return (
      <div className="row mx-0 align-items-center mb-30 leads-new-dropdown-block">
        <h3 className="font-21-bold leads-new-dropdown-block__text">Level</h3>
        <Dropdown
          className="font-24-semibold lead-status-dropDown lead-status-dropDown--emoji ml-0 mr-30"
          options={emojiOption}
          value={
            leadActivitySummary.degree === "SUPER_HOT"
              ? emojiOption[0]
              : leadActivitySummary.degree === "HOT"
              ? emojiOption[1]
              : leadActivitySummary.degree === "WARM"
              ? emojiOption[2]
              : leadActivitySummary.degree === "COLD"
              ? emojiOption[3]
              : ""
          }
          onChange={onAllLeadDropdownSelect}
        />
        <h3 className="font-21-bold leads-new-dropdown-block__text">
          Assign To
        </h3>
        <Dropdown
          className="font-18-semibold lead-status-dropDown lead-status-dropDown--statusRow mr-30"
          options={optionsAssignedTo}
          onChange={onAssignedToClick}
          value={
            !isEmpty(leadActivitySummary) && leadActivitySummary.assigned.name
          }
          // placeholder="Assigned To"
        />
        <h3 className="font-21-bold leads-new-dropdown-block__text">Status</h3>
        <Dropdown
          className="font-18-semibold lead-status-dropDown lead-status-dropDown--statusRow"
          options={statusOptionsRow}
          onChange={onStatusOptionsRowClick}
          value={renderCurrentStageName(leadActivitySummary)}
        />
      </div>
    );
  };

  /*======================================================================
        renderButtons
  ======================================================================*/
  const handleOnClickProfileButton = (action) => (e) => {
    if (action === "delete_lead") {
      setValues({
        ...values,
        deleteWarningPopup: true,
        deleteId: leadActivitySummary._id,
      });
    }
  };

  // Dlete popup handlers
  const callBackDelete = () => {
    setValues({
      ...values,
      deleteWarningPopup: false,
      deleteId: "",
    });
    history.push("/leads-new");
  };

  const yesHandlder = () => {
    const { deleteId } = values;
    var data = JSON.parse(localStorage.getItem("Data"));
    // dispatch(deleteLead(deleteId, "", userId, callBackDelete));
    dispatch(deletePipelineLead(deleteId, "", data.id, callBackDelete));
  };

  const noHandler = () => {
    setValues({
      ...values,
      deleteWarningPopup: false,
      deleteId: "",
    });
  };

  const renderButtons = () => {
    const addToLogButtonContent = (
      <>
        <img
          // src={require("../../../../src/assets/img/leads-new/note.svg")}
          src="/img/desktop-dark-ui/icons/lead-add-logs.svg"
          alt=""
        />
        <span className="font-15-bold">add to log</span>
      </>
    );
    return (
      <div className="row mx-0 align-items-start leads-new-inner-page-profile-row__colm2">
        <div className="col-4">
          <ActivitySummaryFollowUpModal
            leadActivityData={!isEmpty(leadActivityData) && leadActivityData}
          />
        </div>
        <div className="col-4">
          <AddToLogModal
            modalButtonContent={addToLogButtonContent}
            modalButtonClassName="leads-new-inner-page-profile-row__colm2-btn"
            leadActivityData={
              !isEmpty(leadActivitySummary) && leadActivitySummary
            }
          />
        </div>
        {/* {leadActivitySummary.isKanban === true ? (
          <div className="col-4">
            <button
              className="leads-new-inner-page-profile-row__colm2-btn"
              onClick={handleOnClickProfileButton("remove_from_kanban")}
            >
              <img
                src={require("../../../../src/assets/img/leads-new/remove-from-kanban.svg")}
                alt=""
              />
              <span className="font-15-bold">Remove from kanban</span>
            </button>
          </div>
        ) : (
          <div className="col-4">
            <button
              onClick={handleOnClickProfileButton("add_to_kanban")}
              className="leads-new-inner-page-profile-row__colm2-btn"
            >
              <img
                src="/img/desktop-dark-ui/icons/lead-add-to-kanban.svg"
                alt=""
              />
              <span className="font-15-bold">add to kanban</span>
            </button>
          </div>
        )} */}

        {/* <div className="col-4">
          <button
            className="leads-new-inner-page-profile-row__colm2-btn"
            onClick={handleOnClickProfileButton("call")}
          >
            <img
              src={require("../../../../src/assets/img/leads-new/call.svg")}
              alt=""
            />
            <span className="font-15-bold">call</span>
          </button>
        </div> */}
        {/* {leadActivitySummary.isHidden === true ? (
          <div className="col-4">
            <button
              className="leads-new-inner-page-profile-row__colm2-btn"
              onClick={handleOnClickProfileButton("unhide_lead")}
            >
              <img
                src="/img/desktop-dark-ui/icons/lead-eye-icon.svg"
                alt=""
              />
              <span className="font-15-bold">unhide lead</span>
            </button>
          </div>
        ) : (
          <div className="col-4">
            <button
              className="leads-new-inner-page-profile-row__colm2-btn"
              onClick={handleOnClickProfileButton("hide_lead")}
            >
              <img
                src="/img/desktop-dark-ui/icons/lead-eye-with-line.svg"
                alt=""
              />
              <span className="font-15-bold">hide lead</span>
            </button>
          </div>
        )} */}

        <div className="col-4">
          <button
            className="leads-new-inner-page-profile-row__colm2-btn"
            onClick={handleOnClickProfileButton("delete_lead")}
          >
            <img
              // src={require("../../../../src/assets/img/leads-new/delete.svg")}
              src="/img/desktop-dark-ui/icons/lead-delete.svg"
              alt=""
              className="leads-new-inner-page-profile-row__delete-icon"
            />
            <span className="font-15-bold">Delete lead</span>
          </button>
        </div>

        <div className="col-4">
          <ActivitySummaryCreateMailModal
            leadActivityData={!isEmpty(leadActivityData) && leadActivityData}
          />
        </div>
      </div>
    );
  };

  return (
    <>
      <DeleteWarningPopup
        deleteWarningPopup={values.deleteWarningPopup}
        yesHandlder={yesHandlder}
        noHandler={noHandler}
        title={"lead"}
      />
      <div className="row mx-0 justify-content-between leads-new-inner-page-profile-row">
        <div className="leads-new-inner-page-profile-row__colm1">
          {renderProfileImgBlock()}
          {renderDropdownsRow()}
        </div>
        {renderButtons()}
      </div>
    </>
  );
}

export default LeadsNewDetailsProfile;
