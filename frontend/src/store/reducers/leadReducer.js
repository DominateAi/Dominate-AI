import {
  GET_ALL_LEAD,
  GET_LEADS_OVERVIEW,
  GET_KANBAN_LEADS,
  GET_CURRENT_LEAD_ADDED_DATA,
  GET_LEAD_COUNT_BY_STATUS,
  GET_LEADS_COUNT,
  GET_KANBAN_STATUS_CHANGE,
  SET_ACTIVITY_EMAILS,
  SET_ACTIVITY_DATA,
  SET_ACTIVITY_NOTES,
  SET_EMAIL_TEMPLATES,
  SET_ACTIVITY_ARCHIVE_EMAILS,
  SET_LEAD_ACTIVITY_SUMMARY_INFO,
  GET_ALL_ACTIVE_LEAD,
  SET_LEADS_TIMELINE,
  SET_LEAD_FILES,
  SET_KANBAN_VIEW,
  SET_CONFETTI_ANIMATION,
  SET_LEAD_ACTIVITY_LOG,
  SET_SELECTED_NOTE,
  SET_SINGLE_LEAD_CLOSURE_PROBABLITY,
} from "./../types";

const initialState = {
  allLeads: [],
  activeLeads: [],
  leadsOverview: [],
  kanBanLeads: [],
  currentLeadAdded: [],
  leadStatusCount: [],
  allLeadCount: [],
  kanbanLeadStatusChangedData: [],
  leadActivitySummary: [],
  activity: [],
  email: [],
  notes: [],
  selectedNoteData: {},
  allFiles: [],
  emailTemplates: [],
  archiveEmails: [],
  leadAllTimeline: {},
  isKanbanView: false,
  confettiAnimation: false,
  leadActivityLog: [],
  singleLeadClosureProbablity: [],
};

export default function (state = initialState, action) {
  switch (action.type) {
    case GET_LEADS_OVERVIEW:
      return {
        ...state,
        leadsOverview: action.payload,
      };
    case GET_ALL_LEAD:
      return {
        ...state,
        allLeads: action.payload,
      };

    case GET_KANBAN_LEADS:
      return {
        ...state,
        kanBanLeads: action.payload,
      };
    case GET_CURRENT_LEAD_ADDED_DATA:
      return {
        ...state,
        currentLeadAdded: action.payload,
      };

    case GET_LEAD_COUNT_BY_STATUS:
      return {
        ...state,
        leadStatusCount: action.payload,
      };
    case GET_LEADS_COUNT:
      return {
        ...state,
        allLeadCount: action.payload,
      };
    case GET_KANBAN_STATUS_CHANGE:
      return {
        ...state,
        kanbanLeadStatusChangedData: action.payload,
      };
    case SET_ACTIVITY_EMAILS:
      return {
        ...state,

        email: action.payload,
      };
    case SET_ACTIVITY_DATA:
      return {
        ...state,

        activity: action.payload,
      };
    case SET_ACTIVITY_NOTES:
      return {
        ...state,
        notes: action.payload,
      };
    case SET_EMAIL_TEMPLATES:
      return {
        ...state,
        emailTemplates: action.payload,
      };

    case SET_ACTIVITY_ARCHIVE_EMAILS:
      return {
        ...state,
        archiveEmails: action.payload,
      };
    case SET_LEAD_ACTIVITY_SUMMARY_INFO:
      return {
        ...state,
        leadActivitySummary: action.payload,
      };
    case GET_ALL_ACTIVE_LEAD:
      return {
        ...state,
        activeLeads: action.payload,
      };
    case SET_LEADS_TIMELINE:
      return {
        ...state,
        leadAllTimeline: action.payload,
      };
    case SET_LEAD_FILES:
      return {
        ...state,
        allFiles: action.payload,
      };
    case SET_KANBAN_VIEW:
      return {
        ...state,
        isKanbanView: action.payload,
      };
    case SET_CONFETTI_ANIMATION:
      return {
        ...state,
        confettiAnimation: action.payload,
      };
    case SET_LEAD_ACTIVITY_LOG:
      return {
        ...state,
        leadActivityLog: action.payload,
      };
    case SET_SELECTED_NOTE:
      return {
        ...state,
        selectedNoteData: action.payload,
      };
    case SET_SINGLE_LEAD_CLOSURE_PROBABLITY:
      return {
        ...state,
        singleLeadClosureProbablity: action.payload,
      };
    default:
      return state;
  }
}
