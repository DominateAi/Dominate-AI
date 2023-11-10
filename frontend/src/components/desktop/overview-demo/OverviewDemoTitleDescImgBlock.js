import React from "react";

const OverviewDemoTitleDescImgBlock = (props) => {
  return (
    <>
      <div className="overview-demo__titleBlockDashboard text-center">
        <img
          src="/img/desktop-dark-ui/logo/logo-color-white.svg"
          alt="dominate"
          className="overview-demo__titleBlock-logo"
        />
        <div className="overview-demo__titleBlock_text-div">
          <img
            src={props.iconPath}
            alt={props.title}
            className="overview-demo__titleBlock-title__img"
          />
          <h2 className="overview-demo__titleBlock-title">{props.title}</h2>
        </div>
      </div>

      {props.children}

      <div className="overview-demo__screens-min-max-height">
        <img
          src={props.imgPath}
          alt="overview"
          className={props.imgClassName}
        />
      </div>
    </>
  );
};

export default OverviewDemoTitleDescImgBlock;
