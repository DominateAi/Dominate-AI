import axios from "axios";
import Alert from "react-s-alert";
import ReactDOM from "react-dom";

import { workspaceId } from "./config";
import { url } from "./config";
import { SET_PROPOSAL_OVERVIEW_COUNT } from "./../../components/desktop/ProposalEditor/store/types";
import { READ_ALL_PROPOSAL } from "./../../components/desktop/ProposalEditor/store/types";
import {
  SET_PROPOSAL_BY_CRAFT_OVERVIEW_COUNT,
  GET_ALL_PROPOSALS_BY_CRAFT_LIST,
  CLEAR_LOADER,
} from "./../../store/types";

/*==========================================
            Quotation Overview
============================================*/
export const getProposalsOverview = () => (dispatch) => {
  axios
    .get(`${url}/api/presentations/overview`)
    .then((res) => {
      // console.log(res.data);
      dispatch({
        type: SET_PROPOSAL_OVERVIEW_COUNT,
        payload: res.data,
      });
    })
    .catch((err) => console.log(err));
};

/*============================================
            Filter Proposals
=============================================*/

export const filterProposalsByLevel = (formData) => (dispatch) => {
  axios
    .post(`${url}/api/presentations/search`, formData)
    .then((res) => {
      dispatch({
        type: READ_ALL_PROPOSAL,
        payload: res.data,
      });
    })
    .catch((err) => console.log(err));
};

/*========================================================================================================
                                            PROPOSALS BY CRAFTJS
=========================================================================================================*/

/*==========================================
            Quotation Overview
============================================*/
export const getProposalsByCraftjsOverview = () => (dispatch) => {
  axios
    .get(`${url}/api/proposals/overview`)
    .then((res) => {
      dispatch({
        type: SET_PROPOSAL_BY_CRAFT_OVERVIEW_COUNT,
        payload: res.data,
      });
    })
    .catch((err) => console.log(err));
};

/***************************************
 * @DESC - CREATE NEW PROPOSAL
 **************************************/
export const createProposalByCraftjs =
  (formData, history) => async (dispatch) => {
    try {
      let { data } = await axios.post(`${url}/api/proposals`, formData, {
        "Content-Type": "application/json",
      });
      if (data) {
        Alert.success(`<h4>Proposal sent</h4>`, {
          position: "top-right",
          effect: "slide",
          beep: false,
          html: true,
          timeout: 5000,
          // offset: 100
        });
        dispatch({
          type: CLEAR_LOADER,
        });
        history.push("/proposals-by-craft");
      }
    } catch (err) {
      console.log(err);
    }
  };

export const saveDraftProposalByCraftjs =
  (formData, history) => async (dispatch) => {
    try {
      let { data } = await axios.post(`${url}/api/proposals`, formData, {
        "Content-Type": "application/json",
      });
      if (data) {
        Alert.success(`<h4>Proposal Saved</h4>`, {
          position: "top-right",
          effect: "slide",
          beep: false,
          html: true,
          timeout: 5000,
          // offset: 100
        });
        history.push("/proposals-by-craft");
      }
    } catch (err) {
      console.log(err);
    }
  };

// /**************************************
//  * @DESC - READ ALL PROPOSALS
//  *************************************/
export const getAllProposalsByCraftjsList = () => async (dispatch) => {
  try {
    let { data } = await axios.get(
      `${url}/api/proposals?pageNo=1&pageSize=100&sortBy=asda"`
    );
    if (data) {
      dispatch({
        type: GET_ALL_PROPOSALS_BY_CRAFT_LIST,
        payload: data,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

// /***************************************
//  * @DESC - READ SELECTED PROPOSAL
//  ***************************************/
export const getSingleProposalByCraftjsData = (id) => async (dispatch) => {
  try {
    let { data } = await axios.get(`${url}/api/proposals/${id}`);
    if (data) {
      console.log(data);
      // dispatch({
      //   type: READ_PROPOSAL,
      //   payload: data,
      // });
    }
  } catch (err) {
    console.log(err);
  }
};

// /***************************************
//  * @DESC - DELETE PROPOSAL
//  ***************************************/
export const deleteProposalByCraftjs =
  (id, callBackDelete) => async (dispatch) => {
    try {
      let data = await axios.delete(`${url}/api/proposals/${id}`);
      if (data) {
        dispatch(getProposalsByCraftjsOverview());
        dispatch(getAllProposalsByCraftjsList());
        callBackDelete();
        Alert.success(`<h4>Proposal Deleted</h4>`, {
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

// /*******************************************
//  * @DESC - UPDATE PROPOSAL
//  ******************************************/
export const updateProposalByCraftjs =
  (formData, id, history) => async (dispatch) => {
    try {
      let { data } = await axios.put(`${url}/api/proposals/${id}`, formData);
      if (data) {
        Alert.success(`<h4>Proposal Updated</h4>`, {
          position: "top-right",
          effect: "slide",
          beep: false,
          html: true,
          timeout: 5000,
          // offset: 100
        });
        history.push("/proposals-by-craft");
      }
    } catch (err) {
      console.log(err);
    }
  };

/*============================================
     Filter Proposals By Craftjs
=============================================*/

export const filterProposalsByLevelCraftjs = (formData) => (dispatch) => {
  axios
    .post(`${url}/api/proposals/search`, formData)
    .then((res) => {
      dispatch({
        type: GET_ALL_PROPOSALS_BY_CRAFT_LIST,
        payload: res.data,
      });
    })
    .catch((err) => console.log(err));
};
