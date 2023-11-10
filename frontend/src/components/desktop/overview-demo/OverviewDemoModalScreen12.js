import React from "react";
import OverviewDemoPrevNextButtonBlock from "./OverviewDemoPrevNextButtonBlock";
import OverviewDemoTextAndImageBlock from "./OverviewDemoTextAndImageBlock";

export default function OverviewDemoModalScreen12({
  imgPath,
  handlePrev,
  handleNext
}) {
  return (
    <>
      <OverviewDemoTextAndImageBlock
        title="Now lets move on to our other features starting with reports"
        // imgPath={require("../../../assets/img/overview-demo/screen-12.png")}
        imgPath={imgPath}
        imgClassName="overview-demo__screen-3 overview-demo__screen-3--mt"
      />
      <OverviewDemoPrevNextButtonBlock
        handlePrev={handlePrev}
        handleNext={handleNext}
      />
    </>
  );
}
