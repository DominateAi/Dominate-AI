import axios from "axios";
import {
  GET_CUSTOMERS_OVERVIEW,
  GET_ALL_CUSTOMERS,
  GET_API_STATUS,
  SET_ERRORS,
  SET_CONFETTI_ANIMATION,
} from "./../types";
import Alert from "react-s-alert";

import { url } from "./config";

/*===================================
        GET CUSTOMERS OVERVIEW
=====================================*/

export const getCustomerOverview = () => (dispatch) => {
  axios
    .get(`${url}/api/customers/overview`)
    .then((res) => {
      dispatch({
        type: GET_CUSTOMERS_OVERVIEW,
        payload: res.data,
      });
    })
    .catch((err) => console.log(err));
};

/*====================================
          Add Customer Action
======================================*/

export const addCustomerAction = (formData, filterName) => (dispatch) => {
  console.log(filterName);
  axios
    .post(`${url}/api/customers`, formData)
    .then((res) => {
      dispatch({
        type: GET_API_STATUS,
        payload: res.status,
      });
      Alert.success("<h4>Customer Added</h4>", {
        position: "top-right",
        effect: "slide",
        beep: false,
        html: true,
        timeout: 5000,
        // offset: 100
      });
      if (filterName === "All Customers") {
        // const allCustomerQuery = {
        //   // pageNo: 10,
        //   // pageSize: 0,
        //   query: {}
        // };
        dispatch(getAllCustomers());
        dispatch(getCustomerOverview());
      } else {
        const filterCustomer = {
          query: {
            // pageNo: 10,
            // pageSize: 0,
            status: "ARCHIVE",
          },
        };
        dispatch(filterAllCustomerByLevelAction(filterCustomer));
        dispatch(getCustomerOverview());
      }
    })
    .catch((err) => {
      dispatch({
        type: SET_ERRORS,
        payload: err.response.data,
      });
      Alert.error(`<h4>${err.response.message}</h4>`, {
        position: "top-right",
        effect: "slide",
        beep: false,
        html: true,
        timeout: 5000,
        // offset: 100
      });
    });
};

/*===========================================
  Add coneverted lead into Customer Action
=============================================*/

export const addKanBanCustomer = (formData, history) => (dispatch) => {
  axios
    .post(`${url}/api/customers`, formData)
    .then((res) => {
      dispatch({
        type: SET_CONFETTI_ANIMATION,
        payload: true,
      });
      Alert.success("<h4> Customer Added</h4>", {
        position: "top-right",
        effect: "slide",
        beep: false,
        html: true,
        timeout: 5000,
        // offset: 100
      });
      dispatch(history.push("/customers"));
    })
    .catch((err) => console.log(err));
};

/*======================================
            Get All Customer 
========================================*/
export const getAllCustomers = (formData) => (dispatch) => {
  axios
    .post(`${url}/api/customers/search`, formData)
    .then((res) => {
      dispatch({
        type: GET_ALL_CUSTOMERS,
        payload: res.data,
      });
    })
    .catch((err) => console.log(err));
};

/*========================================
        Get My Customers Action 
=========================================*/
export const getMyCustomers = (userId) => (dispatch) => {
  axios
    .get(`${url}/api/customers?assigned=${userId}`)
    .then((res) => {
      dispatch({
        type: GET_ALL_CUSTOMERS,
        payload: res.data,
      });
    })
    .catch((err) => console.log(err));
};

/*=======================================
          Search all Customers  
=========================================*/
export const searchAllCustomerAction = (searchText) => (dispatch) => {
  axios
    .get(`${url}/api/customers/search/text?text=${searchText}`)
    .then((res) => {
      dispatch({
        type: GET_ALL_CUSTOMERS,
        payload: res.data,
      });
    })
    .catch((err) => console.log(err));
};

/*=======================================
    Search all Customers in status  
=========================================*/
export const searchWithStatusCustomerAction = (searchText, status) => (
  dispatch
) => {
  axios
    .get(`${url}/api/customers/search/text?text=${searchText}&status=${status}`)
    .then((res) => {
      dispatch({
        type: GET_ALL_CUSTOMERS,
        payload: res.data,
      });
    })
    .catch((err) => console.log(err));
};

