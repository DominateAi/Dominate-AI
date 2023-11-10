import React from "react";
import OverviewDemoPrevNextButtonBlock from "./OverviewDemoPrevNextButtonBlock";
import OverviewDemoTitleDescImgBlock from "./OverviewDemoTitleDescImgBlock";

export default function OverviewDemoModalScreen16({
  imgPath,
  handlePrev,
  handleNext
}) {
  return (
    <>
      <OverviewDemoTitleDescImgBlock
        iconPath={require("../../../assets/img/newmenu/messages.svg")}
        title="Chat"
        // imgPath={require("../../../assets/img/overview-demo/screen-16.png")}
        imgPath={imgPath}
        imgClassName="overview-demo__screen-9"
      >
        <p className="overview-demo__descDashboard">
          You can chat with all the active members in your organisation
        </p>
      </OverviewDemoTitleDescImgBlock>

      <OverviewDemoPrevNextButtonBlock
        handlePrev={handlePrev}
        handleNext={handleNext}
      />
    </>
  );
}
