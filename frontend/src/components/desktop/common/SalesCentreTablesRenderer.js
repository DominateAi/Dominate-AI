import React from "react";

export let renderName = function (data) {
  return (
    <div className="sales-centre-table__textCircleOuterBlock">
      <div className="sales-centre-table__textCircleBlock">
        <span>{data.charAt(0)}</span>
      </div>
      <span className="sales-centre-table__overflowText">{data}</span>
    </div>
  );
};

export let renderTitle = function (data) {
  return <span className="sales-centre-table__purpleText">{data}</span>;
};

export let renderLink = function (data) {
  return (
    <a href={data} rel="noopener noreferrer" target="_blank">
      <span className="sales-centre-table__linkText">Link</span>
    </a>
  );
};
