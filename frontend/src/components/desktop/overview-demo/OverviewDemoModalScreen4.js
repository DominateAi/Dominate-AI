import React from "react";
import OverviewDemoPrevNextButtonBlock from "./OverviewDemoPrevNextButtonBlock";
import OverviewDemoTitleDescImgBlock from "./OverviewDemoTitleDescImgBlock";

export default function OverviewDemoModalScreen4({
  imgPath,
  handlePrev,
  handleNext
}) {
  return (
    <>
      <OverviewDemoTitleDescImgBlock
        iconPath={require("../../../assets/img/newmenu/employees.svg")}
        title="Team"
        // imgPath={require("../../../assets/img/overview-demo/screen-4.png")}
        imgPath={imgPath}
        imgClassName="overview-demo__screen-4"
      >
        <p className="overview-demo__descDashboard">
          Start by adding your team members to the workspace using{" "}
          <img
            src={require("../../../assets/img/overview-demo/buttons/add-member.png")}
            alt="add member"
            className="overview-demo__text-btn-img"
          />{" "}
          button
        </p>
      </OverviewDemoTitleDescImgBlock>

      <OverviewDemoPrevNextButtonBlock
        handlePrev={handlePrev}
        handleNext={handleNext}
      />
    </>
  );
}
