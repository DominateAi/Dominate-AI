import React, { Component } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import DropdownIcon from "rc-dropdown";
import Menu, { Item as MenuItem, Divider } from "rc-menu";

class ActivityContentCallLogRecordings extends Component {
  state = {
    startDate: new Date(),
    endDate: new Date(),
  };

  /*=====================================
        dropdown handler
    ===================================== */
  onVisibleChange = (visible) => {
    console.log(visible);
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
        <div className="leads-title-block-container__date-picker mr-0 pr-20">
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
    const menu = (
      <Menu onSelect={this.onSelect}>
        <MenuItem key="1">Delete</MenuItem>
        <Divider />
        <MenuItem key="2">Lorem Ipsum</MenuItem>
      </Menu>
    );
    return (
      <div className="ac-call-recording-card text-center">
        {/* dropdown */}
        <DropdownIcon
          trigger={["click"]}
          overlay={menu}
          animation="none"
          onVisibleChange={this.onVisibleChange}
        >
          <img
            className="ac-email-edit-dropdown-img ac-email-edit-dropdown-img--callRecording ml-70"
            src={require("./../../../assets/img/icons/Dominate-Icon_3dots.svg")}
            alt="dropdown menu"
          />
        </DropdownIcon>
        {/* card content */}
        <div className="ac-call-recording-card__overflow">
          <img
            src={require("../../../assets/img/icons/Dominate-Icon_audio.svg")}
            alt="audio"
            className="ac-call-recording-audio-img"
          />
          <h5 className="font-17-regular">Alex Herd</h5>
          <h6 className="font-12-regular">10 mins 15 sec</h6>
          <h6 className="font-12-regular">11/2/2019</h6>
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
        <div className="ac-call-recordings-content">
          <div className="justify-content-space-between">
            <h6 className="font-21-bold cursor-pointer">All recordings</h6>
            {this.renderDatePicker()}
          </div>
        </div>
        <div className="ac-call-recordings-content">
          <div className="ac-call-recordings-blocks">
            {/* illustration */}
            <div className="leads-new-no-data-illustration-div">
              <div className="row mx-0 justify-content-center align-items-start">
                <img
                  className="leads-new-no-data-illustration-div__no-calls-img"
                  // src={require("../../../../src/assets/img/illustrations/leads-new-no-calls.svg")}
                  src="/img/desktop-dark-ui/illustrations/leads-new-no-call-log.svg"
                  alt="no recordings"
                />
              </div>
              <p className="font-18-medium color-white-79 mb-30 text-center">
                No recordings yet
              </p>
            </div>
            {/* {this.renderCard()}
            {this.renderCard()}
            {this.renderCard()}
            {this.renderCard()}
            {this.renderCard()}
            {this.renderCard()}
            {this.renderCard()} */}
          </div>
        </div>
      </>
    );
  }
}

export default ActivityContentCallLogRecordings;
