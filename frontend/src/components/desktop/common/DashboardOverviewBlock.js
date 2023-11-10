import React, { Fragment } from "react";
import PropTypes from "prop-types";

const DashboardOverviewBlock = ({ count, status, blockClassName, onClick }) => {
  return (
    <Fragment>
      <div className={blockClassName} onClick={onClick}>
        <h3 className="leads-gradient-block-font-100 dashboard-card-font-100">
          {count}
          <span className="font-28-semibold pl-10">Leads</span>
        </h3>
        <h5 className="font-24-semibold">Lead Level - {status}</h5>
      </div>
    </Fragment>
  );
};

DashboardOverviewBlock.propTypes = {
  status: PropTypes.string,
  blockClassName: PropTypes.string,
  onClick: PropTypes.func
};

export default DashboardOverviewBlock;
