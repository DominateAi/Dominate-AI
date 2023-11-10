import React from "react";
import isEmpty from "./../../../store/validations/is-empty";

const DashboardOverviewPerformanceCard = ({
  badgeCount,
  name,
  jobPost,
  count,
  user,
}) => {
  // console.log(user);
  let dataToken = JSON.parse(localStorage.getItem("Data"));
  return (
    <div className="dashboard-performance-card">
      <div>
        <div className="img-badge-text-card">
          <span className="badgeCount">{badgeCount}</span>
          <img
            src={require("../../../assets/img/dashboard/badge-common.svg")}
            alt="badge"
          />
        </div>
        <img
          src={
            !isEmpty(user) &&
            `${user.user.profileImage}&token=${dataToken.token}`
          }
          alt="person"
          className="leads-content-img leads-content-img--card"
        />
        <div className="performace-scoreboard-text">
          <h3 className="font-18-medium">{name}</h3>
          <h4 className="font-15-light">{jobPost}</h4>
        </div>
      </div>
      <div>
        <span className="font-36-extraBold pr-20">{count}</span>
        <span className="font-15-light mr-70">Leads closed</span>
      </div>
    </div>
  );
};

export default DashboardOverviewPerformanceCard;
