import React, { useState } from "react";
// import React, { Component } from "react";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
import { connect } from "react-redux";
import { updateLeadInAccountDetails } from "./../../../store/actions/accountsAction";
import isEmpty from "../../../store/validations/is-empty";
import { useDispatch } from "react-redux";

const emojiOption = ["🌋", "☀️", "☕", "❄️️"];

const statusLeadOption = [
  "New Lead",
  "Qualified Lead",
  "On Hold Lead",
  "Contacted Lead",
  "Opportunity Lead",
  "Converted Lead",
  "Drop Lead",
];

function AccountsDetailProfileFormDisplayContactsLeadsCard({ cardData }) {
  const dispatch = useDispatch();
  const [values, setValues] = useState({
    statusLeadValue: statusLeadOption[0].value,
    statusLead: statusLeadOption[0],
    emojiValue: emojiOption[0].value,
    emoji: emojiOption[0],
  });

  const handleDropdownChange = (e) => {
    // const { cardData } = this.props;
    setValues({ ...values, statusLead: e, statusLeadValue: e.value });
    console.log(`Option selected:`, e);
    if (e.value === "New Lead") {
      let leadAllData = cardData;
      leadAllData.status = "NEW_LEAD";

      dispatch(updateLeadInAccountDetails(cardData._id, leadAllData));
    } else if (e.value === "Qualified Lead") {
      let leadAllData = cardData;
      leadAllData.status = "QUALIFIED_LEADS";

      dispatch(updateLeadInAccountDetails(cardData._id, leadAllData));
    } else if (e.value === "On Hold Lead") {
      let leadAllData = cardData;
      leadAllData.status = "ON_HOLD";

      dispatch(updateLeadInAccountDetails(cardData._id, leadAllData));
    } else if (e.value === "Contacted Lead") {
      let leadAllData = cardData;
      leadAllData.status = "CONTACTED_LEADS";

      dispatch(updateLeadInAccountDetails(cardData._id, leadAllData));
    } else if (e.value === "Opportunity Lead") {
      let leadAllData = cardData;
      leadAllData.status = "OPPORTUNITIES";

      dispatch(updateLeadInAccountDetails(cardData._id, leadAllData));
    } else if (e.value === "Converted Lead") {
      let leadAllData = cardData;
      leadAllData.status = "CONVERTED";
      leadAllData.convertedDate = new Date().toISOString();
      dispatch(updateLeadInAccountDetails(cardData._id, leadAllData));
    } else if (e.value === "Drop Lead") {
      let leadAllData = cardData;
      leadAllData.status = "DROPPED_LEAD";
      leadAllData.convertedDate = new Date().toISOString();
      dispatch(updateLeadInAccountDetails(cardData._id, leadAllData));
    }
  };

  const handleDropdownEmojiChange = (e) => {
    // const { cardData } = this.props;
    setValues({ ...values, emoji: e, emojiValue: e.value });
    console.log(`Option selected:`, e);
    if (e.value === "🌋") {
      let leadAllData = cardData;
      cardData.degree = "SUPER_HOT";
      dispatch(updateLeadInAccountDetails(cardData._id, leadAllData));
    } else if (e.value === "☀️") {
      let leadAllData = cardData;
      cardData.degree = "HOT";
      dispatch(updateLeadInAccountDetails(cardData._id, leadAllData));
    } else if (e.value === "☕") {
      let leadAllData = cardData;
      cardData.degree = "WARM";
      dispatch(updateLeadInAccountDetails(cardData._id, leadAllData));
    } else {
      let leadAllData = cardData;
      cardData.degree = "COLD";
      dispatch(updateLeadInAccountDetails(cardData._id, leadAllData));
    }
  };

  return (
    <div className="row flex-nowrap align-items-center mx-0 accounts-profile-display-fields-text-block-contactLeads">
      {/* <div className="row flex-nowrap align-items-center mx-0"> */}
      {/* <div className="row flex-nowrap align-items-center mx-0 "> */}
      {/*===============================================================
      
                profileImg,name,email
      
      ================================================================*/}
      <div className="accounts-profile-display-fields-text-block-contactLeads-col-1 flex-nowrap row mx-0 align-items-center">
        <div className="accounts-profile-display-fields-text-block-salesperson-img-div">
          <img
            src={require("../../../assets/img/accounts/deal-dot.svg")}
            alt="sales person"
            className="accounts-profile-display-fields-text-block-salesperson-img"
          />
        </div>
        <div>
          <h3 className="font-18-semibold accounts-profile-display-fields-text-block-contactLeads-title">
            {cardData.name}
          </h3>
          <h3 className="font-18-regular accounts-profile-display-fields-text-block-contactLeads-data accounts-profile-display-fields-text-block-contactLeads-data--email">
            {cardData.email}
          </h3>
        </div>
      </div>
      {/*===============================================================
      
                phoneNumber
      
      ================================================================*/}{" "}
      <h3 className="font-18-regular accounts-profile-display-fields-text-block-contactLeads-data accounts-profile-display-fields-text-block-contactLeads-data--pnumber">
        {!isEmpty(cardData.phone) ? <>{cardData.phone}</> : "NA"}
      </h3>{" "}
      {/*===============================================================
      
                     emoji
      
      ================================================================*/}{" "}
      <div className="row mx-0 accounts-profile-display-fields-text-block-contactLeads-2 align-items-center">
        {/* <h3 className="accounts-profile-display-fields-text-block-contactLeads-subtitle pt-10">
              level
            </h3> */}
        <Dropdown
          className="lead-status-dropDown lead-status-dropDown--accounts-profile-display-fields-text-block-contactLeads lead-status-dropDown--accounts-profile-display-fields-text-block-contactLeads-emoji"
          options={emojiOption}
          value={
            cardData.degree === "SUPER_HOT"
              ? emojiOption[0]
              : cardData.degree === "HOT"
              ? emojiOption[1]
              : cardData.degree === "WARM"
              ? emojiOption[2]
              : cardData.degree === "COLD"
              ? emojiOption[3]
              : ""
          }
          onChange={(e) => handleDropdownEmojiChange(e)}
        />
      </div>
      {/* <div className="row mx-0 accounts-profile-display-fields-text-block-contactLeads-col-3">
            <h3 className="accounts-profile-display-fields-text-block-contactLeads-subtitle">
              Email adress
            </h3>
            <h3 className="font-18-semibold accounts-profile-display-fields-text-block-contactLeads-data">
              {cardData.email}
            </h3>
          </div> */}
      {/* <div className="row mx-0 accounts-profile-display-fields-text-block-contactLeads-col-4">
            <h3 className="accounts-profile-display-fields-text-block-contactLeads-subtitle">
              phone number
            </h3>
            <h3 className="font-18-semibold accounts-profile-display-fields-text-block-contactLeads-data">
              {!isEmpty(cardData.phone) ? <>{cardData.phone}</> : "NA"}
            </h3>
          </div>*/}
      {/* </div> */}
      {/*===============================================================
      
                     assign
      
      ================================================================*/}{" "}
      <div className="accounts-profile-display-fields-text-block-contactLeads-row2-col-2">
        <h3 className="font-18-regular accounts-profile-display-fields-text-block-contactLeads-data accounts-profile-display-fields-text-block-contactLeads-data--assign">
          {cardData.assigned.name}
        </h3>{" "}
      </div>
      {/*===============================================================
      
                     status
      
      ================================================================*/}{" "}
      {/* <div className="row mx-0 align-items-center accounts-profile-display-fields-text-block-contactLeads-row2"> */}
      <div className="accounts-profile-display-fields-text-block-contactLeads-row2-col-1">
        {/* <h3 className="accounts-profile-display-fields-text-block-contactLeads-subtitle">
              Status
            </h3> */}
        <Dropdown
          className="lead-status-dropDown font-18-semibold lead-status-dropDown--accounts-profile-display-fields-text-block-contactLeads"
          options={statusLeadOption}
          value={
            cardData.status === "NEW_LEAD"
              ? "New Lead"
              : cardData.status === "CONTACTED_LEADS"
              ? "Contacted Lead"
              : cardData.status === "QUALIFIED_LEADS"
              ? "Qualified Lead"
              : cardData.status === "OPPORTUNITIES"
              ? "Opportunity Lead"
              : cardData.status === "CONVERTED"
              ? "Converted Lead"
              : cardData.status === "ARCHIVE"
              ? "Archive"
              : cardData.status === "ON_HOLD"
              ? "On Hold Lead"
              : cardData.status === "DROPPED_LEAD"
              ? "Drop Lead"
              : ""
          }
          onChange={(e) => handleDropdownChange(e)}
        />
      </div>
      {/* <div className="accounts-profile-display-fields-text-block-contactLeads-row2-col-2">
            <h3 className="accounts-profile-display-fields-text-block-contactLeads-subtitle">
              Assigned to
            </h3>
            <h3 className="font-18-semibold accounts-profile-display-fields-text-block-contactLeads-data">
              {cardData.assigned.name}
            </h3>
          </div> */}
      {/* </div> */}
    </div>
    // </div>
  );
}

export default AccountsDetailProfileFormDisplayContactsLeadsCard;
