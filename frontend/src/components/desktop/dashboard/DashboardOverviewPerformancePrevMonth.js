import React, { Component } from "react";
import DashboardOverviewPerformanceCard from "./DashboardOverviewPerformanceCard";
import DashboardOverviewPerformanceThreeCardsQuarterly from "./DashboardOverviewPerformanceThreeCardsQuarterly";
import { connect } from "react-redux";
import isEmpty from "./../../../store/validations/is-empty";

class DashboardOverviewPerformancePrevMonth extends Component {
  constructor() {
    super();
    this.state = {
      isSeeAllCards: false,
    };
  }

  /*===================================
          Lifecycle Methods
  ====================================*/

  static getDerivedStateFromProps(nextProps, nextState) {
    if (
      !isEmpty(nextProps.leaderBoardPrevious) &&
      nextProps.leaderBoardPrevious !== nextState.leaderBoardPrevious
    ) {
      let firstUser = nextProps.leaderBoardPrevious.filter((data, index) => {
        if (index < 1) {
          return data;
        }
      });

      let secondUser = nextProps.leaderBoardPrevious.filter((data, index) => {
        if ((index > 0) & (index < 2)) {
          return data;
        }
      });

      let thirdUser = nextProps.leaderBoardPrevious.filter((data, index) => {
        if ((index > 1) & (index < 3)) {
          return data;
        }
      });

      let topTwoUsers = nextProps.leaderBoardPrevious.filter((data, index) => {
        if (index > 2 && index < 5) {
          return data;
        }
      });

      // let topThreeUsers = nextProps.leaderBoardCurrent.filter((data, index) => {
      //   if (index < 3) {
      //     return data;
      //   }
      // });

      let remainingUsers = nextProps.leaderBoardPrevious.filter(
        (data, index) => {
          if (index >= 5) {
            return data;
          }
        }
      );
      return {
        leaderBoardPrevious: nextProps.leaderBoardPrevious,
        firstUser: firstUser,
        secondUser: secondUser,
        thirdUser: thirdUser,
        topTwoUsers: topTwoUsers,
        remainingUsers: remainingUsers,
      };
    }
    return null;
  }

  handleSeeAllCards = () => {
    this.setState({ isSeeAllCards: !this.state.isSeeAllCards });
  };

  render() {
    const {
      leaderBoardPrevious,
      topTwoUsers,
      remainingUsers,
      topThreeUsers,
      firstUser,
      secondUser,
      thirdUser,
    } = this.state;
    return (
      <div className="dashboard-overview-blocks__performanceCardOverflowDiv">
        <DashboardOverviewPerformanceThreeCardsQuarterly
          topThreeUsers={!isEmpty(topThreeUsers) && topThreeUsers}
          firstUser={!isEmpty(firstUser) && firstUser}
          secondUser={!isEmpty(secondUser) && secondUser}
          thirdUser={!isEmpty(thirdUser) && thirdUser}
          leaderBoardPrevious={
            !isEmpty(leaderBoardPrevious) && leaderBoardPrevious
          }
        />

        {!isEmpty(topTwoUsers) &&
          topTwoUsers.map((user, index) => {
            return (
              <DashboardOverviewPerformanceCard
                key={index}
                badgeCount={index + 4}
                name={user.user.name}
                jobPost={user.user.jobTitle}
                count={user.count}
                user={user}
              />
            );
          })}
        {/* <DashboardOverviewPerformanceCard
          badgeCount="5"
          name="Mike Ross"
          jobPost="Sales head"
          count="03"
        /> */}
        {this.state.isSeeAllCards && !isEmpty(remainingUsers)
          ? remainingUsers.map((user, index) => {
              return (
                <DashboardOverviewPerformanceCard
                  key={index}
                  badgeCount={index + 6}
                  name={user.user.name}
                  jobPost={user.user.jobTitle}
                  count={user.count}
                  user={user}
                />
              );
            })
          : // <>
            //   <DashboardOverviewPerformanceCard
            //     badgeCount="6"
            //     name="Mike Ross"
            //     jobPost="Sales intern"
            //     count="02"
            //   />
            //   <DashboardOverviewPerformanceCard
            //     badgeCount="7"
            //     name="Mike Ross"
            //     jobPost="Sales head"
            //     count="01"
            //   />
            // </>
            ""}

        {this.state.isSeeAllCards ? (
          <button
            className="performance-card-btn performance-card-btn--scoreboard"
            onClick={this.handleSeeAllCards}
          >
            See All
          </button>
        ) : !isEmpty(leaderBoardPrevious) &&
          !isEmpty(remainingUsers) &&
          this.state.leaderBoardPrevious.length > 2 ? (
          <div className="text-right">
            <button
              className="performance-card-btn performance-card-btn--scoreboard"
              onClick={this.handleSeeAllCards}
            >
              See All
            </button>
          </div>
        ) : (
          ""
        )}
      </div>
    );
  }
}
const mapStateToProps = (state) => ({
  leaderBoardPrevious: state.dashboard.leaderBoardPrevious,
});

export default connect(
  mapStateToProps,
  {}
)(DashboardOverviewPerformancePrevMonth);
