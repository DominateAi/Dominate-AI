import React from "react";
import OverviewDemoPrevNextButtonBlock from "./OverviewDemoPrevNextButtonBlock";
import OverviewDemoTitleDescImgBlock from "./OverviewDemoTitleDescImgBlock";

export default function OverviewDemoModalScreen13({
  imgPath,
  handlePrev,
  handleNext
}) {
  return (
    <>
      <OverviewDemoTitleDescImgBlock
        iconPath={require("../../../assets/img/newmenu/REPORTS.svg")}
        title="Reports"
        // imgPath={require("../../../assets/img/overview-demo/screen-13.png")}
        imgPath={imgPath}
        imgClassName="overview-demo__screen-9"
      >
        <p className="overview-demo__descDashboard">
          The reports section in dominate is filled with various visualisations
          to help understand your progress and statistics better.
        </p>
      </OverviewDemoTitleDescImgBlock>

      <OverviewDemoPrevNextButtonBlock
        handlePrev={handlePrev}
        handleNext={handleNext}
      />
    </>
  );
}
