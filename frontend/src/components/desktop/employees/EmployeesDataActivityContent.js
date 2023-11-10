import React from "react";
import { Line } from "react-chartjs-2";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Tabs, Tab, TabPanel, TabList } from "react-web-tabs";
import isEmpty from "./../../../store/validations/is-empty";
import ActivityContentActivityCard from "./../activity/ActivityContentActivityCard";
import dateFns from "date-fns";
import {
  graph_text_yAxis_ticks_color,
  graph_text_xAxis_ticks_color,
  graph_label_color,
  graph_gridline_color,
} from "../../exportGraphColorsValues";

const array = ["1", "2", "3", "4", "5", "6", "7"];

/*=============================
    Render Employee Data
==============================*/
function renderEployeData(allEmaployeeActivity, employeeLeadsOwn) {
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
      <TabPanel tabId="activity">
        <div className="justify-content-space-between">
          <table className="table employee-data-activity">
            <tbody>
              <tr>
                <td>
                  {!isEmpty(activityData) ? (
                    activityData.map((activity, index) => {
                      if (activity.activityType === "EMAIL_CREATED") {
                        return (
                          <ActivityContentActivityCard
                            key={index}
                            //   checkboxId="card6"
                            //   handleCheckboxChange={this.handleCheckboxChange}
                            emoji="&#128231;"
                            emojiAlt="E-Mail"
                            time={dateFns.format(activity.createdAt, "h:mm A")}
                          >
                            <div className="mr-30">
                              <h5 className="font-20-semibold">
                                {activity.user.name}
                                <span className="font-20-regular">
                                  {" "}
                                  sent an{" "}
                                </span>
                                email.
                              </h5>

                              <h6 className="font-18-semibold">
                                {activity.data.subject} :&nbsp;
                                <span className="font-18-regular">
                                  {activity.data.body}
                                </span>
                              </h6>
                            </div>
                          </ActivityContentActivityCard>
                        );
                      } else if (
                        activity.activityType === "NOTE_CREATED" ||
                        activity.activityType === "NOTE_UPDATED"
                      ) {
                        return (
                          <ActivityContentActivityCard
                            key={index}
                            //   checkboxId="card4"
                            //   handleCheckboxChange={this.handleCheckboxChange}
                            emoji="&#128466;"
                            emojiAlt="Memo"
                            time={dateFns.format(activity.createdAt, "h:mm A")}
                          >
                            <div className="mr-30">
                              <h5 className="font-20-semibold">
                                {activity.user.name}
                                <span className="font-20-regular">
                                  {activity.activityType === "NOTE_CREATED"
                                    ? " added a"
                                    : activity.activityType === "NOTE_UPDATED"
                                    ? " updated a"
                                    : ""}{" "}
                                </span>
                                note.
                              </h5>
                            </div>
                          </ActivityContentActivityCard>
                        );
                      } else if (
                        activity.activityType === "FOLLOWUP_CREATED" ||
                        activity.activityType === "FOLLOWUP_UPDATED"
                      ) {
                        return (
                          <ActivityContentActivityCard
                            key={index}
                            //   checkboxId="card4"
                            //   handleCheckboxChange={this.handleCheckboxChange}
                            emoji="&#128221;"
                            emojiAlt="Memo"
                            time={dateFns.format(activity.createdAt, "h:mm A")}
                          >
                            <div className="mr-30">
                              <h5 className="font-20-semibold">
                                {activity.user.name}
                                <span className="font-20-regular">
                                  {" "}
                                  {activity.activityType === "FOLLOWUP_CREATED"
                                    ? " added a"
                                    : activity.activityType ===
                                      "FOLLOWUP_UPDATED"
                                    ? " updated a"
                                    : ""}{" "}
                                </span>
                                Follow Up
                              </h5>
                            </div>
                          </ActivityContentActivityCard>
                        );
                      } else {
                        return (
                          <ActivityContentActivityCard
                            key={index}
                            // checkboxId="card5"
                            //     handleCheckboxChange={this.handleCheckboxChange}
                            emoji="&#128221;"
                            emojiAlt="Memo"
                            time={dateFns.format(activity.createdAt, "h:mm A")}
                          >
                            <div className="mr-30">
                              <h5 className="font-20-semibold">
                                {activity.user.name}
                                <span className="font-20-regular">
                                  {" "}
                                  added a{" "}
                                </span>
                                note.
                              </h5>
                            </div>
                          </ActivityContentActivityCard>
                        );
                      }
                    })
                  ) : (
                    <h3>No Activity found</h3>
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </TabPanel>
      <TabPanel tabId="email">
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
                      {lead.name}
                    </td>
                    <td>{lead.company === "" ? "----" : lead.company}</td>
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
                        : ""}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td>
                  <h3>No Leads Owned found</h3>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </TabPanel>
    </>
  );
}

/*=============================
    Main Activity Content
==============================*/

function EmployeesDataActivityContent({
  employeeLeadsOwn,
  allEmaployeeActivity,
  employeePerformanceGraph,
  tab1,
  tab2,
  tab3,
  tab4,
  tab5,
  tab6,
  startDate,
  endDate,
  handleChangeStart,
  handleChangeEnd,
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
    const gradient1 = ctx.createLinearGradient(0, 0, 0, 1000);
    gradient1.addColorStop(0.3, "rgba(1, 0, 142, .56)");
    gradient1.addColorStop(0.7, "rgba(198, 1, 187, .56)");
    gradient1.addColorStop(0, "rgba(229, 1, 152, .56)");
    gradient1.addColorStop(0.7, "rgba(237, 213, 201, .56)");

    const gradient2 = ctx.createLinearGradient(0, 0, 0, 1000);
    gradient2.addColorStop(0.3, "rgba(0, 255, 136, .19)");
    gradient2.addColorStop(0.5, "rgba(4, 97, 255, .56)");

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
      <Tabs
        defaultTab="activity"
        onChange={(tabId) => {
          console.log(tabId);
        }}
      >
        <TabList>
          <Tab tabFor="activity">{tab1}</Tab>
          <Tab tabFor="email">{tab2}</Tab>
          <Tab tabFor="callLog">{tab3}</Tab>
        </TabList>

        {renderEployeData(allEmaployeeActivity, employeeLeadsOwn)}

        <TabPanel tabId="callLog">
          <h6 className="font-24-semibold mb-25 pt-20">Performance analysis</h6>
          {/* datepicker */}
          <div className="leads-title-block-container__date-picker mb-25">
            {/* datepicker */}
            {/* <DatePicker
              selected={startDate}
              selectsStart
              startDate={startDate}
              endDate={endDate}
              onChange={handleChangeStart}
              placeholderText="---"
            /> */}
            {/* <span className="font-18-medium">to</span> */}
            {/* <DatePicker
              selected={endDate}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              onChange={handleChangeEnd}
              minDate={startDate}
              placeholderText="---"
            /> */}
          </div>
          {/* graph */}
          <Line
            data={data}
            options={optionsPerformanceGraph}
            width={60}
            height={31}
          />
        </TabPanel>
      </Tabs>
    </div>
  );
}

export default EmployeesDataActivityContent;

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
