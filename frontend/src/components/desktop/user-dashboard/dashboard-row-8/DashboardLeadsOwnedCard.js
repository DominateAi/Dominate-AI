import React, { Component } from "react";
import { Tabs, Tab, TabPanel, TabList } from "react-web-tabs";
import DashboardRowTwoColm1Card1Graph from "../dashboard-row-2/DashboardRowTwoColm1Card1Graph";
import DashboardRowTwoColm1Card2Graph from "../dashboard-row-2/DashboardRowTwoColm1Card2Graph";

export class DashboardLeadsOwnedCard extends Component {
  render() {
    return (
      <div className="leads_owned_card">
        <div className="heading_section">
          <img
            className="employee_img"
            src={require("./../../../../assets/img/employees/emp-default-img.jpg")}
            alt=""
          />
          <p>Travis Miller</p>
        </div>
        <div className="leads_own_card_tabs">
          <Tabs
            defaultTab="one"
            onChange={tabId => {
              // console.log(tabId);
            }}
          >
            <TabList>
              <Tab tabFor="one">Dollars</Tab>
              <Tab tabFor="two">Leads</Tab>
            </TabList>
            <TabPanel tabId="one">
              <DashboardRowTwoColm1Card1Graph
                labels={["New Leads", "Contacted Leads", "Closed Leads"]}
                labelName1="Expected"
                dataSet1={[60, 70, 84]}
                labelName2="Accomplished"
                dataSet2={[74, 53, 75]}
              />
            </TabPanel>
            <TabPanel tabId="two">
              <DashboardRowTwoColm1Card2Graph
                labels={["New Leads", "Contacted Leads", "Closed Leads"]}
                labelName1="Expected"
                dataSet1={[60, 70, 84]}
                labelName2="Accomplished"
                dataSet2={[74, 53, 75]}
              />
            </TabPanel>
          </Tabs>
        </div>
      </div>
    );
  }
}

export default DashboardLeadsOwnedCard;
