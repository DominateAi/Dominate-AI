import {
  VERIFY_EMPLOYEE,
  GET_ALL_EMPLOYEES,
  GET_EMPLOYEE_OVERVIEW,
  SET_APPROVAL_PENDING_LEAVES,
  SET_EMPLOYEE_ACTIVITY,
  SET_EMPLOYEE_LEADS_OWN,
  SET_EMPLOYEE_PERFORMANCE_GRAPH,
  SET_EMPLOYEE_BLOCK_VIEW_POPUP_DATA,
  SET_BLOCK_VIEW_EMPLOYEE,
  SET_SINGLE_EMPLOYEE_DATA,
} from "./../types";

const initialState = {
  verifyEmployee: {},
  allEmployees: {},
  employeeOverview: {},
  approvalPendingLeaves: {},
  employeeActivity: [],
  employeeLeadsOwn: [],
  singleEmployeeDetail: [],
  employeePerformanceGraph: {},
  employeeBlockViewPopupData: {},
  isBlockView: false,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case VERIFY_EMPLOYEE:
      return {
        ...state,
        verifyEmployee: action.payload,
      };
    case GET_ALL_EMPLOYEES:
      return {
        ...state,
        allEmployees: action.payload,
      };
    case GET_EMPLOYEE_OVERVIEW:
      return {
        ...state,
        employeeOverview: action.payload,
      };

    case SET_APPROVAL_PENDING_LEAVES:
      return {
        ...state,
        approvalPendingLeaves: action.payload,
      };
    case SET_EMPLOYEE_ACTIVITY:
      return {
        ...state,
        employeeActivity: action.payload,
      };
    case SET_EMPLOYEE_LEADS_OWN:
      return {
        ...state,
        employeeLeadsOwn: action.payload,
      };
    case SET_EMPLOYEE_PERFORMANCE_GRAPH:
      return {
        ...state,
        employeePerformanceGraph: action.payload,
      };
    case SET_EMPLOYEE_BLOCK_VIEW_POPUP_DATA:
      return {
        ...state,
        employeeBlockViewPopupData: action.payload,
      };
    case SET_BLOCK_VIEW_EMPLOYEE:
      return {
        ...state,
        isBlockView: action.payload,
      };
    case SET_SINGLE_EMPLOYEE_DATA:
      return {
        ...state,
        singleEmployeeDetail: action.payload,
      };

    default:
      return state;
  }
}
