import {
  SET_ALL_QUOTATIONS,
  SET_QUOTATION_OVERVIEW,
  SET_CLICK_ON_QUOTATION,
  SET_EMPTY_QUOTATION,
  SET_EDIT_OR_VIEW,
} from "./../types";

const initialState = {
  allQuotation: {},
  quotationOverview: {},
  selectedQuotationData: {},
  editQuotationView: false,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_ALL_QUOTATIONS:
      return {
        ...state,
        allQuotation: action.payload,
      };
    case SET_QUOTATION_OVERVIEW:
      return {
        ...state,
        quotationOverview: action.payload,
      };
    case SET_CLICK_ON_QUOTATION:
      return {
        ...state,
        selectedQuotationData: action.payload,
      };
    case SET_EMPTY_QUOTATION:
      return {
        ...state,
        selectedQuotationData: {},
      };
    case SET_EDIT_OR_VIEW:
      return {
        ...state,
        editQuotationView: action.payload,
      };
    default:
      return state;
  }
}
