import {
  SET_FOLLOWUPS_OVERVIEW_COUNT,
  SET_FOLLOWUPS_OVERVIEW_CHART,
  SET_OVERVIEW_PORTFOLIO_COUNT,
  SET_REVENUE_BY_MEMBER_COUNT,
  SET_REVENUE_BY_MEMBER_CHART,
  SET_WORKSPACE_LEADS_ACTIVITY,
  SET_WORKSPACE_DEALS_ACTIVITY,
  SET_WORKSPACE_FOLLOWUP_ACTIVITY,
} from "./../types";

const initialState = {
  followupsOverviewCount: [],
  followupsOverviewChart: [],
  portfolioCount: [],
  revenueByMembersCount: [],
  revenueByMembersChart: [],
  workspaceLeadsLog: [],
  workspaceDealsLog: {},
  workspaceFollowupLog: {},
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_FOLLOWUPS_OVERVIEW_COUNT:
      return {
        ...state,
        followupsOverviewCount: action.payload,
      };
    case SET_FOLLOWUPS_OVERVIEW_CHART:
      return {
        ...state,
        followupsOverviewChart: action.payload,
      };
    case SET_OVERVIEW_PORTFOLIO_COUNT:
      return {
        ...state,
        portfolioCount: action.payload,
      };
    case SET_REVENUE_BY_MEMBER_COUNT:
      return {
        ...state,
        revenueByMembersCount: action.payload,
      };
    case SET_REVENUE_BY_MEMBER_CHART:
      return {
        ...state,
        revenueByMembersChart: action.payload,
      };
    case SET_WORKSPACE_LEADS_ACTIVITY:
      return {
        ...state,
        workspaceLeadsLog: action.payload,
      };
    case SET_WORKSPACE_DEALS_ACTIVITY:
      return {
        ...state,
        workspaceDealsLog: action.payload,
      };
    case SET_WORKSPACE_FOLLOWUP_ACTIVITY:
      return {
        ...state,
        workspaceFollowupLog: action.payload,
      };
    default:
      return state;
  }
}
