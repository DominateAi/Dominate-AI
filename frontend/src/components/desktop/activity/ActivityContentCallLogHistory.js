import React, { Component } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

class ActivityContentCallLogHistory extends Component {
  state = {
    startDate: new Date(),
    endDate: new Date(),
  };

  /*=====================================
        datepicker handlers
    ===================================== */
  handleChangeStart = (date) => {
    if (date === null) {
      this.setState({
        startDate: new Date(),
      });
    } else {
      this.setState({
        startDate: date,
      });
    }
  };

  handleChangeEnd = (date) => {
    if (date === null) {
      this.setState({
        endDate: new Date(),
      });
    } else {
      this.setState({
        endDate: date,
      });
    }
  };

  /*=====================================
        handler
    ===================================== */
  handleOnClickDelete = () => {
    alert("clicked delete");
  };

  handleDateChangeRaw = (e) => {
    e.preventDefault();
  };

  /*=====================================
        render datepicker
    ===================================== */
  renderDatePicker = () => {
    return (
      <div className="justify-content-center mb-30">
        {/* datepicker */}
        <div className="leads-title-block-container__date-picker">
          {/* datepicker */}
          <DatePicker
            selected={this.state.startDate}
            selectsStart
            startDate={this.state.startDate}
            endDate={this.state.endDate}
            onChange={this.handleChangeStart}
            onChangeRaw={this.handleDateChangeRaw}
          />
          <span className="font-18-medium">to</span>
          <DatePicker
            selected={this.state.endDate}
            selectsEnd
            startDate={this.state.startDate}
            endDate={this.state.endDate}
            onChange={this.handleChangeEnd}
            minDate={this.state.startDate}
            onChangeRaw={this.handleDateChangeRaw}
          />
        </div>
      </div>
    );
  };

  /*=====================================
        render card
    ===================================== */
  renderCard = () => {
    return (
      <div className="ac-call-log-history-card">
        <div className="ac-call-log-history-card__1">
          <h6 className="font-21-medium">10/12/2019</h6>
        </div>
        <div className="ac-call-log-history-card__2">
          <h6 className="font-21-medium">10 min 15 sec</h6>
        </div>
        <div className="ac-call-log-history-card__3">
          <h6 className="font-21-medium opacity-62 mr-30">11:00 AM</h6>
          <img
            src={require("../../../assets/img/icons/Dominate-Icon_dustbin.svg")}
            alt="delete"
            className="ac-email-template-delete-img my-auto opacity-62"
            onClick={this.handleOnClickDelete}
          />
        </div>
      </div>
    );
  };

  /*=====================================
        main method
    ===================================== */
  render() {
    return (
      <>
        {this.renderDatePicker()}
        {/* illustration */}
        <div className="leads-new-no-data-illustration-div">
          <div className="row mx-0 justify-content-center align-items-start">
            <img
              className="leads-new-no-data-illustration-div__no-calls-img"
              // src={require("../../../../src/assets/img/illustrations/leads-new-no-calls.svg")}
              src="/img/desktop-dark-ui/illustrations/leads-new-no-call-log.svg"
              alt="no calls"
            />
          </div>
          <p className="font-18-medium color-white-79 mb-30 text-center">
            No calls yet
          </p>
        </div>
        {/* {this.renderCard()}
        {this.renderCard()}
        {this.renderCard()}
        {this.renderCard()}
        {this.renderCard()}
        {this.renderCard()} */}
      </>
    );
  }
}

export default ActivityContentCallLogHistory;
