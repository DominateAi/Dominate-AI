import {
  SET_SUPERADMIN_ORGANIZATIONS,
  SET_PERTICULAR_WORKSPACE_INFO,
  SET_ORGANIZATION_OVERVIEW,
  GET_SINGLE_ORGANIZATION_OVERVIEW,
  GET_SUPERADMIN_FILTERNAME,
  SET_MANUAL_RETRY_COUNT
} from "./../types";

const initialState = {
  allOrganizations: {},
  singleWorkspaceInfo: {},
  allOrganizationOverview: {},
  singleOrganizationOverview: {},
  superadminFilterName: {},
  manualRetryCount: {}
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_SUPERADMIN_ORGANIZATIONS:
      return {
        ...state,
        allOrganizations: action.payload
      };
    case SET_PERTICULAR_WORKSPACE_INFO:
      return {
        ...state,
        singleWorkspaceInfo: action.payload
      };
    case SET_ORGANIZATION_OVERVIEW:
      return {
        ...state,
        allOrganizationOverview: action.payload
      };
    case GET_SINGLE_ORGANIZATION_OVERVIEW:
      return {
        ...state,
        singleOrganizationOverview: action.payload
      };
    case GET_SUPERADMIN_FILTERNAME:
      return {
        ...state,
        superadminFilterName: action.payload
      };
    case SET_MANUAL_RETRY_COUNT:
      return {
        ...state,
        manualRetryCount: action.payload
      };
    default:
      return state;
  }
}
