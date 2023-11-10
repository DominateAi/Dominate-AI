import React from "react";

const LeadsMobileFilterBlock = ({ className, handleCloseFilterBlock }) => {
  return (
    <>
      <div
        className={
          className
            ? `resp-search-overlay-block ${className}`
            : "resp-search-overlay-block"
        }
      >
        <div className="resp-search-overlay-block__element">
          <div className="resp-search-block">
            <span
              className="closeIconInModal"
              onClick={handleCloseFilterBlock}
            />
            <h6
              className="resp-font-12-regular search-text-border-bottom pl-30"
              onClick={handleCloseFilterBlock}
            >
              New Lead
            </h6>
            <h6
              className="resp-font-12-regular search-text-border-bottom pl-30"
              onClick={handleCloseFilterBlock}
            >
              Qualified Leads
            </h6>
            <h6
              className="resp-font-12-regular search-text-border-bottom pl-30"
              onClick={handleCloseFilterBlock}
            >
              On Hold Leads
            </h6>
            <h6
              className="resp-font-12-regular search-text-border-bottom pl-30"
              onClick={handleCloseFilterBlock}
            >
              Contacted Leads
            </h6>
            <h6
              className="resp-font-12-regular search-text-border-bottom pl-30"
              onClick={handleCloseFilterBlock}
            >
              Opportunity Leads
            </h6>
            <h6
              className="resp-font-12-regular pl-30"
              onClick={handleCloseFilterBlock}
            >
              Converted Leads
            </h6>
          </div>
        </div>
      </div>
    </>
  );
};

export default LeadsMobileFilterBlock;
