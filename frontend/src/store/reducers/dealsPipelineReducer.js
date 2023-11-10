import {
  SET_ALL_DEALS_IN_PIPELINE,
  SET_STACK_OF_PERTICULAR_PIPELINE,
  SET_CLOSED_STACK_OF_PERTICULAR_PIPELINE,
} from "./../types";
import isEmpty from "./../validations/is-empty";

const initialState = {
  getAllPipelines: [],
  getAllStackOfPipeline: [],
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_ALL_DEALS_IN_PIPELINE:
      return {
        ...state,
        getAllPipelines: action.payload,
      };
    case SET_STACK_OF_PERTICULAR_PIPELINE:
      return {
        ...state,
        getAllStackOfPipeline: action.payload,
      };
    case SET_CLOSED_STACK_OF_PERTICULAR_PIPELINE:
      return {
        ...state,
        getClosedStackOfPipeline: action.payload,
      };
    default:
      return state;
  }
}
