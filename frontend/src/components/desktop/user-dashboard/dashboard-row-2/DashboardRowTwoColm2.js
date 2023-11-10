import React, { Component } from "react";
import { Bar } from "react-chartjs-2";
import { connect } from "react-redux";
import isEmpty from "../../../../store/validations/is-empty";
import {
  graph_text_yAxis_ticks_color,
  graph_text_xAxis_ticks_color,
  graph_gridline_color,
} from "../../../exportGraphColorsValues";

const optionsSymbol = {
  legend: {
    display: false,
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
      leadSourceByRevenue: [],
    };
  }

  /*=======================================
        Component Lifecycle methods
  =========================================*/

  static getDerivedStateFromProps(nextProps, nextState) {
    if (
      !isEmpty(nextProps.leadSourceByRevenue) &&
      nextProps.leadSourceByRevenue !== nextState.leadSourceByRevenue
    ) {
      return {
        leadSourceByRevenue: nextProps.leadSourceByRevenue,
      };
    }
    return null;
  }

  render() {
    // console.log(this.state.leadSourceByRevenue);
    const { leadSourceByRevenue } = this.state;

    const data = (canvas) => {
      const ctx = canvas.getContext("2d");
      const gradient1 = "rgba(174, 154, 255, 1)";
      // ctx.createLinearGradient(0, 0, 0, 1000);
      // gradient1.addColorStop(0, "#1904E5");
      // gradient1.addColorStop(0.2, "#FAB2FF");
      // gradient1.addColorStop(0.3, "#EAAFC8");

      return {
        // labels: ["Facebook", "Google", "Inbound", "LinkedIn", "Instagram"],
        labels: !isEmpty(leadSourceByRevenue) && leadSourceByRevenue.labels,
        datasets: [
          {
            // data: [50, 20, 45, 30, 70],
            categoryPercentage: 0.5,
            barPercentage: 0.8,
            data: !isEmpty(leadSourceByRevenue) && leadSourceByRevenue.values,
            backgroundColor: gradient1,
          },
        ],
      };
    };

    let leadBySourceExist = false;
    if (!isEmpty(leadSourceByRevenue)) {
      leadSourceByRevenue.values.forEach((ele) => {
        if (ele !== 0) {
          leadBySourceExist = true;
        }
      });
    }

    return (
      <>
        {/* column 2 card */}
        <div className="new-dashboard-row-2-colm1-card1 new-dashboard-row-2-colm1-card1--colm2-card">
          <h3 className="text-center new-dashboard-row-2-colm1-card1__title pb-30">
            Leads By Source (revenue)
          </h3>
          {leadBySourceExist === true ? (
            <Bar data={data} options={optionsSymbol} width={100} height={52} />
          ) : (
            <>
              {/*"Show illustartion"*/}
              <div className="text-center">
                <img
                  // src={require("../../../../assets/img/illustrations/dashboard-leads-by-sources.svg")}
                  src="/img/desktop-dark-ui/illustrations/dashboard-leads-by-sources.svg"
                  alt="dashboard leads by sources no found"
                  className="dashboard-leads-by-sources-img"
                />
                <h5 className="reports-graph-not-found-text">
                  There is no data
                </h5>
              </div>
            </>
          )}
          {/*<Bar data={data} options={optionsSymbol} width={100} //height={50} />*/}
        </div>
      </>
    );
  }
}
const mapStateToProps = (state) => ({
  leadSourceByRevenue: state.dashboard.leadSourceByRevenue,
});

export default connect(mapStateToProps, {})(DashboardRowTwoColm2);
