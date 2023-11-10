import axios from "axios";
import { url } from "./config";
import {
  SET_EMPLOYEE_ACTIVITY,
  SET_EMPLOYEE_LEADS_OWN,
  SET_EMPLOYEE_PERFORMANCE_GRAPH
} from "./../types";

/*====================================
        Get Employee Activity
=====================================*/

export const getEmployeeActivity = employeeId => dispatch => {
  axios
    .get(`${url}/api/users/activity/${employeeId}`)
    .then(res => {
      dispatch({
        type: SET_EMPLOYEE_ACTIVITY,
        payload: res.data
      });
    })
    .catch(err => console.log(err));
};

/*=====================================
    Get Employee Leads Owned
======================================*/
export const getEmployeeLeadsOwned = formData => dispatch => {
  axios
    .post(`${url}/api/leads/search`, formData)
    .then(res => {
      dispatch({
        type: SET_EMPLOYEE_LEADS_OWN,
        payload: res.data
      });
    })
    .catch(err => console.log(err));
};

/*======================================
      Employee Prformance Graph
=======================================*/
export const getEmployeePerformanceGraph = employeeId => dispatch => {
  axios
    .get(`${url}/api/users/performance/${employeeId}`)
    .then(res => {
      dispatch({
        type: SET_EMPLOYEE_PERFORMANCE_GRAPH,
        payload: res.data
      });
    })
    .catch(err => console.log(err));
};
