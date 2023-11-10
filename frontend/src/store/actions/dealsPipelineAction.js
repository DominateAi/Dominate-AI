import axios from "axios";
import { url } from "./config";
import {
  SET_ALL_DEALS_IN_PIPELINE,
  SET_STACK_OF_PERTICULAR_PIPELINE,
  SET_CLOSED_STACK_OF_PERTICULAR_PIPELINE,
} from "./../types";
import Alert from "react-s-alert";
import { workspaceId } from "./config";
import { createFieldValue } from "./commandCenter";
import isEmpty from "../validations/is-empty";

/*=============================================================================================
                                      Pipeline Actions
===============================================================================================*/

/*==========================================================
                Create Pipeline Action 
===========================================================*/

export const createPipeline =
  (formData, callBackCreatePipeline, history) => async (dispatch) => {
    const headers = {
      "Content-Type": "application/json",
      workspaceId: workspaceId,
    };
    try {
      let { data, status } = await axios.post(
        `${url}/api/pipelines`,
        formData,
        {
          headers: headers,
        }
      );
      if (data) {
        localStorage.setItem("pipelineData", JSON.stringify(data));
        Alert.success(`<h4>Pipeline Created</h4>`, {
          position: "top-right",
          effect: "slide",
          beep: false,
          html: true,
          timeout: 5000,
          // offset: 100
        });
        callBackCreatePipeline(status);
        dispatch(getAllPipeline());
        const formData = {
          name: "CLOSED",
          pipeline: data._id,
          cards: [],
          type: "CLOSED",
          additionalInfo: {},
        };
        dispatch(createStack(formData));

        history.push({
          pathname: "/deal-pipelines-detail",

          state: { detail: data },
        });

        //   console.log(data);
      }
    } catch (err) {
      console.log(err);
    }
  };

/*==========================================================
                Create Pipeline Action 
===========================================================*/

export const deletePipelineById =
  (pipelineId, callBackDelete) => async (dispatch) => {
    const headers = {
      "Content-Type": "application/json",
      workspaceId: workspaceId,
    };
    try {
      let { data } = await axios.delete(`${url}/api/pipelines/${pipelineId}`, {
        headers: headers,
      });
      if (data) {
        Alert.success(`<h4>Pipeline deleted</h4>`, {
          position: "top-right",
          effect: "slide",
          beep: false,
          html: true,
          timeout: 5000,
          // offset: 100
        });
        dispatch(getAllPipeline());
        callBackDelete();
      }
    } catch (err) {
      console.log(err);
    }
  };

/*==========================================================
                Get All Pipeline
===========================================================*/

export const getAllPipeline = () => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data } = await axios.get(
      `${url}/api/pipelines?pageNo=1&pageSize=10`,
      {
        headers: headers,
      }
    );
    if (data) {
      dispatch({
        type: SET_ALL_DEALS_IN_PIPELINE,
        payload: data,
      });
      // console.log(data);
    }
  } catch (err) {
    console.log(err);
  }
};

/*==========================================================
             Pipeline Search
===========================================================*/

export const seachPipelineAction = (formData) => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data } = await axios.post(`${url}/api/pipelines/search`, formData, {
      headers: headers,
    });
    if (data) {
      dispatch({
        type: SET_ALL_DEALS_IN_PIPELINE,
        payload: data,
      });
      // console.log(data);
    }
  } catch (err) {
    console.log(err);
  }
};

/*==========================================================
             Update Pipline By Id
===========================================================*/

export const updatePipelineById =
  (pipelineId, formData, callBackUpdate) => async (dispatch) => {
    const headers = {
      "Content-Type": "application/json",
      workspaceId: workspaceId,
    };
    try {
      let { data } = await axios.put(
        `${url}/api/pipelines/${pipelineId}`,
        formData,
        {
          headers: headers,
        }
      );
      if (data) {
        Alert.success(`<h4>Pipeline Updated</h4>`, {
          position: "top-right",
          effect: "slide",
          beep: false,
          html: true,
          timeout: 5000,
          // offset: 100
        });
        dispatch(getAllPipeline());
        callBackUpdate();
      }
    } catch (err) {
      console.log(err);
    }
  };

