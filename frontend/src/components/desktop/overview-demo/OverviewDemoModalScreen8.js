import React from "react";
import OverviewDemoPrevNextButtonBlock from "./OverviewDemoPrevNextButtonBlock";
import OverviewDemoTitleDescImgBlock from "./OverviewDemoTitleDescImgBlock";

export default function OverviewDemoModalScreen8({
  imgPath,
  handlePrev,
  handleNext
}) {
  return (
    <>
      <OverviewDemoTitleDescImgBlock
        iconPath={require("../../../assets/img/newmenu/leads.svg")}
        title="Leads"
        // imgPath={require("../../../assets/img/overview-demo/screen-8.png")}
        imgPath={imgPath}
        imgClassName="overview-demo__screen-8"
      >
        <p className="overview-demo__descDashboard">
          Funnel View will help you in comparative visualisation. To see it
          click on{" "}
          <img
            src={require("../../../assets/img/overview-demo/buttons/funnel-view.png")}
            alt="funnel view"
            className="overview-demo__text-btn-img"
          />{" "}
          button.
        </p>
      </OverviewDemoTitleDescImgBlock>

      <OverviewDemoPrevNextButtonBlock
        handlePrev={handlePrev}
        handleNext={handleNext}
      />
    </>
  );
}
