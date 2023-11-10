import { SET_FILE_KEYS, SET_JSON_FILE, SET_STANDERED_FIELDS } from "../type";

const initialState = {
  file_keys: [],
  json_data: [],
  standered_fields: [],
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_JSON_FILE:
      return {
        ...state,
        json_data: action.payload,
      };
    case SET_FILE_KEYS:
      return {
        ...state,
        file_keys: action.payload,
      };
    case SET_STANDERED_FIELDS:
      return {
        ...state,
        standered_fields: action.payload,
      };
    default:
      return state;
  }
}
