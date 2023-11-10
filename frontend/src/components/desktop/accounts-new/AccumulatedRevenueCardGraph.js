import React from "react";
import { Bar } from "react-chartjs-2";
import { connect } from "react-redux";
import isEmpty from "../../../store/validations/is-empty";
import { useSelector } from "react-redux";
import {
  graph_text_yAxis_ticks_color,
  graph_text_xAxis_ticks_color,
  graph_label_color,
  graph_gridline_color,
} from "../../exportGraphColorsValues";

const optionsLeads = {
  legend: {
    display: true,
    labels: {
      fontSize: 8,
      fontColor: graph_label_color,
      fontFamily: "Inter-Medium",
      usePointStyle: true,
      boxWidth: 5,
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
        stacked: true,
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
            else return value + "  ";
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
        stacked: true,
        ticks: {
          fontSize: "8",
          fontColor: graph_text_xAxis_ticks_color,
          fontFamily: "Inter-SemiBold",
        },
        categoryPercentage: 0.5,
        barPercentage: 0.8,
        gridLines: {
          display: false,
          color: graph_gridline_color,
        },
      },
    ],
  },
};

function AccumulatedRevenueCardGraph() {
  const accountAccumulatedRevenueGraph = useSelector(
    (state) => state.account.accountAccumulatedRevenueGraph
  );

  const data = (canvas) => {
    const ctx = canvas.getContext("2d");
    const gradient1 = ctx.createLinearGradient(0, 0, 0, 1000);
    gradient1.addColorStop(0, "rgba(0, 198, 255, 1)");
    gradient1.addColorStop(0.2, "rgba(0, 114, 255, 1)");

    const gradient2 = ctx.createLinearGradient(0, 0, 0, 1000);
    gradient2.addColorStop(0, "rgba(254, 168, 89, 1)");
    gradient2.addColorStop(0.2, "rgba(238, 118, 94, 1)");

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
      datasets: !isEmpty(accountAccumulatedRevenueGraph)
        ? accountAccumulatedRevenueGraph.accountsWithData.map((data, index) => {
            return {
              label: data.label,
              // backgroundColor:
              //   index === 0
              //     ? "#57BAC9"
              //     : index === 1
              //     ? "#B683CF"
              //     : index === 2
              //     ? "#F8A66C"
              //     : "#57BAC9",
              backgroundColor: "rgba(174, 154, 255, 0.25)",
              borderWidth: 0,
              data: data.data,
            };
          })
        : [],
      // [
      //   {
      //     label: "Account 1",
      //     backgroundColor: "#57BAC9",
      //     borderWidth: 0,
      //     data: [10, 20, 30, 40],
      //   },
      //   {
      //     label: "Account 2",
      //     backgroundColor: "#B683CF",
      //     borderWidth: 0,
      //     data: [10, 20, 30],
      //   },
      //   {
      //     label: "Account 3",
      //     backgroundColor: "#F8A66C",
      //     borderWidth: 0,
      //     data: [10, 20, 30],
      //   },
      // ],
    };
  };

  return (
    <>
      {!isEmpty(accountAccumulatedRevenueGraph) &&
      !isEmpty(accountAccumulatedRevenueGraph.accountsWithData[0]) ? (
        <Bar data={data} options={optionsLeads} width={100} height={32} />
      ) : (
        <div className="accumulated-no-data-found-div">
          <img
            // className="no_leads_img"
            // src={require("../../../../src/assets/img/accounts-new/no_revenue_chart.png")}
            src="/img/desktop-dark-ui/illustrations/accounts-accumulated-revenue-no-data.svg"
            alt="lead"
          />
          <p className="font-18-medium color-white-79">No Data Yet</p>
        </div>
      )}
    </>
  );
}

export default AccumulatedRevenueCardGraph;
