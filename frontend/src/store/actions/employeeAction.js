import axios from "axios";
import {
  VERIFY_EMPLOYEE,
  GET_ALL_EMPLOYEES,
  GET_API_STATUS,
  GET_EMPLOYEE_OVERVIEW,
  SET_EMPTY_STATUS,
  SET_EMPLOYEE_BLOCK_VIEW_POPUP_DATA,
  SET_APPROVAL_PENDING_LEAVES,
  SET_SINGLE_EMPLOYEE_DATA,
} from "./../types";
import { SET_LOGIN, SET_ERRORS } from "./../types";
import setAuthToken from "./../utils/setAuthToken";
import { performanceScoreBoard } from "./dashBoardAction";
import { getOrganizationDetaisAction } from "./authAction";
import Alert from "react-s-alert";
import { workspaceId } from "./config";
import { url } from "./config";
import isEmpty from "../validations/is-empty";
import { getAllActiveUserQuantity } from "./paymentAction";

/*============================
  Add Employee Action
==============================*/

export const addEmployeesAction = (formData, filterName) => (dispatch) => {
  const recipients = [formData];

  axios
    .post(`${url}/api/users/invite`, { recipients })
    .then((res) => {
      dispatch(getAllActiveUserQuantity());
      dispatch({
        type: GET_API_STATUS,
        payload: res.status,
      });
      if (filterName === "All Members") {
        const allEmployeeQuery = {
          // pageNo: 10,
          // pageSize: 0,
          query: {},
        };
        dispatch(getAllEmployeesWithAdmin(allEmployeeQuery));
      } else if (filterName === "Archive Members") {
        dispatch(
          filterAllEmployeesByLevelAction({
            query: {
              status: "ARCHIVE",
            },
          })
        );
      } else if (filterName === "Active Members") {
        dispatch(
          filterAllEmployeesByLevelAction({
            query: {
              status: "ACTIVE",
            },
          })
        );
      } else {
        const allEmployeeQuery = {
          // pageNo: 10,
          // pageSize: 0,
          query: {},
        };
        dispatch(getAllEmployeesWithAdmin(allEmployeeQuery));
      }
      dispatch(performanceScoreBoard("current"));
      Alert.success("<h4>Member Invited</h4>", {
        position: "top-right",
        effect: "slide",
        beep: false,
        html: true,
        timeout: 5000,
        // offset: 100
      });
    })
    .catch((err) => {
      Alert.error(`<h4>${err.response.data.message}</h4>`, {
        position: "top-right",
        effect: "slide",
        beep: false,
        html: true,
        timeout: 5000,
        // offset: 100
      });
      dispatch({
        type: SET_ERRORS,
        payload: err.response.data,
      });
    });
};

/*============================
    Verify Employee Action
==============================*/

export const verifyEmployeeAction = (authCode, workspaceName) => (dispatch) => {
  console.log(authCode);
  axios
    .get(`${url}/public/authCode/verify?authCode=${authCode}`, {
      headers: {
        workspaceId: workspaceName,
      },
    })
    .then((res) => {
      dispatch({
        type: VERIFY_EMPLOYEE,
        payload: res.data,
      });
    })
    .catch((err) => console.log(err));
};

/*================================
  Employee Reset password Action
================================*/

export const employeePasswordResetAction =
  (formData, authCode, history, workspaceName) => (dispatch) => {
    const headers = {
      "Content-Type": "application/json",
      workspaceId: workspaceName,
    };
    console.log(workspaceName);
    axios
      .patch(`${url}/public/users?authCode=${authCode}`, formData, {
        headers: headers,
      })
      .then((res) => {
        dispatch(getAllEmployees());
        dispatch(getAllActiveUserQuantity());
        dispatch(loginUser(formData, history, workspaceName));
      })
      .catch((err) => console.log(err));
  };

/*==================================
    Login Employee Action
====================================*/

export const loginUser = (formData, history, workspaceName) => (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceName,
  };
  axios
    .post(`${url}/public/login`, formData, { headers: headers })
    .then((res) => {
      // Save token to localstorage
      const { token } = res.data;
      localStorage.setItem("Data", JSON.stringify(res.data));
      // localStorage.setItem("isUserLoggedIn", true);
      dispatch({ type: SET_LOGIN, payload: res.data });
      // Set token to auth header
      setAuthToken(token);
      Alert.success("<h4>Login Successfully</h4>", {
        position: "top-right",
        effect: "slide",
        beep: false,
        html: true,
        timeout: 5000,
        // offset: 100
      });
      dispatch(getOrganizationDetaisAction(workspaceName));
      dispatch(history.push("/dashboard"));
    })
    .catch((err) => console.log(err));
};

