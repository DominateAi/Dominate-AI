import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import isEmpty from "../../../store/validations/is-empty";
import { useSelector } from "react-redux";
import {
  graph_text_yAxis_ticks_color,
  graph_text_xAxis_ticks_color,
  graph_label_color,
  graph_gridline_color,
} from "../../exportGraphColorsValues";

let letTicksFontSize = 0;

if (window.innerWidth > 880) {
  letTicksFontSize = 11;
} else {
  letTicksFontSize = 8;
}

const optionsRevenueBarGraph = {
  curvature: 1,
  legend: {
    display: false,
    labels: {
      fontSize: letTicksFontSize,
      fontColor: graph_label_color,
      fontFamily: "Inter-SemiBold",
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
        scaleLabel: {
          display: true,
          labelString: "",
          fontSize: letTicksFontSize,
          fontColor: graph_label_color,
          fontFamily: "Inter-SemiBold",
        },
        ticks: {
          fontSize: letTicksFontSize,
          fontColor: graph_text_yAxis_ticks_color,
          fontFamily: "Inter-SemiBold",
          suggestedMin: 0,
          // suggestedMax: 200,
          // precision: 10,
          // stepSize: 100,
          beginAtZero: true,
          // Include a string value in the ticks
          callback: function (value, index, values) {
            if (value === 0) return null;
            else return "$" + value + "K  ";
          },
        },
        gridLines: {
          display: true,
          drawBorder: false,
          borderDash: [8],
          borderColor: graph_gridline_color,
          color: graph_gridline_color,
        },
      },
    ],
    xAxes: [
      {
        ticks: {
          fontSize: letTicksFontSize,
          fontColor: graph_text_xAxis_ticks_color,
          fontFamily: "Inter-SemiBold",
          beginAtZero: true,
        },
        gridLines: {
          display: false,
          color: graph_gridline_color,
          borderColor: graph_gridline_color,
        },
      },
    ],
  },
};

function AccountsDetailRevenueBarGraph() {
  const [revenueForecast, setRevenueForecast] = useState([]);

  const revenueForecastReducer = useSelector(
    (state) => state.account.revenueForecast
  );

  useEffect(() => {
    if (!isEmpty(revenueForecastReducer)) {
      setRevenueForecast(revenueForecastReducer);
    } else {
      setRevenueForecast([]);
    }
  }, [revenueForecastReducer]);

  const data = (canvas) => {
    const ctx = canvas.getContext("2d");
    const gradient1 = "rgba(174, 154, 255, 1)";
    // ctx.createLinearGradient(0, 0, 0, 1000);
    // gradient1.addColorStop(0, "#FEA859");
    // gradient1.addColorStop(0.3, "#EE765E");

    let bgColorArr = [];
    for (let i = 0; i < 12; i++) {
      bgColorArr.push(gradient1);
    }
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

      datasets: [
        {
          categoryPercentage: 0.5,
          barPercentage: 1.0,
          label: "",
          backgroundColor: bgColorArr,
          data: !isEmpty(revenueForecast) && revenueForecast.values,
          borderWidth: 0,
        },
      ],
    };
  };

  return (
    <>
      <Bar
        data={data}
        options={optionsRevenueBarGraph}
        width={100}
        height={33}
      />
    </>
  );
}

export default AccountsDetailRevenueBarGraph;
