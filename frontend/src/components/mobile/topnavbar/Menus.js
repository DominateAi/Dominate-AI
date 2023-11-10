import React, { Fragment } from "react";
import { NavLink } from "react-router-dom";

export default function Menus({ link, imgPath }) {
  return (
    <Fragment>
      <NavLink
        exact
        to={link}
        className="dominate-menus-left__menus"
        activeClassName="activeclass"
      >
        <li>
          <img src={imgPath} alt="" />
        </li>
      </NavLink>
    </Fragment>
  );
}
