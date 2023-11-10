import React, { Component } from "react";
import ActivityContentCallLogHistory from "./ActivityContentCallLogHistory";
import ActivityContentCallLogRecordings from "./ActivityContentCallLogRecordings";

class ActivityContentCallLog extends Component {
  state = {
    isActiveTab1: true,
    isActiveTab2: false
  };

  /*=====================================
        handlers
    ===================================== */

  handleOnClickIsActiveTab1 = () => {
    this.setState({
      isActiveTab1: true,
      isActiveTab2: false
    });
  };

  handleOnClickIsActiveTab2 = () => {
    this.setState({
      isActiveTab1: false,
      isActiveTab2: true
    });
  };

  /*=====================================
        main method
    ===================================== */
  render() {
    const { isActiveTab1, isActiveTab2 } = this.state;
    return (
      <div>
        {/* title  */}
        <div className="ac-call-recording-title">
          <div className="ac-email-title">
            <h5
              className={isActiveTab1 ? "font-21-bold" : "font-21-light"}
              onClick={this.handleOnClickIsActiveTab1}
            >
              Call history
            </h5>
            <span className="activity-text-border-right activity-text-border-right--acCallLog"></span>
            <h5
              className={isActiveTab2 ? "font-21-bold" : "font-21-light"}
              onClick={this.handleOnClickIsActiveTab2}
            >
              Recordings
            </h5>
          </div>
        </div>

        {isActiveTab1 ? (
          <ActivityContentCallLogHistory />
        ) : (
          <ActivityContentCallLogRecordings />
        )}
      </div>
    );
  }
}

export default ActivityContentCallLog;
