import React from "react";
import OverviewDemoPrevNextButtonBlock from "./OverviewDemoPrevNextButtonBlock";
import OverviewDemoTitleDescImgBlock from "./OverviewDemoTitleDescImgBlock";

export default function OverviewDemoModalScreen2({
  imgPath,
  handlePrev,
  handleNext
}) {
  return (
    <>
      <OverviewDemoTitleDescImgBlock
        iconPath={require("../../../assets/img/newmenu/dashboard.svg")}
        title="Dashboard"
        // imgPath={require("../../../assets/img/overview-demo/screen-2.png")}
        imgPath={imgPath}
        imgClassName="overview-demo__screen-2"
      >
        <p className="overview-demo__descDashboard">
          The dashboard will be having some useful widgets that can help you in
          management.
        </p>
      </OverviewDemoTitleDescImgBlock>

      <div className="overview-demo__tip-block overview-demo__tip-block--dashboard">
        <span
          className="overview-demo__tip-block-img"
          role="img"
          aria-labelledby="Light bulb"
        >
          💡
        </span>
        <h3 className="overview-demo__tip-block-title">Tip</h3>
        <p className="overview-demo__tip-block-desc">
          You can go back to Dashboard by clicking on the logo as well
        </p>
      </div>

      <OverviewDemoPrevNextButtonBlock
        handlePrev={handlePrev}
        handleNext={handleNext}
      />
    </>
  );
}
