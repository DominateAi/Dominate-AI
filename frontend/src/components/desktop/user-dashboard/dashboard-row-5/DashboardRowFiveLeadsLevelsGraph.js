import React, { Component } from "react";
import { Doughnut } from "react-chartjs-2";
import {
  // graph_text_yAxis_ticks_color,
  // graph_text_xAxis_ticks_color,
  graph_label_color,
  // graph_gridline_color,
} from "../../../exportGraphColorsValues";

const options = {
  legend: {
    labels: {
      fontSize: 12,
      fontColor: graph_label_color,
      fontFamily: "Inter-SemiBold",
      usePointStyle: true,
    },
  },
  cutoutPercentage: 35,
  tooltips: {
    backgroundColor: "#1e2428",
    titleFontFamily: "Inter-Regular",
    bodyFontFamily: "Inter-Regular",
  },
};

class DashboardRowFiveLeadsLevelsGraph extends Component {
  constructor() {
    super();
    this.state = {};
  }

  render() {
    let lebelsData = [
      "Warm leads",
      "Super hot leads",
      "Hot leads",
      "Cold leads",
    ];

    const data = (canvas) => {
      const ctx = canvas.getContext("2d");
      const gradient1 = ctx.createLinearGradient(0, 0, 0, 900);
      gradient1.addColorStop(0, "#B95EFF");
      gradient1.addColorStop(0.5, "#FF9966");

      const gradient2 = ctx.createLinearGradient(0, 0, 0, 1000);
      gradient2.addColorStop(0, "#FF9966");
      gradient2.addColorStop(0.7, "#B95EFF");

      const gradient3 = ctx.createLinearGradient(0, 0, 0, 900);
      gradient3.addColorStop(0, "#1CB5E0");
      gradient3.addColorStop(0.8, "#B95EFF");

      const gradient4 = ctx.createLinearGradient(0, 0, 0, 900);
      gradient4.addColorStop(0.3, "#FFA5A5");
      gradient4.addColorStop(0, "#FF2626");

      return {
        labels: lebelsData,
        datasets: [
          {
            data: [23, 34, 31, 12],
            backgroundColor: [gradient1, gradient2, gradient3, gradient4],
            borderColor: "#fff",
            borderWidth: 0,
            hoverBorderColor: "transparent",
          },
        ],
      };
    };

    // console.log(this.state.socialMediaGraph);
    return (
      <div>
        <Doughnut data={data} options={options} width={100} height={70} />
      </div>
    );
  }
}

export default DashboardRowFiveLeadsLevelsGraph;
