import React from "react";
import { Link } from "react-router-dom";
import ToggleSwitch from "../../desktop/common/ToggleSwitch";

const renderNameValue = (name, val) => {
  return (
    <div className="mr-30 mb-10">
      <span className="resp-font-12-regular">{name}:&nbsp;</span>
      <span className="resp-font-12-regular">{val}</span>
    </div>
  );
};

const CustomersMobileCardDetails = ({ mobileNo, status, toggleFunction }) => {
  return (
    <>
      {/* content */}
      <div className="card-content-block-outer">
        <div>
          {renderNameValue("Mobile Number", mobileNo)}
          {/* Status */}
          <div className="mr-30">
            <div className="row mx-0 toggle-switch-section">
              <span className="resp-font-12-regular">Status: &nbsp;</span>
              <ToggleSwitch
                name="status"
                currentState={status}
                type={"checkbox"}
                spantext1={"Active"}
                spantext2={"Inactive"}
                toggleclass={"toggle d-flex align-items-center mb-2"}
                toggleinputclass={"toggle__switch ml-3 mr-3"}
                onChange={toggleFunction}
                defaultChecked={status === "ACTIVE" ? true : false}
              />
            </div>
          </div>
        </div>
      </div>
      {/* footer */}
      <div className="text-center">
        <Link to="/customer-data">
          <span className="font-28-semibold color-gray-resp">View</span>
        </Link>
      </div>
    </>
  );
};

export default CustomersMobileCardDetails;
