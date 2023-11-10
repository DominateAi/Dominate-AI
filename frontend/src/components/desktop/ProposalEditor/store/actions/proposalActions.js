import axios from "axios";
import React from "react";
import ReactDOM from "react-dom";
import { READ_ALL_PROPOSAL, READ_PROPOSAL, SET_AUTOSAVE } from "../types";
import {
  ProposalSendAndSaved,
  ErrorWhileSaving,
  ProposalSaved,
} from "../../Component/ReusableComponents/ErrorModals";
import { getProposalsOverview } from "./../../../../../store/actions/proposalAction";
import Alert from "react-s-alert";
import { url } from "./../../../../../store/actions/config";

let workspaceName = window.location.host.split(".")[0];
// let url = `https://${workspaceName}.dominate.ai`;
// if (process.env.NODE_ENV === "development") {
//   url = `https://login.dominate.ai`;
// }

/***************************************
 * @DESC - CREATE NEW PROPOSAL
 **************************************/
export const create_new_propsal = (formData) => async (dispatch) => {
  try {
    let { data } = await axios.post(`${url}/api/presentations`, formData, {
      "Content-Type": "application/json",
    });
    if (data) {
      ReactDOM.render(
        <ProposalSendAndSaved
          callback={() => (window.location.href = "/presentations")}
        />,
        document.getElementById("error_message")
      );
    }
  } catch (err) {
    console.log(err);
    ReactDOM.render(
      <ErrorWhileSaving />,
      document.getElementById("error_message")
    );
  }
};

export const save_new_propsal = (formData) => async (dispatch) => {
  try {
    let { data } = await axios.post(`${url}/api/presentations`, formData, {
      "Content-Type": "application/json",
    });
    if (data) {
      ReactDOM.render(
        <ProposalSaved
          callback={() => (window.location.href = "/presentations")}
        />,
        document.getElementById("error_message")
      );
    }
  } catch (err) {
    console.log(err);
    ReactDOM.render(
      <ErrorWhileSaving />,
      document.getElementById("error_message")
    );
  }
};

/**************************************
 * @DESC - READ ALL PROPOSALS
 *************************************/
export const get_all_proposal_list = () => async (dispatch) => {
  try {
    let { data } = await axios.get(
      `${url}/api/presentations?pageNo=1&pageSize=100&sortBy=asda"`
    );
    if (data) {
      dispatch({
        type: READ_ALL_PROPOSAL,
        payload: data,
      });
    }
  } catch (err) {
    console.log(err);
    ReactDOM.render(
      <ErrorWhileSaving />,
      document.getElementById("error_message")
    );
  }
};

/***************************************
 * @DESC - READ SELECTED PROPOSAL
 ***************************************/
export const get_selected_proposal_data = (id) => async (dispatch) => {
  try {
    let { data } = await axios.get(`${url}/api/presentations/${id}`);
    if (data) {
      dispatch({
        type: READ_PROPOSAL,
        payload: data,
      });
    }
  } catch (err) {
    console.log(err);
    ReactDOM.render(
      <ErrorWhileSaving />,
      document.getElementById("error_message")
    );
  }
};

/***************************************
 * @DESC - DELETE PROPOSAL
 ***************************************/
export const delete_proposal_data =
  (id, alertText, callBackDelete) => async (dispatch) => {
    try {
      let data = await axios.delete(`${url}/api/presentations/${id}`);
      if (data) {
        if (alertText) {
          Alert.success(`<h4>${alertText}</h4>`, {
            position: "top-right",
            effect: "slide",
            beep: false,
            html: true,
            timeout: 5000,
            // offset: 100
          });
        }

        callBackDelete();
        dispatch(get_all_proposal_list());
        dispatch(getProposalsOverview());

        // window.location.reload();
      }
    } catch (err) {
      console.log(err);
      ReactDOM.render(
        <ErrorWhileSaving />,
        document.getElementById("error_message")
      );
    }
  };

/*******************************************
 * @DESC - UPDATE PROPOSAL
 ******************************************/
export const update_proposal = (formData, id) => async (dispatch) => {
  try {
    let { data } = await axios.put(`${url}/api/presentations/${id}`, formData);
    if (data) {
      alert("data updated successfully");
      window.location.href = "/presentations";
    }
  } catch (err) {
    console.log(err);
    ReactDOM.render(
      <ErrorWhileSaving />,
      document.getElementById("error_message")
    );
  }
};

/*==========================================
        Autosaving Proposals
============================================*/

export const autoSavingProposal = (formData, history) => async (dispatch) => {
  try {
    let { data } = await axios.post(`${url}/api/presentations`, formData, {
      "Content-Type": "application/json",
    });
    if (data) {
      history.push(`/proposal-editor/${data._id}`);
      dispatch({
        type: SET_AUTOSAVE,
        payload: true,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

/*==========================================
        Update autosaving
============================================*/
export const updateAutosavingProposal = (formData, id) => async (dispatch) => {
  try {
    let { data } = await axios.put(`${url}/api/presentations/${id}`, formData);
    if (data) {
      dispatch({
        type: SET_AUTOSAVE,
        payload: true,
      });
    }
  } catch (err) {
    ReactDOM.render(
      <ErrorWhileSaving />,
      document.getElementById("error_message")
    );
  }
};
