import {
  SET_ALL_LEADS_PIPELINE,
  SET_LEADS_PIPELINE_STAGES,
  SET_ALL_LEADS_OF_PIPELINE,
  SET_PIPELINE_FUNNEL_VIEW,
  SET_ALL_LEADS_COUNT_OF_PIPELINE,
  SET_ALL_PIPELINE_LEADS,
  SET_OVERALL_PIPE_LEADS,
  SET_ALL_PIPELINE_LEADS_COUNT,
} from "./../types";

const initialState = {
  allLeadsPipeline: [],
  allPipelineStages: [],
  allKanbanLeadsOfPipeline: [],
  pipelineFunnelView: [],
  allLeadsPipelineCount: [],
  allLeadsOfPipeline: [],
  allLeadsOfAllPipeline: [],
  allLeadsPipelineLevelCount: [],
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_ALL_LEADS_PIPELINE:
      return {
        ...state,
        allLeadsPipeline: action.payload,
      };
    case SET_LEADS_PIPELINE_STAGES:
      return {
        ...state,
        allPipelineStages: action.payload,
      };
    case SET_ALL_LEADS_OF_PIPELINE:
      return {
        ...state,
        allKanbanLeadsOfPipeline: action.payload,
      };
    case SET_PIPELINE_FUNNEL_VIEW:
      return {
        ...state,
        pipelineFunnelView: action.payload,
      };
    case SET_ALL_LEADS_COUNT_OF_PIPELINE:
      return {
        ...state,
        allLeadsPipelineCount: action.payload,
      };
    case SET_ALL_PIPELINE_LEADS:
      return {
        ...state,
        allLeadsOfPipeline: action.payload,
      };
    case SET_OVERALL_PIPE_LEADS:
      return {
        ...state,
        allLeadsOfAllPipeline: action.payload,
      };
    case SET_ALL_PIPELINE_LEADS_COUNT:
      return {
        ...state,
        allLeadsPipelineLevelCount: action.payload,
      };
    default:
      return state;
  }
}
