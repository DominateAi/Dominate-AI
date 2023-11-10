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

class DashboardRowTwoColm2 extends Component {
  constructor() {
    super();
    this.state = {
      revenueForcast: [],
    };
  }

  /*=====================================
           Lifecycle methods
  ======================================*/
  static getDerivedStateFromProps(nextProps, nextState) {
    if (
      !isEmpty(nextProps.revenueForcast) &&
      nextProps.revenueForcast !== nextState.revenueForcast
    ) {
      return {
        revenueForcast: nextProps.revenueForcast,
      };
    }
    return null;
  }

  render() {
    // console.log(this.state.revenueForcast);
    const { revenueForcast } = this.state;

    const data = (canvas) => {
      const ctx = canvas.getContext("2d");
      const gradient1 = ctx.createLinearGradient(0, 0, 0, 900);
      gradient1.addColorStop(0.33, "#1CB5E0");
      gradient1.addColorStop(0, "#C200B3");

      return {
        labels: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "June",
          "Jul",
          "Aug",
          "Sept",
          "Oct",
          "Nov",
          "Dec",
        ],
        // !isEmpty(revenueForcast) && revenueForcast.labels,
        datasets: [
          // {
          //   label: "Aquired",
          //   data: [786, 814, 616, 716, 717, 911, 633, 721, 973, 578],
          //   borderColor: "#0077FF",
          //   fill: false
          //   // pointStyle: "line"
          // },
          {
            categoryPercentage: 0.5,
            barPercentage: 1.0,
            label: "Forecast",
            data: !isEmpty(revenueForcast) && revenueForcast.values,
            // borderColor: "#DA3B52",
            borderColor: "rgba(174, 154, 255, 1)",
            fill: false,
            borderDash: [8],
            // pointStyle: "line"
          },
        ],
      };
    };

    let revenueForcastExist = false;
    if (!isEmpty(revenueForcast)) {
      revenueForcast.values.forEach((ele) => {
        if (ele !== 0) {
          revenueForcastExist = true;
        }
      });
    }

    return (
      <>
        {/* card1 */}
        <div className="new-dashboard-row-2-colm1-card1 new-dashboard-row-2-colm1-card1--colm3-card">
          <h3 className="text-center new-dashboard-row-2-colm1-card1__title pb-16">
            revenue forecast vs acquired revenue
          </h3>

          {revenueForcastExist === true ? (
            <Line data={data} options={options} width={100} height={62} />
          ) : (
            <>
              {/*"Show illustartion"*/}
              <div className="text-center">
                <img
                  // src={require("../../../../assets/img/illustrations/dashboard-revenue-forcast.svg")}
                  src="/img/desktop-dark-ui/illustrations/dashboard-revenue-forcast.svg"
                  alt="dashboard revenue forcast no found"
                  className="dashboard-revenue-forcast-img"
                />
                <h5 className="reports-graph-not-found-text">
                  There is no forecast right now
                </h5>
              </div>
            </>
          )}
          {/*<Line data={data} options={options} width={100} height={71} />*/}
        </div>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  revenueForcast: state.dashboard.revenueForcast,
});

export default connect(mapStateToProps, {})(DashboardRowTwoColm2);
