import axios from "axios";
import { url } from "./config";
import {
  SET_ALL_LEADS_PIPELINE,
  SET_LEADS_PIPELINE_STAGES,
  SET_ALL_LEADS_OF_PIPELINE,
  SET_ERRORS,
  GET_CURRENT_LEAD_ADDED_DATA,
  SET_PIPELINE_FUNNEL_VIEW,
  SET_ALL_LEADS_COUNT_OF_PIPELINE,
  SET_ALL_PIPELINE_LEADS,
  GET_API_STATUS,
  SET_LEAD_ACTIVITY_SUMMARY_INFO,
  SET_OVERALL_PIPE_LEADS,
  SET_ALL_PIPELINE_LEADS_COUNT,
} from "./../types";
import Alert from "react-s-alert";
import isEmpty from "./../validations/is-empty";

/*========================================================================================
                                   PIPELINE SETCION 
=========================================================================================*/

/*=================================================
             CREATE LEADS PIPELINE
===================================================*/
export const createLeadsPipeline =
  (formData, callBackAddPipeline) => async (dispatch) => {
    try {
      let { data, status } = await axios.post(
        `${url}/api/leadPipelines`,
        formData
      );
      if (data) {
        Alert.success(`<h4>Pipeline Created</h4>`, {
          position: "top-right",
          effect: "slide",
          beep: false,
          html: true,
          timeout: 5000,
          // offset: 100
        });
        dispatch(getAllLeadsPipelines());
        dispatch(getLeadsPipelineCountData());
        callBackAddPipeline(status);
      }
    } catch (err) {
      console.log(err);
    }
  };

