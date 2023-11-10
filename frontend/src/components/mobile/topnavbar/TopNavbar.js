import React, { Fragment } from "react";
import Menus from "./Menus";

export default function TopNavbar() {
  return (
    <Fragment>
      <nav className="menu-navbar">
        <ul className="dominate-menus-left">
          <Menus
            link={"/dashboard"}
            imgPath={require("./../../../assets/img/newmenu/dashboard.svg")}
          />
          <Menus
            link={"/leads-new"}
            imgPath={require("./../../../assets/img/newmenu/leads.svg")}
          />
          <Menus
            link={"/customers"}
            imgPath={require("./../../../assets/img/newmenu/customers.svg")}
          />
          <Menus
            link={"/admin-employees"}
            imgPath={require("./../../../assets/img/newmenu/employees.svg")}
          />
          <Menus
            link={"/quotations"}
            imgPath={require("./../../../assets/img/newmenu/proposal.svg")}
          />
          <Menus
            link={"/proposals"}
            imgPath={require("./../../../assets/img/newmenu/quotation.svg")}
          />
          <Menus
            link={"/admin-reports"}
            imgPath={require("./../../../assets/img/newmenu/REPORTS.svg")}
          />
          <Menus
            link={"/main-calender"}
            imgPath={require("./../../../assets/img/newmenu/calender.svg")}
          />
          <Menus
            link={"/task-list"}
            imgPath={require("./../../../assets/img/newmenu/task.svg")}
          />
          <Menus
            link={"/message"}
            imgPath={require("./../../../assets/img/newmenu/messages.svg")}
          />
          <Menus
            link={"/calling"}
            imgPath={require("./../../../assets/img/newmenu/calls.svg")}
          />
        </ul>
      </nav>
    </Fragment>
  );
}
