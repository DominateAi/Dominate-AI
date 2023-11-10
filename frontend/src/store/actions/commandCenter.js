import axios from "axios";
import {} from "./../types";
// import setAuthToken from "./../utils/setAuthToken";
import Alert from "react-s-alert";

import { workspaceId } from "./config";
import { url } from "./config";
import {
  SET_ORGANISATION_TARGET,
  GET_ALL_EMPLOYEES_TARGET,
  SET_SIGNLE_EMPLOYEE_TARGET,
  SET_ORGANIZATION_TARGET_VS_DOLLER_CHART,
  SET_ORGANIZATION_TARGET_VS_ACTUAL_LEADS_CHART,
  SET_ORGANIZATION_TARGET_EFFICIENCY,
  SET_USER_TARGET_VS_DOLLER_CHART,
  SET_USER_TARGET_VS_LEADS_CHART,
  SET_USER_TARGET_EFFICIENCY,
  SET_ORGANIZATION_TARGET_TABLE,
  SET_USER_TARGET_TABLE,
  SET_ALL_USERS_ROLES,
  // GET_API_STATUS,
  SET_ALL_CUSTOM_FIELDS,
  SET_LEADS_ALL_CUSTOME_FIELDS,
  SET_ACCOUNT_ALL_CUSTOME_FIELDS,
  // SET_CONTACT_ALL_CUSTOME_FIELDS,
  GET_FIELDS_VALUE_BY_ENTITY,
  SET_DEAL_ALL_CUSTOME_FIELDS,
  // org deal target
  SET_ORGANISATION_DEAL_TARGET,
  SET_ORGANIZATION_TARGET_VS_ACTUAL_DEALS_CHART,
  SET_ORGANIZATION_DEAL_TARGET_VS_DOLLER_CHART,
  SET_ORGANIZATION_DEAL_TARGET_EFFICIENCY,
  SET_ORGANIZATION_DEAL_TARGET_TABLE,
  //user deal target
  SET_SIGNLE_DEAL_EMPLOYEE_TARGET,
  SET_USER_DEAL_TARGET_VS_DOLLER_CHART,
  SET_USER_DEAL_TARGET_EFFICIENCY,
  SET_USER_TARGET_VS_DEAL_CHART,
  SET_USER_DEAL_TARGET_TABLE,
} from "./../types";
import dateFns from "date-fns";
import isEmpty from "../validations/is-empty";

export const createOrganizationTarget =
  (formData, callBackOrganisationTarget) => async (dispatch) => {
    try {
      let { data, status } = await axios.post(`${url}/api/otargets`, formData);
      if (data) {
        Alert.success("<h4>Organisation target is set </h4>", {
          position: "top-right",
          effect: "slide",
          beep: false,
          html: true,
          timeout: 5000,
          // offset: 100
        });
        callBackOrganisationTarget(status);
        dispatch(getOrganizationTarget());
        dispatch(getOrganizationTargetVsActualDollers());
        dispatch(getOrgTargetVsActualLeads());
        dispatch(getOrgTargetEfficiency());
        dispatch(getOrgTargetTable());
      }
    } catch (err) {
      console.log(err);
    }
  };

export const getOrganizationTarget = () => async (dispatch) => {
  let startDate = dateFns.startOfMonth(new Date()).toISOString();
  let endDate = dateFns.endOfMonth(new Date()).toISOString();
  // console.log(endDate);
  try {
    let { data } = await axios.get(
      `${url}/api/itargets/thismonthtarget?startDate=${startDate}&endDate=${endDate}`
    );
    if (data) {
      // console.log(data);

      dispatch({
        type: SET_ORGANISATION_TARGET,
        payload: data.targetNewLeadDollars === undefined ? [] : [data],
      });
    }
  } catch (err) {
    console.log(err);
  }
};

export const updateOrganizationTarget =
  (organizationId, formData, callBackOrganisationTarget) =>
  async (dispatch) => {
    try {
      let { data, status } = await axios.put(
        `${url}/api/otargets/${organizationId}`,
        formData
      );
      if (data) {
        Alert.success("<h4>Organisation target updated</h4>", {
          position: "top-right",
          effect: "slide",
          beep: false,
          html: true,
          timeout: 5000,
          // offset: 100
        });
        callBackOrganisationTarget(status);
        dispatch(getOrganizationTarget());
        dispatch(getOrganizationTargetVsActualDollers());
        dispatch(getOrgTargetVsActualLeads());
        dispatch(getOrgTargetEfficiency());
        dispatch(getOrgTargetTable());
      }
    } catch (err) {
      console.log(err);
    }
  };

