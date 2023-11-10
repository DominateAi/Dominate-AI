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
  activeImgPath,
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
        <p className="font-18-semibold topmenubar-menu-name">
          <img
            src={pageTitle === pageName ? activeImgPath : imgPath}
            alt={pageTitle}
            onMouseOver={handleOnMouseOver}
            onMouseLeave={handleOnMouseLeave}
            name={pageTitle}
          />
          {pageTitle}
        </p>
        {/* tooltip */}
        {/* {pageTitle !== pageName &&
          tooltipImgPath !== null &&
          pageTitle === tooltipName && (
            <span className="tooltip-box">
              <p className="tooltip-box__text">{pageTitle}</p>
            </span>
          )} */}
      </li>
    </Link>
  );
};

Menus.defaultProps = {
  extraClassName: "",
  tooltipImgPath: "",
  tooltipName: "",
  pageTitle: "",
};

export default withRouter(Menus);
