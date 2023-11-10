import axios from "axios";
import { url } from "./config";
import {
  SET_SINGLE_DEAL_DATA,
  SET_DEALS_OVERVIEW,
  SET_DEALS_OF_ACCOUNT,
} from "./../types";
import Alert from "react-s-alert";
import {
  getStackOfPerticularPipeline,
  createRevenueOfDeal,
} from "./../actions/dealsPipelineAction";
import isEmpty from "../validations/is-empty";
import {
  updateFieldValueById,
  createDealAchievementForUser,
} from "./commandCenter";

/*==================================================
                 Create Deals
===================================================*/

export const createDeal =
  (formData, pipelineSelectedOptionDropdown, callBackDealCreated) =>
  async (dispatch) => {
    var userData = JSON.parse(localStorage.getItem("Data"));
    try {
      let { data, status } = await axios.post(`${url}/api/deals`, formData);
      if (data) {
        Alert.success(`<h4>Deal Created</h4>`, {
          position: "top-right",
          effect: "slide",
          beep: false,
          html: true,
          timeout: 5000,
          // offset: 100
        });
        const formData = {
          deal: data._id,
          revenueAmount: `${data.value}`,
        };
        dispatch(createRevenueOfDeal(formData));
        const formAchivementData = {
          user: userData.id,
          deal: data._id,
          value: data.value,
          onDate: new Date().toISOString(),
          type: "CLOSED",
        };
        dispatch(createDealAchievementForUser(formAchivementData));
        if (!isEmpty(pipelineSelectedOptionDropdown)) {
          const formDataCheckClosedList = {
            query: {
              pipeline: pipelineSelectedOptionDropdown.value,
              type: "CLOSED",
            },
          };
          dispatch(
            checkClosedPipelineExistOrNot(formDataCheckClosedList, data._id)
          );
        }

        callBackDealCreated(status);
      }
    } catch (err) {
      console.log(err);
    }
  };

/*==================================================
                Get Deal Overview
===================================================*/

export const getDealsOverview = () => async (dispatch) => {
  try {
    let { data, status } = await axios.get(`${url}/api/deals/widget`);
    if (data) {
      dispatch({
        type: SET_DEALS_OVERVIEW,
        payload: data,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

/*=================================================
            Get Deal By Id
===================================================*/
export const getDealById = (dealId) => async (dispatch) => {
  try {
    let { data, status } = await axios.get(`${url}/api/deals/${dealId}`);
    if (data) {
      dispatch({
        type: SET_SINGLE_DEAL_DATA,
        payload: data,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

/*=================================================
            Update Deal By Id
===================================================*/
export const updateDealById =
  (
    dealId,
    formData,
    customTextboxfieldData,
    customeDropdownFieldData,
    dealsCustomFields,
    callBackUpdateDeal
  ) =>
  async (dispatch) => {
    try {
      let { data, status } = await axios.put(
        `${url}/api/deals/${dealId}`,
        formData
      );
      if (data) {
        Alert.success(`<h4>Deal Updated</h4>`, {
          position: "top-right",
          effect: "slide",
          beep: false,
          html: true,
          timeout: 5000,
          // offset: 100
        });
        callBackUpdateDeal(status);
        dispatch(getDealById(data._id));

        //UPDATING FIELD VALUE FOR CUSTOM FIELDS
        if (!isEmpty(dealsCustomFields)) {
          dealsCustomFields.forEach((element) => {
            if (element.fieldData.type === "TEXTBOX") {
              element.fieldData.name = element.fieldData.name
                .split(" ")
                .join("");
              let sendData = element;
              sendData.value = isEmpty(customTextboxfieldData)
                ? ""
                : customTextboxfieldData[element.fieldData.name];

              dispatch(updateFieldValueById(sendData));
            } else if (element.fieldData.type === "DROPDOWN") {
              element.fieldData.name = element.fieldData.name
                .split(" ")
                .join("");
              let sendData = element;
              sendData.value = isEmpty(customeDropdownFieldData)
                ? ""
                : customeDropdownFieldData[element.fieldData.name].value;

              dispatch(updateFieldValueById(sendData));
            }
          });
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

/*=================================================
            Delete Deal By Id
===================================================*/
export const deleteDealById = (dealId, callBackDelete) => async (dispatch) => {
  try {
    let { data, status } = await axios.delete(`${url}/api/deals/${dealId}`);
    if (data) {
      Alert.success(`<h4>Deal Deleted</h4>`, {
        position: "top-right",
        effect: "slide",
        beep: false,
        html: true,
        timeout: 5000,
        // offset: 100
      });
      //  dispatch(getDealById(data._id))
      callBackDelete();
    }
  } catch (err) {
    console.log(err);
  }
};

/*==================================================
        DEFAULT THREE PIPELINES FUNCTIONALITY
===================================================*/

export const checkClosedPipelineExistOrNot =
  (formData, dealId) => async (dispatch) => {
    try {
      let { data, status } = await axios.post(
        `${url}/api/pipelineLists/search`,
        formData
      );
      if (data) {
        if (!isEmpty(data)) {
          const formData = data[0];

          let cards = formData.cards;
          cards.push(dealId);
          dispatch(updatePipelineListById(formData._id, formData));
        } else {
          const createClosedList = {
            name: "CLOSED",
            pipeline: formData.query.pipeline,
            cards: [dealId],
            type: "CLOSED",
            additionalInfo: {},
          };
          dispatch(createPipelineList(createClosedList));
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

export const createPipelineList = (formData) => async (dispatch) => {
  try {
    let { data, status } = await axios.post(
      `${url}/api/pipelineLists`,
      formData
    );
    if (data) {
    }
  } catch (err) {
    console.log(err);
  }
};

export const updatePipelineListById =
  (pipelineId, formData) => async (dispatch) => {
    try {
      let { data, status } = await axios.put(
        `${url}/api/pipelineLists/${pipelineId}`,
        formData
      );
      if (data) {
      }
    } catch (err) {
      console.log(err);
    }
  };
