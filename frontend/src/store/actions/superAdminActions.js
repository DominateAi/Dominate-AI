import axios from "axios";
import { url } from "./config";
import {
  SET_SUPERADMIN_ORGANIZATIONS,
  SET_PERTICULAR_WORKSPACE_INFO,
  SET_ORGANIZATION_OVERVIEW,
  GET_SINGLE_ORGANIZATION_OVERVIEW,
  SET_MANUAL_RETRY_COUNT
} from "./../types";
import Alert from "react-s-alert";

/*=============================================
            Get All Organizations
===============================================*/
export const getAllOraganizations = (pageNo, pageSize) => dispatch => {
  axios
    .get(`${url}/api/organizations?pageNo=${pageNo}&pageSize=${pageSize}`)
    .then(res => {
      dispatch({
        type: SET_SUPERADMIN_ORGANIZATIONS,
        payload: res.data
      });
    })
    .catch(err => console.log(err));
};

/*==============================================
        Get Organizations By Id
===============================================*/
export const getOrganizationUsers = organizationId => dispatch => {
  axios
    .get(`${url}/api/organization/${organizationId}/users`)
    .then(res => {
      dispatch({
        type: SET_PERTICULAR_WORKSPACE_INFO,
        payload: res.data
      });
    })
    .catch(err => console.log(err));
};

/*==============================================
      Get  Organization Overview
===============================================*/
export const getOragnizationOverview = () => dispatch => {
  axios
    .get(`${url}/api/organizations/overview`)
    .then(res =>
      dispatch({
        type: SET_ORGANIZATION_OVERVIEW,
        payload: res.data
      })
    )
    .catch(err => console.log(err));
};

/*===============================================
        filter all organization by level
================================================*/
export const filterAllOrganizationByLevel = formData => dispatch => {
  axios
    .post(`${url}/api/organizations/search`, formData)
    .then(res => {
      dispatch({
        type: SET_SUPERADMIN_ORGANIZATIONS,
        payload: res.data
      });
    })
    .catch(err => console.log(err));
};

/*====================================================================
                      Single Organization Section
======================================================================*/
/*=============================================
      Get Single Organization Overview
===============================================*/
export const singleOrganizationOverview = organizationId => dispatch => {
  axios
    .get(`${url}/api/organization/${organizationId}/users/overview`)
    .then(res => {
      dispatch({
        type: GET_SINGLE_ORGANIZATION_OVERVIEW,
        payload: res.data
      });
    })
    .catch(err => console.log(err));
};

/*==============================================
      Filter Single Organization By Level
================================================*/
export const filterSingleOrganizationByLevel = (
  organizationId,
  levelName
) => dispatch => {
  axios
    .get(
      `${url}/api/organization/${organizationId}/users?userStatus=${levelName}`
    )
    .then(res => {
      dispatch({
        type: SET_PERTICULAR_WORKSPACE_INFO,
        payload: res.data
      });
    })
    .catch(err => console.log(err));
};

/*==========================================================
            Refund subscription of user
===========================================================*/

export const refundSubscriptionAmount = (
  organizationId,
  callBackRefundSubscription,
  pageNo,
  pageSize,
  formData
) => dispatch => {
  axios
    .post(`${url}/api/organizations/approve/refund/${organizationId}`, formData)
    .then(res => {
      callBackRefundSubscription();
      dispatch(getAllOraganizations(pageNo, pageSize));
      Alert.success(`<h4>Refund Proceed</h4>`, {
        position: "top-right",
        effect: "slide",
        beep: false,
        html: true,
        timeout: 5000
        // offset: 100
      });
    })
    .catch(err => console.log(err));
};

/*================================================
          Get Manual retry Requests 
=================================================*/
export const getManualRetryRequest = (pageNo, pageSize) => dispatch => {
  axios
    .get(
      `${url}/api/organizations/manual/retry?pageNo=${pageNo}&pageSize=${pageSize}`
    )
    .then(res => {
      dispatch({
        type: SET_SUPERADMIN_ORGANIZATIONS,
        payload: res.data
      });
    })
    .catch(err => console.log(err));
};

/*===============================================
    Update manuel reuest froom superadmin
=================================================*/
export const updateManualRetryRequest = (
  formData,
  alertText,
  pageNo,
  pageSize
) => dispatch => {
  axios
    .put(`${url}/api/organizations/manual/retry`, formData)
    .then(res => {
      dispatch(getManualRetryRequest(pageNo, pageSize));
      Alert.success(`<h4>${alertText}</h4>`, {
        position: "top-right",
        effect: "slide",
        beep: false,
        html: true,
        timeout: 5000
        // offset: 100
      });
    })
    .catch(err => console.log(err));
};

export const getManualRetryCount = () => dispatch => {
  axios
    .get(`${url}/api/organizations/manual/retry/count`)
    .then(res => {
      dispatch({
        type: SET_MANUAL_RETRY_COUNT,
        payload: res.data
      });
    })
    .catch(err => console.log(err));
};
