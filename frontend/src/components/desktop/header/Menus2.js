import React, { Fragment } from "react";
import { Link, withRouter } from "react-router-dom";
import store from "./../../../store/store";
import { SET_PAGETITLE } from "./../../../store/types";

const Menus = ({
  pageTitle,
  pageName,
  handleOnMouseOver,
  handleOnMouseLeave,
  link,
  className,
  imgPath,
  tooltipImgPath,
  tooltipName,
  extraClassName,
  ...props
}) => {
  return (
    <Link
      onClick={() =>
        store.dispatch({
          type: SET_PAGETITLE,
          payload: pageTitle,
        })
      }
      to={link}
      className={
        pageTitle === pageName
          ? `topmenubar-icon topmenubar-icon--active ${extraClassName}`
          : `topmenubar-icon ${extraClassName}`
      }
    >
      <li>
        <img
          src={imgPath}
          alt={pageTitle}
          onMouseOver={handleOnMouseOver}
          onMouseLeave={handleOnMouseLeave}
          name={pageTitle}
        />

        {/* tooltip */}
        {pageTitle !== pageName &&
          tooltipImgPath !== null &&
          pageTitle === tooltipName && (
            <span className="tooltip-box">
              <p className="tooltip-box__text">{pageTitle}</p>
            </span>
          )}
      </li>
    </Link>
  );
};

Menus.defaultProps = {
  extraClassName: "",
};

export default withRouter(Menus);
