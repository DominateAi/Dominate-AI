import axios from "axios";
import Alert from "react-s-alert";
import { url } from "./config";
import { GET_API_STATUS, SET_UPCOMING_LEAVES } from "./../../store/types";
import { getLeadsOverview } from "./leadAction";
import { getEmployeesOverview } from "./employeeAction";
import { getAllDataCalenderWidget } from "./dashBoardAction";
import { getAccountById } from "./accountsAction";
import dateFns from "date-fns";
import {
  GET_ALL_PENDING_LEAVES,
  GET_ALL_FOLLOW_UPS,
  GET_ALL_MEETINGS,
  SET_ALL_HOLIDAYS,
  GET_ALL_APPROVED_LEAVES,
  SET_APPROVAL_PENDING_LEAVES,
  SET_ALL_HOLIDAYS_IN_YEAR,
  SET_ALL_HOLIDAYS_IN_MONTH,
  SET_ALL_PENDING_AND_APPROVED_LEAVES,
  SET_CALENDER_DATA_OF_DAY,
  SET_TODAYS_SCHEDULE,
} from "./../types";

import { getTodaysFollowUps, getTodaysMeetings } from "./dashBoardAction";

/*==================================================================================
                                Follow Up Sections
====================================================================================*/

/*======================================
    Add Follow up Action
=======================================*/
export const addFollowUpLead =
  (formData, callBackAddFollowUp) => (dispatch) => {
    dispatch({
      type: GET_API_STATUS,
      payload: "",
    });
    axios
      .post(`${url}/api/followups`, formData)
      .then((res) => {
        Alert.success("<h4>Follow Up Added</h4>", {
          position: "top-right",
          effect: "slide",
          beep: false,
          html: true,
          timeout: 5000,
          // offset: 100
        });
        callBackAddFollowUp(res.status);
        // dispatch(getTodaysFollowUps(false));
        dispatch(getLeadsOverview());

        // console.log(res.data);
      })
      .catch((err) => console.log(err));
  };

/*======================================
    Add Follow up Action
=======================================*/
export const addFollowUpInCalender =
  (formData, month, year, day, callBackAddFollowUp) => (dispatch) => {
    dispatch({
      type: GET_API_STATUS,
      payload: "",
    });
    axios
      .post(`${url}/api/followups`, formData)
      .then((res) => {
        Alert.success("<h4>Follow Up Added</h4>", {
          position: "top-right",
          effect: "slide",
          beep: false,
          html: true,
          timeout: 5000,
          // offset: 100
        });
        callBackAddFollowUp(res.status);
        // dispatch(getTodaysFollowUps(false));
        dispatch(getAllDataOfTheDay(day, month, year));
        dispatch(
          getAllDataCalenderWidget(
            dateFns.format(new Date(), "M"),
            dateFns.format(new Date(), "YYYY")
          )
        );

        dispatch(
          getTodaySchedule(
            dateFns.format(new Date(), "D"),
            dateFns.format(new Date(), "M"),
            dateFns.format(new Date(), "YYYY")
          )
        );

        // console.log(res.data);
      })
      .catch((err) => console.log(err));
  };

/*==============================================
    Add Follow up In acoount details Action 
===============================================*/
export const addFollowUpInAccountDetails =
  (formData, accountId, callBackAddFollowUp) => (dispatch) => {
    dispatch({
      type: GET_API_STATUS,
      payload: "",
    });
    axios
      .post(`${url}/api/followups`, formData)
      .then((res) => {
        Alert.success("<h4>Follow Up Added</h4>", {
          position: "top-right",
          effect: "slide",
          beep: false,
          html: true,
          timeout: 5000,
          // offset: 100
        });
        callBackAddFollowUp(res.status);

        dispatch(getAccountById(accountId));
        // console.log(res.data);
      })
      .catch((err) => console.log(err));
  };

/*======================================
    Get All Followups Of user
=======================================*/
export const getAllFolloUps = (month, year) => (dispatch) => {
  axios
    .get(`${url}/api/calenders?type=FOLLOW_UP&month=${month}&year=${year}`)
    .then((res) => {
      dispatch({
        type: GET_ALL_FOLLOW_UPS,
        payload: res.data,
      });
    })
    .catch((err) => console.log(err));
};

/*====================================
    Delete followups action
=====================================*/
export const deleteFollowUpAction =
  (followUpId, month, year, day) => (dispatch) => {
    axios
      .delete(`${url}/api/followups/${followUpId}`)
      .then((res) => {
        Alert.success("<h4>Follow Deleted</h4>", {
          position: "top-right",
          effect: "slide",
          beep: false,
          html: true,
          timeout: 5000,
          // offset: 100
        });

        dispatch(getAllDataCalenderWidget(month, year));
        dispatch(getAllDataOfTheDay(day, month, year));
        dispatch(
          getTodaySchedule(
            dateFns.format(new Date(), "D"),
            dateFns.format(new Date(), "M"),
            dateFns.format(new Date(), "YYYY")
          )
        );
      })
      .catch((err) => console.log(err));
  };

