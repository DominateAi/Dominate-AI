import {
  SET_PROPOSAL_BY_CRAFT_OVERVIEW_COUNT,
  GET_ALL_PROPOSALS_BY_CRAFT_LIST,
  SET_ALL_CRAFTJS_HTML,
  SET_EDITOR_ENABLE_OR_NOT,
} from "./../types";

const initialState = {
  allProposalsByCraftjs: {},
  proposalsByCraftOverview: {},
  allHtmlOfCarftjs: {},
  editorEditable: false,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case GET_ALL_PROPOSALS_BY_CRAFT_LIST:
      return {
        ...state,
        allProposalsByCraftjs: action.payload,
      };
    case SET_PROPOSAL_BY_CRAFT_OVERVIEW_COUNT:
      return {
        ...state,
        proposalsByCraftOverview: action.payload,
      };

    case SET_ALL_CRAFTJS_HTML:
      return {
        ...state,
        allHtmlOfCarftjs: action.payload,
      };
    case SET_EDITOR_ENABLE_OR_NOT:
      return {
        ...state,
        editorEditable: action.payload,
      };
    default:
      return state;
  }
}
