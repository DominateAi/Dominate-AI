import React, { Fragment } from "react";
import isEmpty from "./../../../store/validations/is-empty";
import dateFns from "date-fns";

// gray icons to be displayed
const mapGrayIcons = ["1", "2", "3", "4"];

// timeline data left and right blocks
// const mapTimelines = ["1", "2", "3", "4", "5", "6"];
// total left and right blocks
// const mapTimelinesLength = mapTimelines.length - 1;

let mapTimelinesLength = 0;

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
  let dataToken = JSON.parse(localStorage.getItem("Data"));
  // console.log(timeline.organizer.profileImage);
  return (
    <div className="row mx-0 leads-timeline-card">
      <div className="leads-timeline-card__div">
        <h1 className="font-17-regular pb-10">
          {timeline.type === "EMAIL" ? "Sent by" : "Organized by"}{" "}
        </h1>
        <p className="font-17-semibold">
          <img
            src={`https://login.dominate.ai${timeline.organizer.profileImage}&token=${dataToken.token}`}
            alt="person"
            className="leads-timeline-card__div-img"
          />
          {timeline.organizer.name}
        </p>
      </div>
      <div className="leads-timeline-card__div">
        <h1 className="font-17-regular pb-10">Activity</h1>
        <p className="font-17-semibold">
          {timeline.type === "FOLLOWUP"
            ? "Follow up"
            : timeline.type === "EMAIL"
            ? "Email"
            : timeline.type === "MEETING"
            ? "Meeting"
            : ""}
        </p>
      </div>
      <div className="leads-timeline-card__div">
        <p className="font-17-regular pb-10">
          {timeline.type === "FOLLOWUP"
            ? dateFns.format(timeline.followupAtDate, "	Do MMM")
            : timeline.type === "EMAIL"
            ? dateFns.format(timeline.createdAt, "	Do MMM")
            : timeline.type === "MEETING"
            ? dateFns.format(timeline.meetingDate, "	Do MMM")
            : ""}{" "}
        </p>
        <p className="font-17-regular">
          {timeline.type === "FOLLOWUP"
            ? dateFns.format(timeline.followupAtTime, "HH:mm a")
            : timeline.type === "EMAIL"
            ? dateFns.format(timeline.createdAt, "HH:mm a")
            : timeline.type === "MEETING"
            ? dateFns.format(timeline.meetingTime, "HH:mm a")
            : ""}
        </p>
      </div>
    </div>
  );
};

function ActivityContentTimeline({ leadAllTimeline }) {
  // console.log(leadAllTimeline);
  let allLeadTimelineArray = [];
  if (leadAllTimeline) {
    allLeadTimelineArray = leadAllTimeline;
    mapTimelinesLength = allLeadTimelineArray.length - 1;
  }

  return (
    <div className="mt-20">
      {/* <h6 className="font-21-bold mb-30 pb-16 text-center">Timeline</h6> */}
      <div className="leads-new-details-timeline-block">
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
          <div className="leads-new-no-data-illustration-div">
            <div className="row mx-0 justify-content-center align-items-start">
              <img
                // src={require("../../../../src/assets/img/illustrations/leads-new-no-timeline.svg")}
                src="/img/desktop-dark-ui/illustrations/leads-new-no-timeline.svg"
                alt="no timeline"
                className="leads-new-no-data-illustration-div__no-timeline-img"
              />
            </div>
            <p className="font-18-medium color-white-79 mb-30 text-center">
              No activity yet
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ActivityContentTimeline;
