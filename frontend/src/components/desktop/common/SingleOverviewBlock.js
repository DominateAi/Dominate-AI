import React, { Fragment } from "react";
import PropTypes from "prop-types";
import displaySmallText from "./../../../store/utils/sliceString";
import isEmpty from "../../../store/validations/is-empty";

const SingleOverviewBlock = ({ count, status, blockClassName, onClick }) => {
  // console.log(typeof count);

  return (
    <Fragment>
      <div className={blockClassName} onClick={onClick}>
        <h3 className="leads-gradient-block-font-100">
          {" "}
          {typeof count === "string"
            ? displaySmallText(count, 7, true)
            : count}{" "}
        </h3>
        <h5 className="font-24-semibold">{status}</h5>
      </div>
    </Fragment>
  );
};

SingleOverviewBlock.propTypes = {
  status: PropTypes.string,
  blockClassName: PropTypes.string,
  onClick: PropTypes.func,
};

export default SingleOverviewBlock;
