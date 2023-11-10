import React from "react";
import { Bar } from "react-chartjs-2";
import isEmpty from "../../../store/validations/is-empty";
import { useSelector } from "react-redux";
import {
  graph_text_yAxis_ticks_color,
  graph_text_xAxis_ticks_color,
  // graph_label_color,
  graph_gridline_color,
} from "../../exportGraphColorsValues";

const dummyData = [1, 2, 3, 4, 5, 6, 7, 8];
const optionsLeads = {
  legend: {
    display: false,
    labels: {
      //fontSize: 8,
      //fontColor: graph_label_color,
      //fontFamily: "Inter-Regular",
      //usePointStyle: true,
      //boxWidth: 5,
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
          fontSize: "7",
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

function AccountsNewDealsBar() {
  const accountWithTotalDealsChart = useSelector(
    (state) => state.account.accountWithTotalDealsChart
  );

  const data = (canvas) => {
    const ctx = canvas.getContext("2d");
    const gradient1 = "rgba(174, 154, 255, 1)";
    // ctx.createLinearGradient(0, 0, 0, 1000);
    // gradient1.addColorStop(0, "#1CB5E0");
    // gradient1.addColorStop(0.1, "#C200B3");

    //const gradient2 = ctx.createLinearGradient(0, 0, 0, 1000);
    // gradient2.addColorStop(0, "rgba(254, 168, 89, 1)");
    //gradient2.addColorStop(0.2, "rgba(238, 118, 94, 1)");

    return {
      labels: !isEmpty(accountWithTotalDealsChart)
        ? accountWithTotalDealsChart.accounts
        : [],
      datasets: [
        {
          backgroundColor: gradient1,
          borderWidth: 0,
          data: !isEmpty(accountWithTotalDealsChart)
            ? accountWithTotalDealsChart.deals
            : [],
        },
        //{
        //  backgroundColor: "",
        //  borderWidth: 0,
        //  data: [10, 20, 30, 20, 50],
        //},
      ],
    };
  };
  return (
    <>
      {!isEmpty(accountWithTotalDealsChart) &&
      !isEmpty(accountWithTotalDealsChart.accounts) ? (
        <Bar data={data} options={optionsLeads} width={100} height={32} />
      ) : (
        <div className="account-new-no-deals-found-div">
          <img
            // src={require("../../../../src/assets/img/accounts-new/no_deals_chart.png")}
            src="/img/desktop-dark-ui/illustrations/no_deals_chart.svg"
            alt="account no deals found"
          />
          <p className="font-18-medium color-white-79 mb-21">No Data Yet</p>
        </div>
      )}
    </>
  );
}

export default AccountsNewDealsBar;
