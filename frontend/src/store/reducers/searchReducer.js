import { SET_SEARCH_IN_ALL_PAGE, SET_KANBAN_SEARCH } from "./../types";

const initialState = {
  searchInAllPage: "",
  kanbanSearch: "",
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_SEARCH_IN_ALL_PAGE:
      return {
        ...state,
        searchInAllPage: action.payload,
      };
    case SET_KANBAN_SEARCH:
      return {
        ...state,
        kanbanSearch: action.payload,
      };
    default:
      return state;
  }
}
