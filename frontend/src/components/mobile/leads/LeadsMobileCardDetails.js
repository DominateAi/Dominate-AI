import React from "react";
import { Link } from "react-router-dom";

const renderNameValue = (name, val) => {
  return (
    <div className="mr-30">
      <span className="resp-font-12-regular">{name} </span>
      <span className="resp-font-12-regular">{val}</span>
    </div>
  );
};

const LeadsMobileCardDetails = ({
  data,
  assignedTo,
  companyName,
  mobileNo,
  handleOnclickCall,
}) => {
  return (
    <>
      {/* content */}
      <div className="card-content-block-outer display-block">
        {renderNameValue("Assigned to :", assignedTo)}
        {renderNameValue("Company Name:", companyName)}
        {renderNameValue("Mobile Number:", mobileNo)}
      </div>
      {/* footer */}
      <div className="card-block-footer d-flex justify-content-center align-items-center">
        <span className="font-28-semibold" onClick={handleOnclickCall}>
          Call
        </span>
        <span className="resp-border-gray"></span>
        <Link
          to={{
            pathname: "/leads-new-details",
            state: { detail: data },
          }}
        >
          <span className="font-28-semibold">View</span>
        </Link>
      </div>
    </>
  );
};

export default LeadsMobileCardDetails;