/*=================================================
             CREATE LEADS PIPELINE
===================================================*/
export const getAllLeadsPipelines = (formData) => async (dispatch) => {
  try {
    let { data, status } = await axios.post(
      `${url}/api/leadPipelines/search`,
      formData
    );
    if (data) {
      dispatch({
        type: SET_ALL_LEADS_PIPELINE,
        payload: data,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

/*=================================================
          GET LEADS PIPELINE COUNT DATA
===================================================*/
export const getLeadsPipelineCountData = () => async (dispatch) => {
  try {
    let { data, status } = await axios.get(
      `${url}/api/leadPipelines/countData`
    );
    if (data) {
      dispatch({
        type: SET_ALL_PIPELINE_LEADS_COUNT,
        payload: data,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

// /*=================================================
//              DELETE PIPELINE HANDLER
// ===================================================*/
// export const deletePipeline = (formData) => async (dispatch) => {
//     try {
//       let { data, status } = await axios.post(
//         `${url}/api/leadPipelines/search`,
//         formData
//       );
//       if (data) {
//         dispatch({
//           type: SET_ALL_LEADS_PIPELINE,
//           payload: data,
//         });
//       }
//     } catch (err) {
//       console.log(err);
//     }
//   };

/*========================================================================================
                                    STAGE SECTION
=========================================================================================*/

/*=================================================
             CREATE LEADS PIPELINE STAGE
===================================================*/
export const createLeadsPipelineStage =
  (formData, callBackAddPipelineStage) => async (dispatch) => {
    try {
      let { data, status } = await axios.post(
        `${url}/api/leadStages`,
        formData
      );
      if (data) {
        Alert.success(`<h4>Pipeline Stage Created</h4>`, {
          position: "top-right",
          effect: "slide",
          beep: false,
          html: true,
          timeout: 5000,
          // offset: 100
        });
        dispatch(
          getAllLeadsPipelineStages({
            query: {
              pipeline: data.pipeline,
            },
          })
        );
        dispatch(getFunnelViewByPipelineId(data.pipeline));

        callBackAddPipelineStage(status);
      }
    } catch (err) {
      console.log(err);
    }
  };

/*=================================================
             GET LEADS PIPELINE STAGE
===================================================*/
export const getAllLeadsPipelineStages = (formData) => async (dispatch) => {
  try {
    let { data, status } = await axios.post(
      `${url}/api/leadStages/search`,
      formData
    );
    if (data) {
      dispatch({
        type: SET_LEADS_PIPELINE_STAGES,
        payload: data,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

/*========================================================================================
                                   LEADS KANBAN SETCION 
=========================================================================================*/

/*=================================================
             CREATE LEADS PIPELINE STAGE
===================================================*/
export const getAllKanbanLeadsOfPipeline = (formData) => async (dispatch) => {
  try {
    let { data, status } = await axios.post(
      `${url}/api/pipeLeads/search`,
      formData
    );
    if (data) {
      dispatch({
        type: SET_ALL_LEADS_OF_PIPELINE,
        payload: data,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

/*=================================================
           UPDATE KANBAN LEAD OF PIPELINE
===================================================*/

export const updateKanBanLeadOfPipelineAction =
  (leadId, formData, userId, filterName) => (dispatch) => {
    axios
      .put(`${url}/api/pipeLeads/${leadId}`, formData)
      .then((res) => {
        Alert.success("<h4>Lead Updated</h4>", {
          position: "top-right",
          effect: "slide",
          beep: false,
          html: true,
          timeout: 5000,
          // offset: 100
        });
        dispatch(
          getAllKanbanLeadsOfPipeline({
            query: {
              isKanban: true,
              isHidden: false,
              status: { $ne: "ARCHIVE" },
              pipeline: res.data.pipeline,
            },
          })
        );
        dispatch(getFunnelViewByPipelineId(res.data.pipeline));
        dispatch(
          getAllLeadsCountOfPipeline({
            query: {
              pipeline: res.data.pipeline,
            },
          })
        );

        if (filterName === "My Leads") {
          const myLeadQuery = {
            // pageNo: 10,
            // pageSize: 0,
            query: {
              assigned: userId,
              pipeline: res.data.pipeline,
            },
          };
          dispatch(getMyLeadsOfPipeline(myLeadQuery));
        } else if (filterName === "All Leads") {
          const allLeadQuery = {
            query: {
              pipeline: res.data.pipeline,
            },
          };
          dispatch(getAllLeadsOfPipeline(allLeadQuery));
        }
      })
      .catch((err) => {
        Alert.error(`<h4>${err}</h4>`, {
          position: "top-right",
          effect: "slide",
          beep: false,
          html: true,
          timeout: 5000,
          // offset: 100
        });
      });
  };

/*=================================================
             DELETE PIPELINE LEAD
===================================================*/

export const deletePipelineLead =
  (leadId, filterName, loginUserId, callBackDelete) => (dispatch) => {
    console.log(loginUserId);
    axios
      .delete(`${url}/api/pipeLeads/${leadId}`)
      .then((res) => {
        Alert.success("<h4>Lead Deleted</h4>", {
          position: "top-right",
          effect: "slide",
          beep: false,
          html: true,
          timeout: 5000,
          // offset: 100
        });

        dispatch(
          getAllKanbanLeadsOfPipeline({
            query: {
              isKanban: true,
              isHidden: false,
              status: { $ne: "ARCHIVE" },
              pipeline: res.data.pipeline,
            },
          })
        );
        dispatch(getFunnelViewByPipelineId(res.data.pipeline));
        dispatch(
          getAllLeadsCountOfPipeline({
            query: {
              pipeline: res.data.pipeline,
            },
          })
        );
        if (filterName === "My Leads") {
          const myLeadQuery = {
            // pageNo: 10,
            // pageSize: 0,
            query: {
              assigned: loginUserId,
              pipeline: res.data.pipeline,
            },
          };
          dispatch(getMyLeadsOfPipeline(myLeadQuery));
        } else if (filterName === "All Leads") {
          const allLeadQuery = {
            query: {
              pipeline: res.data.pipeline,
            },
          };
          dispatch(getAllLeadsOfPipeline(allLeadQuery));
        }
        callBackDelete();
      })
      .catch((err) => console.log(err));
  };

/*===================================
          ADD PIPELINE LEADS API
=====================================*/
export const addpipelineLeadsAction =
  (formData, filterName, userId, callBackAddLead) => (dispatch) => {
    axios
      .post(`${url}/api/pipeLeads`, formData)
      .then((res) => {
        Alert.success("<h4>Lead Added</h4>", {
          position: "top-right",
          effect: "slide",
          beep: false,
          html: true,
          timeout: 5000,
          // offset: 100
        });
        dispatch({
          type: GET_CURRENT_LEAD_ADDED_DATA,
          payload: res.data,
        });
        callBackAddLead(res.status);
        dispatch(
          getAllKanbanLeadsOfPipeline({
            query: {
              isKanban: true,
              isHidden: false,
              status: { $ne: "ARCHIVE" },
              pipeline: res.data.pipeline,
            },
          })
        );
        dispatch(getFunnelViewByPipelineId(res.data.pipeline));
        dispatch(
          getAllLeadsCountOfPipeline({
            query: {
              pipeline: res.data.pipeline,
            },
          })
        );

        if (filterName === "My Leads") {
          const myLeadQuery = {
            // pageNo: 10,
            // pageSize: 0,
            query: {
              assigned: userId,
              pipeline: res.data.pipeline,
            },
          };
          dispatch(getMyLeadsOfPipeline(myLeadQuery));
        } else if (filterName === "All Leads") {
          const allLeadQuery = {
            query: {
              pipeline: res.data.pipeline,
            },
          };
          dispatch(getAllLeadsOfPipeline(allLeadQuery));
        }
      })
      .catch((err) => {
        dispatch({
          type: SET_ERRORS,
          payload: err,
        });
      });
  };

/*=====================================
    Update Lead api
======================================*/
export const updateLeadAction =
  (leadId, formData, userId, filterName, callBackHandleSave) => (dispatch) => {
    axios
      .put(`${url}/api/pipeLeads/${leadId}`, formData)
      .then((res) => {
        dispatch({
          type: GET_API_STATUS,
          payload: res.status,
        });
        if (callBackHandleSave) {
          callBackHandleSave(res.status);
        }
        dispatch(getLeadById(leadId));
        Alert.success("<h4>Lead Updated</h4>", {
          position: "top-right",
          effect: "slide",
          beep: false,
          html: true,
          timeout: 5000,
          // offset: 100
        });
        if (filterName === "My Leads") {
          const myLeadQuery = {
            // pageNo: 10,
            // pageSize: 0,
            query: {
              assigned: userId,
              pipeline: res.data.pipeline,
            },
          };
          dispatch(getMyLeadsOfPipeline(myLeadQuery));
        } else if (filterName === "All Leads") {
          const allLeadQuery = {
            query: {
              pipeline: res.data.pipeline,
            },
          };
          dispatch(getAllLeadsOfPipeline(allLeadQuery));
        }
      })
      .catch((err) => {
        Alert.error(`<h4>${err}</h4>`, {
          position: "top-right",
          effect: "slide",
          beep: false,
          html: true,
          timeout: 5000,
          // offset: 100
        });
      });
  };

/*========================================================================================
                               PIPELINE LEADS LIST VIEW SECTION
=========================================================================================*/

/*======================================
        GET MY PIPELINE LEADS
=======================================*/
export const getMyLeadsOfPipeline = (formData) => (dispatch) => {
  axios
    .post(`${url}/api/pipeLeads/search`, formData)
    .then((res) => {
      dispatch({
        type: SET_ALL_PIPELINE_LEADS,
        payload: res.data,
      });
    })
    .catch((err) => console.log(err));
};

/*=====================================
  Get All Leads List View Except hidden 
=======================================*/
export const getAllLeadsOfPipeline = (formData) => (dispatch) => {
  axios
    .post(`${url}/api/pipeLeads/search`, formData)
    .then((res) => {
      dispatch({
        type: SET_ALL_PIPELINE_LEADS,
        payload: res.data,
      });
    })
    .catch((err) => console.log(err));
};

/*===============================================
    PIPELINE LEADS FILTER BY STAGE AND ASSIGN    
================================================*/

export const leadsFilterByStatus = (filterName) => (dispatch) => {
  axios
    .post(`${url}/api/pipeLeads/search`, filterName)
    .then((res) =>
      dispatch({
        type: SET_ALL_PIPELINE_LEADS,
        payload: res.data,
      })
    )
    .catch((err) => console.log(err));
};

/*======================================
          Get Lead By Id
========================================*/
export const getLeadById = (leadId) => (dispatch) => {
  axios
    .get(`${url}/api/pipeLeads/${leadId}`)
    .then((res) => {
      dispatch({ type: SET_LEAD_ACTIVITY_SUMMARY_INFO, payload: res.data });
    })
    .catch((err) => console.log(err));
};

/*======================================
   GET ALL LEADS OF ALL PIPELINE
=======================================*/
export const getOverallPipeleads = (formData) => (dispatch) => {
  axios
    .post(`${url}/api/pipeLeads/search`, formData)
    .then((res) => {
      dispatch({
        type: SET_OVERALL_PIPE_LEADS,
        payload: res.data,
      });
    })
    .catch((err) => console.log(err));
};

/*========================================================================================
                                 FUNNEL VIEW SETCION
=========================================================================================*/

/*=================================================
             CREATE LEADS PIPELINE
===================================================*/
export const getFunnelViewByPipelineId = (pipelineId) => async (dispatch) => {
  try {
    let { data, status } = await axios.get(
      `${url}/api/leadPipelines/funnel/${pipelineId}`
    );
    if (data) {
      dispatch({
        type: SET_PIPELINE_FUNNEL_VIEW,
        payload: data,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

/*=================================================
            GET ALL PIPELINE LEADS COUNT
===================================================*/
export const getAllLeadsCountOfPipeline = (formData) => async (dispatch) => {
  try {
    let { data, status } = await axios.post(
      `${url}/api/pipeLeads/search`,
      formData
    );
    if (data) {
      dispatch({
        type: SET_ALL_LEADS_COUNT_OF_PIPELINE,
        payload: data.length,
      });
    }
  } catch (err) {
    console.log(err);
  }
};
