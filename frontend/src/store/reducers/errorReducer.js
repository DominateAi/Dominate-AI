import { SET_ERRORS, SET_EMPTY_ERRORS, SET_ERROR_CODE } from "./../types";

const initialState = {
  errors: [],
  errorCode: "",
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_ERRORS:
      return {
        ...state,
        errors: action.payload,
      };
    case SET_EMPTY_ERRORS:
      return {
        ...state,
        errors: {},
      };
    case SET_ERROR_CODE:
      return {
        ...state,
        errorCode: action.payload,
      };
    default:
      return state;
  }
}
