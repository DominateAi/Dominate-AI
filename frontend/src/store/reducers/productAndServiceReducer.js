import { SET_PRODUCT_AND_SERVICES } from "./../types";

const initialState = {
  allProductAndServices: [],
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_PRODUCT_AND_SERVICES:
      return {
        ...state,
        allProductAndServices: action.payload,
      };
    default:
      return state;
  }
}
