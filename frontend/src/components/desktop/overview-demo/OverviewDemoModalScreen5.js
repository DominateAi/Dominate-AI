import React from "react";
import OverviewDemoPrevNextButtonBlock from "./OverviewDemoPrevNextButtonBlock";
import OverviewDemoTitleDescImgBlock from "./OverviewDemoTitleDescImgBlock";

export default function OverviewDemoModalScreen5({
  imgPath,
  handlePrev,
  handleNext
}) {
  return (
    <>
      <OverviewDemoTitleDescImgBlock
        iconPath={require("../../../assets/img/newmenu/leads.svg")}
        title="Leads"
        // imgPath={require("../../../assets/img/overview-demo/screen-5.png")}
        imgPath={imgPath}
        imgClassName="overview-demo__screen-5"
      >
        <p className="overview-demo__descDashboard">
          Start by adding Leads to you software using the{" "}
          <img
            src={require("../../../assets/img/overview-demo/buttons/add-lead.png")}
            alt="add lead"
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
