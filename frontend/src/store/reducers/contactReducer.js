import {
  SET_ALL_CONTACT,
  SET_SELECTED_CONTACTS,
  SET_ASSIGNED_MEMBER,
  SET_ASSIGNED_ACCOUNT,
  SET_CONTACT_VALIDATION_ERROR,
} from "./../types";

const initialState = {
  allContacts: {},
  selectedContacts: {},
  assignedUser: {},
  assignedAccount: {},
  validationErrors: {},
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_ALL_CONTACT:
      return {
        ...state,
        allContacts: action.payload,
      };
    case SET_SELECTED_CONTACTS:
      return {
        ...state,
        selectedContacts: action.payload,
      };
    case SET_ASSIGNED_MEMBER:
      return {
        ...state,
        assignedUser: action.payload,
      };
    case SET_ASSIGNED_ACCOUNT:
      return {
        ...state,
        assignedAccount: action.payload,
      };
    case SET_CONTACT_VALIDATION_ERROR:
      return {
        ...state,
        validationErrors: action.payload,
      };
    default:
      return state;
  }
}
