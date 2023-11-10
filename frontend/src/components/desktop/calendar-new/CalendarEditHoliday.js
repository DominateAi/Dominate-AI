import React, { Component, Fragment } from "react";
import dateFns from "date-fns";
import Modal from "react-responsive-modal";
import DatePicker from "react-datepicker";
import { validateAddHoliday } from "../../../store/validations/holidayValidation/holidayValidation";
import { maxLengths } from "../../../store/validations/maxLengths/MaxLengths";
import isEmpty from "../../../store/validations/is-empty";
import { updateHolidayAction } from "./../../../store/actions/calenderAction";
import { connect } from "react-redux";

export class CalendarEditHoliday extends Component {
  constructor() {
    super();
    this.state = {
      /*=======================
              edit Holiday
          ========================*/
      editHolidayPopup: false,
      prevNextIndex: 0,
      holidayDate: new Date(),
      holiday: "",
      clickOnDate: "",
      errors: {},
    };
  }

  componentDidMount() {
    const { holidayData } = this.props;
    if (!isEmpty(holidayData)) {
      this.setState({
        holiday: holidayData.reason,
        holidayDate: new Date(holidayData.toDate),
      });
    }
  }

  /*===============================
          onchange handler
  ================================*/

  handleChangeHolidayDate = (date) => {
    if (date === null) {
      this.setState({
        holidayDate: new Date(),
      });
    } else {
      this.setState({
        holidayDate: date,
      });
    }
  };

  onChangeHandler = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  /*============================
        Model Event Handlers
    ===============================*/

  onOpenModal = () => {
    this.setState({ editHolidayPopup: true });
  };

  onCloseModal = () => {
    this.setState({
      editHolidayPopup: false,
      // prevNextIndex: 0,
      hasClosedModal: false,
      // holidayDate: new Date(),
      success: false,
      hasmodalclose: false,
      errors: {},
    });
  };

  handlePrev = () => {
    this.setState({
      prevNextIndex: this.state.prevNextIndex - 1,
    });
  };

  // handle next on key enter
  onFormKeyDown = (e) => {
    if (e.keyCode === 13) {
      e.preventDefault();
      this.handleNext();
    }
  };

  onFormKeyDownNew = (e) => {
    if (e.keyCode === 13 && e.target.name !== "SaveButtonNewEditForm") {
      e.preventDefault();
    }
  };

  handleNext = () => {
    const { errors } = validateAddHoliday(this.state);
    console.log(errors);
    if (this.state.prevNextIndex === 0) {
      if (errors.holiday) {
        this.setState({
          errors,
          prevNextIndex: this.state.prevNextIndex,
        });
      } else {
        this.setState({
          prevNextIndex: this.state.prevNextIndex + 1,
          errors: {},
        });
      }
    }
    if (this.state.prevNextIndex === 1) {
      if (errors.holidayDate) {
        this.setState({
          errors,
          prevNextIndex: this.state.prevNextIndex,
        });
      }
    }
  };

  /*================================
          form events
    =================================*/

  callBackUpdate = (status) => {
    if (status === 200) {
      this.onCloseModal();
    }
  };

  handleSubmit = (e) => {
    e.preventDefault();

    const { holidayData } = this.props;

    const { isValid, errors } = validateAddHoliday(this.state);
    console.log(errors);
    if (!isValid) {
      this.setState({ errors });
    } else {
      // let newFromDate = this.state.fromDate.toISOString();
      let newtoDate = this.state.holidayDate.toISOString();

      const newLeave = {
        leaveType: "HOLIDAY",
        leaveStatus: "APPROVED",
        fromDate: newtoDate,
        toDate: newtoDate,
        reason: this.state.holiday,
      };
      console.log(newLeave);
      this.props.updateHolidayAction(
        holidayData._id,
        newLeave,
        dateFns.format(new Date(), "M"),
        dateFns.format(new Date(), "YYYY"),
        this.callBackUpdate
      );
    }
  };

  handleDateChangeRaw = (e) => {
    e.preventDefault();
  };

  /*=======================================
      Render edit Holiday modal block New
  ========================================*/

