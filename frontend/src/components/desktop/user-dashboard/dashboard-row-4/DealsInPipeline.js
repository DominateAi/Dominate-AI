import React, { Component } from "react";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
import { connect } from "react-redux";
import isEmpty from "../../../../store/validations/is-empty";
import {
  updateLeadAction,
  updateLeadLevelAction,
} from "./../../../../store/actions/leadAction";
import displaySmallText from "./../../../../store/utils/sliceString";

const emojiOption = ["🌋", "☀️", "☕", "❄️️"];

const statusOptionsRow = [
  "New Lead",
  "Qualified Lead",
  "On Hold Lead",
  "Contacted Lead",
  "Opportunity Lead",
  "Converted Lead",
];
export class DealsInPipeline extends Component {
  constructor() {
    super();
    this.state = {
      leadLevelDefaultOption: emojiOption[0],
      statusDefualtValue: statusOptionsRow[0],
    };
  }

  /*=====================================
      Component Lifecycle method
  ======================================*/
  static getDerivedStateFromProps(nextProps, nextState) {
    if (
      !isEmpty(nextProps.dealsInPipeline) &&
      nextProps.dealsInPipeline !== nextState.dealsInPipeline
    ) {
      return {
        dealsInPipeline: nextProps.dealsInPipeline,
      };
    }
    return null;
  }

  componentDidUpdate() {
    if (this.props.dealsInPipeline !== this.state.dealsInPipeline) {
      this.setState({
        dealsInPipeline: this.props.dealsInPipeline,
      });
    }
  }

  onAllLeadDropdownSelect = (leadData) => (e) => {
    console.log("Selected: " + e.value);
    if (e.value === "🌋") {
      this.props.updateLeadLevelAction(
        leadData._id,
        { degree: "SUPER_HOT" },
        this.props.leadFilterName,
        this.props.userId
      );
    } else if (e.value === "☀️") {
      this.props.updateLeadLevelAction(
        leadData._id,
        { degree: "HOT" },
        this.props.leadFilterName,
        this.props.userId
      );
    } else if (e.value === "☕") {
      this.props.updateLeadLevelAction(
        leadData._id,
        { degree: "WARM" },
        this.props.leadFilterName,
        this.props.userId
      );
    } else {
      this.props.updateLeadLevelAction(
        leadData._id,
        { degree: "COLD" },
        this.props.leadFilterName,
        this.props.userId
      );
    }
  };

  /*==========================================
              onStatusOptionsRowClick
  ============================================*/

  onStatusOptionsRowClick = (leadData) => (e) => {
    console.log(e.value);
    console.log(leadData);
    if (e.value === "New Lead") {
      let leadAllData = leadData;
      leadAllData.status = "NEW_LEAD";

      this.props.updateLeadAction(
        leadData._id,
        leadAllData,
        this.props.userId,
        this.props.leadFilterName
      );
    } else if (e.value === "Qualified Lead") {
      let leadAllData = leadData;
      leadAllData.status = "QUALIFIED_LEADS";

      this.props.updateLeadAction(
        leadData._id,
        leadAllData,
        this.props.userId,
        this.props.leadFilterName
      );
    } else if (e.value === "On Hold Lead") {
      let leadAllData = leadData;
      leadAllData.status = "ON_HOLD";

      this.props.updateLeadAction(
        leadData._id,
        leadAllData,
        this.props.userId,
        this.props.leadFilterName
      );
    } else if (e.value === "Contacted Lead") {
      let leadAllData = leadData;
      leadAllData.status = "CONTACTED_LEADS";

      this.props.updateLeadAction(
        leadData._id,
        leadAllData,
        this.props.userId,
        this.props.leadFilterName
      );
    } else if (e.value === "Opportunity Lead") {
      let leadAllData = leadData;
      leadAllData.status = "OPPORTUNITIES";

      this.props.updateLeadAction(
        leadData._id,
        leadAllData,
        this.props.userId,
        this.props.leadFilterName
      );
    } else if (e.value === "Converted Lead") {
      let leadAllData = leadData;
      leadAllData.status = "CONVERTED";
      leadAllData.convertedDate = new Date().toISOString();
      this.props.updateLeadAction(
        leadData._id,
        leadAllData,
        this.props.userId,
        this.props.leadFilterName
      );
    }
  };

