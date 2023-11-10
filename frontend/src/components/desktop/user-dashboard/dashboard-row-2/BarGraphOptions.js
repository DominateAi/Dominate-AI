import {
  graph_text_yAxis_ticks_color,
  graph_text_xAxis_ticks_color,
  graph_label_color,
  graph_gridline_color,
} from "../../../exportGraphColorsValues";

export const optionsCurrency = {
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
    backgroundColor: "#a6a9b7",
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
        categoryPercentage: 0.5,
        barPercentage: 1.0,
        gridLines: {
          display: false,
          color: graph_gridline_color,
        },
      },
    ],
  },
};

export const optionsLeads = {
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
