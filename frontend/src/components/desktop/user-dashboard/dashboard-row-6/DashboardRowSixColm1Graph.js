import React, { Component } from "react";
import { Line } from "react-chartjs-2";
import { connect } from "react-redux";
import isEmpty from "../../../../store/validations/is-empty";
import {
  graph_text_yAxis_ticks_color,
  graph_text_xAxis_ticks_color,
  graph_label_color,
  graph_gridline_color,
} from "../../../exportGraphColorsValues";

const options = {
  legend: {
    display: true,
    labels: {
      fontSize: 8,
      fontColor: graph_label_color,
      fontFamily: "Inter-Medium",
      usePointStyle: true,
      boxWidth: 2,
    },
  },
  tooltips: {
    backgroundColor: "#1e2428",
    titleFontFamily: "Inter-Regular",
    bodyFontFamily: "Inter-Regular",
  },
  scales: {
    yAxes: [
      {
        ticks: {
          fontSize: "8",
          fontColor: graph_text_yAxis_ticks_color,
          fontFamily: "Inter-Regular",
          suggestedMin: 0,
          // suggestedMax: 200,
          // precision: 10,
          // stepSize: 100,
          // Include a string value in the ticks
          callback: function (value, index, values) {
            if (value === 0) return null;
            else return "$ " + value + "  ";
          },
        },
        gridLines: {
          display: true,
          drawBorder: false,
          borderDash: [8],
          color: graph_gridline_color,
        },
      },
    ],
    xAxes: [
      {
        ticks: {
          fontSize: "8",
          fontColor: graph_text_xAxis_ticks_color,
          fontFamily: "Inter-SemiBold",
        },
        gridLines: {
          display: false,
          color: graph_gridline_color,
        },
      },
    ],
  },
};

class DashboardRowSixColm1Graph extends Component {
  constructor() {
    super();
    this.state = {
      expectedAndAquiredRevenue: [],
    };
  }

  static getDerivedStateFromProps(nextProps, nextState) {
    if (
      !isEmpty(nextProps.expectedAndAquiredRevenue) &&
      nextProps.expectedAndAquiredRevenue !==
        nextState.expectedAndAquiredRevenue
    ) {
      return {
        expectedAndAquiredRevenue: nextProps.expectedAndAquiredRevenue,
      };
    }
    return null;
  }

  render() {
    // console.log(this.state.expectedAndAquiredRevenue);
    const { expectedAndAquiredRevenue } = this.state;

    const data = (canvas) => {
      const ctx = canvas.getContext("2d");
      const gradient1 = ctx.createLinearGradient(0, 0, 0, 900);
      gradient1.addColorStop(0.33, "#1CB5E0");
      gradient1.addColorStop(0, "#C200B3");

      return {
        labels:
          !isEmpty(expectedAndAquiredRevenue) &&
          expectedAndAquiredRevenue.months,
        datasets: [
          {
            categoryPercentage: 0.5,
            barPercentage: 1.0,
            label: "Aquired",
            data:
              !isEmpty(expectedAndAquiredRevenue) &&
              expectedAndAquiredRevenue.acquired_revenue,
            // borderColor: "#DA3B52",
            borderColor: "rgba(174, 154, 255, 1)",
            fill: false,
            // pointStyle: "line"
          },
          {
            categoryPercentage: 0.5,
            barPercentage: 1.0,
            label: "Expected",
            data:
              !isEmpty(expectedAndAquiredRevenue) &&
              expectedAndAquiredRevenue.expected_revenue,
            // borderColor: "#0077FF",
            borderColor: "rgba(255, 255, 255, 0.77)",
            fill: false,
            borderDash: [8],
            // pointStyle: "line"
          },
        ],
      };
    };
    // console.log(expectedAndAquiredRevenue);

    let expectesRevenueExist = false;
    if (!isEmpty(expectedAndAquiredRevenue)) {
      expectedAndAquiredRevenue.expected_revenue.forEach((ele) => {
        if (ele !== 0) {
          expectesRevenueExist = true;
        }
      });
    }
    return (
      <>
        {/* card1 */}
        <div className="new-dashboard-row-6-colm1-card">
          <h3 className="text-center new-dashboard-row-2-colm1-card1__title">
            Expected Revenue vs Acquired Revenue
          </h3>
          {expectesRevenueExist === true ? (
            <Line data={data} options={options} width={100} height={65} />
          ) : (
            <>
              {/*"Show illustartion"*/}
              <div className="text-center">
                <img
                  // src={require("../../../../assets/img/illustrations/dashboard-excepted-acquired-revenue.svg")}
                  src="/img/desktop-dark-ui/illustrations/dashboard-excepted-acquired-revenue.svg"
                  alt="dashboard expected acquired revenue no found"
                  className="dashboard-expected-acquired-revenue-img"
                />
                <h5 className="reports-graph-not-found-text">No Data</h5>
              </div>
            </>
          )}
        </div>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  expectedAndAquiredRevenue: state.dashboard.expectedAndAquiredRevenue,
});

export default connect(mapStateToProps)(DashboardRowSixColm1Graph);
