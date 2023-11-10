import { SET_PROPOSAL_INITIAL_DATA, CLEAR_PROPOSAL_INITIAL_DATA } from "../types";

const initialState = {
    proposalTitle:"",
    leadInformation:{},
    isDataSet:false
}

export default function( state = initialState, action ){
    switch( action.type ){
        case SET_PROPOSAL_INITIAL_DATA:
            return {
                ...state,
                proposalTitle : action.payload.proposalTitle,
                leadInformation : action.payload.selectedLeadData,
                isDataSet:true
            }
        case CLEAR_PROPOSAL_INITIAL_DATA:
            return {
                ...state,
                proposalTitle : "",
                leadInformation : {},
                isDataSet:false
            }
        default : 
            return state
    }
}