/*=======================================
      Search All In My Customers
========================================*/

export const searchInMyCustomerAction = (searchText, assignedId) => (
  dispatch
) => {
  axios
    .get(
      `${url}/api/customers/search/text?text=${searchText}&assigned=${assignedId}`
    )
    .then((res) => {
      dispatch({
        type: GET_ALL_CUSTOMERS,
        payload: res.data,
      });
    })
    .catch((err) => console.log(err));
};

/*=====================================
    Customers Filter By Levels
=======================================*/
export const filterAllCustomerByLevelAction = (level) => (dispatch) => {
  axios
    .post(`${url}/api/customers/search`, level)
    .then((res) => {
      dispatch({
        type: GET_ALL_CUSTOMERS,
        payload: res.data,
      });
    })
    .catch((err) => console.log(err));
};

/*=======================================
              Delete Customer
========================================*/
export const deleteCustomer = (customerId) => (dispatch) => {
  axios
    .delete(`${url}/api/customers/${customerId}`)
    .then((res) => {
      Alert.success("<h4>Customer Archived</h4>", {
        position: "top-right",
        effect: "slide",
        beep: false,
        html: true,
        timeout: 5000,
        // offset: 100
      });
      const allCustomerQuery = {
        // pageNo: 10,
        // pageSize: 0,
        query: {},
      };
      dispatch(getAllCustomers(allCustomerQuery));
    })
    .catch((err) => console.log(err));
};

/*=========================================
          Update Customer Status
===========================================*/
export const updateCustomerStatus = (
  customerId,
  formData,
  filterName,
  textLabel
) => (dispatch) => {
  // console.log(filterName);
  axios
    .put(`${url}/api/customers/${customerId}`, formData)
    .then((res) => {
      if (filterName === "All Customers") {
        const allCustomerQuery = {
          // pageNo: 10,
          // pageSize: 0,
          query: {},
        };
        Alert.success(`<h4>${textLabel}</h4>`, {
          position: "top-right",
          effect: "slide",
          beep: false,
          html: true,
          timeout: 5000,
          // offset: 100
        });
        dispatch(getAllCustomers(allCustomerQuery));
        dispatch(getCustomerOverview());
      } else {
        const filterCustomer = {
          query: {
            status: "ARCHIVE",
          },
        };
        Alert.success(`<h4>${textLabel}</h4>`, {
          position: "top-right",
          effect: "slide",
          beep: false,
          html: true,
          timeout: 5000,
          // offset: 100
        });
        dispatch(filterAllCustomerByLevelAction(filterCustomer));
        dispatch(getCustomerOverview());
      }
    })
    .catch((err) => console.log(err.response.data));
};

/*==========================================
            Update Customer
===========================================*/
export const updateCustomer = (customerId, formData, filterName) => (
  dispatch
) => {
  axios
    .put(`${url}/api/customers/${customerId}`, formData)
    .then((res) => {
      Alert.success("<h4>Customer Updated</h4>", {
        position: "top-right",
        effect: "slide",
        beep: false,
        html: true,
        timeout: 5000,
        // offset: 100
      });
      dispatch({
        type: GET_API_STATUS,
        payload: res.status,
      });
      if (filterName === "All Customers") {
        const allCustomerQuery = {
          // pageNo: 10,
          // pageSize: 0,
          query: {},
        };
        dispatch(getAllCustomers(allCustomerQuery));
        dispatch(getCustomerOverview());
      } else {
        const filterCustomer = {
          query: {
            status: "ARCHIVE",
          },
        };
        dispatch(filterAllCustomerByLevelAction(filterCustomer));
        dispatch(getCustomerOverview());
      }
    })
    .catch((err) => console.log(err));
};

/*=======================================
      Filter Customers By Alphabates
========================================*/

export const filterLevelByAlphabate = (formData) => (dispatch) => {
  axios
    .post(`${url}/api/customers/search`, formData)
    .then((res) => {
      dispatch({
        type: GET_ALL_CUSTOMERS,
        payload: res.data,
      });
    })
    .catch((err) => console.log(err));
};
