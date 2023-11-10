import { SET_SINGLE_DEAL_DATA, SET_DEALS_OVERVIEW } from "./../types";

const initialState = {
  singleDealData: {},
  dealsOverview: [],
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_SINGLE_DEAL_DATA:
      return {
        ...state,
        singleDealData: action.payload,
      };
    case SET_DEALS_OVERVIEW:
      return {
        ...state,
        dealsOverview: action.payload,
      };
    default:
      return state;
  }
}
