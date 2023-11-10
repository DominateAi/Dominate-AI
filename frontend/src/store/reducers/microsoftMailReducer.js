import {
  SET_ALL_MICROSOFT_FOLDERS,
  SET_FOLDERS_MESSEGES,
  SET_ALL_MICROSOFT_CONTACTS,
  SET_ALL_MICROSOFT_EVENTS,
  SET_MICROSOFT_SINGLE_MESSAGE,
} from "./../types";

const initialState = {
  allMicrosoftFolders: [],
  allMessages: [],
  allContacts: [],
  allEvents: [],
  microsoftSingleMessage: {},
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_ALL_MICROSOFT_FOLDERS:
      return {
        ...state,
        allMicrosoftFolders: action.payload,
      };
    case SET_FOLDERS_MESSEGES:
      return {
        ...state,
        allMessages: action.payload,
      };
    case SET_ALL_MICROSOFT_CONTACTS:
      return {
        ...state,
        allContacts: action.payload,
      };
    case SET_ALL_MICROSOFT_EVENTS:
      return {
        ...state,
        allEvents: action.payload,
      };
    case SET_MICROSOFT_SINGLE_MESSAGE:
      return {
        ...state,
        microsoftSingleMessage: action.payload,
      };
    default:
      return state;
  }
}