/*===============================================
          Target vs Actual Dollars
================================================*/

export const getOrganizationTargetVsActualDollers = () => async (dispatch) => {
  try {
    let { data } = await axios.get(`${url}/api/otargets/orgrevgraph`);
    if (data) {
      dispatch({
        type: SET_ORGANIZATION_TARGET_VS_DOLLER_CHART,
        payload: data,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

/*===============================================
         Target VS Actual Leads
================================================*/

export const getOrgTargetVsActualLeads = () => async (dispatch) => {
  try {
    let { data } = await axios.get(`${url}/api/otargets/orgcountgraph`);
    if (data) {
      dispatch({
        type: SET_ORGANIZATION_TARGET_VS_ACTUAL_LEADS_CHART,
        payload: data,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

/*===============================================
         Target achieving Efficiency Chart
================================================*/

export const getOrgTargetEfficiency = () => async (dispatch) => {
  try {
    let { data } = await axios.get(`${url}/api/otargets/orgefficiency`);
    if (data) {
      dispatch({
        type: SET_ORGANIZATION_TARGET_EFFICIENCY,
        payload: data,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

/*===============================================
      Organisation monthly target table chart
================================================*/

export const getOrgTargetTable = () => async (dispatch) => {
  try {
    let { data } = await axios.get(`${url}/api/otargets/monthlytable`);
    if (data) {
      // console.log(data);
      let months = data.months;
      let monthData = data.data;
      let finalArray = [];

      monthData.forEach((data, dataIndex) => {
        months.forEach((month, monthIndex) => {
          if (dataIndex === monthIndex) {
            finalArray.push({ month: month, data: data });
          }
        });
      });
      let filteredData = finalArray.filter((element) => !isEmpty(element.data));
      dispatch({
        type: SET_ORGANIZATION_TARGET_TABLE,
        payload: filteredData,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

/*==============================================================================
                            Organization Target
===============================================================================*/

export const getOrganisationTarget = () => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data } = await axios.get(`${url}/api/targets/organisation`, {
      headers: headers,
    });
    if (data) {
      // dispatch({
      //   type: SET_ORGANISATION_TARGET,
      //   payload: data,
      // });
    }
  } catch (err) {
    console.log(err);
  }
};

export const setOrganisationTarget =
  (formData, callBackOrganisationTarget) => async (dispatch) => {
    const headers = {
      "Content-Type": "application/json",
      workspaceId: workspaceId,
    };
    try {
      let { data, status } = await axios.post(`${url}/api/targets`, formData, {
        headers: headers,
      });
      if (data) {
        console.log(data);
        Alert.success("<h4>Organisation target is set </h4>", {
          position: "top-right",
          effect: "slide",
          beep: false,
          html: true,
          timeout: 5000,
          // offset: 100
        });
        callBackOrganisationTarget(status);
        dispatch(getOrganisationTarget());
      }
    } catch (err) {
      console.log(err);
    }
  };

export const updateOrganisationTarget =
  (formData, targetId, callBackOrganisationTarget) => async (dispatch) => {
    const headers = {
      "Content-Type": "application/json",
      workspaceId: workspaceId,
    };
    try {
      let { data, status } = await axios.put(
        `${url}/api/target/${targetId}`,
        formData,
        {
          headers: headers,
        }
      );
      if (data) {
        console.log(data);
        Alert.success("<h4>Organisation target updated</h4>", {
          position: "top-right",
          effect: "slide",
          beep: false,
          html: true,
          timeout: 5000,
          // offset: 100
        });
        callBackOrganisationTarget(status);
        dispatch(getOrganisationTarget());
      }
    } catch (err) {
      console.log(err);
    }
  };

export const resetAllTargets =
  (resetCallBackAction, employeeId) => (dispatch) => {
    const headers = {
      "Content-Type": "application/json",
      workspaceId: workspaceId,
    };
    axios
      .delete(`${url}/api/targets?deleteAll=true`, { headers: headers })
      .then((res) => {
        Alert.success("<h4>All target reset sucessfully </h4>", {
          position: "top-right",
          effect: "slide",
          beep: false,
          html: true,
          timeout: 5000,
          // offset: 100
        });
        resetCallBackAction(res.status);
        dispatch(getOrganisationTarget());
        dispatch(getSingleEmployeeTargetById(employeeId));
      })
      .catch((err) => console.log(err));
  };

/*====================================================================================
                              Employee Target
=====================================================================================*/

export const getAllEmployeesTarget = () => (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  axios
    .get(`${url}/api/targets`, { headers: headers })
    .then((res) => {
      dispatch({
        type: GET_ALL_EMPLOYEES_TARGET,
        payload: res.data,
      });
    })
    .catch((err) => console.log(err));
};

export const setEmployeeTarget =
  (formData, callBackOrganisationTarget, employeeId) => (dispatch) => {
    const headers = {
      "Content-Type": "application/json",
      workspaceId: workspaceId,
    };
    axios
      .post(`${url}/api/targets`, formData, { headers: headers })
      .then((res) => {
        Alert.success("<h4>Employee target is set </h4>", {
          position: "top-right",
          effect: "slide",
          beep: false,
          html: true,
          timeout: 5000,
          // offset: 100
        });
        callBackOrganisationTarget(res.status);
        dispatch(getSingleEmployeeTargetById(employeeId));
      })
      .catch((err) => console.log(err));
  };

export const getSingleEmployeeTargetById = (employeeId) => (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  axios
    .get(`${url}/api/targets?user_id=${employeeId}`, { headers: headers })
    .then((res) => {
      dispatch({
        type: SET_SIGNLE_EMPLOYEE_TARGET,
        payload: res.data,
      });
    })
    .catch((err) => console.log(err));
};

export const updateEmployeeTarget =
  (formData, targetId, callBackOrganisationTarget, employeeId) =>
  (dispatch) => {
    console.log(targetId);
    axios
      .put(`${url}/api/target/${targetId}`, formData)
      .then((res) => {
        Alert.success("<h4>Employee target updated</h4>", {
          position: "top-right",
          effect: "slide",
          beep: false,
          html: true,
          timeout: 5000,
          // offset: 100
        });
        callBackOrganisationTarget(res.status);
        dispatch(getSingleEmployeeTargetById(employeeId));
      })
      .catch((err) => console.log(err));
  };

export const resetEmployeeTarget =
  (targteId, employeeId, callBackEmployeeReset) => (dispatch) => {
    axios
      .delete(`${url}/api/target/${targteId}`)
      .then((res) => {
        Alert.success("<h4>Employee target reset successfully</h4>", {
          position: "top-right",
          effect: "slide",
          beep: false,
          html: true,
          timeout: 5000,
          // offset: 100
        });
        callBackEmployeeReset(res.status);
        dispatch(getSingleEmployeeTargetById(employeeId));
      })
      .catch((err) => console.log(err));
  };

/*===================================================
              New Employee Target
=====================================================*/
export const getAllUserTarget = () => async (dispatch) => {
  try {
    let { data } = await axios.get(`${url}/api/itargets?pageNo=1&pageSize=10`);
    if (data) {
      // console.log(data);
      dispatch({
        type: GET_ALL_EMPLOYEES_TARGET,
        payload: data,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

export const getSingleUserTarget = (userId) => async (dispatch) => {
  let startDate = dateFns.startOfMonth(new Date()).toISOString();
  let endDate = dateFns.endOfMonth(new Date()).toISOString();
  try {
    let { data } = await axios.get(
      `${url}/api/itargets/thismonthtarget?user=${userId}&startDate=${startDate}&endDate=${endDate}`
    );
    if (data) {
      // console.log(data);
      dispatch({
        type: SET_SIGNLE_EMPLOYEE_TARGET,
        payload: data.targetNewLeadDollars === undefined ? [] : [data],
      });
    }
  } catch (err) {
    console.log(err);
  }
};

export const createUserTarget =
  (formData, callBackUserTarget) => async (dispatch) => {
    try {
      let { data, status } = await axios.post(`${url}/api/itargets`, formData);
      if (data) {
        Alert.success("<h4>Employee target is set </h4>", {
          position: "top-right",
          effect: "slide",
          beep: false,
          html: true,
          timeout: 5000,
          // offset: 100
        });
        // console.log(data);
        callBackUserTarget(status);
        dispatch(getSingleUserTarget(formData.assigned));
        dispatch(getUserTargetVsActualDollers(formData.assigned));
        dispatch(getUserTargetVsActualLeads(formData.assigned));
        dispatch(getUserTargetEfficiency(formData.assigned));
        dispatch(getUserTargetTable(formData.assigned));
      }
    } catch (err) {
      console.log(err);
    }
  };

export const updateUserTarget =
  (targetId, formData, callBackUserTarget) => async (dispatch) => {
    try {
      let { data, status } = await axios.put(
        `${url}/api/itargets/${targetId}`,
        formData
      );
      if (data) {
        Alert.success("<h4>Employee target updated</h4>", {
          position: "top-right",
          effect: "slide",
          beep: false,
          html: true,
          timeout: 5000,
          // offset: 100
        });
        callBackUserTarget(status);
        dispatch(getSingleUserTarget(formData.assigned));
        dispatch(getUserTargetVsActualDollers(formData.assigned));
        dispatch(getUserTargetVsActualLeads(formData.assigned));
        dispatch(getUserTargetEfficiency(formData.assigned));
        dispatch(getUserTargetTable(formData.assigned));
      }
    } catch (err) {
      console.log(err);
    }
  };

/*===============================================
          User target vs actual Dollers
=================================================*/

export const getUserTargetVsActualDollers = (userId) => async (dispatch) => {
  try {
    let { data } = await axios.get(
      `${url}/api/itargets/indrevgraph?user=${userId}`
    );
    if (data) {
      dispatch({
        type: SET_USER_TARGET_VS_DOLLER_CHART,
        payload: data,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

/*===============================================
          User target vs actual Leads
=================================================*/

export const getUserTargetVsActualLeads = (userId) => async (dispatch) => {
  try {
    let { data } = await axios.get(
      `${url}/api/itargets/indcountgraph?user=${userId}`
    );
    if (data) {
      dispatch({
        type: SET_USER_TARGET_VS_LEADS_CHART,
        payload: data,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

/*===============================================
     User Target achieving Efficiency Chart
================================================*/

export const getUserTargetEfficiency = (userId) => async (dispatch) => {
  try {
    let { data } = await axios.get(
      `${url}/api/itargets/indefficiency?user=${userId}`
    );
    if (data) {
      dispatch({
        type: SET_USER_TARGET_EFFICIENCY,
        payload: data,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

/*===============================================
      User monthly target table chart
================================================*/

export const getUserTargetTable = (userId) => async (dispatch) => {
  try {
    let { data } = await axios.get(
      `${url}/api/itargets/monthlytable?user=${userId}`
    );
    if (data) {
      let months = data.months;
      let monthData = data.data;
      let finalArray = [];

      monthData.forEach((data, dataIndex) => {
        months.forEach((month, monthIndex) => {
          if (dataIndex === monthIndex) {
            finalArray.push({ month: month, data: data });
          }
        });
      });
      let filteredData = finalArray.filter((element) => !isEmpty(element.data));
      // console.log(filteredData);
      dispatch({
        type: SET_USER_TARGET_TABLE,
        payload: filteredData,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

/*===================================================
              Create Achivement
=====================================================*/

export const createAchievementForUser = (formData) => async (dispatch) => {
  try {
    let { data } = await axios.post(`${url}/api/achievements`, formData);
    if (data) {
    }
  } catch (err) {
    console.log(err);
  }
};

/*======================================================
                Match Achievement 
========================================================*/
export const MatchAchievementForUser =
  (leadId, leadStatus, responseData) => async (dispatch) => {
    try {
      let { data } = await axios.get(
        `${url}/api/achievements/match?lead=${leadId}&type=${leadStatus}`
      );
      if (data) {
        if (data.isExist === false) {
          const formData = {
            user: responseData.assigned,
            lead: responseData._id,
            value: responseData.worth,
            onDate: new Date().toISOString(),
            type: responseData.status,
          };
          dispatch(createAchievementForUser(formData));
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

/*===========================================================================================================
                                        COMMAND CENTER ORGANISATION DEAL TARGET
============================================================================================================*/

/*=================================================
      Create Organisation deals target
==================================================*/
export const createOrganizationDealTarget =
  (formData, callBackOrganisationDealTarget) => async (dispatch) => {
    try {
      let { data, status } = await axios.post(
        `${url}/api/odealtargets`,
        formData
      );
      if (data) {
        Alert.success("<h4>Organisation deal target is set </h4>", {
          position: "top-right",
          effect: "slide",
          beep: false,
          html: true,
          timeout: 5000,
          // offset: 100
        });
        callBackOrganisationDealTarget(status);
        dispatch(getOrganizationDealTarget());
        dispatch(getOrganizationDealsTargetVsActualDollers());
        dispatch(getOrgTargetVsActualDeals());
        dispatch(getOrgDealTargetEfficiency());
        dispatch(getOrgDealTargetTable());
      }
    } catch (err) {
      console.log(err);
    }
  };

/*=================================================
    Get Organisation deals target
==================================================*/

export const getOrganizationDealTarget = () => async (dispatch) => {
  let startDate = dateFns.startOfMonth(new Date()).toISOString();
  let endDate = dateFns.endOfMonth(new Date()).toISOString();
  // console.log(endDate);
  try {
    let { data } = await axios.get(
      `${url}/api/idealtargets/thismonthtarget?startDate=${startDate}&endDate=${endDate}`
    );
    if (data) {
      dispatch({
        type: SET_ORGANISATION_DEAL_TARGET,
        payload: data.targetNewDealDollars === undefined ? [] : [data],
      });
    }
  } catch (err) {
    console.log(err);
  }
};

export const updateDealOrganizationTarget =
  (organizationId, formData, callBackOrganisationTarget) =>
  async (dispatch) => {
    try {
      let { data, status } = await axios.put(
        `${url}/api/odealtargets/${organizationId}`,
        formData
      );
      if (data) {
        Alert.success("<h4>Organisation deal target updated</h4>", {
          position: "top-right",
          effect: "slide",
          beep: false,
          html: true,
          timeout: 5000,
          // offset: 100
        });
        callBackOrganisationTarget(status);
        dispatch(getOrganizationDealTarget());
        dispatch(getOrganizationDealsTargetVsActualDollers());
        dispatch(getOrgTargetVsActualDeals());
        dispatch(getOrgDealTargetEfficiency());
        dispatch(getOrgDealTargetTable());
      }
    } catch (err) {
      console.log(err);
    }
  };

/*===============================================
        Org  Target VS Actual Deals
================================================*/

export const getOrgTargetVsActualDeals = () => async (dispatch) => {
  try {
    let { data } = await axios.get(`${url}/api/odealtargets/orgcountgraph`);
    if (data) {
      dispatch({
        type: SET_ORGANIZATION_TARGET_VS_ACTUAL_DEALS_CHART,
        payload: data,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

/*===============================================
        Org Deal Target vs Actual Dollars
================================================*/

export const getOrganizationDealsTargetVsActualDollers =
  () => async (dispatch) => {
    try {
      let { data } = await axios.get(`${url}/api/odealtargets/orgrevgraph`);
      if (data) {
        dispatch({
          type: SET_ORGANIZATION_DEAL_TARGET_VS_DOLLER_CHART,
          payload: data,
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

/*=========================================================
    Deal Organisation Target achieving Efficiency Chart
===========================================================*/

export const getOrgDealTargetEfficiency = () => async (dispatch) => {
  try {
    let { data } = await axios.get(`${url}/api/odealtargets/orgefficiency`);
    if (data) {
      dispatch({
        type: SET_ORGANIZATION_DEAL_TARGET_EFFICIENCY,
        payload: data,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

/*===============================================
  Organisation monthly Deals target table chart
================================================*/

export const getOrgDealTargetTable = () => async (dispatch) => {
  try {
    let { data } = await axios.get(`${url}/api/odealtargets/monthlytable`);
    if (data) {
      // console.log(data);
      let months = data.months;
      let monthData = data.data;
      let finalArray = [];

      monthData.forEach((data, dataIndex) => {
        months.forEach((month, monthIndex) => {
          if (dataIndex === monthIndex) {
            finalArray.push({ month: month, data: data });
          }
        });
      });
      let filteredData = finalArray.filter((element) => !isEmpty(element.data));
      dispatch({
        type: SET_ORGANIZATION_DEAL_TARGET_TABLE,
        payload: filteredData,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

/*===========================================================================================================
                                        COMMAND CENTER TEAM DEAL TARGET
============================================================================================================*/

/*============================================
            Create User Deal Target
=============================================*/

export const createUserDealTarget =
  (formData, callBackUserDealTarget) => async (dispatch) => {
    try {
      let { data, status } = await axios.post(
        `${url}/api/idealtargets`,
        formData
      );
      if (data) {
        Alert.success("<h4>Employee deal target is set </h4>", {
          position: "top-right",
          effect: "slide",
          beep: false,
          html: true,
          timeout: 5000,
          // offset: 100
        });
        // console.log(data);
        callBackUserDealTarget(status);
        dispatch(getSingleUserDealTarget(formData.assigned));
        dispatch(getUserDealTargetVsActualDollers(formData.assigned));
        dispatch(getUserTargetVsActualDeals(formData.assigned));
        dispatch(getUserDealTargetEfficiency(formData.assigned));
        dispatch(getUserDealTargetTable(formData.assigned));
      }
    } catch (err) {
      console.log(err);
    }
  };

/*================================================
            GET ALL USER DEAL TARGET
==================================================*/

export const getAllUserDealTarget = () => async (dispatch) => {
  try {
    let { data } = await axios.get(
      `${url}/api/idealtargets?pageNo=1&pageSize=10`
    );
    if (data) {
      // console.log(data);
      dispatch({
        type: GET_ALL_EMPLOYEES_TARGET,
        payload: data,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

/*================================================
       GET SINGLE USER DEAL TARGET
==================================================*/

export const getSingleUserDealTarget = (userId) => async (dispatch) => {
  let startDate = dateFns.startOfMonth(new Date()).toISOString();
  let endDate = dateFns.endOfMonth(new Date()).toISOString();
  try {
    let { data } = await axios.get(
      `${url}/api/idealtargets/thismonthtarget?user=${userId}&startDate=${startDate}&endDate=${endDate}`
    );
    if (data) {
      // console.log(data);
      dispatch({
        type: SET_SIGNLE_DEAL_EMPLOYEE_TARGET,
        payload: data.targetNewDealsDollars === undefined ? [] : [data],
      });
    }
  } catch (err) {
    console.log(err);
  }
};

/*================================================
       UPDATE SINGLE USER DEAL TARGET
==================================================*/

export const updateUserDealTarget =
  (targetId, formData, callBackUserDealTarget) => async (dispatch) => {
    try {
      let { data, status } = await axios.put(
        `${url}/api/idealtargets/${targetId}`,
        formData
      );
      if (data) {
        Alert.success("<h4>Employee deal target updated</h4>", {
          position: "top-right",
          effect: "slide",
          beep: false,
          html: true,
          timeout: 5000,
          // offset: 100
        });
        callBackUserDealTarget(status);
        dispatch(getSingleUserDealTarget(formData.assigned));
        dispatch(getUserDealTargetVsActualDollers(formData.assigned));
        dispatch(getUserTargetVsActualDeals(formData.assigned));
        dispatch(getUserDealTargetEfficiency(formData.assigned));
        dispatch(getUserDealTargetTable(formData.assigned));
      }
    } catch (err) {
      console.log(err);
    }
  };

/*===============================================
      User Deal target vs actual Dollers
=================================================*/

export const getUserDealTargetVsActualDollers =
  (userId) => async (dispatch) => {
    try {
      let { data } = await axios.get(
        `${url}/api/idealtargets/indrevgraph?user=${userId}`
      );
      if (data) {
        dispatch({
          type: SET_USER_DEAL_TARGET_VS_DOLLER_CHART,
          payload: data,
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

/*===============================================
        User Deal target vs actual Leads
=================================================*/

export const getUserTargetVsActualDeals = (userId) => async (dispatch) => {
  try {
    let { data } = await axios.get(
      `${url}/api/idealtargets/indcountgraph?user=${userId}`
    );
    if (data) {
      dispatch({
        type: SET_USER_TARGET_VS_DEAL_CHART,
        payload: data,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

/*===============================================
     User DEAL Target achieving Efficiency Chart
================================================*/

export const getUserDealTargetEfficiency = (userId) => async (dispatch) => {
  try {
    let { data } = await axios.get(
      `${url}/api/idealtargets/indefficiency?user=${userId}`
    );
    if (data) {
      dispatch({
        type: SET_USER_DEAL_TARGET_EFFICIENCY,
        payload: data,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

/*===============================================
      User monthly Deal target table chart
================================================*/

export const getUserDealTargetTable = (userId) => async (dispatch) => {
  try {
    let { data } = await axios.get(
      `${url}/api/idealtargets/monthlytable?user=${userId}`
    );
    if (data) {
      let months = data.months;
      let monthData = data.data;
      let finalArray = [];

      monthData.forEach((data, dataIndex) => {
        months.forEach((month, monthIndex) => {
          if (dataIndex === monthIndex) {
            finalArray.push({ month: month, data: data });
          }
        });
      });
      let filteredData = finalArray.filter((element) => !isEmpty(element.data));
      // console.log(filteredData);
      dispatch({
        type: SET_USER_DEAL_TARGET_TABLE,
        payload: filteredData,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

/*===========================================================================================
                                     DEAL ACHIEVEMENT
=============================================================================================*/

/*===================================================
         Create Achivement For Deal
=====================================================*/

export const createDealAchievementForUser = (formData) => async (dispatch) => {
  try {
    let { data } = await axios.post(`${url}/api/dealachieves`, formData);
    if (data) {
      console.log(data);
    }
  } catch (err) {
    console.log(err);
  }
};

/*======================================================
                Match Achievement 
========================================================*/
export const MatchDealAchievementForUser =
  (dealId, dealStatus, responseData) => async (dispatch) => {
    try {
      let { data } = await axios.get(
        `${url}/api/dealachieves/match?deal=${dealId}&type=${dealStatus}`
      );
      if (data) {
        console.log(data);
        // if (data.isExist === false) {
        //   const formData = {
        //     user: responseData.assigned,
        //     lead: responseData._id,
        //     value: responseData.worth,
        //     onDate: new Date().toISOString(),
        //     type: responseData.status,
        //   };
        //   dispatch(createAchievementForUser(formData));
        // }
      }
    } catch (err) {
      console.log(err);
    }
  };

/*======================================================
        Match Achievement For Deal
========================================================*/
// export const MatchDealAchievementForUser = (
//   leadId,
//   leadStatus,
//   responseData
// ) => async (dispatch) => {
//   try {
//     let { data, status } = await axios.get(
//       `${url}/api/achievements/match?lead=${leadId}&type=${leadStatus}`
//     );
//     if (data) {
//       if (data.isExist === false) {
//         const formData = {
//           user: responseData.assigned,
//           lead: responseData._id,
//           value: responseData.worth,
//           onDate: new Date().toISOString(),
//           type: responseData.status,
//         };
//         dispatch(createAchievementForUser(formData));
//       }
//     }
//   } catch (err) {
//     console.log(err);
//   }
// };

/*===========================================================================================
                                  Roles and Permissions
=============================================================================================*/

/*===============================
          Get All Roles
===============================*/

export const getAllRoles = () => async (dispatch) => {
  try {
    let { data } = await axios.get(`${url}/api/roles`);
    if (data) {
      dispatch({
        type: SET_ALL_USERS_ROLES,
        payload: data,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

/*===============================
        Create Roles
===============================*/

export const createRoles = (formData, callBackAddRole) => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data, status } = await axios.post(`${url}/api/roles`, formData, {
      headers: headers,
    });
    if (data) {
      Alert.success("<h4>New role created</h4>", {
        position: "top-right",
        effect: "slide",
        beep: false,
        html: true,
        timeout: 5000,
        // offset: 100
      });
      dispatch(getAllRoles());
      callBackAddRole(status);
    }
  } catch (err) {
    console.log(err);
  }
};

/*===============================
      Delete Role By id
===============================*/

export const deleteRoleById = (roleId) => async (dispatch) => {
  try {
    let { data } = await axios.delete(`${url}/api/roles/${roleId}`);
    if (data) {
      Alert.success("<h4>Role Deleted</h4>", {
        position: "top-right",
        effect: "slide",
        beep: false,
        html: true,
        timeout: 5000,
        // offset: 100
      });
      dispatch(getAllRoles());
    }
  } catch (err) {
    console.log(err);
  }
};

/*===============================
      Update Role By id
===============================*/

export const updateRoleById =
  (roleId, formData, callBackUpdate) => async (dispatch) => {
    try {
      let { data, status } = await axios.put(
        `${url}/api/roles/${roleId}`,
        formData
      );
      if (data) {
        console.log(data);
        Alert.success("<h4>Role Updated</h4>", {
          position: "top-right",
          effect: "slide",
          beep: false,
          html: true,
          timeout: 5000,
          // offset: 100
        });
        dispatch(getAllRoles());
        callBackUpdate(status);
      }
    } catch (err) {
      console.log(err);
    }
  };

/*===========================================================================================
                                  Custom Fields command center
=============================================================================================*/

/*===============================
      Create Custom IsExist
===============================*/

export const customFieldIsExist =
  (fieldName, entity, formData, callBackCustomFields) => async (dispatch) => {
    const headers = {
      "Content-Type": "application/json",
      workspaceId: workspaceId,
    };
    try {
      let { data } = await axios.get(
        `${url}/api/fields/exist?name=${fieldName}&entity=${entity}`,
        {
          headers: headers,
        }
      );
      if (data) {
        if (data.isExist) {
          Alert.success("<h4>Custom field already exist</h4>", {
            position: "top-right",
            effect: "slide",
            beep: false,
            html: true,
            timeout: 5000,
            // offset: 100
          });
        } else {
          dispatch(createCustomField(formData, callBackCustomFields));
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

/*===============================
      Create Custom Field
===============================*/

export const createCustomField =
  (formData, callBackCustomFields) => async (dispatch) => {
    const headers = {
      "Content-Type": "application/json",
      workspaceId: workspaceId,
    };
    try {
      let { data, status } = await axios.post(`${url}/api/fields`, formData, {
        headers: headers,
      });
      if (data) {
        Alert.success("<h4>Custom field created</h4>", {
          position: "top-right",
          effect: "slide",
          beep: false,
          html: true,
          timeout: 5000,
          // offset: 100
        });
        callBackCustomFields(status);
        dispatch(getAllCustomFields());
      }
    } catch (err) {
      console.log(err);
    }
  };

/*===============================
      Get All Custom Fields
===============================*/

export const getAllCustomFields = () => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data } = await axios.get(`${url}/api/fields?pageNo=1&pageSize=10`, {
      headers: headers,
    });
    if (data) {
      dispatch({
        type: SET_ALL_CUSTOM_FIELDS,
        payload: data,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

/*===============================
      Get All Custom Fields
===============================*/

export const UpdateCustomFields =
  (formData, callBackUpdateField) => async (dispatch) => {
    const headers = {
      "Content-Type": "application/json",
      workspaceId: workspaceId,
    };
    try {
      let { data, status } = await axios.put(
        `${url}/api/fields/${formData._id}`,
        formData,
        {
          headers: headers,
        }
      );
      if (data) {
        Alert.success("<h4>Custom field updated</h4>", {
          position: "top-right",
          effect: "slide",
          beep: false,
          html: true,
          timeout: 5000,
          // offset: 100
        });
        dispatch(getAllCustomFields());
        callBackUpdateField(status);
      }
    } catch (err) {
      console.log(err);
    }
  };

/*===============================
      Delete Custom Field
===============================*/

export const deleteCustomField =
  (customFieldId, callBackDelete) => async (dispatch) => {
    const headers = {
      "Content-Type": "application/json",
      workspaceId: workspaceId,
    };
    try {
      let { data, status } = await axios.delete(
        `${url}/api/fields/${customFieldId}`,
        {
          headers: headers,
        }
      );
      if (data) {
        Alert.success("<h4>Custom field deleted</h4>", {
          position: "top-right",
          effect: "slide",
          beep: false,
          html: true,
          timeout: 5000,
          // offset: 100
        });
        dispatch(getAllCustomFields());
        callBackDelete();
      }
    } catch (err) {
      console.log(err);
    }
  };

/*=====================================
      Get All Custom Fields By Entity
=======================================*/

export const getAllCustomFieldsByEntity = (entityName) => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };

  const formData = {
    entity: entityName,
  };
  try {
    let { data, status } = await axios.post(
      `${url}/api/fields/search`,
      formData,
      {
        headers: headers,
      }
    );
    if (data) {
      if (entityName === "LEAD") {
        dispatch({
          type: SET_LEADS_ALL_CUSTOME_FIELDS,
          payload: data,
        });
      } else if (entityName === "ACCOUNT") {
        dispatch({
          type: SET_ACCOUNT_ALL_CUSTOME_FIELDS,
          payload: data,
        });
      } else if (entityName === "DEAL") {
        dispatch({
          type: SET_DEAL_ALL_CUSTOME_FIELDS,
          payload: data,
        });
      }
    }
  } catch (err) {
    console.log(err);
  }
};

/*===============================
      Create Field Value 
===============================*/

export const createFieldValue = (formData) => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data } = await axios.post(`${url}/api/fvalues`, formData, {
      headers: headers,
    });
    if (data) {
      console.log(data);
    }
  } catch (err) {
    console.log(err);
  }
};

/*===============================
  Update Field Value by id 
===============================*/

export const updateFieldValueById = (formData) => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data } = await axios.put(
      `${url}/api/fvalues/${formData._id}`,
      formData,
      {
        headers: headers,
      }
    );
    if (data) {
      console.log(data);
    }
  } catch (err) {
    console.log(err);
  }
};

/*=====================================
      Get All Fields value By query
=======================================*/

export const getAllFieldsValue = (formData) => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data } = await axios.post(`${url}/api/fvalues/search`, formData, {
      headers: headers,
    });
    if (data) {
      dispatch({
        type: GET_FIELDS_VALUE_BY_ENTITY,
        payload: data,
      });
    }
  } catch (err) {
    console.log(err);
  }
};
