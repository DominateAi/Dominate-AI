import React from "react";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

// const percentage = 66;

function MonthlyRevenueCard({ expected, headingName, percentage }) {
  let newPercentage = 0;
  if (percentage < expected) {
    newPercentage = ((percentage * 100) / expected).toFixed(2);
  } else {
    newPercentage = 100;
  }

  return (
    <div className="monthly_revenue_card">
      <h3>{headingName}</h3>
      <div className="new-dashboard-circular-graph">
        <CircularProgressbar
          value={newPercentage}
          text={`${percentage === null ? 0 : newPercentage}%`}
        />
        <p className="monthly_revenue_card__title2 mt-2">Closed</p>
      </div>
      <p className="monthly_revenue_card__title1">{`$${expected}`}</p>
      <p className="monthly_revenue_card__title2">Expected</p>
    </div>
  );
}

export default MonthlyRevenueCard;
