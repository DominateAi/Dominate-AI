import React, { useState } from "react";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
import DropdownIcon from "rc-dropdown";
import "rc-dropdown/assets/index.css";
import { connect } from "react-redux";
import { updateLeadInAccountDetails } from "./../../../store/actions/accountsAction";
import { withRouter, useHistory } from "react-router-dom";
import isEmpty from "../../../store/validations/is-empty";
import { useDispatch, useSelector } from "react-redux";

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

function AccountsDetailLeadsCard({ cardData, filterName }) {
  const history = useHistory();
  const dispatch = useDispatch();
  const [values, setValues] = useState({
    statusLeadValue: statusLeadOption[0].value,
    statusLead: statusLeadOption[0],
    emojiValue: emojiOption[0].value,
    emoji: emojiOption[0],
  });

  const singleAccountData = useSelector(
    (state) => state.account.singleAccountData
  );

  const handleDropdownChange = (e) => {
    // const { cardData, filterName } = this.props;

    console.log(filterName);
    setValues({ ...values, statusLead: e, statusLeadValue: e.value });
    console.log(`Option selected:`, e);
    if (e.value === "New Lead") {
      let leadAllData = cardData;
      leadAllData.status = "NEW_LEAD";

      dispatch(
        updateLeadInAccountDetails(cardData._id, leadAllData, filterName)
      );
    } else if (e.value === "Qualified Lead") {
      let leadAllData = cardData;
      leadAllData.status = "QUALIFIED_LEADS";

      dispatch(
        updateLeadInAccountDetails(cardData._id, leadAllData, filterName)
      );
    } else if (e.value === "On Hold Lead") {
      let leadAllData = cardData;
      leadAllData.status = "ON_HOLD";

      dispatch(
        updateLeadInAccountDetails(cardData._id, leadAllData, filterName)
      );
    } else if (e.value === "Contacted Lead") {
      let leadAllData = cardData;
      leadAllData.status = "CONTACTED_LEADS";

      dispatch(
        updateLeadInAccountDetails(cardData._id, leadAllData, filterName)
      );
    } else if (e.value === "Opportunity Lead") {
      let leadAllData = cardData;
      leadAllData.status = "OPPORTUNITIES";

      dispatch(
        updateLeadInAccountDetails(cardData._id, leadAllData, filterName)
      );
    } else if (e.value === "Converted Lead") {
      let leadAllData = cardData;
      leadAllData.status = "CONVERTED";
      leadAllData.convertedDate = new Date().toISOString();
      dispatch(
        updateLeadInAccountDetails(cardData._id, leadAllData, filterName)
      );
    } else if (e.value === "Drop Lead") {
      let leadAllData = cardData;
      leadAllData.status = "DROPPED_LEAD";
      leadAllData.convertedDate = new Date().toISOString();
      dispatch(
        updateLeadInAccountDetails(cardData._id, leadAllData, filterName)
      );
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

  const viewHandler = () => {
    // const { cardData, singleAccountData } = this.props;
    history.push({
      pathname: "/leads-new-details",
      state: {
        detail: cardData,
        prevUrl: "/accounts-detail-new",
        accountData: singleAccountData,
      },
    });
  };
  return (
    <div className="accounts-details-leads-card-container">
      <div className="row mx-0 align-items-center flex-nowrap accounts-details-leads-card-container__row1 mb-20">
        {/* <div className="row mx-0 align-items-center flex-nowrap"> */}
        <div className="row mx-0 align-items-center flex-nowrap accounts-details-leads-card-container_img-title-div">
          <div className="accounts-details-leads-card-container__img-block">
            <img
              src={require("../../../assets/img/accounts/deals.svg")}
              alt="accounts"
              className="accounts-card-block_profileImg"
            />
          </div>
          {/* <div className="mb-25"> */}
          <h3 className="font-18-semibold accounts-details-leads-card-container_text">
            {cardData.name}
          </h3>
        </div>
        {/* <div className="row mx-0 pt-2 align-items-center"> */}
        {/* <h3 className="accounts-details-leads-card-container_text-2">
                level
              </h3> */}
        <div className="accounts-details-leads-card-container_level-dropdown">
          <Dropdown
            className="lead-status-dropDown lead-status-dropDown--accounts-details-leads-cards lead-status-dropDown--accounts-details-leads-emoji"
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
        {/* </div> */}
        <h3 className="font-18-semibold accounts-details-leads-card-container_text--4 accounts-details-leads-card-container_text--assigned">
          {!isEmpty(cardData.assigned) && cardData.assigned.name}
        </h3>
        <h3 className="font-18-semibold accounts-details-leads-card-container_text--4 accounts-details-leads-card-container_status-dropdown">
          <Dropdown
            className="lead-status-dropDown lead-status-dropDown--accounts-details-leads-cards"
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
          {cardData.status === "ARCHIVE" && (
            <>
              {" "}
              {/* <p>show label</p> */}
              <div className="row mx-0 align-items-center leads-archived-div leads-archived-div--accounts-details">
                <img
                  src={require("../../../assets/img/leads-new/archive-leads.svg")}
                  alt="archived leads"
                  className="archived-leads-img"
                />
                <span className="archived-leads-text">Lead Archived</span>
              </div>
            </>
          )}
        </h3>
        {/* </div> */}
        {/* </div> */}
        {/* <div>
          <button
            onClick={viewHandler}
            className="accounts-card-list-btn accounts-card-list-btn--view"
          >
            View
          </button>
        </div> */}
      </div>
      {/* <div className="row mx-0  accounts-details-leads-card-container--middel-div mb-30"> */}
      {/* <div className="column">
          <h3 className="font-21-bold accounts-details-leads-card-container_text--3">
            Assigned to
          </h3>
          <h3 className="font-18-semibold accounts-details-leads-card-container_text--4">
            {!isEmpty(cardData.assigned) && cardData.assigned.name}
          </h3>
        </div> */}
      {/*<div className="column align-items-start ml-200">
          <h3 className="font-21-bold accounts-details-leads-card-container_text--3">
            Status
          </h3>
           <h3 className="font-18-semibold accounts-details-leads-card-container_text--4">
            <Dropdown
              className="lead-status-dropDown lead-status-dropDown--accounts-details-leads-cards"
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
            {cardData.status === "ARCHIVE" && (
              <>
                {" "}
                <p>show label</p>
                <div className="row mx-0 align-items-center leads-archived-div leads-archived-div--accounts-details">
                  <img
                    src={require("../../../assets/img/leads-new/archive-leads.svg")}
                    alt="archived leads"
                    className="archived-leads-img"
                  />
                  <span className="archived-leads-text">Lead Archived</span>
                </div>
              </>
            )}
          </h3>
        </div> */}
      {/* </div> */}
      <div className="row mx-0 align-items-center flex-nowrap accounts-details-leads-card-container_deal">
        <h3 className="font-14-semibold accounts-details-leads-card-container_text--3">
          Deals :
        </h3>
        <h3 className="font-18-semibold accounts-details-leads-card-container_text--4 accounts-details-leads-card-container_text--deal-text">
          None{" "}
        </h3>
      </div>
    </div>
  );
}

export default AccountsDetailLeadsCard;
