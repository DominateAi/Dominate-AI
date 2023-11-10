import { combineReducers } from "redux";
import importLeadReducer from './importLeadReducer';

export default combineReducers({
    import_lead:importLeadReducer
});