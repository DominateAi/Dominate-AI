import React, { Fragment } from "react";
import { useHistory } from "react-router-dom";
import { Link } from "react-router-dom";

export default function BreadcrumbMenu({ extraClassName, menuObj }) {
  let history = useHistory();

  return (
    <div className={`breadcrumb-menu ${extraClassName}`}>
      <div className="row mx-0 flex-nowrap align-items-center breadcrumb-menu__row">
        {menuObj.map((data, index) => (
          <Fragment key={index}>
            {data.type === "goBackButton" ? (
              <>
                <img
                  src="/img/desktop-dark-ui/icons/gray-home-icon.svg"
                  alt=""
                />
                <button
                  className="breadcrumb-menu__li"
                  onClick={() => history.goBack()}
                >
                  <span>{data.title}</span>
                </button>
                <b className="breadcrumb-menu__forwardSlash">/</b>
              </>
            ) : data.link ? (
              <>
                <img
                  src="/img/desktop-dark-ui/icons/gray-home-icon.svg"
                  alt=""
                />
                <Link to={data.link}>
                  <div className="breadcrumb-menu__li">
                    <span>{data.title}</span>
                  </div>
                </Link>
                <b className="breadcrumb-menu__forwardSlash">/</b>
              </>
            ) : (
              <div className="row mx-0 align-items-center breadcrumb-menu__li breadcrumb-menu__li--last">
                <img
                  src="/img/desktop-dark-ui/icons/blue-home-icon.svg"
                  alt=""
                />
                <span>{data.title}</span>
                <b className="breadcrumb-menu__forwardSlash">/</b>
              </div>
            )}
          </Fragment>
        ))}
      </div>
    </div>
  );
}

BreadcrumbMenu.defaultProps = {
  extraClassName: "",
};
