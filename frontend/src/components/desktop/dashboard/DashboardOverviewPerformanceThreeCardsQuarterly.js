import React from "react";
import isEmpty from "./../../../store/validations/is-empty";
import { url } from "./../../../store/actions/config";

const first = (
  <div className="performance-score-block">
    <h1 className="font-40-extraBold">85</h1>
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
    <div className="performace-scoreboard-text">
      <h3 className="font-18-medium">John Doe</h3>
      <h4 className="font-15-light">Sales head</h4>
    </div>
  </div>
);

const second = (
  <div className="performance-score-block">
    <h1 className="font-32-extraBold">70</h1>
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
    <div className="performace-scoreboard-text">
      <h3 className="font-18-medium">John Doe</h3>
      <h4 className="font-15-light">Sales head</h4>
    </div>
  </div>
);

const third = (
  <div className="performance-score-block">
    <h1 className="font-32-extraBold">45</h1>
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
    <div className="performace-scoreboard-text">
      <h3 className="font-18-medium">John Doe</h3>
      <h4 className="font-15-light">Sales head</h4>
    </div>
  </div>
);

const DashboardOverviewPerformanceThreeCardsQuarterly = ({
  firstUser,
  secondUser,
  thirdUser,
  leaderBoardPrevious,
}) => {
  let arr = [];
  if (firstUser) {
    arr = firstUser;
  }

  let arr2 = [];
  if (secondUser) {
    arr2 = secondUser;
  }

  let arr3 = [];
  if (thirdUser) {
    arr3 = thirdUser;
  }

  let dataToken = JSON.parse(localStorage.getItem("Data"));
  // console.log(isEmpty(arr3) && arr3);

  let totalMembers = [];
  if (leaderBoardPrevious) {
    totalMembers = leaderBoardPrevious.length;
  }
  // console.log(totalMembers);

  return (
    <div className="performance-score-block-outer">
      {/* {third} */}
      {arr3.map((data, index) => (
        <div key={index} className="performance-score-block">
          <h1 className="font-32-extraBold">{data.count}</h1>
          <p className="font-12-light">Leads Closed</p>
          {/* img and badge */}
          <div className="img-badge-outer">
            <div className="img-badge-text-outer">
              <div className="img-badge-text">
                <span className="badgeCount">3</span>
                <img
                  src={require("../../../assets/img/dashboard/badge-second.svg")}
                  alt="badge"
                />
              </div>
            </div>
            <img
              src={`${url}${data.user.profileImage}&token=${dataToken.token}`}
              alt="person"
              className="performace-scoreboard-img"
            />
          </div>
          {/* img and badge end */}
          <div className="performace-scoreboard-text">
            <h3 className="font-18-medium">{data.user.name}</h3>
            <h4 className="font-15-light">{data.user.jobTitle}</h4>
          </div>
        </div>
      ))}

      {/* first */}

      {arr.map((data, index) => (
        <div
          key={index}
          className={
            totalMembers === 2
              ? "performance-score-block margin_when_two_sers_only"
              : "performance-score-block hello"
          }
        >
          <h1 className="font-40-extraBold">{data.count}</h1>
          <p className="font-12-light">Leads Closed </p>
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
              src={`${url}${data.user.profileImage}&token=${dataToken.token}`}
              alt="person"
              className="performace-scoreboard-img1"
            />
          </div>
          {/* img and badge end */}
          <div className="performace-scoreboard-text">
            <h3 className="font-18-medium">{data.user.name}</h3>
            <h4 className="font-15-light">{data.user.role.name}</h4>
          </div>
        </div>
      ))}

      {arr2.map((data, index) => (
        <div key={index} className="performance-score-block">
          <h1 className="font-32-extraBold">{data.count}</h1>
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
              src={`${url}${data.user.profileImage}&token=${dataToken.token}`}
              alt="person"
              className="performace-scoreboard-img"
            />
          </div>
          {/* img and badge end */}
          <div className="performace-scoreboard-text">
            <h3 className="font-18-medium">{data.user.name}</h3>
            <h4 className="font-15-light">{data.user.jobTitle}</h4>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardOverviewPerformanceThreeCardsQuarterly;
