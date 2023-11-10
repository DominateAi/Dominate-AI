import React from "react";
import OverviewDemoPrevNextButtonBlock from "./OverviewDemoPrevNextButtonBlock";
import OverviewDemoTitleDescImgBlock from "./OverviewDemoTitleDescImgBlock";

export default function OverviewDemoModalScreen7({
  imgPath,
  handlePrev,
  handleNext
}) {
  return (
    <>
      <OverviewDemoTitleDescImgBlock
        iconPath={require("../../../assets/img/newmenu/leads.svg")}
        title="Leads"
        // imgPath={require("../../../assets/img/overview-demo/screen-7.gif")}
        imgPath={imgPath}
        imgClassName="overview-demo__screen-7"
      >
        <p className="overview-demo__descDashboard">
          You can go to Kanban Board using{" "}
          <img
            src={require("../../../assets/img/overview-demo/buttons/kanban-view.png")}
            alt="kanban view"
            className="overview-demo__text-btn-img"
          />{" "}
          button. Here you can sort and change their status with ease. Simply by
          dragging in the boards you want.
        </p>
      </OverviewDemoTitleDescImgBlock>

      <OverviewDemoPrevNextButtonBlock
        handlePrev={handlePrev}
        handleNext={handleNext}
      />
    </>
  );
}
