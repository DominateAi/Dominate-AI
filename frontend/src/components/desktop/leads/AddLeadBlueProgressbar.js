import React from "react";

function AddLeadBlueProgressbar({ percentage, skipButtonFrom, prevNextIndex }) {
  return (
    <div
      className={
        prevNextIndex >= skipButtonFrom
          ? "add-lead-blue-progressbar-block-with-button"
          : "add-lead-blue-progressbar-block"
      }
      // className="add-lead-blue-progressbar-block"
    >
      {percentage <= 100 ? (
        <div
          className="add-lead-blue-progressbar-block__fill"
          style={{ width: `${percentage}%` }}
        ></div>
      ) : (
        <div
          className="add-lead-blue-progressbar-block__fill"
          style={{ width: "100%" }}
        ></div>
      )}
    </div>
  );
}

export default AddLeadBlueProgressbar;
