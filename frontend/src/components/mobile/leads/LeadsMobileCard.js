import React from "react";

const LeadsMobileCard = ({
  name,
  email,
  status
}) => {
  return (
    <>
      {/* title block */}
      <div className="card-title-block-outer">
        <div className="card-title-block-outer__1">
          <div>
            <img
              src={require("../../../assets/img/dashboard/person.png")}
              alt="person"
              className="resp-leads-content-img resp-mr-16"
            />
          </div>
          <div className="mr-40">
            <h1 className="resp-font-18-medium">{name}</h1>
            <h2 className="resp-font-12-italic color-gray-resp">{email}</h2>
            <h3 className="resp-font-12-medium color-gray-resp">{status}</h3>
          </div>
        </div>
      </div>
    </>
  );
};

export default LeadsMobileCard;