  renderDealsList = () => {
    const { dealsInPipeline } = this.state;
    if (!isEmpty(dealsInPipeline)) {
      return dealsInPipeline.map((lead, index) => {
        return (
          <tr key={index} className="list_row">
            <td>
              <div className="profile_section">
                <img
                  src={require("./../../../../assets/img/employees/emp-default-img.jpg")}
                  alt=""
                />
                <p>{displaySmallText(lead.name, 10, true)} </p>
              </div>
            </td>
            <td>{lead.worth}</td>
            <td>
              {/* <Dropdown
                className="font-24-semibold lead-status-dropDown lead-status-dropDown--emoji ml-0"
                options={emojiOption}
                value={
                  lead.degree === "SUPER_HOT"
                    ? emojiOption[0]
                    : lead.degree === "HOT"
                    ? emojiOption[1]
                    : lead.degree === "WARM"
                    ? emojiOption[2]
                    : lead.degree === "COLD"
                    ? emojiOption[3]
                    : ""
                }
                onChange={this.onAllLeadDropdownSelect(lead)}
              /> */}
              {lead.degree === "SUPER_HOT"
                ? emojiOption[0]
                : lead.degree === "HOT"
                ? emojiOption[1]
                : lead.degree === "WARM"
                ? emojiOption[2]
                : lead.degree === "COLD"
                ? emojiOption[3]
                : ""}
            </td>
            <td>
              {/* <Dropdown
                className="lead-status-dropDown lead-status-dropDown--statusRow"
                options={statusOptionsRow}
                onChange={this.onStatusOptionsRowClick(lead)}
                value={
                  lead.status === "NEW_LEAD"
                    ? "New Lead"
                    : lead.status === "CONTACTED_LEADS"
                    ? "Contacted Lead"
                    : lead.status === "QUALIFIED_LEADS"
                    ? "Qualified Lead"
                    : lead.status === "OPPORTUNITIES"
                    ? "Opportunity Lead"
                    : lead.status === "CONVERTED"
                    ? "Converted Lead"
                    : lead.status === "ARCHIVE"
                    ? "Archive"
                    : lead.status === "ON_HOLD"
                    ? "On Hold Lead"
                    : ""
                }
              /> */}
              {lead.status === "NEW_LEAD"
                ? "New Lead"
                : lead.status === "CONTACTED_LEADS"
                ? "Contacted Lead"
                : lead.status === "QUALIFIED_LEADS"
                ? "Qualified Lead"
                : lead.status === "OPPORTUNITIES"
                ? "Opportunity Lead"
                : lead.status === "CONVERTED"
                ? "Converted Lead"
                : lead.status === "ARCHIVE"
                ? "Archive"
                : lead.status === "ON_HOLD"
                ? "On Hold Lead"
                : ""}
            </td>
            <td>72%</td>
          </tr>
        );
      });
    }
  };

  render() {
    // console.log(this.state.dealsInPipeline);
    const { dealsInPipeline } = this.state;
    if (!isEmpty(dealsInPipeline)) {
      return (
        <div className="deals_in_pipeline_container">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Amount</th>
                <th>LVL</th>
                <th>Status</th>
                <th>Conversion Probability</th>
              </tr>
            </thead>
            <tbody>{this.renderDealsList()}</tbody>
          </table>
        </div>
      );
    } else {
      return (
        <>
          {/*<div className="no_deals_in_pipeline">
          <p>No deals in pipeline</p>
      </div>*/}
          <div className="text-center">
            <img
              // src={require("../../../../assets/img/illustrations/dashboard-deal-pipeline.svg")}
              src="/img/desktop-dark-ui/illustrations/dashboard-deal-pipeline.svg"
              alt="dashboard deal pipeline no found"
              className="dashboard-deal-pipeline-img"
            />
            <h5 className="reports-graph-not-found-text">There is no data</h5>
          </div>
        </>
      );
    }
  }
}

const mapStateToProps = (state) => ({
  dealsInPipeline: state.dashboard.dealsInPipeline,
});

export default connect(mapStateToProps, {
  updateLeadAction,
  updateLeadLevelAction,
})(DealsInPipeline);