/*======================================
      Update FollowUp Action
=======================================*/
export const updateFollowUpAction =
  (followUpId, formData, month, year, day, callBackUpdate) => (dispatch) => {
    axios
      .put(`${url}/api/followups/${followUpId}`, formData)
      .then((res) => {
        Alert.success("<h4>Follow Up Updated</h4>", {
          position: "top-right",
          effect: "slide",
          beep: false,
          html: true,
          timeout: 5000,
          // offset: 100
        });
        callBackUpdate(res.status);
        dispatch(getTodaysFollowUps(false));
        dispatch(getAllDataCalenderWidget(month, year));
        dispatch(getAllDataOfTheDay(day, month, year));
        dispatch(
          getTodaySchedule(
            dateFns.format(new Date(), "D"),
            dateFns.format(new Date(), "M"),
            dateFns.format(new Date(), "YYYY")
          )
        );
      })
      .catch((err) => console.log(err));
  };

/*==================================================================================
                                Metting Sections
====================================================================================*/

/*======================================
    Add Meetings api
=======================================*/
export const addLeadMeetingsAction =
  (formData, callBackAddMeeting) => (dispatch) => {
    axios
      .post(`${url}/api/meetings`, formData)
      .then((res) => {
        Alert.success("<h4>Meeting Added</h4>", {
          position: "top-right",
          effect: "slide",
          beep: false,
          html: true,
          timeout: 5000,
          // offset: 100
        });
        callBackAddMeeting(res.status);
        dispatch(getTodaysMeetings(false));
        dispatch(getLeadsOverview());
        console.log(res.data);
      })
      .catch((err) => console.log(err));
  };

/*======================================
    Add Meetings api
=======================================*/
export const addMeetingsInClenderAction =
  (formData, month, year, day, callBackAddMeeting) => (dispatch) => {
    axios
      .post(`${url}/api/meetings`, formData)
      .then((res) => {
        Alert.success("<h4>Meeting Added</h4>", {
          position: "top-right",
          effect: "slide",
          beep: false,
          html: true,
          timeout: 5000,
          // offset: 100
        });
        callBackAddMeeting(res.status);
        dispatch(getAllDataCalenderWidget(month, year));
        dispatch(getAllDataOfTheDay(day, month, year));
        dispatch(
          getTodaySchedule(
            dateFns.format(new Date(), "D"),
            dateFns.format(new Date(), "M"),
            dateFns.format(new Date(), "YYYY")
          )
        );
      })
      .catch((err) => console.log(err));
  };

/*===========================================
      Get individual User Meetings
=============================================*/
// export const getUserAllMettings = () => dispatch => {
//   axios
//     .get(`${url}/api/meetings`)
//     .then(res => {
//       dispatch({
//         type: GET_ALL_MEETINGS,
//         payload: res.data
//       });
//     })
//     .catch(err => console.log(err));
// };

export const getUserAllMettings = (month, year) => (dispatch) => {
  axios
    .get(`${url}/api/calenders?type=MEETING&month=${month}&year=${year}`)
    .then((res) => {
      dispatch({
        type: GET_ALL_MEETINGS,
        payload: res.data,
      });
    })
    .catch((err) => console.log(err));
};

/*====================================
    Delete Meeting action
=====================================*/
export const deleteMeetingAction =
  (meetingId, month, year, day) => (dispatch) => {
    axios
      .delete(`${url}/api/meetings/${meetingId}`)
      .then((res) => {
        Alert.success("<h4>Meeting Deleted</h4>", {
          position: "top-right",
          effect: "slide",
          beep: false,
          html: true,
          timeout: 5000,
          // offset: 100
        });
        // dispatch(getUserAllMettings(month, year));
        dispatch(getAllDataCalenderWidget(month, year));
        dispatch(getAllDataOfTheDay(day, month, year));
        dispatch(
          getTodaySchedule(
            dateFns.format(new Date(), "D"),
            dateFns.format(new Date(), "M"),
            dateFns.format(new Date(), "YYYY")
          )
        );
      })
      .catch((err) => console.log(err));
  };

