import React, { Component } from "react";
import LevelCountMonthlyCard from "./LevelCountMonthlyCard";
import DatePicker from "react-datepicker";
import { connect } from "react-redux";
import isEmpty from "../../../../store/validations/is-empty";
import { getLeadsMonthStatusCount } from "./../../../../store/actions/dashBoardAction";

export class DashboardRowThree extends Component {
  constructor() {
    super();
    this.state = {
      fromDate: new Date(),
      toDate: new Date(),
    };
  }

  /*================================
          Lifecycle Methods
  ==================================*/
  static getDerivedStateFromProps(nextProps, nextState) {
    if (
      !isEmpty(nextProps.monthStatusCount) &&
      nextProps.monthStatusCount !== nextState.monthStatusCount
    ) {
      return {
        monthStatusCount: nextProps.monthStatusCount,
      };
    }
    return null;
  }

  /*===============================
      leads level count month events
  ================================*/
  handleChangeFromDate = (date) => {
    if (date === null) {
      this.setState({
        fromDate: new Date(),
      });
    } else {
      this.setState({
        fromDate: date,
      });
      this.props.getLeadsMonthStatusCount(
        false,
        date.toISOString(),
        this.state.toDate.toISOString()
      );
    }
  };

  handleChangeToDate = (date) => {
    if (date === null) {
      this.setState({
        toDate: new Date(),
      });
    } else {
      this.setState({
        toDate: date,
      });
      this.props.getLeadsMonthStatusCount(
        false,
        this.state.fromDate.toISOString(),
        date.toISOString()
      );
    }
  };
  render() {
    // console.log(this.state.monthStatusCount);
    const { monthStatusCount } = this.state;
    return (
      <div className="dashboard_row_three_main_container">
        <h2>This Month's stats</h2>
        <div>
          {/* datepicker */}
          {/* <div className="leads-title-block-container__date-picker text-center">
            <span
              className="font-24-semibold mr-30"
              role="img"
              aria-labelledby="Tear-Off Calendar"
            >
               &#x1F4C6; 
            </span>
            <DatePicker
              selected={this.state.fromDate}
              selectsStart
              startDate={this.state.fromDate}
              endDate={this.state.toDate}
              onChange={this.handleChangeFromDate}
            />
            <span className="font-18-medium">to</span>
            <DatePicker
              selected={this.state.toDate}
              selectsEnd
              startDate={this.state.fromDate}
              endDate={this.state.toDate}
              onChange={this.handleChangeToDate}
              minDate={this.state.fromDate}
            />
          </div> */}
        </div>
        <div className="level_count_container">
          <LevelCountMonthlyCard
            className={"level_count_card super_hot_gradient"}
            count={!isEmpty(monthStatusCount) && monthStatusCount.SUPERHOT}
            name={"Super Hot Leads"}
          />
          <LevelCountMonthlyCard
            className={"level_count_card hot_gradient"}
            count={!isEmpty(monthStatusCount) && monthStatusCount.HOT}
            name={"Hot Leads"}
          />
          <LevelCountMonthlyCard
            className={"level_count_card warm_gradient"}
            count={!isEmpty(monthStatusCount) && monthStatusCount.WARM}
            name={"Warm Leads"}
          />
          <LevelCountMonthlyCard
            className={"level_count_card new_gradient"}
            count={!isEmpty(monthStatusCount) && monthStatusCount.NEW_LEAD}
            name={"New leads"}
          />
          <LevelCountMonthlyCard
            className={"level_count_card qualified_gradient"}
            count={
              !isEmpty(monthStatusCount) && monthStatusCount.QUALIFIED_LEADS
            }
            name={"Qualified Leads"}
          />
          <LevelCountMonthlyCard
            className={"level_count_card on_hold_gradient"}
            count={!isEmpty(monthStatusCount) && monthStatusCount.ON_HOLD}
            name={"On Hold Leads"}
          />
          <LevelCountMonthlyCard
            className={"level_count_card drop_gradient"}
            count={!isEmpty(monthStatusCount) && monthStatusCount.DROPPED_LEAD}
            name={"Drop Leads"}
          />
          <LevelCountMonthlyCard
            className={"level_count_card contacted_gradient"}
            count={
              !isEmpty(monthStatusCount) && monthStatusCount.CONTACTED_LEADS
            }
            name={"Contacted Leads"}
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  monthStatusCount: state.dashboard.monthStatusCount,
});

export default connect(mapStateToProps, { getLeadsMonthStatusCount })(
  DashboardRowThree
);
