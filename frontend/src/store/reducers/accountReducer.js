import {
  SET_ALL_ACCOUNTS,
  SET_SINGLE_ACCOUNT_DATA,
  SET_DEALS_OF_ACCOUNT,
  SET_LEADS_OF_ACCOUNT,
  SET_ACCOUNTS_OVERVIEW,
  SET_REVENUE_OVERVIEW,
  SET_DEALS_AND_THEIR_REVENUE,
  SET_REVENUE_FORCAST_GRAPH,
  SET_ACCOUNT_ACTIVITY,
  SET_ACCOUNT_ACCUMULATED_GRAPH,
  SET_ACCOUNTS_WITH_DEALS_CHART,
  SET_ACCOUNT_NOTES,
  GET_NOTE_DATA,
} from "./../types";

const initialState = {
  allAccounts: [],
  singleAccountData: [],
  dealsOfAccount: [],
  leadsOfAccount: [],
  accountOverview: [],
  dealsWithRevenue: [],
  revenueForecast: [],
  accountTimeline: [],
  accountAccumulatedRevenueGraph: [],
  accountWithTotalDealsChart: [],
  accountAllNotes: [],
  accountSingleNote: [],
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_ALL_ACCOUNTS:
      return {
        ...state,
        allAccounts: action.payload,
      };
    case SET_SINGLE_ACCOUNT_DATA:
      return {
        ...state,
        singleAccountData: action.payload,
      };
    case SET_DEALS_OF_ACCOUNT:
      return {
        ...state,
        dealsOfAccount: action.payload,
      };
    case SET_LEADS_OF_ACCOUNT:
      return {
        ...state,
        leadsOfAccount: action.payload,
      };
    case SET_ACCOUNTS_OVERVIEW:
      return {
        ...state,
        accountOverview: action.payload,
      };
    case SET_REVENUE_OVERVIEW:
      return {
        ...state,
        revenueOverview: action.payload,
      };
    case SET_DEALS_AND_THEIR_REVENUE:
      return {
        ...state,
        dealsWithRevenue: action.payload,
      };
    case SET_REVENUE_FORCAST_GRAPH:
      return {
        ...state,
        revenueForecast: action.payload,
      };
    case SET_ACCOUNT_ACTIVITY:
      return {
        ...state,
        accountTimeline: action.payload,
      };
    case SET_ACCOUNT_ACCUMULATED_GRAPH:
      return {
        ...state,
        accountAccumulatedRevenueGraph: action.payload,
      };
    case SET_ACCOUNTS_WITH_DEALS_CHART:
      return {
        ...state,
        accountWithTotalDealsChart: action.payload,
      };
    case SET_ACCOUNT_NOTES:
      return {
        ...state,
        accountAllNotes: action.payload,
      };
    case GET_NOTE_DATA:
      return {
        ...state,
        accountSingleNote: action.payload,
      };
    default:
      return state;
  }
}
