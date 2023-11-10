import React from "react";

export default function OverviewDemoTextAndImageBlock({
  title,
  imgPath,
  imgClassName,
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

      <p className="overview-demo__descScreen3">{title}</p>

      <div className="overview-demo__screens-min-max-height">
        <img src={imgPath} alt="overview" className={imgClassName} />
      </div>
    </>
  );
}
