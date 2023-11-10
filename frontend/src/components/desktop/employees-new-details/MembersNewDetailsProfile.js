import React, { Component } from "react";
import { Link } from "react-router-dom";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import isEmpty from "./../../../store/validations/is-empty";

export class MembersNewDetailsProfile extends Component {
  renderProfileImgBlock = () => {
    const { employeeData } = this.props;
    let dataToken = JSON.parse(localStorage.getItem("Data"));
    // console.log(employeeData);
    return (
      <div className="leads-new-details-main-profile">
        <div className="leads-new-details-main-profile__img-block">
          <img
            src={`${employeeData.profileImage}&token=${dataToken.token}`}
            alt="person"
            className="leads-new-details-main-profile__img"
          />
        </div>
        <div>
          <h3 className="font-24-semibold leads-new-details-main-profile__title">
            {employeeData.firstName}
          </h3>
          <Link to="/message">
            <span className="members-new-list-btn members-new-list-btn--chat">
              <img
                src={require("../../../assets/img/icons/chat-icon.svg")}
                alt="chat"
                className="members-new-details-profile-chat-icon"
              />
              Chat
            </span>
          </Link>
          <div className="row mx-0 mb-30">
            <p className="font-21-bold members-new-block-view__text-follow-up mr-30">
              upcoming leaves
            </p>
            <div>
              <span className="members-new-block-view__leads-closed">
                12-07-2020
              </span>
              <span className="members-new-block-view__text-upcoming-leaves-light">
                To
              </span>
              <span className="members-new-block-view__leads-closed">
                17-07-2020
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  renderCountsBlock = () => {
    const { employeeData } = this.props;
    return (
      <div className="row mx-0 members-new-details-profile-counts-row">
        <div className="members-new-details-profile-count-block">
          <h4 className="members-new-details-profile-count-text">
            {employeeData.followupCount}
          </h4>
          <p className="font-21-bold members-new-block-view__text-follow-up">
            Follow ups
          </p>
        </div>
        <div className="members-new-details-profile-count-block">
          <h4 className="members-new-details-profile-count-text">
            {employeeData.callCount}
          </h4>
          <p className="font-21-bold members-new-block-view__text-follow-up">
            Calls
          </p>
        </div>
        <div className="members-new-details-profile-count-block">
          <h4 className="members-new-details-profile-count-text">
            {employeeData.meetingsCount}
          </h4>
          <p className="font-21-bold members-new-block-view__text-follow-up">
            meetings
          </p>
        </div>
        <div className="members-new-details-profile-count-block">
          <h4 className="members-new-details-profile-count-text">
            {employeeData.closedCount}
          </h4>
          <p className="font-21-bold members-new-block-view__text-follow-up">
            Leads closed
          </p>
        </div>
      </div>
    );
  };

  renderProgressbarBlock = () => {
    const { employeeData } = this.props;
    const percentage = !isEmpty(employeeData.conversionRate)
      ? employeeData.conversionRate
      : 45;
    return (
      <div>
        <div className="members-new-CircularProgressbar members-new-CircularProgressbar--detailsProfile">
          <CircularProgressbar
            value={parseInt(employeeData.closedPercentage)}
            text={`${parseInt(employeeData.closedPercentage)}%`}
            styles={buildStyles({
              strokeLinecap: "round",
              pathTransitionDuration: 0.5,
              pathTransition: "none",
              // Colors
              pathColor: "#54349F",
              textColor: "#303030",
              trailColor: "#C8DFF7",
              backgroundColor: "#3e98c7",
            })}
          />
        </div>
        <p className="font-21-bold members-new-block-view__text-follow-up">
          lead closure probability
        </p>
      </div>
    );
  };

  render() {
    return (
      <div className="row mx-0 justify-content-between leads-new-inner-page-profile-row">
        {this.renderProfileImgBlock()}
        {this.renderCountsBlock()}
        {this.renderProgressbarBlock()}
      </div>
    );
  }
}

export default MembersNewDetailsProfile;
