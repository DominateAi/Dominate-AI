import React, { Component } from "react";
import { Line } from "react-chartjs-2";
import { connect } from "react-redux";
import isEmpty from "./../../../../store/validations/is-empty";
import {
  graph_text_yAxis_ticks_color,
  graph_text_xAxis_ticks_color,
  graph_label_color,
  graph_gridline_color,
} from "../../../exportGraphColorsValues";

const optionsSalesReportGraph = {
  legend: {
    labels: {
      fontSize: 8,
      fontColor: graph_label_color,
      fontFamily: "Inter-Regular",
      usePointStyle: true,
      boxWidth: 4,
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
          fontSize: 8,
          fontColor: graph_text_yAxis_ticks_color,
          fontFamily: "Inter-Regular",
          suggestedMin: 0,
          // suggestedMax: 30,
          // precision: 5,
          // stepSize: 5,
          beginAtZero: true,
          // Include a string value in the ticks
          callback: function (value, index, values) {
            if (value === 0) return null;
            else return value + "  ";
          },
        },
        scaleLabel: {
          // fontSize: "10",
          // fontColor: graph_label_color,
          // fontFamily: "Inter-Medium",
          // labelString: "",
          display: false,
        },
        gridLines: {
          display: false,
          drawBorder: true,
          lineWidth: 1,
          color: graph_gridline_color,
        },
      },
    ],
    xAxes: [
      {
        ticks: {
          fontSize: 8,
          fontColor: graph_text_xAxis_ticks_color,
          fontFamily: "Inter-SemiBold",
        },
        barPercentage: 0.5,
        scaleLabel: {
          fontSize: 10,
          fontColor: graph_label_color,
          fontFamily: "Inter-Bold",
          display: true,
          // labelString: ""
        },
        gridLines: {
          display: true,
          drawBorder: true,
          lineWidth: 1,
          color: graph_gridline_color,
        },
      },
    ],
  },
};

class DashboardRowSixColm2Graph extends Component {
  constructor() {
    super();
    this.state = {};
  }

  /*=======================================
              Lifecycle Methods
  ========================================*/
  static getDerivedStateFromProps(nextProps, nextState) {
    if (
      !isEmpty(nextProps.userMyTargetsGraph) &&
      nextProps.userMyTargetsGraph !== nextState.userMyTargetsGraph
    ) {
      return {
        userMyTargetsGraph: nextProps.userMyTargetsGraph,
      };
    }
    return null;
  }

  handleSeeMore = () => {
    console.log("see more button clicked");
  };
  render() {
    // console.log(this.state.userMyTargetsGraph);

    const { userMyTargetsGraph } = this.state;
    /*=========================================
              lineGraph
=========================================*/

    // graphs data
    const data = (canvas) => {
      const ctx = canvas.getContext("2d");
      // const gradient1 = ctx.createLinearGradient(0, 0, 0, 1000);
      // gradient1.addColorStop(0, "rgba(255, 204, 112, 1)");
      // gradient1.addColorStop(0.2, "rgba(200, 80, 192, 1)");
      // gradient1.addColorStop(0.5, "rgba(65, 88, 208, 1)");

      // const gradient2 = ctx.createLinearGradient(0, 0, 0, 100);
      // gradient2.addColorStop(0.3, "rgba(209, 199, 255, .97)");
      // gradient2.addColorStop(0, "rgba(80, 46, 255, .97)");

      return {
        labels: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ],
        // labels:
        //   !isEmpty(userMyTargetsGraph) &&
        //   userMyTargetsGraph.graph.x_axis.labels,
        datasets: [
          {
            label: "Leads converted",
            // data: [20, 30, 55, 56, 30, 65, 32, 67, 30, 56, 30, 65],
            data:
              !isEmpty(userMyTargetsGraph) &&
              userMyTargetsGraph.graph.y_axis.leads,
            // backgroundColor: gradient1,
            backgroundColor: "rgba(174, 154, 255, 0.29)",
            borderColor: "transparent",
          },
          // {
          //   label: "Tasks completed",
          //   data: [30, 50, 30, 55, 30, 45, 52, 28, 25, 55, 30, 45],
          //   // data:
          //   //   !isEmpty(userMyTargetsGraph) &&
          //   //   userMyTargetsGraph.graph.y_axis.tasks,
          //   backgroundColor: gradient2,
          //   borderColor: "transparent"
          // }
        ],
      };
    };
    /*=========================================
              end lineGraph
=========================================*/

    let mytargetExist = false;
    if (!isEmpty(userMyTargetsGraph)) {
      userMyTargetsGraph.graph.y_axis.leads.forEach((ele) => {
        if (ele !== 0) {
          mytargetExist = true;
        }
      });
    }

    if (mytargetExist === true) {
      return (
        <div>
          {/* <h4 className="font-16-medium">Monthly report</h4> */}
          <div className="sales-report-tab-content sales-report-tab-content--new-dashboard">
            <div className="sales-report-tab-content__1-new-dashboard">
              {/* lineGraph */}
              <Line
                data={data}
                options={optionsSalesReportGraph}
                width={100}
                height={46}
              />
            </div>
            {/* ratio */}
            <div className="sales-report-tab-content__2-new-dashboard text-center">
              <h5 className="sales-purple-text">
                {!isEmpty(userMyTargetsGraph) &&
                  userMyTargetsGraph.convertedLeads.convertedLead}{" "}
                /{" "}
                {!isEmpty(userMyTargetsGraph) &&
                userMyTargetsGraph.convertedLeads.targetedLeadForUser !==
                  undefined
                  ? userMyTargetsGraph.convertedLeads.targetedLeadForUser
                  : 0}
                {/* 24 /24 */}
              </h5>
              <h6 className="font-16-medium mb-30">
                Converted leads this month
              </h6>
              {/* <h5 className="sales-cayan-text"> */}
              {/* {!isEmpty(userMyTargetsGraph) && userMyTargetsGraph.taskCompleted} */}
              {/* 24 */}
              {/* </h5> */}
              {/* <h6 className="font-16-medium">Tasks completed in this month </h6> */}
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <>
          {/*"Show illustartion"*/}
          <div className="text-center">
            <img
              // src={require("../../../../assets/img/illustrations/dashboard-target.svg")}
              src="/img/desktop-dark-ui/illustrations/dashboard-target.svg"
              alt="dashboard target no found"
              className="dashboard-target-img"
            />
            <h5 className="reports-graph-not-found-text">No Data</h5>
          </div>
        </>
      );
    }
  }
}

const mapStateToProps = (state) => ({
  userMyTargetsGraph: state.dashboard.userMyTargetsGraph,
});

export default connect(mapStateToProps, {})(DashboardRowSixColm2Graph);
