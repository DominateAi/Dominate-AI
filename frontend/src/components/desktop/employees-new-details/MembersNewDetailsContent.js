import React from "react";
import { Line } from "react-chartjs-2";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Tabs, Tab, TabPanel, TabList } from "react-web-tabs";
import isEmpty from "./../../../store/validations/is-empty";
import ActivityContentActivityCard from "./../activity/ActivityContentActivityCard";
import dateFns from "date-fns";
import displaySmallText from "./../../../store/utils/sliceString";
import {
  graph_text_yAxis_ticks_color,
  graph_text_xAxis_ticks_color,
  graph_label_color,
  graph_gridline_color,
} from "../../exportGraphColorsValues";

/*=============================
    Render Employee Data
==============================*/
function renderEployeData(tab1, tab2, allEmaployeeActivity, employeeLeadsOwn) {
  // console.log(allEmaployeeActivity);
  let activityData = [];
  if (allEmaployeeActivity) {
    activityData = allEmaployeeActivity;
  }

  let leadsOwnData = [];
  if (employeeLeadsOwn) {
    leadsOwnData = employeeLeadsOwn;
  }

  return (
    <>
      {tab1 === "activity" && (
        <table className="table employee-data-activity">
          <tbody>
            <tr>
              <td className="border-top-0 border-bottom-0">
                {!isEmpty(activityData) ? (
                  activityData.map((activity, index) => {
                    // console.log(activity);
                    return (
                      <ActivityContentActivityCard
                        key={index}
                        //   checkboxId="card6"
                        //   handleCheckboxChange={this.handleCheckboxChange}
                        emoji="&#128231;"
                        emojiAlt="E-Mail"
                        time={dateFns.format(activity.createdAt, "h:mm A")}
                      >
                        {/* {activity} */}
                        {activity.activityType === "LEAD_CREATED" ||
                        activity.activityType === "LEAD_UPDATED" ||
                        activity.activityType === "LEAD_CLOSED" ? (
                          <div className="mr-30">
                            <h5 className="font-20-semibold">
                              {activity.user.name}
                              <span className="font-20-regular">
                                {" "}
                                {activity.activityType === "LEAD_CREATED"
                                  ? "created"
                                  : activity.activityType === "LEAD_UPDATED"
                                  ? "updated"
                                  : "closed"}{" "}
                                an{" "}
                              </span>
                              lead.
                            </h5>
                          </div>
                        ) : activity.activityType === "FOLLOWUP_CREATED" ||
                          activity.activityType === "FOLLOWUP_UPDATED" ? (
                          <div className="mr-30">
                            <h5 className="font-20-semibold">
                              {activity.user.name}
                              <span className="font-20-regular">
                                {" "}
                                added an{" "}
                              </span>
                              followup.
                            </h5>
                          </div>
                        ) : activity.activityType === "DEAL_CREATED" ||
                          activity.activityType === "DEAL_UPDATED" ||
                          activity.activityType === "DEAL_CLOSED" ? (
                          <div className="mr-30">
                            <h5 className="font-20-semibold">
                              {activity.user.name}
                              <span className="font-20-regular">
                                {" "}
                                {activity.activityType === "DEAL_CLOSED"
                                  ? "closed"
                                  : activity.activityType === "DEAL_UPDATED"
                                  ? "updated"
                                  : "added"}{" "}
                                an{" "}
                              </span>
                              Deal.
                            </h5>
                          </div>
                        ) : activity.activityType === "EMAIL_CREATED" ? (
                          <div className="mr-30">
                            <h5 className="font-20-semibold">
                              {activity.user.name}
                              <span className="font-20-regular"> sent an </span>
                              email.
                            </h5>

                            <h6 className="font-18-semibold">
                              {activity.data.subject} :&nbsp;
                              <span className="font-18-regular">
                                {activity.data.body}
                              </span>
                            </h6>
                          </div>
                        ) : (
                          ""
                        )}
                      </ActivityContentActivityCard>
                    );
                  })
                ) : (
                  <h3 className="font-21-semibold">No Activity found</h3>
                )}
              </td>
            </tr>
          </tbody>
        </table>
      )}
      {tab2 === "email" && (
        <div className="employee-data-container">
          <table className="table employee-data-leads-own">
            <thead>
              <tr>
                <th>Lead Name</th>
                <th>Company Name</th>
                <th>Email</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {!isEmpty(leadsOwnData) ? (
                leadsOwnData.map((lead, index) => {
                  return (
                    <tr key={index}>
                      <td>
                        <img
                          src={require("../../../assets/img/leads/lead_default_img.svg")}
                          alt="profile-img"
                        />{" "}
                        {displaySmallText(lead.name, 15, true)}
                      </td>
                      <td>
                        {!isEmpty(lead.account_id) &&
                          lead.account_id.accountname}
                      </td>
                      <td>{lead.email}</td>
                      <td>
                        {lead.status === "CONVERTED"
                          ? "Converted"
                          : lead.status === "NEW_LEAD"
                          ? "New lead"
                          : lead.status === "ON_HOLD"
                          ? "On hold"
                          : lead.status === "OPPORTUNITES"
                          ? "Opportunity"
                          : lead.status === "QUALIFIED_LEADS"
                          ? "Qualified Lead"
                          : lead.status === "CONTACTED_LEADS"
                          ? "Contacted"
                          : "Archive"}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td className="border-bottom-0">
                    <h3 className="font-21-semibold">No Leads Owned found</h3>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

/*=============================
    Main Activity Content
==============================*/

function MembersNewDetailsContent({
  employeeLeadsOwn,
  allEmaployeeActivity,
  employeePerformanceGraph,
  tab1,
  tab2,
  tab3,
}) {
  let x_axis_labels_InArray = [];
  if (employeePerformanceGraph) {
    x_axis_labels_InArray = employeePerformanceGraph.x_axis.labels;
  }

  let y_axis_closed_leads = [];
  if (employeePerformanceGraph) {
    y_axis_closed_leads = employeePerformanceGraph.y_axis.closed;
  }

  let y_axis_open_leads = [];
  if (employeePerformanceGraph) {
    y_axis_open_leads = employeePerformanceGraph.y_axis.open;
  }
  // console.log(dataInArray);

  /*=========================================
              lineGraph
=========================================*/

  // graphs data
  const data = (canvas) => {
    const ctx = canvas.getContext("2d");
    const gradient1 = "rgba(174, 154, 255, 0.8)";
    // ctx.createLinearGradient(0, 0, 0, 1000);
    // gradient1.addColorStop(0.3, "rgba(1, 0, 142, .56)");
    // gradient1.addColorStop(0.7, "rgba(198, 1, 187, .56)");
    // gradient1.addColorStop(0, "rgba(229, 1, 152, .56)");
    // gradient1.addColorStop(0.7, "rgba(237, 213, 201, .56)");

    const gradient2 = "rgba(113, 95, 204, 0.8)";
    // ctx.createLinearGradient(0, 0, 0, 1000);
    // gradient2.addColorStop(0.3, "rgba(0, 255, 136, .19)");
    // gradient2.addColorStop(0.5, "rgba(4, 97, 255, .56)");

    return {
      labels: x_axis_labels_InArray,
      datasets: [
        {
          label: "Open leads",
          data: y_axis_open_leads,
          backgroundColor: gradient2,
          borderColor: "transparent",
        },
        {
          label: "Closed leads",
          data: y_axis_closed_leads,
          backgroundColor: gradient1,
          borderColor: "transparent",
        },
      ],
    };
  };
  /*=========================================
              end lineGraph
=========================================*/
  return (
    <div className="activityMenuTabs">
      {renderEployeData(tab1, tab2, allEmaployeeActivity, employeeLeadsOwn)}

      {tab3 === "performance" && (
        <div className="mt-20">
          {/* graph */}
          <Line
            data={data}
            options={optionsPerformanceGraph}
            width={100}
            height={33}
          />
        </div>
      )}
    </div>
  );
}

export default MembersNewDetailsContent;

// optionsPerformanceGraph
export const optionsPerformanceGraph = {
  legend: {
    labels: {
      fontColor: graph_label_color,
      fontFamily: "Inter-Regular",
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
          fontSize: "12",
          fontColor: graph_text_yAxis_ticks_color,
          fontFamily: "Inter-Medium",
          suggestedMin: 0,
          // suggestedMax: 30,
          // precision: 5,
          // stepSize: 5,
          beginAtZero: true,
          // Include a string value in the ticks
          callback: function (value, index, values) {
            return value + "  ";
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
          fontSize: "12",
          fontColor: graph_text_xAxis_ticks_color,
          fontFamily: "Inter-Medium",
        },
        barPercentage: 0.5,
        scaleLabel: {
          fontSize: "10",
          fontColor: graph_label_color,
          fontFamily: "Inter-Bold",
          display: true,
          labelString: "",
        },
        gridLines: {
          display: false,
          drawBorder: true,
          lineWidth: 1,
          color: graph_gridline_color,
        },
      },
    ],
  },
};
// optionsPerformanceGraph end