/*==============================================
    Get Employee Data by Id
================================================*/
export const getEmployeeDataById = (userId) => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data } = await axios.get(`${url}/api/users/${userId}`, {
      headers: headers,
    });
    if (data) {
      dispatch({
        type: SET_SINGLE_EMPLOYEE_DATA,
        payload: data,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

/*==============================================
    Get All Employees Action Except admin
================================================*/

export const getAllEmployees = (formData) => (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  axios
    .post(`${url}/api/users/search`, formData, { headers: headers })
    // .get(`${url}/api/users/status/ACTIVE`, { headers: headers })
    .then((res) => {
      // let filterData = res.data.filter(
      //   (user) => user.role.name !== "Administrator"
      // );

      dispatch({
        type: GET_ALL_EMPLOYEES,
        payload: res.data,
      });
    })
    .catch((err) => console.log(err));
};

/*===============================================
          Get All Users Including Admin
=================================================*/

export const getAllEmployeesWithAdmin = (formData) => (dispatch) => {
  axios
    .post(`${url}/api/users/search`, formData)
    .then((res) => {
      dispatch({
        type: GET_ALL_EMPLOYEES,
        payload: res.data,
      });
    })
    .catch((err) => console.log(err));
};

/*================================
        Delete Employees
=================================*/
export const deleteEmployee = (formData, filterName) => (dispatch) => {
  const users = [formData];
  const headers = {
    "Content-Type": "application/json",
    // workspaceId: workspaceId
  };
  console.log(filterName);
  axios
    .post(`${url}/api/users/archive`, { users }, { headers: headers })
    .then((res) => {
      Alert.success("<h4>Member Archived</h4>", {
        position: "top-right",
        effect: "slide",
        beep: false,
        html: true,
        timeout: 5000,
        // offset: 100
      });
      dispatch(getAllActiveUserQuantity());
      dispatch({
        type: GET_API_STATUS,
        payload: res.status,
      });
      if (filterName === "All Members") {
        const allEmployeeQuery = {
          // pageNo: 10,
          // pageSize: 0,
          query: {},
        };
        dispatch(getAllEmployeesWithAdmin(allEmployeeQuery));
      } else if (filterName === "Archive Members") {
        const newQuery = {
          query: {
            status: "ARCHIVE",
          },
        };

        dispatch(filterAllEmployeesByLevelAction(newQuery));
      } else {
        const newQuery = {
          query: {
            status: "ACTIVE",
          },
        };
        dispatch(filterAllEmployeesByLevelAction(newQuery));
      }
    })
    .catch((err) => console.log(err));
};

/*=====================================
  Delete Employees from Payment time
=======================================*/
export const deleteEmployeeInPlans =
  (formData, callBackEmployeeDelete) => (dispatch) => {
    const users = [formData];
    const headers = {
      "Content-Type": "application/json",
      workspaceId: workspaceId,
    };
    // console.log(filterName);
    axios
      .post(`${url}/api/users/archive`, { users }, { headers: headers })
      .then((res) => {
        // Alert.success("<h4>Member Archived</h4>", {
        //   position: "top-right",
        //   effect: "slide",
        //   beep: false,
        //   html: true,
        //   timeout: 5000,
        //   // offset: 100
        // });

        callBackEmployeeDelete(res.status);
        // dispatch(getAllEmployees());
      })
      .catch((err) => console.log(err));
  };

/*================================
            Remove errors
=================================*/
export const remove_errorss = () => (dispatch) => {
  dispatch({
    type: SET_ERRORS,
    payload: {},
  });
};

/*=================================
    Clear Status
==================================*/

// export const clear_staus = () => dispatch => {
//   dispatch({
//     type: SET_EMPTY_STATUS,
//     payload: {}
//   });
// };

/*==================================
        Get Employee Overview
====================================*/
export const getEmployeesOverview = () => (dispatch) => {
  axios
    .get(`${url}/api/users/overview`)
    .then((res) => {
      dispatch({
        type: GET_EMPLOYEE_OVERVIEW,
        payload: res.data,
      });
    })
    .catch((err) => console.log(err));
};

/*====================================
      Update Employees Action
======================================*/

export const updateEmployee =
  (employeeId, formData, filterName, callBackUpdate) => (dispatch) => {
    axios
      .put(`${url}/api/users/${employeeId}`, formData)
      .then((res) => {
        dispatch({
          type: GET_API_STATUS,
          payload: res.status,
        });

        dispatch(getEmployeeDataById(employeeId));
        Alert.success("<h4>Member Updated</h4>", {
          position: "top-right",
          effect: "slide",
          beep: false,
          html: true,
          timeout: 5000,
          // offset: 100
        });
        if (filterName === "All Employees" || filterName === undefined) {
          const allEmployeeQuery = {
            // pageNo: 10,
            // pageSize: 0,
            query: {},
          };
          dispatch(getAllEmployeesWithAdmin(allEmployeeQuery));
        } else if (filterName === "Archive Employees") {
          const newQuery = {
            query: {
              status: "ARCHIVE",
            },
          };
          dispatch(filterAllEmployeesByLevelAction(newQuery));
        } else {
          const newQuery = {
            query: {
              status: "ACTIVE",
            },
          };
          dispatch(filterAllEmployeesByLevelAction(newQuery));
        }
        dispatch(callBackUpdate(res.status));
      })

      .catch((err) => console.log(err));
  };

/*====================================
      Update Employees status
======================================*/

export const updateEmployeeStatus =
  (employeeId, formData, filterName) => (dispatch) => {
    console.log(filterName);
    axios
      .put(`${url}/api/users/${employeeId}`, formData)
      .then((res) => {
        Alert.success("<h4>Status Updated</h4>", {
          position: "top-right",
          effect: "slide",
          beep: false,
          html: true,
          timeout: 5000,
          // offset: 100
        });
        dispatch(getAllActiveUserQuantity());
        if (filterName === "All Members") {
          const allEmployeeQuery = {
            // pageNo: 10,
            // pageSize: 0,
            query: {},
          };
          dispatch(getAllEmployeesWithAdmin(allEmployeeQuery));
        } else if (filterName === "Archive Members") {
          const filterByLevel = {
            query: {
              status: "ARCHIVE",
            },
          };
          dispatch(filterAllEmployeesByLevelAction(filterByLevel));
        } else if (filterName === "Active Members") {
          const filterByLevel = {
            query: {
              status: "ACTIVE",
            },
          };
          dispatch(filterAllEmployeesByLevelAction(filterByLevel));
        } else {
          // console.log("not selected");
        }
      })
      .catch((err) => console.log(err));
  };

/*=====================================
    Employees Search in all
=======================================*/

export const searchAllEmployeeAction = (searchText) => (dispatch) => {
  axios
    .get(`${url}/api/users/search/text?text=${searchText}`)
    .then((res) => {
      dispatch({
        type: GET_ALL_EMPLOYEES,
        payload: res.data,
      });
    })
    .catch((err) => console.log(err));
};

/*=========================================
    Employee Search In Active and Inactive
===========================================*/
export const searchWithStatusEmployeeAction =
  (searchText, status) => (dispatch) => {
    axios
      .get(`${url}/api/users/search/text?text=${searchText}&status=${status}`)
      .then((res) => {
        dispatch({
          type: GET_ALL_EMPLOYEES,
          payload: res.data,
        });
      })
      .catch((err) => console.log(err));
  };

/*=====================================
    Employees Filter By Levels
=======================================*/
export const filterAllEmployeesByLevelAction = (level) => (dispatch) => {
  axios
    .post(`${url}/api/users/search`, level)
    .then((res) => {
      dispatch({
        type: GET_ALL_EMPLOYEES,
        payload: res.data,
      });
    })
    .catch((err) => console.log(err));
};

/*=======================================
      Filter Employees By Alphabates
========================================*/

export const filterLevelByAlphabate = (formData) => (dispatch) => {
  axios
    .post(`${url}/api/users/search`, formData)
    .then((res) => {
      dispatch({
        type: GET_ALL_EMPLOYEES,
        payload: res.data,
      });
    })
    .catch((err) => console.log(err));
};

/*============================================================
                        Filter by leaves
==============================================================*/

/*==============================
    Filter employee by on Leave
================================*/
export const filterLevelByOnLeave = () => (dispatch) => {
  axios
    .get(`${url}/api/leaves/on-leave`)
    .then((res) => {
      // dispatch({
      //   type: GET_ALL_EMPLOYEES,
      //   payload: res.data
      // });
      dispatch({
        type: SET_APPROVAL_PENDING_LEAVES,
        payload: res.data,
      });
      console.log(res.data);
    })
    .catch((err) => console.log(err));
};

/*======================================
    Filter employee by Upcoming leaves
========================================*/
export const filterLevelByUpcomingLeaves = () => (dispatch) => {
  axios
    .get(`${url}/api/leaves/upcoming-leaves`)
    .then((res) => {
      // dispatch({
      //   type: GET_ALL_EMPLOYEES,
      //   payload: res.data
      // });
      dispatch({
        type: SET_APPROVAL_PENDING_LEAVES,
        payload: res.data,
      });
      console.log(res.data);
    })
    .catch((err) => console.log(err));
};

/*===========================================================
            Employee block card view popup
============================================================*/
export const employeeBlockCardPopupAction = (employeeId) => (dispatch) => {
  axios
    .get(`${url}/api/users/userdetails/${employeeId}`)
    .then((res) =>
      dispatch({
        type: SET_EMPLOYEE_BLOCK_VIEW_POPUP_DATA,
        payload: res.data,
      })
    )
    .catch((err) => console.log(err));
};

/*=============================================================
                Get All Users  
===============================================================*/

export const getAllUsers = () => (dispatch) => {
  axios
    .get(`${url}/api/users`)
    .then((res) => console.log(res))
    .catch((err) => console.log(err));
};

/*=======================================
      Check If User Is exist or not
========================================*/

export const checkIfUserExistOrNot =
  (formData, callbackUserExist) => (dispatch) => {
    axios
      .post(`${url}/api/users/search`, formData)
      .then((res) => {
        if (!isEmpty(res.data)) {
          callbackUserExist(true);
        } else {
          callbackUserExist(false);
        }
      })
      .catch((err) => console.log(err));
  };
