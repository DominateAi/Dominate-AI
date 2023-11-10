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
  updateLeadAction,
  addToKanBanAction,
  unhideLeadAction,
  hideLeadAction,
  deleteLead,
} from "./../../../store/actions/leadAction";
import AddToLogModal from "./AddToLogModal";
import DeleteWarningPopup from "./../common/DeleteWarningPopup";
import { useDispatch, useSelector } from "react-redux";

const emojiOption = ["🌋", "☀️", "☕", "❄️️"];

const statusOptionsRow = [
  "New Lead",
  "Qualified Lead",
  "On Hold Lead",
  "Contacted Lead",
  "Opportunity Lead",
  "Converted Lead",
];

// const optionsAssignedTo = ["John Doe", "Anna Mull", "Paul Molive"];

function LeadsNewDetailsProfile({ leadActivityData, leadActivitySummary }) {
  const dispatch = useDispatch();
  const [values, setValues] = useState({
    deleteWarningPopup: false,
    allEmployees: [],
    deleteId: "",
  });

  const allEmployees = useSelector((state) => state.employee.allEmployees);
  const userId = useSelector((state) => state.auth.user.id);

  useEffect(() => {
    if (!isEmpty(allEmployees)) {
      setValues({
        ...values,
        allEmployees: allEmployees,
      });
    }
  }, [allEmployees]);

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
      dispatch(
        updateLeadLevelAction(
          leadActivityData._id,
          { degree: "SUPER_HOT" },
          "",
          userId
        )
      );
    } else if (e.value === "☀️") {
      dispatch(
        updateLeadLevelAction(
          leadActivityData._id,
          { degree: "HOT" },
          "",
          userId
        )
      );
    } else if (e.value === "☕") {
      dispatch(
        updateLeadLevelAction(
          leadActivityData._id,
          { degree: "WARM" },
          "",
          userId
        )
      );
    } else {
      dispatch(
        updateLeadLevelAction(
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
        <div className="flex-shrink-0 leads-new-details-main-profile__img-block">
          {/* <img
            // src={require("../../../assets/img/leads/lead_default_img.svg")}
            alt="person"
          /> */}
        </div>
        <div className="flex-grow-1">
          <div className="row mx-0 flex-nowrap align-items-baseline flex-nowrap new-lead-detail-title-block-row-1">
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
            {renderButtons()}
          </div>
          <div className="row mx-0 flex-nowrap align-items-center justify-content-between mb-21">
            {renderDropdownsRow()}
            {leadActivitySummary.status === "ARCHIVE" ? (
              <div className="flex-shrink-0 ml-70">
                <button
                  className="leads-new-inner-page-profile-row__colm2-btn"
                  onClick={handleOnClickProfileButton("restore_lead")}
                >
                  <img
                    src={require("../../../../src/assets/img/leads-new/delete.svg")}
                    alt=""
                    className="leads-new-inner-page-profile-row__delete-icon"
                  />
                  <span className="font-15-bold">Restore lead</span>
                </button>
              </div>
            ) : (
              <div className="flex-shrink-0 ml-70">
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
                  <span className="font-15-bold">archive lead</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  /*======================================================================
        renderDropdownsRow
  ======================================================================*/
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
      <div className="row mx-0 flex-grow-1 justify-content-between align-items-center mb-30 leads-new-dropdown-block">
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
          value={
            leadActivitySummary.status === "NEW_LEAD"
              ? "New Lead"
              : leadActivitySummary.status === "CONTACTED_LEADS"
              ? "Contacted Lead"
              : leadActivitySummary.status === "QUALIFIED_LEADS"
              ? "Qualified Lead"
              : leadActivitySummary.status === "OPPORTUNITIES"
              ? "Opportunity Lead"
              : leadActivitySummary.status === "CONVERTED"
              ? "Converted Lead"
              : leadActivitySummary.status === "ARCHIVE"
              ? "Archive"
              : leadActivitySummary.status === "ON_HOLD"
              ? "On Hold Lead"
              : ""
          }
        />
      </div>
    );
  };

  /*======================================================================
        renderButtons
  ======================================================================*/
  const handleOnClickProfileButton = (action) => (e) => {
    if (action === "remove_from_kanban") {
      dispatch(
        addToKanBanAction(
          leadActivitySummary._id,
          {
            isKanban: false,
          },
          "",
          userId,
          "Remove from kanban"
        )
      );
    } else if (action === "add_to_kanban") {
      dispatch(
        addToKanBanAction(
          leadActivitySummary._id,
          {
            isKanban: true,
          },
          "",
          userId,
          "Added to kanban"
        )
      );
    } else if (action === "unhide_lead") {
      dispatch(
        unhideLeadAction(
          leadActivitySummary._id,
          {
            isHidden: false,
          },
          "",
          userId
        )
      );
    } else if (action === "hide_lead") {
      dispatch(
        hideLeadAction(
          leadActivitySummary._id,
          {
            isHidden: true,
          },
          "",
          userId
        )
      );
    } else if (action === "restore_lead") {
      dispatch(
        updateLeadAction(
          leadActivitySummary._id,
          {
            status: "NEW_LEAD",
          },
          userId,
          ""
        )
      );
    } else if (action === "delete_lead") {
      setValues({
        ...values,
        deleteWarningPopup: true,
        deleteId: leadActivitySummary._id,
      });
      // this.props.deleteLead(
      //   leadActivitySummary._id,
      //   this.props.leadFilterName,
      //   this.props.userId
      // );
    }
  };

  // Dlete popup handlers
  const callBackDelete = () => {
    setValues({
      ...values,
      deleteWarningPopup: false,
      deleteId: "",
    });
  };

  const yesHandlder = () => {
    const { deleteId } = values;

    dispatch(deleteLead(deleteId, "", userId, callBackDelete));
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
      <div className="row mx-0 flex-nowrap align-items-start leads-new-inner-page-profile-row__colm2">
        <>
          <ActivitySummaryFollowUpModal
            leadActivityData={!isEmpty(leadActivityData) && leadActivityData}
          />
        </>
        <>
          <AddToLogModal
            modalButtonContent={addToLogButtonContent}
            modalButtonClassName="leads-new-inner-page-profile-row__colm2-btn"
            leadActivityData={
              !isEmpty(leadActivitySummary) && leadActivitySummary
            }
          />
        </>
        {leadActivitySummary.isKanban === true ? (
          <>
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
          </>
        ) : (
          <>
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
          </>
        )}

        {/* <>
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
        </> */}
        {leadActivitySummary.isHidden === true ? (
          <>
            <button
              className="leads-new-inner-page-profile-row__colm2-btn"
              onClick={handleOnClickProfileButton("unhide_lead")}
            >
              <img
                src="/img/desktop-dark-ui/icons/lead-eye-icon.svg"
                alt=""
                className="eye-img"
              />
              <span className="font-15-bold">unhide lead</span>
            </button>
          </>
        ) : (
          <>
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
          </>
        )}

        <>
          <ActivitySummaryCreateMailModal
            leadActivityData={!isEmpty(leadActivityData) && leadActivityData}
          />
        </>
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

      {renderProfileImgBlock()}
    </>
  );
}

export default LeadsNewDetailsProfile;
