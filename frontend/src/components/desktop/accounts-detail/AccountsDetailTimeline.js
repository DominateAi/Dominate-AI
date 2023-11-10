import React, { Fragment } from "react";
import isEmpty from "./../../../store/validations/is-empty";
import dateFns from "date-fns";

// gray icons to be displayed
const mapGrayIcons = ["1", "2", "3", "4", "5", "6"];

// timeline data left and right blocks
const mapTimelines = ["1", "2", "3", "4", "5", "6"];
// total left and right blocks
let mapTimelinesLength = mapTimelines.length - 1;

// let mapTimelinesLength = 0;

/*
 *  renderOranngeAndGrayBlocks
 */
const renderOranngeAndGrayBlocks = () => (
  <div className="leads-timeline-icons-block">
    <img
      src={require("../../../assets/img/icons/timeline-icon-orange.svg")}
      alt="timeline"
      className="leads-timeline-orange-icon"
    />
    {mapGrayIcons.map((data, index) => (
      <span key={index} className="leads-timeline-gray-icon"></span>
    ))}
  </div>
);

/*
 *  renderOranngeBlock
 */
const renderOranngeBlock = () => (
  <div className="leads-timeline-icons-block">
    <img
      src={require("../../../assets/img/icons/timeline-icon-orange.svg")}
      alt="timeline"
      className="leads-timeline-orange-icon"
    />
  </div>
);

const renderCardData = (timeline) => {
  if (
    timeline.activityType === "DEAL_CREATED" ||
    timeline.activityType === "DEAL_CLOSED"
  ) {
    return (
      <div className="account-detail-timeline-card">
        <div className="row mx-0 justify-content-between align-items-baseline">
          <h2 className="font-26-semibold account-detail-timeline-card__ttitle">
            {timeline.activityType === "DEAL_CREATED"
              ? "Deal created"
              : "Deal closed"}
          </h2>
          <p className="font-16-regular account-detail-timeline-card__text1">
            {dateFns.format(timeline.createdAt, "Do MMM hh:mm a")}
          </p>
        </div>
        <p className="font-16-regular account-detail-timeline-card__text2">
          {timeline.data.dealname}
        </p>
        <p className="font-16-semibold account-detail-timeline-card__text3">
          Booked by
        </p>
        <p className="font-16-regular account-detail-timeline-card__text4">
          {timeline.user.name}
        </p>
      </div>
    );
  } else {
    return (
      <div className="account-detail-timeline-card">
        <div className="row mx-0 justify-content-between align-items-baseline">
          <h2 className="font-26-semibold account-detail-timeline-card__ttitle">
            {timeline.activityType === "LEAD_CREATED"
              ? "Lead created"
              : "Lead updated"}
          </h2>
          <p className="font-16-regular account-detail-timeline-card__text1">
            {dateFns.format(timeline.createdAt, "Do MMM hh:mm a")}
            {/* 13th July 11:00 am */}
          </p>
        </div>
        <p className="font-16-regular account-detail-timeline-card__text2">
          {timeline.data.name}
        </p>
        <p className="font-16-semibold account-detail-timeline-card__text3">
          Booked by
        </p>
        <p className="font-16-regular account-detail-timeline-card__text4">
          {timeline.user.name}
        </p>
      </div>
    );
  }
};

function AccountsDetailTimeline({ accountTimeline }) {
  // console.log(accountTimeline);
  let allLeadTimelineArray = [];
  if (accountTimeline) {
    allLeadTimelineArray = accountTimeline;
    mapTimelinesLength = allLeadTimelineArray.length - 1;
  }

  return (
    <div className="mt-20">
      <div className="leads-new-details-timeline-block leads-new-details-timeline-block--account-timeline-block">
        {!isEmpty(allLeadTimelineArray) ? (
          allLeadTimelineArray.map((timeline, index) => {
            return (
              <Fragment key={index}>
                {index % 2 === 0 && (
                  <div
                    key={index}
                    className="leads-timeline-left-block-with-icons"
                  >
                    <div className="leads-timeline-left-block">
                      {renderCardData(timeline)}
                    </div>
                    {/* at last timeline block display only orange dot */}
                    {mapTimelinesLength === index
                      ? renderOranngeBlock()
                      : renderOranngeAndGrayBlocks()}
                  </div>
                )}
                {index % 2 === 1 && (
                  <div
                    key={index}
                    className="leads-timeline-right-block-with-icons"
                  >
                    {/* at last timeline block display only orange dot */}
                    {mapTimelinesLength === index
                      ? renderOranngeBlock()
                      : renderOranngeAndGrayBlocks()}
                    <div className="leads-timeline-right-block">
                      {renderCardData(timeline)}
                    </div>
                  </div>
                )}
              </Fragment>
            );
          })
        ) : (
          <div className="text-center no-leads-found-div">
            <img
              // src={require("../../../../src/assets/img/accounts-new/no_timeline_found.png")}
              src="/img/desktop-dark-ui/illustrations/accounts-timeline-no-data.svg"
              alt="timeline not found"
              className="no-timeline-found-img"
            />
            <p className="font-38-medium color-white-79 mb-30 text-center">
              No Activity Yet
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default AccountsDetailTimeline;
