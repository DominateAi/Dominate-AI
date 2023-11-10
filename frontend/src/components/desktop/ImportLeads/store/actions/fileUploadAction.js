import axios from "axios";
import { url } from "../../../../../store/actions/config";
import Alert from "react-s-alert";
import { getAllLeads } from "./../../../../../store/actions/leadAction";
import { SET_LOADER, CLEAR_LOADER } from "../../../../../store/types";

export const jsonImport = (formData) => async (dispatch) => {
  try {
    let { data } = await axios.post(`${url}/api/leads/import/json`, formData);
    if (data) {
      window.alert("All leads has been successfully created");
    }
  } catch (err) {
    window.alert("Error while performing operations");
  }
};

/*==============================================
            IMPORT LEADS ACTION
===============================================*/

export const importLeadsFromCsv =
  (formData, callBackLeadsImport) => async (dispatch) => {
    try {
      dispatch({
        type: SET_LOADER,
      });
      let { data } = await axios.post(`${url}/api/leads/importest`, formData);
      if (data) {
        callBackLeadsImport(data);
        const allLeadQuery = {
          // pageNo: 10,
          // pageSize: 0,
          query: {},
        };
        dispatch(getAllLeads(allLeadQuery));
        dispatch({
          type: CLEAR_LOADER,
        });
      }
    } catch (err) {}
  };

/*==============================================
                CHECK FIELDS ACTION
===============================================*/

export const checkFieldsAction =
  (formData, callBackCheckFields) => async (dispatch) => {
    dispatch({
      type: SET_LOADER,
    });
    try {
      let { data } = await axios.post(
        `${url}/api/leads/import/checkfields`,
        formData
      );
      if (data) {
        callBackCheckFields(data);
        dispatch({
          type: CLEAR_LOADER,
        });
        //   console.log(data);
      }
    } catch (err) {}
  };

/*==============================================
        IMPORT LEADS OVERWRITE ACTION
===============================================*/

export const overwriteExistingLeadsAction =
  (formData, callBackImportExistingLeads) => async (dispatch) => {
    try {
      let { data, status } = await axios.post(
        `${url}/api/leads/import/overwrite`,
        formData
      );
      if (data) {
        callBackImportExistingLeads(status);
        const allLeadQuery = {
          // pageNo: 10,
          // pageSize: 0,
          query: {},
        };
        dispatch(getAllLeads(allLeadQuery));
        Alert.success(`<h4>Leads imported successfully</h4>`, {
          position: "top-right",
          effect: "slide",
          beep: false,
          html: true,
          timeout: 5000,
          // offset: 100
        });
      }
    } catch (err) {}
  };

/*==============================================
      IMPORT LEADS NOT OVERWRITE ACTION
===============================================*/

export const notOverwriteExistingLeadsAction =
  (formData, callBackImportExistingLeads) => async (dispatch) => {
    try {
      let { data, status } = await axios.post(
        `${url}/api/leads/import/notoverwrite`,
        formData
      );
      if (data) {
        callBackImportExistingLeads(status);
        const allLeadQuery = {
          // pageNo: 10,
          // pageSize: 0,
          query: {},
        };
        dispatch(getAllLeads(allLeadQuery));
        Alert.success(`<h4>Leads imported successfully</h4>`, {
          position: "top-right",
          effect: "slide",
          beep: false,
          html: true,
          timeout: 5000,
          // offset: 100
        });
      }
    } catch (err) {}
  };

/*===================================================
              IMPORT LEADS TO JSON
=====================================================*/

export const importJsonLeads =
  (formData, callBackImportJson) => async (dispatch) => {
    try {
      dispatch({
        type: SET_LOADER,
      });
      let { data, status } = await axios.post(
        `${url}/api/leads/import/json`,
        formData
      );
      if (data) {
        callBackImportJson(status);
        const allLeadQuery = {
          // pageNo: 10,
          // pageSize: 0,
          query: {},
        };
        dispatch(getAllLeads(allLeadQuery));
        Alert.success(`<h4>Leads imported successfully</h4>`, {
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
      }
    } catch (err) {}
  };
