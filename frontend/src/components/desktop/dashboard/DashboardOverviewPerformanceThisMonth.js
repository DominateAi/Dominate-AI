import React, { Component } from "react";
import DashboardOverviewPerformanceCard from "./DashboardOverviewPerformanceCard";
import DashboardOverviewPerformanceThreeCardsToday from "./DashboardOverviewPerformanceThreeCardsToday";
import { connect } from "react-redux";
import isEmpty from "./../../../store/validations/is-empty";

class DashboardOverviewPerformanceThisMonth extends Component {
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
      !isEmpty(nextProps.leaderBoardCurrent) &&
      nextProps.leaderBoardCurrent !== nextState.leaderBoardCurrent
    ) {
      let firstUser = nextProps.leaderBoardCurrent.filter((data, index) => {
        if (index < 1) {
          return data;
        }
      });

      let secondUser = nextProps.leaderBoardCurrent.filter((data, index) => {
        if ((index > 0) & (index < 2)) {
          return data;
        }
      });

      let thirdUser = nextProps.leaderBoardCurrent.filter((data, index) => {
        if ((index > 1) & (index < 3)) {
          return data;
        }
      });

      let topTwoUsers = nextProps.leaderBoardCurrent.filter((data, index) => {
        if (index > 2 && index < 5) {
          return data;
        }
      });

      // let topThreeUsers = nextProps.leaderBoardCurrent.filter((data, index) => {
      //   if (index < 3) {
      //     return data;
      //   }
      // });

      let remainingUsers = nextProps.leaderBoardCurrent.filter(
        (data, index) => {
          if (index >= 5) {
            return data;
          }
        }
      );
      // console.log(secondUser);
      return {
        leaderBoardCurrent: nextProps.leaderBoardCurrent,
        topTwoUsers: topTwoUsers,
        // topThreeUsers: topThreeUsers,
        firstUser: firstUser,
        secondUser: secondUser,
        thirdUser: thirdUser,
        remainingUsers: remainingUsers,
      };
    }
    return null;
  }

  handleSeeAllCards = () => {
    this.setState({ isSeeAllCards: !this.state.isSeeAllCards });
  };

  render() {
    // console.log(this.state.leaderBoardCurrent);
    const {
      leaderBoardCurrent,
      topTwoUsers,
      remainingUsers,
      topThreeUsers,
      firstUser,
      secondUser,
      thirdUser,
    } = this.state;

    return (
      <div className="dashboard-overview-blocks__performanceCardOverflowDiv">
        <DashboardOverviewPerformanceThreeCardsToday
          topThreeUsers={!isEmpty(topThreeUsers) && topThreeUsers}
          firstUser={!isEmpty(firstUser) && firstUser}
          secondUser={!isEmpty(secondUser) && secondUser}
          thirdUser={!isEmpty(thirdUser) && thirdUser}
          leaderBoardCurrent={
            !isEmpty(leaderBoardCurrent) && leaderBoardCurrent
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
            Minimize
          </button>
        ) : !isEmpty(leaderBoardCurrent) &&
          !isEmpty(remainingUsers) &&
          this.state.leaderBoardCurrent.length > 5 ? (
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
  leaderBoardCurrent: state.dashboard.leaderBoardCurrent,
});

export default connect(
  mapStateToProps,
  {}
)(DashboardOverviewPerformanceThisMonth);