/*==========================================================================================
                            Pipeline Details Action (KANBAN ACTION)
============================================================================================

/*===============================================
                Create Stack
=================================================*/
export const createStack =
  (formData, callBackCreateStack) => async (dispatch) => {
    const headers = {
      "Content-Type": "application/json",
      workspaceId: workspaceId,
    };
    try {
      let { data, status } = await axios.post(
        `${url}/api/pipelineLists`,
        formData,
        {
          headers: headers,
        }
      );
      if (data) {
        // console.log(data);

        var pipelineData = JSON.parse(localStorage.getItem("pipelineData"));
        const formData = {
          // pageNo: 1,
          // pageSize: 10,
          query: {
            pipeline: pipelineData._id,
          },
        };
        dispatch(getStackOfPerticularPipeline(formData));
        callBackCreateStack(status);
        Alert.success(`<h4>Stack Created</h4>`, {
          position: "top-right",
          effect: "slide",
          beep: false,
          html: true,
          timeout: 5000,
          // offset: 100
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

/*===============================================
        Get Stack Of perticular Pipeline
=================================================*/
export const getStackOfPerticularPipeline = (formData) => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data } = await axios.post(
      `${url}/api/pipelineLists/search`,
      formData,
      {
        headers: headers,
      }
    );
    if (data) {
      let otherTypeDeals = data.filter((deal) => deal.type === "OTHER");
      let closedTypeDeals = data.filter((deal) => deal.type === "CLOSED");
      dispatch({
        type: SET_STACK_OF_PERTICULAR_PIPELINE,
        payload: otherTypeDeals,
      });
      dispatch({
        type: SET_CLOSED_STACK_OF_PERTICULAR_PIPELINE,
        payload: closedTypeDeals,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

/*=============================================
          Update Stack By Id
==============================================*/
export const updateStackById = (stackId, formData) => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data } = await axios.put(
      `${url}/api/pipelineLists/${stackId}`,
      formData,
      {
        headers: headers,
      }
    );
    if (data) {
      // Alert.success(`<h4>Deal Updated</h4>`, {
      //   position: "top-right",
      //   effect: "slide",
      //   beep: false,
      //   html: true,
      //   timeout: 5000,
      //   // offset: 100
      // });
      var pipelineData = JSON.parse(localStorage.getItem("pipelineData"));
      const formData = {
        // pageNo: 1,
        // pageSize: 10,
        query: {
          pipeline: pipelineData._id,
        },
      };
      dispatch(getStackOfPerticularPipeline(formData));
      // console.log(data);
    }
  } catch (err) {
    console.log(err);
  }
};

/*==========================================================================================
                                  deals action 
============================================================================================

/*=================================================
          Create Deals in Pipeline
===================================================*/

export const createDealsInPipeline =
  (
    formData,
    stackData,
    dealCustomFields,
    customTextboxfieldData,
    customeDropdownFieldData,
    callBackAddDeal
  ) =>
  async (dispatch) => {
    const headers = {
      "Content-Type": "application/json",
      workspaceId: workspaceId,
    };
    try {
      let { data, status } = await axios.post(`${url}/api/deals`, formData, {
        headers: headers,
      });
      if (data) {
        Alert.success(`<h4>Deal Created</h4>`, {
          position: "top-right",
          effect: "slide",
          beep: false,
          html: true,
          timeout: 5000,
          // offset: 100
        });
        callBackAddDeal(status, data);
        let stackAllData = stackData;
        stackAllData.cards.push({ _id: data._id });
        dispatch(updateStackById(stackAllData._id, stackAllData));
        //ADDING FIELD VALUE FOR CUSTOM FIELDS
        if (!isEmpty(dealCustomFields)) {
          dealCustomFields.forEach((element) => {
            if (element.type === "TEXTBOX") {
              element.name = element.name.split(" ").join("");
              const sendData = {
                field: element._id,
                entity_Id: data._id,
                value: customTextboxfieldData[element.name],
              };
              // console.log(sendData);

              dispatch(createFieldValue(sendData));
            } else if (element.type === "DROPDOWN") {
              element.name = element.name.split(" ").join("");
              const sendData = {
                field: element._id,
                entity_Id: data._id,
                value: isEmpty(customeDropdownFieldData)
                  ? ""
                  : customeDropdownFieldData[element.name].value,
              };
              // console.log(sendData);
              dispatch(createFieldValue(sendData));
            }
          });
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

/*===================================================
           Update Deal In pipeline
======================================================*/
export const closeDealInPipeline =
  (dealId, formData, callBackClosedDeal) => async (dispatch) => {
    const headers = {
      "Content-Type": "application/json",
      workspaceId: workspaceId,
    };
    try {
      let { data, status } = await axios.put(
        `${url}/api/deals/${dealId}`,
        formData,
        {
          headers: headers,
        }
      );
      if (data) {
        Alert.success(`<h4>Deal Closed</h4>`, {
          position: "top-right",
          effect: "slide",
          beep: false,
          html: true,
          timeout: 5000,
          // offset: 100
        });
        callBackClosedDeal(status, data);
        // callBackAddDeal(status);
        // let stackAllData = stackData;
        // stackAllData.cards.push(data);
        // dispatch(updateStackById(stackAllData._id, stackAllData));
        const formData = {
          deal: data._id,
          revenueAmount: `${data.value}`,
        };
        dispatch(createRevenueOfDeal(formData));
      }
    } catch (err) {
      console.log(err);
    }
  };

/*==============================================
          Create Revenue of deal
================================================*/
export const createRevenueOfDeal = (formData) => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data, status } = await axios.post(`${url}/api/revenues`, formData, {
      headers: headers,
    });
    if (data) {
      console.log(data);
    }
  } catch (err) {
    console.log(err);
  }
};

/*==================================================
        DEFAULT THREE PIPELINES FUNCTIONALITY
===================================================*/

export const checkClosedPipelineExistOrNot = (formData) => async (dispatch) => {
  try {
    let { data, status } = await axios.post(
      `${url}/api/pipelineLists/search`,
      formData
    );
    if (data) {
      console.log(data);
      if (!isEmpty(data)) {
      } else if (data.length === 0) {
        var pipelineData = JSON.parse(localStorage.getItem("pipelineData"));
        const createClosedList = {
          name: "CLOSED",
          pipeline: pipelineData._id,
          cards: [],
          type: "CLOSED",
          additionalInfo: {},
        };
        dispatch(createDefaultClosedStack(createClosedList));
      }
    }
  } catch (err) {
    console.log(err);
  }
};

export const createDefaultClosedStack = (formData) => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data, status } = await axios.post(
      `${url}/api/pipelineLists`,
      formData,
      {
        headers: headers,
      }
    );
    if (data) {
      // console.log(data);

      var pipelineData = JSON.parse(localStorage.getItem("pipelineData"));
      const formData = {
        // pageNo: 1,
        // pageSize: 10,
        query: {
          pipeline: pipelineData._id,
        },
      };
      dispatch(getStackOfPerticularPipeline(formData));
    }
  } catch (err) {
    console.log(err);
  }
};
