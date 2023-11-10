import React from "react";

export default function OverviewDemoModalScreen1({ imgPath, handleNext }) {
  return (
    <>
      <div className="overview-demo__titleBlock text-center">
        <img
          src="/img/desktop-dark-ui/logo/logo-color-white.svg"
          alt="dominate"
          className="overview-demo__titleBlock-logo"
        />
        <div className="overview-demo__titleBlock_text-div">
          <h2 className="overview-demo__titleBlock-title">
            Dominate Walkthrough
          </h2>
        </div>
      </div>

      <p className="overview-demo__desc">
        Dominate has various features and you can navigate to these sections
        using the Nav bar Icons
      </p>

      <div className="overview-demo__screens-min-max-height">
        <img
          // src={require("../../../assets/img/overview-demo/screen-1.png")}
          src={imgPath}
          alt="overview"
          className="overview-demo__screen-1"
        />
      </div>

      <div className="overview-demo__screen-1-footer-block">
        <div className="overview-demo__tip-block">
          <span
            className="overview-demo__tip-block-img"
            role="img"
            aria-labelledby="Light bulb"
          >
            💡
          </span>
          <h3 className="overview-demo__tip-block-title">Tip</h3>
          <p className="overview-demo__tip-block-desc">
            If at any point of time you can't recall which feature is the icon
            for just hover over it and we will show you the text like in the
            image
          </p>
        </div>
        <button
          type="button"
          className="overview-demo-red-bg-btn-next"
          onClick={handleNext}
        >
          Next
        </button>
      </div>
    </>
  );
}
