import React from "react";

function LevelCountMonthlyCard({ className, count, name }) {
  return (
    <div className={className}>
      <h3>{count}</h3>
      <p>{name}</p>
    </div>
  );
}

export default LevelCountMonthlyCard;
