import React from "react";
import OverviewDemoPrevNextButtonBlock from "./OverviewDemoPrevNextButtonBlock";
import OverviewDemoTitleDescImgBlock from "./OverviewDemoTitleDescImgBlock";

export default function OverviewDemoModalScreen11({
  imgPath,
  handlePrev,
  handleNext
}) {
  return (
    <>
      <OverviewDemoTitleDescImgBlock
        iconPath={require("../../../assets/img/newmenu/customers.svg")}
        title="Customers"
        // imgPath={require("../../../assets/img/overview-demo/screen-11.png")}
        imgPath={imgPath}
        imgClassName="overview-demo__screen-5"
      >
        <p className="overview-demo__descDashboard">
          You can add new customers in your workspace using{" "}
          <img
            src={require("../../../assets/img/overview-demo/buttons/add-customer.png")}
            alt="add customer"
            className="overview-demo__text-btn-img"
          />{" "}
          button. Or you can add customer by changing a lead&#39;s status to
          &ldquo;converted&rdquo;.
        </p>
      </OverviewDemoTitleDescImgBlock>

      <OverviewDemoPrevNextButtonBlock
        handlePrev={handlePrev}
        handleNext={handleNext}
      />
    </>
  );
}
