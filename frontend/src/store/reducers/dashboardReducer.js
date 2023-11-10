import {
  SET_LEADS_GENERATED_FROM_SOCIAL_MEDIA,
  SET_TASK_COMPLETED_COUNT,
  SET_SUPER_HOT_COUNT,
  SET_COLD_COUNT,
  SET_HOT_COUNT,
  SET_WARM_COUNT,
  SET_ACTIVE_CUSTOMERS_COUNT,
  SET_TASK_LIST_COUNT,
  SET_TODAYS_MEET_AND_FOLLOWUP,
  SET_TODAYS_MEET,
  SET_CUSTOMER_STATUS_GRAPH,
  SET_YOUR_PREDICTION_GRAPH,
  SET_USER_TARGET_GRAPH,
  SET_PERFORMANCE_LEADERBOARD_CURRENT,
  SET_PERFORMANCE_LEADERBOARD_PREVIOUS,
  SET_UPCOMING_LEAVES,
  SET_ALL_LEADS_COUNT,
  SET_DASHBOARD_NOTIFICATION,
  SET_DASHBOARD_CALENDER_WIDGET_CARD,
  SET_DASHBOARD_CALENDER_WIDGET_MEET_FOLLOWUP,
  SET_CALENDER_FOLLOWUP_MEET_OF_THAT_DAY,
  SET_DASHBOARD_MONTH_STATUS_COUNT,
  SET_LEADS_SOURCE_BY_REVENUE,
  SET_DEALS_IN_PIPELINE,
  SET_TODAYS_TASKS,
  SET_MONTHLY_TARGET_BY_DOLLER,
  SET_MONTHLY_TARGET_BY_LEAD,
  SET_MONTHLY_AND_QUATERLY_REVENUE,
  SET_REVENUE_FORCAST_GRAPH_DATA,
  SET_EXPECTED_VS_AQUIRED_REVENUE,
  SET_CALENDER_FOLLOWUP_SELECTED_DAY
} from "./../types";

const initialState = {
  leadsGeneratedFromSocial: [],
  taskCompletedCount: [],
  superHotLeadsCount: [],
  coldLeadsCount: [],
  hotLeadsCount: [],
  warmLeadsCount: [],
  activeCustomerCount: [],
  allLeadsCount: [],
  taskListCount: [],
  todaysFollowUp: [],
  todaysMeetings: [],
  todaysTaks: [],
  customerStatusGraph: [],
  yourPredictionGraph: [],
  userMyTargetsGraph: [],
  leaderBoardCurrent: [],
  leaderBoardPrevious: [],
  upcomingLeaves: [],
  allNotifications: [],
  calenderWidgetDataCard: false,
  selectedCalenderDate: [],
  dashboardCalenderMeetFollowup: [],
  meetingFollowupOfDay: [],
  monthStatusCount: [],
  leadSourceByRevenue: [],
  dealsInPipeline: [],
  monthlyTargetByDollers: [],
  monthlyTargetByLead: []
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_LEADS_GENERATED_FROM_SOCIAL_MEDIA:
      return {
        ...state,
        leadsGeneratedFromSocial: action.payload
      };
    case SET_TASK_COMPLETED_COUNT:
      return {
        ...state,
        taskCompletedCount: action.payload
      };
    case SET_SUPER_HOT_COUNT:
      return {
        ...state,
        superHotLeadsCount: action.payload
      };
    case SET_COLD_COUNT:
      return {
        ...state,
        coldLeadsCount: action.payload
      };
    case SET_HOT_COUNT:
      return {
        ...state,
        hotLeadsCount: action.payload
      };
    case SET_WARM_COUNT:
      return {
        ...state,
        warmLeadsCount: action.payload
      };
    case SET_ACTIVE_CUSTOMERS_COUNT:
      return {
        ...state,
        activeCustomerCount: action.payload
      };
    case SET_TASK_LIST_COUNT:
      return {
        ...state,
        taskListCount: action.payload
      };
    case SET_TODAYS_MEET_AND_FOLLOWUP:
      return {
        ...state,
        todaysFollowUp: action.payload
      };
    case SET_TODAYS_MEET:
      return {
        ...state,
        todaysMeetings: action.payload
      };
    case SET_CUSTOMER_STATUS_GRAPH:
      return {
        ...state,
        customerStatusGraph: action.payload
      };
    case SET_YOUR_PREDICTION_GRAPH:
      return {
        ...state,
        yourPredictionGraph: action.payload
      };
    case SET_USER_TARGET_GRAPH:
      return {
        ...state,
        userMyTargetsGraph: action.payload
      };
    case SET_PERFORMANCE_LEADERBOARD_CURRENT:
      return {
        ...state,
        leaderBoardCurrent: action.payload
      };
    case SET_PERFORMANCE_LEADERBOARD_PREVIOUS:
      return {
        ...state,
        leaderBoardPrevious: action.payload
      };
    case SET_UPCOMING_LEAVES:
      return {
        ...state,
        upcomingLeaves: action.payload
      };
    case SET_ALL_LEADS_COUNT:
      return {
        ...state,
        allLeadsCount: action.payload
      };
    case SET_DASHBOARD_NOTIFICATION:
      return {
        ...state,
        allNotifications: action.payload
      };
    case SET_DASHBOARD_CALENDER_WIDGET_CARD:
      return {
        ...state,
        calenderWidgetDataCard: action.payload
      };
    case SET_DASHBOARD_CALENDER_WIDGET_MEET_FOLLOWUP:
      return {
        ...state,
        dashboardCalenderMeetFollowup: action.payload
      };
    case SET_CALENDER_FOLLOWUP_MEET_OF_THAT_DAY:
      return {
        ...state,
        meetingFollowupOfDay: action.payload
      };
    case SET_CALENDER_FOLLOWUP_SELECTED_DAY:
      return {
        ...state,
        selectedCalenderDate: action.payload
      };
    case SET_DASHBOARD_MONTH_STATUS_COUNT:
      return {
        ...state,
        monthStatusCount: action.payload
      };
    case SET_LEADS_SOURCE_BY_REVENUE:
      return {
        ...state,
        leadSourceByRevenue: action.payload
      };
    case SET_DEALS_IN_PIPELINE:
      return {
        ...state,
        dealsInPipeline: action.payload
      };
    case SET_TODAYS_TASKS:
      return {
        ...state,
        todaysTaks: action.payload
      };
    case SET_MONTHLY_TARGET_BY_DOLLER:
      return {
        ...state,
        monthlyTargetByDollers: action.payload
      };
    case SET_MONTHLY_TARGET_BY_LEAD:
      return {
        ...state,
        monthlyTargetByLead: action.payload
      };
    case SET_MONTHLY_AND_QUATERLY_REVENUE:
      return {
        ...state,
        monthlyQuaterlyRevenue: action.payload
      };
    case SET_REVENUE_FORCAST_GRAPH_DATA:
      return {
        ...state,
        revenueForcast: action.payload
      };
    case SET_EXPECTED_VS_AQUIRED_REVENUE:
      return {
        ...state,
        expectedAndAquiredRevenue: action.payload
      };
    default:
      return state;
  }
}
