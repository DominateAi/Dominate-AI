import {
  SET_FILTER_NAME,
  SET_APPROVAL_PENDING,
  SET_OVERVIEW_FILTERNAME
} from "./../types";

const initialState = {
  filterName: {},
  employeeLevelName: {},
  overviewFilterName: {}
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_FILTER_NAME:
      return {
        ...state,
        filterName: action.payload
      };
    case SET_APPROVAL_PENDING:
      return {
        ...state,
        employeeLevelName: action.payload
      };
    case SET_OVERVIEW_FILTERNAME:
      return {
        ...state,
        overviewFilterName: action.payload
      };
    default:
      return state;
  }
}
