import {
  GET_ALL_PENDING_LEAVES,
  GET_ALL_FOLLOW_UPS,
  GET_ALL_MEETINGS,
  SET_ALL_HOLIDAYS,
  GET_ALL_APPROVED_LEAVES,
  SET_ALL_HOLIDAYS_IN_YEAR,
  SET_ALL_HOLIDAYS_IN_MONTH,
  SET_ALL_PENDING_AND_APPROVED_LEAVES,
  SET_CALENDER_DATA_OF_DAY,
  SET_TODAYS_SCHEDULE,
  SET_SELECTED_DATE,
} from "./../types";

const initialState = {
  pendingLeaves: {},
  allFollowUps: {},
  allMeetings: {},
  allHolidays: {},
  approvedLeaves: {},
  allHolidaysInYear: {},
  allHolidaysInMonth: {},
  allPendingAndApprovedLeaves: {},
  allDataOfDay: {},
  todaysSchedule: [],
  selectedDate: new Date().toISOString(),
};

export default function (state = initialState, action) {
  switch (action.type) {
    case GET_ALL_PENDING_LEAVES:
      return {
        ...state,
        pendingLeaves: action.payload,
      };

    case GET_ALL_FOLLOW_UPS:
      return {
        ...state,
        allFollowUps: action.payload,
      };

    case GET_ALL_MEETINGS:
      return {
        ...state,
        allMeetings: action.payload,
      };
    case SET_ALL_HOLIDAYS:
      return {
        ...state,
        allHolidays: action.payload,
      };
    case GET_ALL_APPROVED_LEAVES:
      return {
        ...state,
        approvedLeaves: action.payload,
      };
    case SET_ALL_HOLIDAYS_IN_YEAR:
      return {
        ...state,
        allHolidaysInYear: action.payload,
      };
    case SET_ALL_HOLIDAYS_IN_MONTH:
      return {
        ...state,
        allHolidaysInMonth: action.payload,
      };
    case SET_ALL_PENDING_AND_APPROVED_LEAVES:
      return {
        ...state,
        allPendingAndApprovedLeaves: action.payload,
      };
    case SET_CALENDER_DATA_OF_DAY:
      return {
        ...state,
        allDataOfDay: action.payload,
      };
    case SET_TODAYS_SCHEDULE:
      return {
        ...state,
        todaysSchedule: action.payload,
      };
    case SET_SELECTED_DATE:
      return {
        ...state,
        selectedDate: action.payload,
      };
    default:
      return state;
  }
}
