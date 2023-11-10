import React, { Component } from "react";
import Calender from "./Calender";
import CalenderDataCard from "./CalenderDataCard";
import LeavesHolidayCard from "./LeavesHolidayCard";
import { connect } from "react-redux";

export class DashboardCalender extends Component {
  constructor() {
    super();
    this.state = {};
  }

  render() {
    const { calenderDataView } = this.props;
    return (
      <div className="dashboard_calender_card_conatiner">
        <h3>Calender </h3>
        <div style={{ display: "flex" }}>
          <Calender />
          {calenderDataView ? <CalenderDataCard /> : <LeavesHolidayCard />}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  calenderDataView: state.dashboard.calenderWidgetDataCard
});

export default connect(mapStateToProps, {})(DashboardCalender);
