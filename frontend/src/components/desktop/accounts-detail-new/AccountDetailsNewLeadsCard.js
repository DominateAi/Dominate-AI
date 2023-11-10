import React, { useState, useEffect } from "react";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
import ActivitySummaryFollowUpModal from "../activity/ActivitySummaryFollowUpModal";
// import { connect } from "react-redux";
import isEmpty from "../../../store/validations/is-empty";
import { updateLeadInAccountDetails } from "./../../../store/actions/accountsAction";
import AddLead from "./../leads/AddLead";
import displaySmallText from "./../../../store/utils/sliceString";
import { useSelector, useDispatch } from "react-redux";

const dummyData = [1, 2, 3];

const emojiOption = ["🌋", "☀️", "☕", "❄️️"];

const levelOptions = [
  "New Lead",
  "Qualified Lead",
  "On Hold Lead",
  "Contacted Lead",
  "Opportunity Lead",
  "Converted Lead",
  "Drop Lead",
];

function AccountDetailsNewLeadsCard() {
  const dispatch = useDispatch();
  const [values, setValues] = useState({
    selectedLevel: "",
    leadsOfAccount: [],
  });

  const leadsOfAccountReducer = useSelector(
    (state) => state.account.leadsOfAccount
  );

  useEffect(() => {
    if (!isEmpty(leadsOfAccountReducer)) {
      setValues({
        ...values,
        leadsOfAccount: leadsOfAccountReducer,
      });
    }
  }, [leadsOfAccountReducer]);

  /*======================================================================
        onAllLeadDropdownSelect
  ======================================================================*/
  const onAllLeadDropdownSelect = (leadData) => (e) => {
    // console.log(e.value);

    if (e.value === "🌋") {
      dispatch(
        updateLeadInAccountDetails(
          leadData._id,
          { degree: "SUPER_HOT" },
          "",
          ""
        )
      );
    } else if (e.value === "☀️") {
      dispatch(
        updateLeadInAccountDetails(leadData._id, { degree: "HOT" }, "", "")
      );
    } else if (e.value === "☕") {
      dispatch(
        updateLeadInAccountDetails(leadData._id, { degree: "WARM" }, "", "")
      );
    } else {
      dispatch(
        updateLeadInAccountDetails(leadData._id, { degree: "COLD" }, "", "")
      );
    }
  };

  const onAlLevelDropdownSelect = (leadData) => (e) => {
    if (e.value === "New Lead") {
      let leadAllData = leadData;
      leadAllData.status = "NEW_LEAD";

      dispatch(updateLeadInAccountDetails(leadData._id, leadAllData, "", ""));
    } else if (e.value === "Qualified Lead") {
      let leadAllData = leadData;
      leadAllData.status = "QUALIFIED_LEADS";

      dispatch(updateLeadInAccountDetails(leadData._id, leadAllData, "", ""));
    } else if (e.value === "On Hold Lead") {
      let leadAllData = leadData;
      leadAllData.status = "ON_HOLD";

      dispatch(updateLeadInAccountDetails(leadData._id, leadAllData, "", ""));
    } else if (e.value === "Contacted Lead") {
      let leadAllData = leadData;
      leadAllData.status = "CONTACTED_LEADS";

      dispatch(updateLeadInAccountDetails(leadData._id, leadAllData, "", ""));
    } else if (e.value === "Opportunity Lead") {
      let leadAllData = leadData;
      leadAllData.status = "OPPORTUNITIES";

      dispatch(updateLeadInAccountDetails(leadData._id, leadAllData, "", ""));
    } else if (e.value === "Converted Lead") {
      let leadAllData = leadData;
      leadAllData.status = "CONVERTED";
      leadAllData.convertedDate = new Date().toISOString();
      leadAllData.entityType = "Account";
      leadAllData.entityId = leadData.account_id._id;
      dispatch(updateLeadInAccountDetails(leadData._id, leadAllData, "", ""));
    } else if (e.value === "Drop Lead") {
      let leadAllData = leadData;
      leadAllData.status = "DROPPED_LEAD";
      leadAllData.convertedDate = new Date().toISOString();
      dispatch(updateLeadInAccountDetails(leadData._id, leadAllData, "", ""));
    }
  };

  return (
    <>
      <div className="accounts-detail-new-card-calendar">
        <h3 className="accounts-new-details-us-title accounts-new-details-us-title--leads">
          <img
            src={require("../../../../src/assets/img/accounts-new/leads-icon.svg")}
            alt="leads"
            className="accounts-new-details-profile-calendar-icon"
          />
          Leads
        </h3>

        <div className="accounts-new-details-us-table-div accounts-new-details-us-table-div--leads">
          <table>
            <tbody>
              {!isEmpty(values.leadsOfAccount) ? (
                values.leadsOfAccount.map((data, index) => (
                  <tr key={index}>
                    <td>
                      <div className="row mx-0 flex-nowrap align-items-start accounts-new-details-leads-text-block">
                        <div className="flex-shrink-0 accounts-new-details-us-blue-circle-icon-block">
                          {/* <img
                            // src={require("../../../../src/assets/img/leads/lead_default_img.svg")}
                            alt=""
                          /> */}
                        </div>

                        <div className="accounts-new-details-leads-text-1--width1">
                          <span className="accounts-new-details-leads-text-1">
                            {displaySmallText(data.name, 15, true)}
                          </span>
                        </div>

                        <ActivitySummaryFollowUpModal
                          leadActivityData={data}
                          buttonClassName="accounts-new-details-leads-add-follow-up-btn"
                          buttonText="Add followup"
                        />
                      </div>
                      <div className="w-100 row mx-0 flex-nowrap align-items-center accounts-new-details-leads-dropdowns-div">
                        <Dropdown
                          className="font-24-semibold lead-status-dropDown lead-status-dropDown--emoji ml-0 mr-0"
                          options={emojiOption}
                          value={
                            data.degree === "SUPER_HOT"
                              ? emojiOption[0]
                              : data.degree === "HOT"
                              ? emojiOption[1]
                              : data.degree === "WARM"
                              ? emojiOption[2]
                              : data.degree === "COLD"
                              ? emojiOption[3]
                              : ""
                          }
                          onChange={onAllLeadDropdownSelect(data)}
                        />
                        <Dropdown
                          className="lead-status-dropDown lead-status-dropDown--level ml-0"
                          options={levelOptions}
                          value={
                            data.status === "NEW_LEAD"
                              ? "New Lead"
                              : data.status === "CONTACTED_LEADS"
                              ? "Contacted Lead"
                              : data.status === "QUALIFIED_LEADS"
                              ? "Qualified Lead"
                              : data.status === "OPPORTUNITIES"
                              ? "Opportunity Lead"
                              : data.status === "CONVERTED"
                              ? "Converted Lead"
                              : data.status === "ARCHIVE"
                              ? "Archive"
                              : data.status === "ON_HOLD"
                              ? "On Hold Lead"
                              : data.status === "DROPPED_LEAD"
                              ? "Drop Lead"
                              : ""
                          }
                          onChange={onAlLevelDropdownSelect(data)}
                          // placeholder={levelOptions[0]}
                        />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr className="border-bottom-0">
                  <td colSpan="100" className="py-0">
                    <div className="no_leads_found pb-16">
                      {/* <img
                        className="no_leads_img"
                        src={require("../../../../src/assets/img/accounts-new/no_leads.png")}
                        alt="lead"
                      />                      
                      <p className="no-lead-found-text pl-0">No Leads Added</p> */}
                      <img
                        src="/img/desktop-dark-ui/illustrations/lead-pipeline-inner-list-view.svg"
                        alt=""
                        className="no_leads_img mb-18 mt-10"
                      />
                      <AddLead
                        isMobile={false}
                        className="leads-title-block-btn-red-bg mr-30 ml-30"
                        buttonText="Add New Lead"
                      />
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default AccountDetailsNewLeadsCard;
