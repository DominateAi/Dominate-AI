import React from "react";
import OverviewDemoPrevNextButtonBlock from "./OverviewDemoPrevNextButtonBlock";
import OverviewDemoTitleDescImgBlock from "./OverviewDemoTitleDescImgBlock";

export default function OverviewDemoModalScreen14({
  imgPath,
  handlePrev,
  handleNext
}) {
  return (
    <>
      <OverviewDemoTitleDescImgBlock
        iconPath={require("../../../assets/img/newmenu/calender.svg")}
        title="Calendar"
        // imgPath={require("../../../assets/img/overview-demo/screen-14.png")}
        imgPath={imgPath}
        imgClassName="overview-demo__screen-9"
      >
        <p className="overview-demo__descDashboard">
          The calender section has all your meetings, leaves, follow ups
          information
        </p>
      </OverviewDemoTitleDescImgBlock>

      <OverviewDemoPrevNextButtonBlock
        handlePrev={handlePrev}
        handleNext={handleNext}
      />
    </>
  );
}
