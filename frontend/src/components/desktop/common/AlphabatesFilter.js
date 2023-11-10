import React from "react";

const AlphabatesFilter = ({ alphabate, onClick, activeAlphabate }) => {
  return (
    <span
      onClick={onClick}
      style={
        alphabate === activeAlphabate
          ? { cursor: "pointer", fontWeight: "bold", fontSize: "21px" }
          : { cursor: "pointer" }
      }
    >
      {alphabate}
    </span>
  );
};

export default AlphabatesFilter;
