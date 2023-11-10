import React from "react";
import OverviewDemoPrevNextButtonBlock from "./OverviewDemoPrevNextButtonBlock";
import OverviewDemoTitleDescImgBlock from "./OverviewDemoTitleDescImgBlock";

export default function OverviewDemoModalScreen15({
  imgPath,
  handlePrev,
  handleNext
}) {
  return (
    <>
      <OverviewDemoTitleDescImgBlock
        iconPath={require("../../../assets/img/newmenu/task.svg")}
        title="Tasks"
        // imgPath={require("../../../assets/img/overview-demo/screen-15.png")}
        imgPath={imgPath}
        imgClassName="overview-demo__screen-9"
      >
        <p className="overview-demo__descDashboard">
          Track all your tasks and their status along with the deadlines in
          tasks section.
        </p>
      </OverviewDemoTitleDescImgBlock>

      <OverviewDemoPrevNextButtonBlock
        handlePrev={handlePrev}
        handleNext={handleNext}
      />
    </>
  );
}
