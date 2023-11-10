import axios from "axios";
import Alert from "react-s-alert";
import { GET_API_STATUS, SET_ALL_TASKS, SET_ERRORS } from "./../types";
import { getTodaysTasksAll } from "../actions/dashBoardAction";
import { url } from "./config";
import isEmpty from "../validations/is-empty";

/*===================================
          Add Task Action
=====================================*/

export const addTaskAction = (formData) => (dispatch) => {
  let userData = JSON.parse(localStorage.getItem("Data"));
  axios
    .post(`${url}/api/tasks`, formData)
    .then((res) => {
      dispatch({
        type: GET_API_STATUS,
        payload: true,
      });
      const userTask = {
        query: {
          assignee: userData.id,
        },
      };
      dispatch(getTodaysTasksAll(false));
      dispatch(getAllTasks(userTask));
      Alert.success("<h4>Task Added</h4>", {
        position: "top-right",
        effect: "slide",
        beep: false,
        html: true,
        timeout: 5000,
        // offset: 100
      });
    })
    .catch((err) => {
      dispatch({
        type: GET_API_STATUS,
        payload: false,
      });
      Alert.error(`<h4>${err.response.data.message}</h4>`, {
        position: "top-right",
        effect: "slide",
        beep: false,
        html: true,
        timeout: 5000,
        // offset: 100
      });
    });
};

/*========================================
      Get All Task By User Id Action
==========================================*/
export const getAllTasks = (formData) => (dispatch) => {
  axios
    .post(`${url}/api/tasks/search`, formData)
    .then((res) => {
      dispatch({
        type: SET_ALL_TASKS,
        payload: res.data,
      });
    })
    .catch((err) => console.log(err));
};

/*=========================================
            Delete Task
==========================================*/

export const deleteTask = (taskId) => (dispatch) => {
  let userData = JSON.parse(localStorage.getItem("Data"));
  axios
    .delete(`${url}/api/tasks/${taskId}`)
    .then((res) => {
      const userTask = {
        query: {
          assignee: userData.id,
        },
      };
      dispatch(getAllTasks(userTask));
      Alert.success("<h4>Task Deleted</h4>", {
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

/*============================================
            Update Task Action
==============================================*/
export const updateTaskAction =
  (taskId, formData, taskAssignedSelected, callBack) => (dispatch) => {
    let userData = JSON.parse(localStorage.getItem("Data"));
    axios
      .put(`${url}/api/tasks/${taskId}`, formData)
      .then((res) => {
        Alert.success("<h4>Task Updated</h4>", {
          position: "top-right",
          effect: "slide",
          beep: false,
          html: true,
          timeout: 5000,
          // offset: 100
        });

        dispatch(getTodaysTasksAll(false));

        if (
          !isEmpty(taskAssignedSelected) &&
          taskAssignedSelected === "Tasks Assigned to me"
        ) {
          const assignedToMe = {
            query: {
              assignee: userData.id,
            },
          };
          dispatch(getAllTasks(assignedToMe));
        } else {
          const assignedByMe = {
            query: {
              createdBy: userData.email,
            },
          };
          dispatch(getAllTasks(assignedByMe));
        }
        callBack(res.status);
      })
      .catch((err) => console.log(err));
  };

/*=============================
  Check Task exists or not 
===============================*/

export const checkTaskExist =
  (taskName, callBackTaskExist) => async (dispatch) => {
    try {
      let { data } = await axios.get(`${url}/api/tasks/exist?name=${taskName}`);
      if (data) {
        callBackTaskExist(data);
        console.log(data);
      }
    } catch (err) {
      console.log(err);
    }
  };
