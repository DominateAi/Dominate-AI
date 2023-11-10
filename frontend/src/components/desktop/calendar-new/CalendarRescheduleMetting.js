import React, { useEffect } from "react";
import Modal from "react-responsive-modal";
import DatePicker from "react-datepicker";
import { useState } from "react";
import { Fragment } from "react";
import isEmpty from "../../../store/validations/is-empty";
import { useDispatch, useSelector } from "react-redux";
import { format } from "date-fns";
import { updateMeetingAction } from "./../../../store/actions/calenderAction";

export default function CalendarRescheduleMetting({
  buttonClass,
  buttonName,
  meetingData,
}) {
  const [open, setOpne] = useState(false);
  const dispatch = useDispatch();

  const [clenderSelectedDate, setclenderSelectedDate] = useState([]);

  const selectedDate = useSelector((state) => state.calender.selectedDate);

  const [values, setValues] = useState({
    startDate: new Date(),
    startTime: new Date(),
    endTime: new Date(),
    followUpLocation: "",
  });

  useEffect(() => {
    console.log(meetingData);
    if (!isEmpty(meetingData)) {
      setValues({
        ...values,
        startDate: new Date(meetingData.meetingDate),
        startTime: new Date(meetingData.meetingTime),
        endTime: new Date(meetingData.meetingEndTime),
        followUpLocation: meetingData.location,
      });
    }
  }, [meetingData]);

  useEffect(() => {
    if (!isEmpty(selectedDate)) {
      setclenderSelectedDate(selectedDate);
    }
  }, [selectedDate]);

  /*=========================================================
                      handler
  ==========================================================*/
  const onOpenModal = () => {
    setOpne(!open);
  };

  const handleChange = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value,
    });
  };

  const handleChangeTime = (time) => {
    if (time === null) {
      setValues({
        ...values,
        startTime: new Date(),
      });
    } else {
      setValues({
        ...values,
        startTime: time,
      });
    }
  };

  const handleChangeEndTime = (time) => {
    if (time === null) {
      setValues({
        ...values,
        endTime: new Date(),
      });
    } else {
      setValues({
        ...values,
        endTime: time,
      });
    }
  };

  const handleChangeDate = (date) => {
    if (date === null) {
      setValues({
        ...values,
        startDate: new Date(),
      });
    } else {
      setValues({
        ...values,
        startDate: date,
      });
    }
  };
  const callbackUpdate = (status) => {
    if (status === 200) {
      setOpne(false);
    }
  };
  const handleSaveMeeting = (e) => {
    e.preventDefault();
    console.log(values);

    const newMeeting = {
      meetingDate: values.startDate,
      meetingTime: values.startTime,
      location: values.followUpLocation,
    };
    dispatch(
      updateMeetingAction(
        meetingData._id,
        newMeeting,
        format(clenderSelectedDate, "M"),
        format(clenderSelectedDate, "YYYY"),
        format(clenderSelectedDate, "D"),
        callbackUpdate
      )
    );
  };

  const handleDateChangeRaw = (e) => {
    e.preventDefault();
  };
  /*=========================================================
                      render
  ==========================================================*/
  return (
    <>
      <button className={buttonClass} onClick={onOpenModal}>
        {buttonName}
      </button>
      <Modal
        open={open}
        onClose={onOpenModal}
        closeOnEsc={true}
        closeOnOverlayClick={false}
        center
        classNames={{
          overlay: "customOverlay",
          modal: "customModal customModal--addLead",
          closeButton: "customCloseButton",
        }}
      >
        <span className="closeIconInModal" onClick={onOpenModal} />
        <Fragment>
          <div className="add-lead-modal-container add-lead-modal-container--followUp">
            <h1 className="font-21-bold mb-30">
              {buttonName} Meeting for{" "}
              {!isEmpty(meetingData.assigned)
                ? meetingData.assigned.name
                : meetingData.assignedPipelead.name}
            </h1>
            <form noValidate onSubmit={handleSaveMeeting}>
              <div className="add-lead-form-field-block add-follow-up-main-container">
                <input readOnly className="invisible d-none" autoFocus />
                <div className="follow-up-select mb-30">
                  <div className="row align-items-start justify-content-center main-dropdown-class dropdown-input-class">
                    Meeting
                  </div>
                </div>
                <div className="follow-up-date-time-section follow-up-date-time-section--dashboard-followup-reshedule mb-30">
                  <div className="follow-up-date leads-title-block-container__date-picker">
                    <label htmlFor="date" className="font-21-medium">
                      Date for scheduling
                    </label>
                    <div className="d-flex align-items-center justify-content-end leads-title-block-container__date-picker mb-10 mx-0">
                      <span
                        className="font-24-semibold mr-30"
                        role="img"
                        aria-labelledby="Tear-Off Calendar"
                      >
                        {/* calendar */}
                        {/* &#x1F4C6; */}
                      </span>
                      <DatePicker
                        minDate={new Date()}
                        selected={values.startDate}
                        onChange={handleChangeDate}
                        onChangeRaw={handleDateChangeRaw}
                      />
                    </div>
                  </div>
                  <div className="follow-up-time leads-title-block-container__date-picker align-items-start">
                    <label htmlFor="date" className="font-21-medium">
                      Time for scheduling
                    </label>
                    <div className="d-flex align-items-center justify-content-end leads-title-block-container__date-picker mb-10 mx-0">
                      <span
                        className="font-24-semibold mr-30"
                        role="img"
                        aria-labelledby="clock"
                      >
                        {/* clock */}
                        {/* &#x1F552; */}
                      </span>
                      <DatePicker
                        selected={values.startTime}
                        onChange={handleChangeTime}
                        showTimeSelect
                        showTimeSelectOnly
                        timeIntervals={15}
                        dateFormat="h:mm aa"
                        timeCaption="Time"
                        onChangeRaw={handleDateChangeRaw}
                      />
                      <span className="font-20-semibold mr-30">To</span>
                      <DatePicker
                        selected={values.endTime}
                        onChange={handleChangeEndTime}
                        showTimeSelect
                        showTimeSelectOnly
                        timeIntervals={15}
                        dateFormat="h:mm aa"
                        timeCaption="Time"
                        onChangeRaw={handleDateChangeRaw}
                      />
                    </div>
                  </div>
                </div>
                <div className="mb-30">
                  <label
                    htmlFor="followUpLocation"
                    className="add-lead-label font-21-medium ml-0 pb-16"
                  >
                    Enter Your Location
                  </label>
                  <br />
                  <input
                    htmlFor={"followUpLocation"}
                    id={"followUpLocation"}
                    name={"followUpLocation"}
                    placeholder={"Eg. India"}
                    onChange={handleChange}
                    value={values.followUpLocation}
                    //maxLength={maxLengths.char30}
                    className="add-lead-input-field font-18-regular m-0 w-100"
                  />
                </div>
              </div>
              {/* buttons */}
              <div className="pt-25 text-right">
                <button
                  type="submit"
                  className="btn-funnel-view btn-funnel-view--files m-0"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </Fragment>
      </Modal>
    </>
  );
}
