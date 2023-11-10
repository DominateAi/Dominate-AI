import {
  SET_SELECTED_TEMPLATES_BY_USER,
  SET_AUTOSAVE,
  // SET_AUTOSAVE_FALSE,
} from "../types";

const initialState = {
  selectedTemplatesByUser: {},
  autoSave: false,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_SELECTED_TEMPLATES_BY_USER:
      return {
        ...state,
        selectedTemplatesByUser: action.payload,
      };
    case SET_AUTOSAVE:
      return {
        ...state,
        autoSave: action.payload,
      };

    default:
      return state;
  }
}
