import React from "react";

export default function OverviewDemoModalScreen0({ imgPath, handleNext }) {
  return (
    <div className="text-center">
      <img
        src="/img/desktop-dark-ui/logo/logo-color-white.svg"
        alt="dominate"
        className="overview-demo__welcome-logo"
      />
      <h1 className="overview-demo__welcome-title">Welcome to Dominate</h1>
      <div className="overview-demo__screens-min-max-height">
        <img
          // src={require("../../../assets/img/overview-demo/screen-0.png")}
          src={imgPath}
          alt="overview"
          className="overview-demo__screen-0"
        />
      </div>
      <button
        type="button"
        className="overview-demo-red-bg-btn"
        onClick={handleNext}
      >
        Start Walkthrough
      </button>
    </div>
  );
}
