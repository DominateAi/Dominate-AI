import {
  SET_EMAIL_GRAPH,
  SET_SOCIAL_MEDIA_GRAPH,
  SET_LEADS_CLOSED_GRAPH,
  SET_LEADS_CLOSED_GRAPH_MONTHLY,
  SET_LEADS_CLOSED_GRAPH_WEEKLY,
  SET_LEADS_REVENU_GRAPH_YEARLY,
  SET_LEADS_REVENU_GRAPH_MONTHLY,
  SET_LEADS_REVENU_GRAPH_WEEKLY,
  SET_LEADS_COUNT,
  SET_REPORTS_LEADS_DROP,
  SET_LEADS_LEVELS_GRAPH_DATA,
  SET_OWNER_WISE_LEADS,
  SET_ACCOUNT_WITH_MAX_REVENUE,
  SET_TOTAL_REVENUE_GENERATED_MONTHWISE,
  SET_REVENUE_GENERATED_FROM_RECURRING_DEALS,
  SET_BIGGEST_DEAL_REVENUE,
  SET_FUTURE_REVENUE_PROJECTION,
  SET_FUTURE_REVENUE_PREDICTION,
  SET_DEALS_AND_LEADS_OF_ACCOUNT_CHART,
  GET_CLOSED_DEAL_BY_MONTH_CHART,
  SET_TOTAL_REVENUE_GENERATED_BY_ACCOUNT,
} from "./../types";

const initialState = {
  emailGraphData: {},
  socialMediaGraph: {},
  leadsClosedGraphYearly: [],
  leadsClosedGraphMonthly: [],
  leadsClosedGraphWeekly: [],
  laadsRevenuGraphYearly: [],
  laadsRevenuGraphMonthly: [],
  laadsRevenuGraphWeekly: [],
  leadsStatusCount: [],
  leadsDropGraph: [],
  leadsLevelsGraphData: [],
  ownerWiseLeads: [],
  accountWithMaxRevenue: {},
  revenueFromRecurringDeals: {},
  futureRevenueProjection: {},
  dealsAndLeadsOfAccount: {},
  closedDealsByMonthChart: {},
  totalRevenueGeneratedByAccount: {},
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_EMAIL_GRAPH:
      return {
        ...state,
        emailGraphData: action.payload,
      };
    case SET_SOCIAL_MEDIA_GRAPH:
      return {
        ...state,
        socialMediaGraph: action.payload,
      };
    case SET_LEADS_CLOSED_GRAPH:
      return {
        ...state,
        leadsClosedGraphYearly: action.payload,
      };
    case SET_LEADS_CLOSED_GRAPH_MONTHLY:
      return {
        ...state,
        leadsClosedGraphMonthly: action.payload,
      };
    case SET_LEADS_CLOSED_GRAPH_WEEKLY:
      return {
        ...state,
        leadsClosedGraphWeekly: action.payload,
      };
    case SET_LEADS_REVENU_GRAPH_YEARLY:
      return {
        ...state,
        laadsRevenuGraphYearly: action.payload,
      };
    case SET_LEADS_REVENU_GRAPH_MONTHLY:
      return {
        ...state,
        laadsRevenuGraphMonthly: action.payload,
      };
    case SET_LEADS_REVENU_GRAPH_WEEKLY:
      return {
        ...state,
        laadsRevenuGraphWeekly: action.payload,
      };
    case SET_LEADS_COUNT:
      return {
        ...state,
        leadsStatusCount: action.payload,
      };
    case SET_REPORTS_LEADS_DROP:
      return {
        ...state,
        leadsDropGraph: action.payload,
      };
    case SET_LEADS_LEVELS_GRAPH_DATA:
      return {
        ...state,
        leadsLevelsGraphData: action.payload,
      };
    case SET_OWNER_WISE_LEADS:
      return {
        ...state,
        ownerWiseLeads: action.payload,
      };
    case SET_ACCOUNT_WITH_MAX_REVENUE:
      return {
        ...state,
        accountWithMaxRevenue: action.payload,
      };
    case SET_TOTAL_REVENUE_GENERATED_MONTHWISE:
      return {
        ...state,
        totalRevenueMonthlyChart: action.payload,
      };
    case SET_REVENUE_GENERATED_FROM_RECURRING_DEALS:
      return {
        ...state,
        revenueFromRecurringDeals: action.payload,
      };
    case SET_BIGGEST_DEAL_REVENUE:
      return {
        ...state,
        biggestDealRevenue: action.payload,
      };
    case SET_FUTURE_REVENUE_PROJECTION:
      return {
        ...state,
        futureRevenueProjection: action.payload,
      };
    case SET_FUTURE_REVENUE_PREDICTION:
      return {
        ...state,
        futureRevenuePrediction: action.payload,
      };
    case SET_DEALS_AND_LEADS_OF_ACCOUNT_CHART:
      return {
        ...state,
        dealsAndLeadsOfAccount: action.payload,
      };
    case GET_CLOSED_DEAL_BY_MONTH_CHART:
      return {
        ...state,
        closedDealsByMonthChart: action.payload,
      };
    case SET_TOTAL_REVENUE_GENERATED_BY_ACCOUNT:
      return {
        ...state,
        totalRevenueGeneratedByAccount: action.payload,
      };
    default:
      return state;
  }
}
