import {
  GET_API_STATUS,
  SET_LOGIN,
  LOGOUT_USER,
  SET_LOADER,
  CLEAR_LOADER,
  GET_ALL_ROLES,
  SET_EMPTY_STATUS,
  SET_SIGNUP_USER_INFO,
  SET_EMAIL_IN_REDUCER,
  SET_ORGANIZATION_DETAILS,
  SET_ORGANIZATION_UPLOADED_IMAGE,
  SET_PAGETITLE,
  SET_WALKTHROUGH_PAGE,
  GET_INVITE_LINK_USERS,
} from "./../types";
import isEmpty from "./../validations/is-empty";

const initialState = {
  isAuthenticated: false,
  user: {},
  organizationDetails: {},
  oragnizationUploadedLogo: {},
  roles: {},
  status: "",
  forgetPasswordMail: {},
  signUpUserInfo: {},
  headingPageTitle: {},
  loader: false,
  activeWalkthroughPage: {},
  allUsersInviteLinks: [],
};

export default function (state = initialState, action) {
  switch (action.type) {
    case GET_API_STATUS:
      return {
        ...state,
        status: action.payload,
      };
    case SET_LOGIN:
      return {
        ...state,
        isAuthenticated: !isEmpty(action.payload),
        user: action.payload,
      };

    case LOGOUT_USER:
      return {
        ...state,
        isAuthenticated: false,
        user: {},
      };
    case SET_LOADER:
      return {
        ...state,
        loader: true,
      };
    case CLEAR_LOADER:
      return {
        ...state,
        loader: false,
      };
    case GET_ALL_ROLES:
      return {
        ...state,
        roles: action.payload,
      };

    case SET_EMPTY_STATUS:
      return {
        ...state,
        status: "",
      };
    case SET_SIGNUP_USER_INFO:
      return {
        ...state,
        signUpUserInfo: action.payload,
      };
    case SET_EMAIL_IN_REDUCER:
      return {
        ...state,
        forgetPasswordMail: action.payload,
      };
    case SET_ORGANIZATION_DETAILS:
      return {
        ...state,
        organizationDetails: action.payload,
      };
    case SET_ORGANIZATION_UPLOADED_IMAGE:
      return {
        ...state,
        oragnizationUploadedLogo: action.payload,
      };
    case SET_PAGETITLE:
      return {
        ...state,
        headingPageTitle: action.payload,
      };
    case SET_WALKTHROUGH_PAGE:
      return {
        ...state,
        activeWalkthroughPage: action.payload,
      };
    case GET_INVITE_LINK_USERS:
      return {
        ...state,
        allUsersInviteLinks: action.payload,
      };
    default:
      return state;
  }
}
