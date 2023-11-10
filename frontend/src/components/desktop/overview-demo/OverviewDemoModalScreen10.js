import React from "react";
import OverviewDemoPrevNextButtonBlock from "./OverviewDemoPrevNextButtonBlock";
import OverviewDemoTitleDescImgBlock from "./OverviewDemoTitleDescImgBlock";

export default function OverviewDemoModalScreen10({
  imgPath,
  handlePrev,
  handleNext
}) {
  return (
    <>
      <OverviewDemoTitleDescImgBlock
        iconPath={require("../../../assets/img/newmenu/proposal.svg")}
        title="Proposals"
        // imgPath={require("../../../assets/img/overview-demo/screen-10.png")}
        imgPath={imgPath}
        imgClassName="overview-demo__screen-5"
      >
        <p className="overview-demo__descDashboard">
          You can also create and customize your proposals to send to your leads
          or customers using{" "}
          <img
            src={require("../../../assets/img/overview-demo/buttons/add-proposal.png")}
            alt="add proposal"
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
