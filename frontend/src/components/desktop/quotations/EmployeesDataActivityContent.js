import React from "react";
import { Tabs, Tab, TabPanel, TabList } from "react-web-tabs";
import isEmpty from "./../../../store/validations/is-empty";

const array = ["1", "2", "3", "4", "5", "6", "7"];

/*=============================
    Render Employee Data
==============================*/
function renderEployeData(allEmaployeeActivity, employeeLeadsOwn) {
  console.log(employeeLeadsOwn);
  return (
    <>
      <TabPanel tabId="activity">
        <div className="justify-content-space-between">
          <table className="table employee-data-activity">
            <tbody>
              {!isEmpty(allEmaployeeActivity) &&
                array.map((value, index) => {
                  return (
                    <tr key={index}>
                      <td className="icon-table-column">
                        <img
                          src={require("../../../assets/img/icons/Dominate-Icon_outlook.png")}
                          alt=""
                        />
                      </td>
                      <td className="content-column">
                        <p>
                          <span>Anna Macintosh</span> Sent an <span>Email</span>
                        </p>
                        <p>
                          <span>Subject:</span> Lorem ipsum dolor sit amet Lorem
                          ipsum dolor sit amet{" "}
                        </p>
                      </td>
                      <td className="time-column">11:AM</td>
                    </tr>
                  );
                })}
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
            {array.map((value, index) => {
              return (
                <tr key={index}>
                  <td>
                    <img
                      src={require("../../../assets/img/leads/ben-1.png")}
                      alt="profile-img"
                    />{" "}
                    John Dorian
                  </td>
                  <td>XYZ Corp</td>
                  <td>admin@xyz.com</td>
                  <td>New</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </TabPanel>
      <TabPanel tabId="callLog">
        <h6 className="font-21-bold">Call Log</h6>
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
  tab1,
  tab2,
  tab3,
  tab4,
  tab5,
  tab6
}) {
  // console.log(leadActivityData);
  return (
    <div className="activityMenuTabs">
      <Tabs
        defaultTab="activity"
        onChange={tabId => {
          console.log(tabId);
        }}
      >
        <TabList>
          <Tab tabFor="activity">{tab1}</Tab>
          <Tab tabFor="email">{tab2}</Tab>
          <Tab tabFor="callLog">{tab3}</Tab>
        </TabList>

        {renderEployeData(allEmaployeeActivity, employeeLeadsOwn)}
      </Tabs>
    </div>
  );
}

export default EmployeesDataActivityContent;
