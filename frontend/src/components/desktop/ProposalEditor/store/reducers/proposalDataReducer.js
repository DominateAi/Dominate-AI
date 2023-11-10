import {
  READ_ALL_PROPOSAL,
  READ_PROPOSAL,
  SET_PROPOSAL_OVERVIEW_COUNT
} from "../types";

const initialData = {
  all_proposal_list: [],
  selected_proposal_data: {},
  proposal_overview: {}
};

export default function(state = initialData, action) {
  switch (action.type) {
    case READ_ALL_PROPOSAL:
      return {
        ...state,
        all_proposal_list: action.payload
      };
    case READ_PROPOSAL:
      return {
        ...state,
        selected_proposal_data: action.payload
      };
    case SET_PROPOSAL_OVERVIEW_COUNT:
      return {
        ...state,
        proposal_overview: action.payload
      };
    default:
      return state;
  }
}
