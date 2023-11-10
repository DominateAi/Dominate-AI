import React from "react";

const first = (
  <div className="performance-score-block">
    <h1 className="font-40-extraBold">95</h1>
    <p className="font-12-light">Leads Closed</p>
    {/* img and badge */}
    <div className="img-badge-outer">
      <div className="img-badge-text-outer-first">
        <div className="img-badge-text-first">
          <span className="badgeCount">1</span>
          <img
            src={require("../../../assets/img/dashboard/badge-first.svg")}
            alt="badge"
          />
        </div>
      </div>
      <img
        src={require("../../../assets/img/dashboard/scoreboard-img1.png")}
        alt="person"
        className="performace-scoreboard-img1"
      />
    </div>
    {/* img and badge end */}
    <h3 className="font-18-medium">John Doe</h3>
    <h4 className="font-15-light">Sales head</h4>
  </div>
);

const second = (
  <div className="performance-score-block">
    <h1 className="font-32-extraBold">80</h1>
    <p className="font-12-light">Leads Closed</p>
    {/* img and badge */}
    <div className="img-badge-outer">
      <div className="img-badge-text-outer">
        <div className="img-badge-text">
          <span className="badgeCount">2</span>
          <img
            src={require("../../../assets/img/dashboard/badge-second.svg")}
            alt="badge"
          />
        </div>
      </div>
      <img
        src={require("../../../assets/img/dashboard/scoreboard-img1.png")}
        alt="person"
        className="performace-scoreboard-img"
      />
    </div>
    {/* img and badge end */}
    <h3 className="font-18-medium">John Doe</h3>
    <h4 className="font-15-light">Sales head</h4>
  </div>
);

const third = (
  <div className="performance-score-block">
    <h1 className="font-32-extraBold">75</h1>
    <p className="font-12-light">Leads Closed</p>
    {/* img and badge */}
    <div className="img-badge-outer">
      <div className="img-badge-text-outer">
        <div className="img-badge-text">
          <span className="badgeCount">3</span>
          <img
            src={require("../../../assets/img/dashboard/badge-third.svg")}
            alt="badge"
          />
        </div>
      </div>
      <img
        src={require("../../../assets/img/dashboard/scoreboard-img1.png")}
        alt="person"
        className="performace-scoreboard-img"
      />
    </div>
    {/* img and badge end */}
    <h3 className="font-18-medium">John Doe</h3>
    <h4 className="font-15-light">Sales head</h4>
  </div>
);

const DashboardOverviewPerformanceThreeCardsAllTime = () => {
  return (
    <div className="performance-score-block-outer">
      {third}
      {first}
      {second}
    </div>
  );
};

export default DashboardOverviewPerformanceThreeCardsAllTime;
