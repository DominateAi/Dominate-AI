import React from "react";
import OverviewDemoPrevNextButtonBlock from "./OverviewDemoPrevNextButtonBlock";
import OverviewDemoTitleDescImgBlock from "./OverviewDemoTitleDescImgBlock";

export default function OverviewDemoModalScreen9({
  imgPath,
  handlePrev,
  handleNext
}) {
  return (
    <>
      <OverviewDemoTitleDescImgBlock
        iconPath={require("../../../assets/img/newmenu/quotation.svg")}
        title="Quotations"
        // imgPath={require("../../../assets/img/overview-demo/screen-9.png")}
        imgPath={imgPath}
        imgClassName="overview-demo__screen-5"
      >
        <p className="overview-demo__descDashboard">
          Quotations can be created and send to leads using the{" "}
          <img
            src={require("../../../assets/img/overview-demo/buttons/add-quotations.png")}
            alt="add quotations"
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
