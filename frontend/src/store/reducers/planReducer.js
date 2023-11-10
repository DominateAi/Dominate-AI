import { GET_PLANS } from "./../types";

const initialState = {
  plans: {}
};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_PLANS:
      return {
        ...state,
        plans: action.payload
      };
    default:
      return state;
  }
}
