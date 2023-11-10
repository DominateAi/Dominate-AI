import {
  GET_CUSTOMERS_OVERVIEW,
  GET_ALL_CUSTOMERS,
  SET_CUSTOMER_EMAILS,
  SET_CUSTOMER_ARCHIVE_EMAILS,
  SET_BLOCK_VIEW
} from "./../types";

const initialState = {
  allCuctomers: {},
  customerOverview: {},
  customerAllEmails: [],
  customerArchiveEmails: [],
  isBlockView: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_CUSTOMERS_OVERVIEW:
      return {
        ...state,
        customerOverview: action.payload
      };

    case GET_ALL_CUSTOMERS:
      return {
        ...state,
        allCuctomers: action.payload
      };
    case SET_CUSTOMER_EMAILS:
      return {
        ...state,
        customerAllEmails: action.payload
      };
    case SET_CUSTOMER_ARCHIVE_EMAILS:
      return {
        ...state,
        customerArchiveEmails: action.payload
      };
    case SET_BLOCK_VIEW:
      return {
        ...state,
        isBlockView: true
      };
    default:
      return state;
  }
}
