import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
function DashboardRowFourFunnelViewCard({
  type,
  number,
  colorLight,
  colorDark,
  percent,
  blockNum,
}) {
  return (
    <div className="funnel-view-outer-div__block">
      <h5 className="font-17-semibold">{type}</h5>
      <h6 className="font-12-regular">{number} Leads</h6>

      {/* color block */}
      <div className="funnel-view-outer-div__colorDivOuter">
        {" "}
        <div
          className="funnel-view-outer-div__lightColorDiv"
          style={{ height: percent, background: colorLight }}
        >
          {blockNum === "1" ? (
            <div
              className="funnel-view-outer-div__darkColorDiv"
              style={{ height: "80%", background: colorDark }}
            ></div>
          ) : (
            ""
          )}
          {blockNum === "2" ? (
            <div
              className="funnel-view-outer-div__darkColorDiv"
              style={{ height: "70%", background: colorDark }}
            ></div>
          ) : (
            ""
          )}
          {blockNum === "3" ? (
            <div
              className="funnel-view-outer-div__darkColorDiv"
              style={{ height: "60%", background: colorDark }}
            ></div>
          ) : (
            ""
          )}
          {blockNum === "4" ? (
            <div
              className="funnel-view-outer-div__darkColorDiv"
              style={{ height: "50%", background: colorDark }}
            ></div>
          ) : (
            ""
          )}
          {blockNum === "5" ? (
            <div
              className="funnel-view-outer-div__darkColorDiv"
              style={{ height: "45%", background: colorDark }}
            ></div>
          ) : (
            ""
          )}
          {blockNum === "6" ? (
            <div
              className="funnel-view-outer-div__darkColorDiv"
              style={{ height: "30%", background: colorDark }}
            ></div>
          ) : (
            ""
          )}
        </div>
      </div>
      {/* <div className="funnel-view-outer-div__colorDivOuter">
                    <div className="funnel-view-outer-div__lightColorDiv"
                        style={{ height: percent, background: "transparent" }}>
                        <img src={require("../../../assets/img/leads/purple.png")} alt="block"
                            style={{ width: "100%", height: "100%", background: "transparent" }} />
                    </div>
                </div> */}
    </div>
  );
}

DashboardRowFourFunnelViewCard.propTypes = {
  type: PropTypes.string,
  colorLight: PropTypes.string,
  colorDark: PropTypes.string,
};

export default DashboardRowFourFunnelViewCard;
