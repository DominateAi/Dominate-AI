import React from "react";
import OverviewDemoPrevNextButtonBlock from "./OverviewDemoPrevNextButtonBlock";
import OverviewDemoTextAndImageBlock from "./OverviewDemoTextAndImageBlock";

export default function OverviewDemoModalScreen3({
  imgPath,
  handlePrev,
  handleNext
}) {
  return (
    <>
      <OverviewDemoTextAndImageBlock
        title="Lets now see how you can add members to your workspace and manage leads"
        // imgPath={require("../../../assets/img/overview-demo/screen-3.png")}
        imgPath={imgPath}
        imgClassName="overview-demo__screen-3"
      />
      <OverviewDemoPrevNextButtonBlock
        handlePrev={handlePrev}
        handleNext={handleNext}
      />
    </>
  );
}