  renderEditHolidayModalBlockNew = () => {
    const { errors, prevNextIndex } = this.state;
    return (
      <div className="add-lead-form-field-block new-edit-lead-form-row__holiday-edit">
        {/* form */}
        <form
          noValidate
          onSubmit={this.handleSubmit}
          onKeyDown={this.onFormKeyDownNew}
        >
          {/* name */}
          <div className="new-edit-lead-form-row">
            <label
              htmlFor="selectedOption"
              className="add-lead-label font-24-semibold"
            >
              Name
            </label>
            <br />
            <div className="type-of-leave-select mb-30">
              {/* <Select
                              value={selectedOption.value}
                              onChange={this.handleChangeSelect}
                              options={options}
                              placeholder="Select"
                          /> */}

              {/* <input readOnly className="invisible d-none" autoFocus /> */}

              <input
                className="holiday_input"
                placeholder="e.g. National Holiday"
                type="text"
                name="holiday"
                id="holiday"
                value={this.state.holiday}
                onChange={this.onChangeHandler}
                maxLength={maxLengths.char30}
                autoFocus={true}
              />
              {errors.holiday && (
                <div className="is-invalid add-lead-form-field-errors ml-4">
                  {errors.holiday}
                </div>
              )}

              {/* <CustomEditDropdown
            id="selectedOption"
            name="selectedOption"
            value={this.state.selectedOption}
            onInputChangeHandler={this.onDropdownChange}
            dropDownToggler={this.dropDownToggler}
            dropDown={this.state.dropdown}
            suggestionList={this.state.suggestionList}
            dropDownSelect={this.dropDownSelect}
            placeholder={"Eg. Sick Leave"}
          /> */}
            </div>
          </div>

          {/* Duration of leave */}
          <div className="new-edit-lead-form-row">
            <label htmlFor="date" className="add-lead-label font-24-semibold">
              Date
            </label>
            <br />
            <div>
              {/* datepicker */}
              <div className="d-flex align-items-center tasklist-duration-fields leads-title-block-container__date-picker mb-30">
                <span
                  className="font-24-semibold mr-30"
                  role="img"
                  aria-labelledby="Tear-Off Calendar"
                >
                  {/* calendar */}
                  {/* &#x1F4C6; */}
                </span>
                {/* datepicker */}
                <DatePicker
                  minDate={new Date()}
                  selected={this.state.holidayDate}
                  onChange={this.handleChangeHolidayDate}
                  onChangeRaw={this.handleDateChangeRaw}
                />
              </div>
              {errors.holidayDate && (
                <div className="is-invalid tasklist-duration-fields mt-0 mb-0">
                  {errors.holidayDate}
                </div>
              )}
            </div>
          </div>

          {/* buttons */}
          <div className="pt-25 text-right">
            <button
              name="SaveButtonNewEditForm"
              type="submit"
              className="btn-funnel-view btn-funnel-view--add-lead-save-btn"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    );
  };

  /*===================================
      Render edit Holiday model 
  ===================================*/

  renderEditHolidayModel = () => {
    const { editHolidayPopup } = this.state;
    const { errors, prevNextIndex } = this.state;
    return (
      <Fragment>
        <button
          className={this.props.buttonClassName}
          onClick={this.onOpenModal}
        >
          {this.props.buttonText}
        </button>
        <Modal
          open={editHolidayPopup}
          onClose={this.onCloseModal}
          closeOnEsc={true}
          closeOnOverlayClick={false}
          center
          classNames={{
            overlay: "customOverlay",
            modal:
              "customModal customModal--addLead customModal--editLeadNew--emp",
            closeButton: "customCloseButton",
          }}
        >
          <span className="closeIconInModal" onClick={this.onCloseModal} />
          <div className="add-lead-modal-container container-fluid pr-0">
            <h1 className="font-30-bold mb-61">Edit Holiday</h1>

            {/* {this.renderEditHolidayModalBlock()} */}
            {this.renderEditHolidayModalBlockNew()}
          </div>
        </Modal>
      </Fragment>
    );
  };

  /*===================================
      main
  ===================================*/

  render() {
    return <>{this.renderEditHolidayModel()}</>;
  }
}

CalendarEditHoliday.defaultProps = {
  buttonClassName: "",
  buttonText: "Edit",
};

export default connect(null, { updateHolidayAction })(CalendarEditHoliday);
