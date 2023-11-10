import axios from "axios";
import Alert from "react-s-alert";
import { url } from "./config";
import {
  GET_API_STATUS,
  SET_ALL_QUOTATIONS,
  SET_QUOTATION_OVERVIEW,
  SET_CLICK_ON_QUOTATION,
} from "./../types";

/*=======================================
        Add quotaion action
=========================================*/
export const addQuotationAction =
  (formData, alertText, closeDraftModel) => (dispatch) => {
    axios
      .post(`${url}/api/quotations`, formData)
      .then((res) => {
        Alert.success(`<h4>${alertText}</h4>`, {
          position: "top-right",
          effect: "slide",
          beep: false,
          html: true,
          timeout: 5000,
          // offset: 100
        });
        closeDraftModel(res.status);
        dispatch(getAllQuotation());
        dispatch(getQuotationOverview());
      })
      .catch((err) => console.log(err));
  };

/*=======================================
        Update quotaion By Id
=========================================*/
export const updateQuotationById =
  (quotationId, formData, alertText, closeDraftModel) => (dispatch) => {
    axios
      .put(`${url}/api/quotations/${quotationId}`, formData)
      .then((res) => {
        Alert.success(`<h4>${alertText}</h4>`, {
          position: "top-right",
          effect: "slide",
          beep: false,
          html: true,
          timeout: 5000,
          // offset: 100
        });
        closeDraftModel(res.status);
        dispatch(getAllQuotation());
        dispatch(getQuotationOverview());
      })
      .catch((err) => console.log(err));
  };

/*=========================================
          Get All Quotation
==========================================*/

export const getAllQuotation = (formData) => (dispatch) => {
  axios
    .post(`${url}/api/quotations/search`, formData)
    .then((res) => {
      dispatch({
        type: SET_ALL_QUOTATIONS,
        payload: res.data,
      });
    })
    .catch((err) => console.log(err));
};

/*==========================================
            Quotation Overview
============================================*/
export const getQuotationOverview = () => (dispatch) => {
  axios
    .get(`${url}/api/quotations/overview`)
    .then((res) =>
      dispatch({
        type: SET_QUOTATION_OVERVIEW,
        payload: res.data,
      })
    )
    .catch((err) => console.log(err));
};

/*============================================
            Filter Quotation
=============================================*/

export const filterQuotationByLevel = (formData) => (dispatch) => {
  axios
    .post(`${url}/api/quotations/search`, formData)
    .then((res) => {
      dispatch({
        type: SET_ALL_QUOTATIONS,
        payload: res.data,
      });
    })
    .catch((err) => console.log(err));
};

/*===========================================
            Search Quotation
=============================================*/
export const searchQuotation = (searchName) => (dispatch) => {
  axios
    .get(`${url}/api/quotations/search/text?text=${searchName}`)
    .then((res) => console.log(res.data))
    .catch((err) => console.log(err));
};

/*===========================================
            Delete Quotation
=============================================*/
export const deleteQuotation = (quotationId, callBackDelete) => (dispatch) => {
  axios
    .delete(`${url}/api/quotations/${quotationId}`)
    .then((res) => {
      dispatch(getAllQuotation());
      dispatch(getQuotationOverview());
      callBackDelete();
      Alert.success("<h4>Estimate Deleted</h4>", {
        position: "top-right",
        effect: "slide",
        beep: false,
        html: true,
        timeout: 5000,
        // offset: 100
      });
    })
    .catch((err) => console.log(err));
};

/*==========================================
            Quotation Overview
============================================*/
export const getQuotationById = (quotationId) => (dispatch) => {
  axios
    .get(`${url}/api/quotations/${quotationId}`)
    .then((res) =>
      dispatch({
        type: SET_CLICK_ON_QUOTATION,
        payload: res.data,
      })
    )
    .catch((err) => console.log(err));
};

/*======================================
        Quotation logo upload
=======================================*/
export const uploadQuotationLogo =
  (formData, callBackUploadLogo) => (dispatch) => {
    const headers = {
      "Content-Type": "multipart/form-data",
    };
    axios
      .post(`${url}/api/upload`, formData, { headers: headers })
      .then((res) => {
        callBackUploadLogo(res.data);
      })
      .catch((err) => console.log(err));
  };

/*======================================
        Quotation pdf upload
=======================================*/
export const uploadQuotationPdf =
  (formData, callBackQuotationpdf, status) => (dispatch) => {
    const headers = {
      "Content-Type": "multipart/form-data",
    };
    axios
      .post(`${url}/api/upload`, formData, { headers: headers })
      .then((res) => {
        callBackQuotationpdf(res.data, status);
      })
      .catch((err) => console.log(err));
  };
