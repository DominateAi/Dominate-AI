import axios from "axios";
import Alert from "react-s-alert";
import {
  SET_GENERATED_REFERRAL_CODE,
  SET_ALL_REFERRALS_DATA,
  SET_REFERRAL_DATA_OF_LOGEDIN_USER,
} from "./../types";
import { url } from "./config";
import isEmpty from "../validations/is-empty";

/*================================================================================
                                REFERRAL CODE SECTIONS
==================================================================================*/

/*=============================
        CREATE RFERRAL CODE
===============================*/

export const createReferralCode =
  (formData, callBackCreateReferral) => async (dispatch) => {
    try {
      let { data, status } = await axios.post(`${url}/api/refCodes`, formData);
      if (data) {
        Alert.success("<h4>Referral Code Created</h4>", {
          position: "top-right",
          effect: "slide",
          beep: false,
          html: true,
          timeout: 5000,
          // offset: 100
        });

        callBackCreateReferral(status, data);
      }
    } catch (err) {
      console.log(err);
    }
  };

/*=============================
        GET REFERRAL CODE 
===============================*/

export const getReferralCodeAllInfo = (formData) => async (dispatch) => {
  try {
    let { data } = await axios.post(`${url}/api/refCodes/search`, formData);
    if (data) {
      dispatch({
        type: SET_GENERATED_REFERRAL_CODE,
        payload: data,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

/*================================================================================
                                REFERRAL SECTIONS
==================================================================================*/

/*=============================
       CREATE REFERRAL
===============================*/

export const createReferral = (formData) => async (dispatch) => {
  try {
    let { data } = await axios.post(`${url}/public/createReferral`, formData);
    if (data) {
      console.log(data);
      localStorage.removeItem("appliedReferralCode");
    }
  } catch (err) {
    console.log(err);
  }
};

/*=============================
       UPDATE REFERRAL
===============================*/

export const updateReferralOfUser = (formData) => async (dispatch) => {
  try {
    let { data } = await axios.put(
      `${url}/api/referrals/${formData._id}`,
      formData
    );
    if (data) {
      console.log(data);
    }
  } catch (err) {
    console.log(err);
  }
};

/*=============================
       GET ALL REFERRALS
===============================*/

export const getAllReferrals = (formData) => async (dispatch) => {
  try {
    let { data } = await axios.post(`${url}/api/referrals/search`, formData);
    if (data) {
      dispatch({
        type: SET_ALL_REFERRALS_DATA,
        payload: data,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

/*=============================
       GET ALL REFERRALS
===============================*/

export const getReferralCount = (callBackGetCount) => async (dispatch) => {
  try {
    let { data } = await axios.get(`${url}/api/referrals/count`);
    if (data) {
      callBackGetCount(data);
    }
  } catch (err) {
    console.log(err);
  }
};

/*=======================================
          GET REFERRAL INFO OF USER
========================================*/

export const getReferralInfoOfLogedInUser = (formData) => async (dispatch) => {
  try {
    let { data } = await axios.post(`${url}/api/referrals/search`, formData);
    if (data) {
      dispatch({
        type: SET_REFERRAL_DATA_OF_LOGEDIN_USER,
        payload: data,
      });
    }
  } catch (err) {
    console.log(err);
  }
};