/*=====================================
        Update Meeting Action
======================================*/
export const updateMeetingAction =
  (meetingId, formData, month, year, day, callbackUpdate) => (dispatch) => {
    axios
      .put(`${url}/api/meetings/${meetingId}`, formData)
      .then((res) => {
        Alert.success("<h4>Meeting Updated</h4>", {
          position: "top-right",
          effect: "slide",
          beep: false,
          html: true,
          timeout: 5000,
          // offset: 100
        });
        callbackUpdate(res.status);
        // dispatch(getTodaysMeetings(false));
        // dispatch(getUserAllMettings(month, year));
        dispatch(getAllDataCalenderWidget(month, year));
        dispatch(getAllDataOfTheDay(day, month, year));
        dispatch(
          getTodaySchedule(
            dateFns.format(new Date(), "D"),
            dateFns.format(new Date(), "M"),
            dateFns.format(new Date(), "YYYY")
          )
        );
      })
      .catch((err) => console.log(err));
  };

/*========================================================================================================
                                            Leaves Sections
==========================================================================================================*/

/*========================================
          Add Leaves Api Action
==========================================*/
export const addLeavesAction =
  (formData, alertText, callBackAddLeave) => (dispatch) => {
    axios
      .post(`${url}/api/leaves`, formData)
      .then((res) => {
        Alert.success(`<h4>${alertText}</h4>`, {
          position: "top-right",
          effect: "slide",
          beep: false,
          html: true,
          timeout: 5000,
          // offset: 100
        });
        callBackAddLeave(res.status);
        dispatch(
          getAllHolidays(
            dateFns.format(new Date(), "M"),
            dateFns.format(new Date(), "YYYY")
          )
        );
        dispatch(
          getAllDataCalenderWidget(
            dateFns.format(new Date(), "M"),
            dateFns.format(new Date(), "YYYY")
          )
        );
        dispatch(
          getAllHolidaysInYear(
            dateFns.format(new Date(), "M"),
            dateFns.format(new Date(), "YYYY")
          )
        );
        dispatch(getAllPendingAndApprovedLeaves());
        dispatch(getUpcomingLeavesAndHoliday());
        console.log(res);
      })
      .catch((err) => console.log(err));
  };

/*========================================
        Get All Approved Leaves
=========================================*/
export const getAllApprovedLeaves = (month, year) => (dispatch) => {
  axios
    .get(`${url}/api/calenders?type=APPROVED_LEAVE&month=${month}&year=${year}`)
    .then((res) => {
      dispatch({
        type: GET_ALL_APPROVED_LEAVES,
        payload: res.data,
      });
    })
    .catch((err) => console.log(err));
};

/*=======================================
        Get All Pending Leaves
=========================================*/

export const getAllPendingLeaves = (month, year) => (dispatch) => {
  axios
    .get(
      `${url}/api/calenders?type=APPROVAL_PENDING&month=${month}&year=${year}`
    )
    .then((res) => {
      dispatch({
        type: GET_ALL_PENDING_LEAVES,
        payload: res.data,
      });
    })
    .catch((err) => console.log(err));
};

/*==========================================
    Get Pending Leves in Employee page
===========================================*/
export const getAllEEmployeePendingLeaves = () => (dispatch) => {
  axios
    .get(`${url}/api/leaves`)
    .then((res) => {
      // console.log(res.data);
      dispatch({
        type: SET_APPROVAL_PENDING_LEAVES,
        payload: res.data,
      });
    })
    .catch((err) => console.log(err));
};

/*=========================================
        Approved Pending Leaves
===========================================*/
export const approvePendingLeaves =
  (leaveId, formData, successText, month, year) => (dispatch) => {
    axios
      .put(`${url}/api/leaves/${leaveId}`, formData)
      .then((res) => {
        Alert.success(`<h4>${successText}</h4>`, {
          position: "top-right",
          effect: "slide",
          beep: false,
          html: true,
          timeout: 5000,
          // offset: 100
        });
        dispatch(getAllEEmployeePendingLeaves());
        dispatch(getEmployeesOverview());
        dispatch(getAllPendingLeaves(month, year));
        dispatch(getAllPendingAndApprovedLeaves());
      })
      .catch((err) => console.log(err));
  };

/*=========================================
          Update leave by Id
===========================================*/
export const updateLeaveById =
  (leaveId, formData, alertText, month, year) => (dispatch) => {
    axios
      .put(`${url}/api/leaves/${leaveId}`, formData)
      .then((res) => {
        Alert.success(`<h4>${alertText}</h4>`, {
          position: "top-right",
          effect: "slide",
          beep: false,
          html: true,
          timeout: 5000,
          // offset: 100
        });
        dispatch(getAllEEmployeePendingLeaves());
        dispatch(getEmployeesOverview());
        dispatch(getAllPendingLeaves(month, year));
        dispatch(getAllPendingAndApprovedLeaves());
      })
      .catch((err) => console.log(err));
  };

