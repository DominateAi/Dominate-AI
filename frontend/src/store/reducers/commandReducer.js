import {
  SET_ORGANISATION_TARGET,
  GET_ALL_EMPLOYEES_TARGET,
  SET_SIGNLE_EMPLOYEE_TARGET,
  SET_ORGANIZATION_TARGET_VS_DOLLER_CHART,
  SET_ORGANIZATION_TARGET_VS_ACTUAL_LEADS_CHART,
  SET_ORGANIZATION_TARGET_EFFICIENCY,
  SET_USER_TARGET_VS_DOLLER_CHART,
  SET_USER_TARGET_VS_LEADS_CHART,
  SET_USER_TARGET_EFFICIENCY,
  SET_ORGANIZATION_TARGET_TABLE,
  SET_USER_TARGET_TABLE,
  SET_ALL_USERS_ROLES,
  SET_ALL_CUSTOM_FIELDS,
  SET_LEADS_ALL_CUSTOME_FIELDS,
  SET_ACCOUNT_ALL_CUSTOME_FIELDS,
  SET_CONTACT_ALL_CUSTOME_FIELDS,
  GET_FIELDS_VALUE_BY_ENTITY,
  SET_DEAL_ALL_CUSTOME_FIELDS,
  // deal org target
  SET_ORGANISATION_DEAL_TARGET,
  SET_ORGANIZATION_TARGET_VS_ACTUAL_DEALS_CHART,
  SET_ORGANIZATION_DEAL_TARGET_VS_DOLLER_CHART,
  SET_ORGANIZATION_DEAL_TARGET_EFFICIENCY,
  SET_ORGANIZATION_DEAL_TARGET_TABLE,
  // deal user target
  SET_SIGNLE_DEAL_EMPLOYEE_TARGET,
  SET_USER_DEAL_TARGET_VS_DOLLER_CHART,
  SET_USER_TARGET_VS_DEAL_CHART,
  SET_USER_DEAL_TARGET_EFFICIENCY,
  SET_USER_DEAL_TARGET_TABLE,
  SET_TARGET_USER_FILTER_ACTIVE_MEMBER,
} from "./../types";
import isEmpty from "./../validations/is-empty";

var userData = JSON.parse(localStorage.getItem("Data"));
const initialState = {
  organisationTarget: {},
  allEmployeesTarget: {},
  singleEmployeeTarget: {},
  orgTargetVsActualDollers: {},
  orgTargetVsActualLeads: {},
  orgTargetEfficiency: {},
  userTargetVsActualLeads: {},
  userTargetEfficiency: {},
  orgTargetTable: {},
  userTargetTable: {},
  memberAllRoles: [],
  allCustomFields: [],
  leadsCustomFields: [],
  accountCustomFields: [],
  contactCustomFields: [],
  dealCustomFields: [],
  allFieldsValue: [],
  // deal org target
  orgDealTarget: [],
  orgTargetVsActualDeals: [],
  orgDealTargetVsActualDollers: [],
  orgDealsTargetEfficiency: [],
  orgDealTargetTable: [],
  //deal user target
  singleEmployeeDealTarget: [],
  userTargetVsActualDeals: [],
  userDealTargetVsActualDollers: [],
  userDealsTargetEfficiency: [],
  userDealTargetTable: [],
  targetUserFilterActiveMember: !isEmpty(userData) ? userData.id : "",
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_ORGANISATION_TARGET:
      return {
        ...state,
        organisationTarget: action.payload,
      };
    case GET_ALL_EMPLOYEES_TARGET:
      return {
        ...state,
        allEmployeesTarget: action.payload,
      };
    case SET_SIGNLE_EMPLOYEE_TARGET:
      return {
        ...state,
        singleEmployeeTarget: action.payload,
      };
    case SET_ORGANIZATION_TARGET_VS_DOLLER_CHART:
      return {
        ...state,
        orgTargetVsActualDollers: action.payload,
      };
    case SET_ORGANIZATION_TARGET_VS_ACTUAL_LEADS_CHART:
      return {
        ...state,
        orgTargetVsActualLeads: action.payload,
      };
    case SET_ORGANIZATION_TARGET_EFFICIENCY:
      return {
        ...state,
        orgTargetEfficiency: action.payload,
      };
    case SET_USER_TARGET_VS_DOLLER_CHART:
      return {
        ...state,
        userTargetVsActualDollers: action.payload,
      };
    case SET_USER_TARGET_VS_LEADS_CHART:
      return {
        ...state,
        userTargetVsActualLeads: action.payload,
      };
    case SET_USER_TARGET_EFFICIENCY:
      return {
        ...state,
        userTargetEfficiency: action.payload,
      };
    case SET_ORGANIZATION_TARGET_TABLE:
      return {
        ...state,
        orgTargetTable: action.payload,
      };
    case SET_USER_TARGET_TABLE:
      return {
        ...state,
        userTargetTable: action.payload,
      };
    case SET_ALL_USERS_ROLES:
      return {
        ...state,
        memberAllRoles: action.payload,
      };
    case SET_ALL_CUSTOM_FIELDS:
      return {
        ...state,
        allCustomFields: action.payload,
      };
    case SET_LEADS_ALL_CUSTOME_FIELDS:
      return {
        ...state,
        leadsCustomFields: action.payload,
      };
    case SET_ACCOUNT_ALL_CUSTOME_FIELDS:
      return {
        ...state,
        accountCustomFields: action.payload,
      };
    case SET_CONTACT_ALL_CUSTOME_FIELDS:
      return {
        ...state,
        contactCustomFields: action.payload,
      };
    case SET_DEAL_ALL_CUSTOME_FIELDS:
      return {
        ...state,
        dealCustomFields: action.payload,
      };
    case GET_FIELDS_VALUE_BY_ENTITY:
      return {
        ...state,
        allFieldsValue: action.payload,
      };
    // deal org target
    case SET_ORGANISATION_DEAL_TARGET:
      return {
        ...state,
        orgDealTarget: action.payload,
      };
    case SET_ORGANIZATION_TARGET_VS_ACTUAL_DEALS_CHART:
      return {
        ...state,
        orgTargetVsActualDeals: action.payload,
      };
    case SET_ORGANIZATION_DEAL_TARGET_VS_DOLLER_CHART:
      return {
        ...state,
        orgDealTargetVsActualDollers: action.payload,
      };
    case SET_ORGANIZATION_DEAL_TARGET_EFFICIENCY:
      return {
        ...state,
        orgDealsTargetEfficiency: action.payload,
      };
    case SET_ORGANIZATION_DEAL_TARGET_TABLE:
      return {
        ...state,
        orgDealTargetTable: action.payload,
      };

    //deal user target
    case SET_SIGNLE_DEAL_EMPLOYEE_TARGET:
      return {
        ...state,
        singleEmployeeDealTarget: action.payload,
      };
    case SET_USER_DEAL_TARGET_VS_DOLLER_CHART:
      return {
        ...state,
        userDealTargetVsActualDollers: action.payload,
      };
    case SET_USER_TARGET_VS_DEAL_CHART:
      return {
        ...state,
        userTargetVsActualDeals: action.payload,
      };
    case SET_USER_DEAL_TARGET_EFFICIENCY:
      return {
        ...state,
        userDealsTargetEfficiency: action.payload,
      };
    case SET_USER_DEAL_TARGET_TABLE:
      return {
        ...state,
        userDealTargetTable: action.payload,
      };
    case SET_TARGET_USER_FILTER_ACTIVE_MEMBER:
      return {
        ...state,
        targetUserFilterActiveMember: action.payload,
      };

    default:
      return state;
  }
}
