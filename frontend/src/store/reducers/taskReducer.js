import { SET_ALL_TASKS } from "./../types";

const initialState = {
  tasks: {}
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_ALL_TASKS:
      return {
        ...state,
        tasks: action.payload
      };
    default:
      return state;
  }
}
