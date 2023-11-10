import React, { Component } from "react";
import DashboardOverviewPerformanceCard from "./DashboardOverviewPerformanceCard";
import DashboardOverviewPerformanceThreeCardsAllTime from "./DashboardOverviewPerformanceThreeCardsAllTime";

class DashboardOverviewPerformanceAllTime extends Component {
  constructor() {
    super();
    this.state = {
      isSeeAllCards: false,
    };
  }

  handleSeeAllCards = () => {
    this.setState({ isSeeAllCards: true });
  };

  render() {
    return (
      <div className="dashboard-overview-blocks__performanceCardOverflowDiv">
        <DashboardOverviewPerformanceThreeCardsAllTime />

        <DashboardOverviewPerformanceCard
          badgeCount="4"
          name="Mike Ross"
          jobPost="Sales intern"
          count="06"
        />
        <DashboardOverviewPerformanceCard
          badgeCount="5"
          name="Mike Ross"
          jobPost="Sales head"
          count="03"
        />
        {this.state.isSeeAllCards ? (
          <>
            <DashboardOverviewPerformanceCard
              badgeCount="6"
              name="Mike Ross"
              jobPost="Sales intern"
              count="02"
            />
            <DashboardOverviewPerformanceCard
              badgeCount="7"
              name="Mike Ross"
              jobPost="Sales head"
              count="01"
            />
          </>
        ) : (
          ""
        )}

        {this.state.isSeeAllCards ? (
          ""
        ) : (
          <div className="text-right">
            <button
              className="performance-card-btn performance-card-btn--scoreboard"
              onClick={this.handleSeeAllCards}
            >
              See All
            </button>
          </div>
        )}
      </div>
    );
  }
}

export default DashboardOverviewPerformanceAllTime;
