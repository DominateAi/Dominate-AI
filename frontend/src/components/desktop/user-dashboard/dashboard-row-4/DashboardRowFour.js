import React, { Component } from "react";
import DashboardRowFourFunnelView from "./DashboardRowFourFunnelView";
import { connect } from "react-redux";
import DealsInPipeline from "./DealsInPipeline";

class DashboardRowFour extends Component {
  render() {
    return (
      <div className="row mx-0 new-dashboard-row-6">
        <div className="new-dashboard-row-4-colm1-card">
          <h3 className="text-center new-dashboard-row-2-colm1-card1__title">
            Deals in Pipeline
          </h3>
          <p className="text-center">(Super Hot + Opportunity leads)</p>

          <DealsInPipeline />
          {/* content */}
        </div>
        <div className="new-dashboard-row-4-colm2-card">
          <h3 className="text-center new-dashboard-row-2-colm1-card1__title">
            Leads Status funnel view
          </h3>
          {/* graph */}
          {/* {!isEmpty(this.state.allLeadCount) && ( */}
          <div className="funnel-view--newDashboard">
            <DashboardRowFourFunnelView />
          </div>
          {/* )} */}
        </div>
      </div>
    );
  }
}

export default connect()(DashboardRowFour);
