import React, { Component } from "react";
import DashboardLeadsOwnedCard from "./DashboardLeadsOwnedCard";

import Slider from "react-slick";
// Import css files
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export class DashboardRowEight extends Component {
  render() {
    var settings = {
      dots: false,
      infinite: true,
      speed: 500,
      slidesToShow: 3,
      slidesToScroll: 1
    };
    return (
      <div className="dashboard_row_eight_container">
        <h3 className="text-center new-dashboard-row-2-colm1-card1__title">
          Owner Wise Leads
        </h3>

        <Slider {...settings}>
          <div className="dashboard_leads_owned_conatiner">
            <DashboardLeadsOwnedCard />
          </div>
          <div className="dashboard_leads_owned_conatiner">
            <DashboardLeadsOwnedCard />
          </div>
          <div className="dashboard_leads_owned_conatiner">
            <DashboardLeadsOwnedCard />
          </div>
          <div className="dashboard_leads_owned_conatiner">
            <DashboardLeadsOwnedCard />
          </div>
          <div className="dashboard_leads_owned_conatiner">
            <DashboardLeadsOwnedCard />
          </div>
        </Slider>
      </div>
    );
  }
}

export default DashboardRowEight;
