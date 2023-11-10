import { combineReducers } from "redux";
import proposalReducer from "./proposalReducer";
import prposalDataReducer from "./proposalDataReducer";
import autoSavePresentation from "./autoSavePresentation";

export default combineReducers({
  createProposal: proposalReducer,
  proposalData: prposalDataReducer,
  autoSaveData: autoSavePresentation,
});
