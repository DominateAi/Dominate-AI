import React, { Component } from "react";
import DashboardRowTwoColm1Card2Graph from "./DashboardRowTwoColm1Card2Graph";
import { connect } from "react-redux";
import isEmpty from "../../../../store/validations/is-empty";

class DashboardRowTwoColm1Card2 extends Component {
  constructor() {
    super();
    this.state = {
      monthlyTargetByLead: [],
      monthlyTargetByDollers: [],
    };
  }

  static getDerivedStateFromProps(nextProps, nextState) {
    if (
      !isEmpty(nextProps.monthlyTargetByLead) &&
      nextProps.monthlyTargetByLead !== nextState.monthlyTargetByLead
    ) {
      return {
        monthlyTargetByLead: nextProps.monthlyTargetByLead,
      };
    }
    if (
      !isEmpty(nextProps.monthlyTargetByDollers) &&
      nextProps.monthlyTargetByDollers !== nextState.monthlyTargetByDollers
    ) {
      return {
        monthlyTargetByDollers: nextProps.monthlyTargetByDollers,
      };
    }
    return null;
  }

  render() {
    const { monthlyTargetByLead, monthlyTargetByDollers } = this.state;

    let DollerLabel = [];
    let DollerExpected = [];
    let DollerAccomplished = [];
    if (!isEmpty(monthlyTargetByDollers.label)) {
      DollerLabel = monthlyTargetByDollers.label;
      DollerExpected = monthlyTargetByDollers.expected;
      DollerAccomplished = monthlyTargetByDollers.accomplished;
    }

    let leadLabel = [];
    let leadExpected = [];
    let leadAccomplished = [];
    if (!isEmpty(monthlyTargetByLead.label)) {
      leadLabel = monthlyTargetByLead.label;
      leadExpected = monthlyTargetByLead.expected;
      leadAccomplished = monthlyTargetByLead.accomplished;
    }

    return (
      <>
        {/* card2 */}
        <div className="new-dashboard-row-2-colm1-card1">
          <h3 className="text-center new-dashboard-row-2-colm1-card1__title">
            Monthly Targets (leads)
          </h3>
          <DashboardRowTwoColm1Card2Graph
            labels={leadLabel}
            labelName1="Expected"
            dataSet1={leadExpected}
            labelName2="Accomplished"
            dataSet2={leadAccomplished}
          />
        </div>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  monthlyTargetByDollers: state.dashboard.monthlyTargetByDollers,
  monthlyTargetByLead: state.dashboard.monthlyTargetByLead,
});

export default connect(mapStateToProps, {})(DashboardRowTwoColm1Card2);
