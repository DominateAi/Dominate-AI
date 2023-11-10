import React, { Component, Fragment } from "react";
import TodaysMeetingsAndFollowUps from "./TodaysMeetingsAndFollowUps";
import CreateEmailTemplate from "./CreateEmailTemplate";
// import ImportLead from "./ImportLead";
import ImportLeadNew from "../../ImportLeads/components/MainButton/MainButton";
import AddLeadCustomerEmployee from "./AddLeadCustomerEmployee";
import CountCard from "./CountCard";
import MonthlyRevenueCard from "./MonthlyRevenueCard";
import NotificationAlerts from "./NotificationAlerts";
import { connect } from "react-redux";
import isEmpty from "../../../../store/validations/is-empty";

export class DashboardRowOne extends Component {
  constructor() {
    super();
    this.state = {
      monthlyQuaterlyRevenue: [],
    };
  }

  /*===========================================
      Lifecycle methods
  ===========================================*/
  static getDerivedStateFromProps(nextProps, nextState) {
    if (
      !isEmpty(nextProps.monthlyQuaterlyRevenue) &&
      nextProps.monthlyQuaterlyRevenue !== nextState.monthlyQuaterlyRevenue
    ) {
      return {
        monthlyQuaterlyRevenue: nextProps.monthlyQuaterlyRevenue,
      };
    }
    return null;
  }

  render() {
    // console.log(this.state.monthlyQuaterlyRevenue);
    const { monthlyQuaterlyRevenue } = this.state;

    // console.log(
    //   !isEmpty(monthlyQuaterlyRevenue) &&
    //     monthlyQuaterlyRevenue.monthly_revenue.monthExpectedDollars
    // );

    let monthExpecteDollars =
      !isEmpty(monthlyQuaterlyRevenue) &&
      monthlyQuaterlyRevenue.monthly_revenue.monthExpectedDollars;

    let quarterExpecteDollars =
      !isEmpty(monthlyQuaterlyRevenue) &&
      monthlyQuaterlyRevenue.monthly_revenue.quarterExpectedDollars;

    return (
      <Fragment>
        <div className="dashboard_row_first">
          <TodaysMeetingsAndFollowUps
            cardTitle={"Meeting"}
            cardTitleTwo={"Meetings"}
            task={false}
            meet={true}
            followup={false}
          />
          <TodaysMeetingsAndFollowUps
            cardTitle={"Follow up"}
            cardTitleTwo={"Follow ups"}
            task={false}
            meet={false}
            followup={true}
          />
          <TodaysMeetingsAndFollowUps
            cardTitle={"Task"}
            cardTitleTwo={"Tasks"}
            task={true}
            meet={false}
            followup={false}
          />
          <div>
            <div className="dashboard_top_buttons">
              <CreateEmailTemplate />
              {/* <ImportLead /> */}
              <ImportLeadNew />
              <AddLeadCustomerEmployee />
            </div>
            <div className="mt-5" style={{ display: "flex" }}>
              <MonthlyRevenueCard
                headingName={"Monthly revenue"}
                expected={
                  monthExpecteDollars === undefined ? 0 : monthExpecteDollars
                }
                percentage={
                  !isEmpty(monthlyQuaterlyRevenue) &&
                  monthlyQuaterlyRevenue.monthly_revenue.monthClosedPercent
                }
              />
              <MonthlyRevenueCard
                headingName={"Quarterly Revenue"}
                expected={
                  quarterExpecteDollars === undefined
                    ? 0
                    : quarterExpecteDollars
                }
                percentage={
                  !isEmpty(monthlyQuaterlyRevenue) &&
                  monthlyQuaterlyRevenue.monthly_revenue.quarterClosedPercent
                }
              />
            </div>
            <div style={{ display: "flex" }}>
              <CountCard
                count={
                  !isEmpty(monthlyQuaterlyRevenue)
                    ? monthlyQuaterlyRevenue.pending_leads === null
                      ? 0
                      : monthlyQuaterlyRevenue.pending_leads
                    : 0
                }
                name={"Pending leads from last month"}
                className={"dashboard_card_count pending_leads_gradient"}
              />
              <CountCard
                count={
                  !isEmpty(monthlyQuaterlyRevenue) &&
                  monthlyQuaterlyRevenue.leads_closed
                }
                name={"Leads Closed this month"}
                className={"dashboard_card_count leads_closed_gradient"}
              />
            </div>
          </div>
          <div className="mt-5">
            <NotificationAlerts />
          </div>
        </div>
      </Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  monthlyQuaterlyRevenue: state.dashboard.monthlyQuaterlyRevenue,
});

export default connect(mapStateToProps, {})(DashboardRowOne);
