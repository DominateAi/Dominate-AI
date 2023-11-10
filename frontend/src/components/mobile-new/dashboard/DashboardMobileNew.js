import React, { Component } from "react";
import { Link } from "react-router-dom";
import StaticNavbar from "../navbar/StaticNavbar";
import TopNavbarMobile from "../navbar/TopNavbarMobile";

const menu = [
  {
    img: require("../../../assets/img/mobile-new/dashboard/team.svg"),
    name: "Team",
    link: "/"
  },
  {
    img: require("../../../assets/img/mobile-new/dashboard/customers.svg"),
    name: "Customers",
    link: "/"
  },
  {
    img: require("../../../assets/img/mobile-new/dashboard/reports.svg"),
    name: "Reports",
    link: "/"
  },
  {
    img: require("../../../assets/img/mobile-new/dashboard/proposals.svg"),
    name: "Proposals",
    link: "/"
  },
  {
    img: require("../../../assets/img/mobile-new/dashboard/quotations.svg"),
    name: "Quotations",
    link: "/"
  },
  {
    img: require("../../../assets/img/mobile-new/dashboard/tasks.svg"),
    name: "Tasks",
    link: "/"
  }
];

class DashboardMobileNew extends Component {
  render() {
    return (
      <div className="bg-mobile">
        <TopNavbarMobile />
        <div className="dashboard-mobile-text-block">
          <h2 className="dashboard-mobile__title">Hi User</h2>
          <h2 className="resp-font-12-regular">Tuesday, 11th</h2>
          <h2 className="dashboard-mobile__title2">
            <span className="dashboard-mobile__title1">12</span> Upcoming
            meetings
          </h2>
          <h2 className="dashboard-mobile__title2">
            <span className="dashboard-mobile__title1">6</span> Owned leads
          </h2>
        </div>

        <div className="row mx-0 dashboard-mobile-card-row">
          {menu.map((data, index) => (
            <Link key={index} to={data.link}>
              <div className="dashboard-mobile-card">
                <img src={data.img} alt={data.name} />
                <h3>{data.name}</h3>
              </div>
            </Link>
          ))}
        </div>

        <StaticNavbar active="home" />
      </div>
    );
  }
}

export default DashboardMobileNew;
