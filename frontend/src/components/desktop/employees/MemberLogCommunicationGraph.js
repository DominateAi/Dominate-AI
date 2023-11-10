import React, { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { useSelector } from "react-redux";
import isEmpty from "../../../store/validations/is-empty";

export default function MemberLogCommunicationGraph() {
  const [labelArray, setlabelArray] = useState([]);
  const [chartData, setchartData] = useState({});
  const followupsOverviewCount = useSelector(
    (state) => state.workspaceActivity.followupsOverviewCount
  );

  const followupsOverviewChart = useSelector(
    (state) => state.workspaceActivity.followupsOverviewChart
  );

  useEffect(() => {
    if (!isEmpty(followupsOverviewChart)) {
      setchartData(followupsOverviewChart);
    } else {
      setchartData({});
    }
  }, [followupsOverviewChart]);

  useEffect(() => {
    if (!isEmpty(followupsOverviewCount)) {
      setlabelArray([
        {
          labels: "Calls",
          conts: followupsOverviewCount.call,
        },
        {
          labels: "Emails",
          conts: followupsOverviewCount.email,
        },
        {
          labels: "Whatsapp",
          conts: followupsOverviewCount.whatsapp,
        },
        {
          labels: "SMS",
          conts: followupsOverviewCount.sms,
        },
      ]);
    } else {
      setlabelArray([
        {
          labels: "Calls",
          conts: "0",
        },
        {
          labels: "Emails",
          conts: "0",
        },
        {
          labels: "Whatsapp",
          conts: "0",
        },
        {
          labels: "SMS",
          conts: "0",
        },
      ]);
    }
  }, [followupsOverviewCount]);

  const options = {
    legend: {
      display: false,
      position: "right",
    },
    elements: {
      arc: {
        borderWidth: 0,
      },
    },
  };

  const data = (canvas) => {
    const ctx = canvas.getContext("2d");
    const gradient1 = ctx.createLinearGradient(0, 0, 0, 900);
    gradient1.addColorStop(0, "#48C6EF");
    gradient1.addColorStop(0.3, "#6F86D6");

    const gradient2 = ctx.createLinearGradient(0, 0, 0, 900);
    gradient2.addColorStop(0, "#16D9E3");
    gradient2.addColorStop(0.3, "#30C7EC");
    gradient2.addColorStop(0.8, "#46AEF7");

    const gradient3 = ctx.createLinearGradient(0, 0, 0, 900);
    gradient3.addColorStop(0, "#B490CA");
    gradient3.addColorStop(0.2, "#5EE7DF");

    const gradient4 = ctx.createLinearGradient(0, 0, 0, 900);
    gradient4.addColorStop(0, "#8EC5FC");
    gradient4.addColorStop(0.3, "#E0C3FC");

    return {
      labels: ["Calls", "Emails", "Whatsapp", "SMS"],
      datasets: [
        {
          data: [
            !isEmpty(chartData) && chartData.call,
            !isEmpty(chartData) && chartData.email,
            !isEmpty(chartData) && chartData.whatsapp,
            !isEmpty(chartData) && chartData.sms,
          ],
          backgroundColor: [gradient1, gradient2, gradient3, gradient4],
          borderColor: "#fff",
          borderWidth: "0.5px",
          hoverBorderColor: "transparent",
        },
      ],
    };
  };
  return (
    <div className="member-log-communication-graph-div">
      <div className="row mx-0 align-items-center">
        <img
          src={require("../../../assets/img/icons/purple-gradient-circle-icon.svg")}
          alt=" "
          className="member-orange-gradient-circle-img"
        />
        <h3 className="member-log-communication-graph-title">
          Communication Overview
        </h3>
      </div>
      <div className="row pt-40 mx-0 flex-nowrap align-items-center">
        <div>
          {!isEmpty(labelArray) &&
            labelArray.map((data, index) => (
              <div
                className="row mx-0 align-items-center mb-18 member-log-communication-labels-row-div"
                key={index}
              >
                <h5 className="chart-label-text">{data.labels}</h5>
                <div className="chart-count-div">
                  <span>{data.conts}</span>
                </div>
              </div>
            ))}
        </div>
        <div className="member-log-communication-graph-block">
          <Doughnut data={data} options={options} width={100} height={100} />
        </div>
      </div>
    </div>
  );
}
