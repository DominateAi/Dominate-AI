import React from "react";
import { Bar } from "react-chartjs-2";

const optionsLeads = {
  legend: {
    display: false,
  },
  tooltips: {
    enabled: false,
    // fontSize: "2",
    // backgroundColor: "#1e2428",
    // titleFontFamily: "Inter-Regular",
    // bodyFontFamily: "Inter-Regular",
  },
  scales: {
    yAxes: [
      {
        ticks: {
          fontSize: "0",
        },
        gridLines: {
          display: false,
          drawBorder: false,
        },
      },
    ],
    xAxes: [
      {
        ticks: {
          fontSize: "0",
        },
        categoryPercentage: 0.5,
        barPercentage: 0.8,
        gridLines: {
          display: false,
        },
      },
    ],
  },
};

function AccumulatedRevenueBarChart() {
  const data = (canvas) => {
    //   const ctx = canvas.getContext("2d");
    //   const gradient1 = ctx.createLinearGradient(0, 0, 0, 1000);
    //   gradient1.addColorStop(0, "rgba(0, 198, 255, 1)");
    //   gradient1.addColorStop(0.2, "rgba(0, 114, 255, 1)");

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
          label: "Target",
          backgroundColor: "#572F85",
          borderWidth: 0,
          data: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120],
        },
      ],
    };
  };

  return (
    <>
      <Bar data={data} options={optionsLeads} width={100} height={55} />
    </>
  );
}

export default AccumulatedRevenueBarChart;
