import {
  SET_MESSAGE,
  SET_MESSAGES,
  CLEAR_MESSAGES,
  SET_LOADING,
  SET_CURRENT_LABEL,
  SET_NEXT_PAGE_TOKEN,
  SET_HAS_MORE_MESSAGES,
  SET_MESSAGE_SECTION,
  HIDE_MESSAGE_SECTION,
  SET_CONTACTS,
  SET_EVENTS,
} from "../types";

export default (state, action) => {
  switch (action.type) {
    case SET_MESSAGES:
      return {
        ...state,
        messages: [...state.messages, action.payload],
        loading: false,
      };

    case SET_MESSAGE:
      return {
        ...state,
        message: action.payload,
      };

    case SET_CURRENT_LABEL:
      return {
        ...state,
        currentLabel: action.payload,
      };

    case SET_NEXT_PAGE_TOKEN: {
      return {
        ...state,
        nextPageToken: action.payload,
      };
    }

    case SET_HAS_MORE_MESSAGES: {
      return {
        ...state,
        hasMoreMessages: action.payload,
      };
    }

    case CLEAR_MESSAGES: {
      return {
        ...state,
        messages: [],
      };
    }

    case SET_LOADING:
      return {
        ...state,
        loading: true,
      };
    case SET_MESSAGE_SECTION:
      return {
        ...state,
        showMessage: true,
      };
    case HIDE_MESSAGE_SECTION:
      return {
        ...state,
        showMessage: false,
      };
    case SET_CONTACTS:
      return {
        ...state,
        contacts: action.payload,
      };
    case SET_EVENTS:
      return {
        ...state,
        events: action.payload,
      };
    default:
      return state;
  }
};
