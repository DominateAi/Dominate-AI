import React from "react";

export default function OverviewDemoModalScreen17({
  imgPath,
  handlePrev,
  onCloseModal,
}) {
  return (
    <>
      <div className="overview-demo__titleBlockDashboard text-center mb-0">
        <img
          src="/img/desktop-dark-ui/logo/logo-color-white.svg"
          alt="dominate"
          className="overview-demo__titleBlock-logo"
        />
      </div>

      <p className="overview-demo__descScreen3">
        Congratulations!! <br />
        You have completed the walkthrough
      </p>

      <div className="overview-demo__screens-min-max-height">
        <img
          // src={require("../../../assets/img/overview-demo/screen-17.png")}
          src={imgPath}
          alt="overview"
          className="overview-demo__screen-17"
        />
      </div>

      <div className="overview-demo__footer-absolute">
        <div className="overview-demo__prev-next-block">
          <button
            type="button"
            className="overview-demo-red-border-btn-prev"
            onClick={handlePrev}
          >
            Previous
          </button>

          <button
            type="button"
            className="overview-demo-red-bg-btn-next"
            onClick={onCloseModal}
          >
            Start Using
          </button>
        </div>
      </div>
    </>
  );
}
