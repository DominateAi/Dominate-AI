import React, { Component } from "react";
import { Bar } from "react-chartjs-2";
import { optionsLeads } from "./BarGraphOptions";

class DashboardRowTwoColm1Card2Graph extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // require for responsive window
      windowWidth: window.innerWidth,
    };
  }

  /*========================================================
                mobile view event handlers
  ========================================================*/

  componentDidMount() {
    window.addEventListener("resize", this.handleWindowResize);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.handleWindowResize);
  }

  handleWindowResize = () => {
    this.setState({
      windowWidth: window.innerWidth,
    });
  };

  /*========================================================
                end mobile view event handlers[74, 53, 75]
  ========================================================*/

  render() {
    const data = (canvas) => {
      const ctx = canvas.getContext("2d");
      // const gradient1 = ctx.createLinearGradient(0, 0, 0, 1000);
      // gradient1.addColorStop(0.1, "#00C6FF");
      // gradient1.addColorStop(0, "#0072FF");

      // const gradient2 = ctx.createLinearGradient(0, 0, 0, 1000);
      // gradient2.addColorStop(0.1, "#FEA859");
      // gradient2.addColorStop(0, "#EE765E");

      return {
        labels: this.props.labels,
        datasets: [
          {
            label: this.props.labelName1,
            // backgroundColor: gradient1,
            backgroundColor: "#A18EFF",
            borderWidth: 0,
            data: this.props.dataSet1,
          },
          {
            label: this.props.labelName2,
            // backgroundColor: gradient2,
            backgroundColor: "#ded8ff",
            borderWidth: 0,
            data: this.props.dataSet2,
          },
        ],
      };
    };
    return (
      <div>
        {this.state.windowWidth >= 1044 ? (
          <Bar data={data} options={optionsLeads} width={100} height={41} />
        ) : (
          this.state.windowWidth < 1044 && (
            <Bar data={data} options={optionsLeads} width={100} height={101} />
          )
        )}
      </div>
    );
  }
}

export default DashboardRowTwoColm1Card2Graph;
