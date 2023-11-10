import React from "react";
import { Link } from "react-router-dom";

const renderNameValue = (name, val) => {
  return (
    <div className="mr-30 mb-10">
      <span className="resp-font-12-regular">{name}:&nbsp;</span>
      <span className="resp-font-12-regular">{val}</span>
    </div>
  );
};

const EmployeesMobileCardDetails = ({ data, email, dateOfJoining }) => {
  return (
    <>
      {/* content */}
      <div className="card-content-block-outer">
        <div>
          {renderNameValue("Email", email)}
          {renderNameValue("Date of joining", dateOfJoining)}
        </div>
      </div>
      {/* footer */}
      <div className="d-flex justify-content-center align-items-center">
        <Link to="/">
          <span className="font-28-semibold color-gray-resp">Message</span>
        </Link>
        <span className="resp-border-gray"></span>
        <Link
          to={{
            pathname: "/employee-data",

            state: { detail: data }
          }}
        >
          <span className="font-28-semibold color-gray-resp">View</span>
        </Link>
      </div>
    </>
  );
};

export default EmployeesMobileCardDetails;
