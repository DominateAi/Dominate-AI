import React from "react";
import PropTypes from "prop-types";

function LeadsFunnelViewCard({
  type,
  number,
  colorLight,
  colorDark,
  percent,
  blockNum,
}) {
  return (
    <div>
      <div className="funnel-view-outer-div__block">
        <h5 className="font-24-semibold">{type}</h5>
        <h6 className="font-21-regular">{number} Leads</h6>

        {/* color block */}
        <div className="funnel-view-outer-div__colorDivOuter">
          <div
            className="funnel-view-outer-div__lightColorDiv"
            style={{ height: percent, backgroundColor: colorLight }}
          >
            {blockNum === "1" ? (
              <div
                className="funnel-view-outer-div__darkColorDiv"
                style={{ height: "80%", backgroundColor: colorDark }}
              ></div>
            ) : (
              ""
            )}
            {blockNum === "2" ? (
              <div
                className="funnel-view-outer-div__darkColorDiv"
                style={{ height: "70%", backgroundColor: colorDark }}
              ></div>
            ) : (
              ""
            )}
            {blockNum === "3" ? (
              <div
                className="funnel-view-outer-div__darkColorDiv"
                style={{ height: "60%", backgroundColor: colorDark }}
              ></div>
            ) : (
              ""
            )}
            {blockNum === "4" ? (
              <div
                className="funnel-view-outer-div__darkColorDiv"
                style={{ height: "50%", backgroundColor: colorDark }}
              ></div>
            ) : (
              ""
            )}
            {blockNum === "5" ? (
              <div
                className="funnel-view-outer-div__darkColorDiv"
                style={{ height: "45%", backgroundColor: colorDark }}
              ></div>
            ) : (
              ""
            )}
            {blockNum === "6" ? (
              <div
                className="funnel-view-outer-div__darkColorDiv"
                style={{ height: "30%", backgroundColor: colorDark }}
              ></div>
            ) : (
              ""
            )}
          </div>
        </div>
        {/* <div className="funnel-view-outer-div__colorDivOuter">
                    <div className="funnel-view-outer-div__lightColorDiv"
                        style={{ height: percent, backgroundColor: "transparent" }}>
                        <img src={require("../../../assets/img/leads/purple.png")} alt="block"
                            style={{ width: "100%", height: "100%", backgroundColor: "transparent" }} />
                    </div>
                </div> */}
      </div>
    </div>
  );
}

LeadsFunnelViewCard.propTypes = {
  type: PropTypes.string,
  colorLight: PropTypes.string,
  colorDark: PropTypes.string,
};

export default LeadsFunnelViewCard;