/*==========================================
      Accept approval pending leaves
============================================*/
export const acceptApprovalPending =
  (leaveId, formData, alertText, month, year) => (dispatch) => {
    axios
      .put(`${url}/api/leaves/${leaveId}/approve`, formData)
      .then((res) => {
        Alert.success(`<h4>${alertText}</h4>`, {
          position: "top-right",
          effect: "slide",
          beep: false,
          html: true,
          timeout: 5000,
          // offset: 100
        });
        dispatch(getAllEEmployeePendingLeaves());
        dispatch(getEmployeesOverview());
        dispatch(getAllPendingLeaves(month, year));
        dispatch(getAllPendingAndApprovedLeaves());
      })
      .catch((err) => console.log(err));
  };

/*==========================================
  GET ALL PENDING AND APPROVED LEAVES
===========================================*/
export const getAllPendingAndApprovedLeaves = () => (dispatch) => {
  axios
    .get(`${url}/api/leaves`)
    .then((res) => {
      let filteredLeaves = res.data.filter(
        (leave) => leave.leaveType !== "HOLIDAY" && leave.hidden === false
      );

      dispatch({
        type: SET_ALL_PENDING_AND_APPROVED_LEAVES,
        payload: filteredLeaves,
      });
    })
    .catch((err) => console.log(err));
};

/*====================================================================================================
                                    Holidays Section
======================================================================================================*/
/*==================================
      Add Holidays Action
===================================*/

export const getAllHolidays = (month, year) => (dispatch) => {
  axios
    .get(`${url}/api/calenders?type=HOLIDAY&month=${month}&year=${year}`)
    .then((res) => {
      dispatch({
        type: SET_ALL_HOLIDAYS,
        payload: res.data,
      });
    })
    .catch((err) => console.log(err));
};

/*====================================
        Get Upcoming leaves
=====================================*/
export const getUpcomingLeavesAndHoliday = () => (dispatch) => {
  axios
    .get(`${url}/api/calenders/upcomingEvents`)
    .then((res) =>
      dispatch({
        type: SET_UPCOMING_LEAVES,
        payload: res.data,
      })
    )
    .catch((err) => console.log(err));
};

/*=====================================
          Delete Holiday
======================================*/
export const deleteHolidayAction = (holidayId, month, year) => (dispatch) => {
  axios
    .delete(`${url}/api/leaves/${holidayId}`)
    .then((res) => {
      Alert.success(`<h4>Holiday Deleted</h4>`, {
        position: "top-right",
        effect: "slide",
        beep: false,
        html: true,
        timeout: 5000,
        // offset: 100
      });
      dispatch(getAllHolidays(month, year));
      dispatch(getAllHolidaysInYear(month, year));
      dispatch(getAllDataCalenderWidget(month, year));
    })
    .catch((err) => console.log(err));
};

/*====================================
          Update Holiday
=====================================*/
export const updateHolidayAction =
  (holidayId, formData, month, year, callBackUpdate) => (dispatch) => {
    axios
      .put(`${url}/api/leaves/${holidayId}`, formData)
      .then((res) => {
        Alert.success(`<h4>Holiday Updated</h4>`, {
          position: "top-right",
          effect: "slide",
          beep: false,
          html: true,
          timeout: 5000,
          // offset: 100
        });
        callBackUpdate(res.status);
        dispatch(getAllHolidays(month, year));
        dispatch(getAllHolidaysInYear(month, year));
      })
      .catch((err) => console.log(err));
  };

/*=======================================
          Get All Holidays 
========================================*/
export const getAllHolidaysInYear = (month, year) => (dispatch) => {
  axios
    .get(`${url}/api/calenders/holiday?year=${year}&month=${month}`)
    .then((res) => {
      dispatch({
        type: SET_ALL_HOLIDAYS_IN_YEAR,
        payload: res.data,
      });
      dispatch({
        type: SET_ALL_HOLIDAYS_IN_MONTH,
        payload: res.data,
      });
    })
    .catch((err) => console.log(err));
};

/*=====================================================================
          Get All Holidays, meetings and followups of the day 
=======================================================================*/
export const getAllDataOfTheDay = (day, month, year) => (dispatch) => {
  axios
    .get(
      `${url}/api/calenders/getDayCalender?year=${year}&month=${month}&date=${day}`
    )
    .then((res) => {
      dispatch({
        type: SET_CALENDER_DATA_OF_DAY,
        payload: res.data,
      });
    })
    .catch((err) => console.log(err));
};

/*=====================================================================
         Schedule day view adat
=======================================================================*/
export const getTodaySchedule = (day, month, year) => (dispatch) => {
  axios
    .get(
      `${url}/api/calenders/getDayCalender?year=${year}&month=${month}&date=${day}`
    )
    .then((res) => {
      dispatch({
        type: SET_TODAYS_SCHEDULE,
        payload: res.data,
      });
    })
    .catch((err) => console.log(err));
};
