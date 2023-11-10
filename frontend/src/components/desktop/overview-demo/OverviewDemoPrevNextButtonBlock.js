import React from "react";

export default function OverviewDemoPrevNextButtonBlock({
  handlePrev,
  handleNext
}) {
  return (
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
          onClick={handleNext}
        >
          Next
        </button>
      </div>
    </div>
  );
}
