import React from "react";
import OverviewDemoPrevNextButtonBlock from "./OverviewDemoPrevNextButtonBlock";
import OverviewDemoTitleDescImgBlock from "./OverviewDemoTitleDescImgBlock";

export default function OverviewDemoModalScreen6({
  imgPath,
  handlePrev,
  handleNext
}) {
  return (
    <>
      <OverviewDemoTitleDescImgBlock
        iconPath={require("../../../assets/img/newmenu/leads.svg")}
        title="Leads"
        // imgPath={require("../../../assets/img/overview-demo/screen-6.png")}
        imgPath={imgPath}
        imgClassName="overview-demo__screen-5"
      >
        <p className="overview-demo__descDashboard">
          In the add leads form, assign a represtative for the lead
        </p>
      </OverviewDemoTitleDescImgBlock>

      <OverviewDemoPrevNextButtonBlock
        handlePrev={handlePrev}
        handleNext={handleNext}
      />
    </>
  );
}
