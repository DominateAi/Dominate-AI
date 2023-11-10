import axios from "axios";
import { url } from "./config";
import {
  SET_LEADS_GENERATED_FROM_SOCIAL_MEDIA,
  SET_TASK_COMPLETED_COUNT,
  SET_SUPER_HOT_COUNT,
  SET_COLD_COUNT,
  SET_HOT_COUNT,
  SET_WARM_COUNT,
  SET_ACTIVE_CUSTOMERS_COUNT,
  SET_TASK_LIST_COUNT,
  SET_TODAYS_MEET_AND_FOLLOWUP,
  SET_TODAYS_MEET,
  SET_CUSTOMER_STATUS_GRAPH,
  SET_YOUR_PREDICTION_GRAPH,
  SET_USER_TARGET_GRAPH,
  SET_PERFORMANCE_LEADERBOARD_CURRENT,
  SET_PERFORMANCE_LEADERBOARD_PREVIOUS,
  SET_ALL_LEADS_COUNT,
  SET_DASHBOARD_NOTIFICATION,
  SET_DASHBOARD_CALENDER_WIDGET_MEET_FOLLOWUP,
  SET_DASHBOARD_MONTH_STATUS_COUNT,
  SET_LEADS_SOURCE_BY_REVENUE,
  SET_DEALS_IN_PIPELINE,
  SET_TODAYS_TASKS,
  SET_MONTHLY_TARGET_BY_DOLLER,
  SET_MONTHLY_TARGET_BY_LEAD,
  SET_MONTHLY_AND_QUATERLY_REVENUE,
  SET_REVENUE_FORCAST_GRAPH_DATA,
  SET_EXPECTED_VS_AQUIRED_REVENUE,
} from "./../types";
import dateFns from "date-fns";
import { workspaceId } from "./config";

/*===================================================================================================
                                              Count Section
=====================================================================================================*/

/*===========================================
      Leads Generated from social media
============================================*/
export const getLeadsContFromSocialMedia = () => (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  axios
    .get(`${url}/api/leads/socialMedia/count`, { headers: headers })
    .then((res) => {
      dispatch({
        type: SET_LEADS_GENERATED_FROM_SOCIAL_MEDIA,
        payload: res.data,
      });
    })
    .catch((err) => console.log(err));
};

/*=============================================
        Task Completed so far count
==============================================*/
export const getTaskCompletedCount = () => (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  axios
    .get(`${url}/api/tasks/completed`, { headers: headers })
    .then((res) =>
      dispatch({
        type: SET_TASK_COMPLETED_COUNT,
        payload: res.data,
      })
    )
    .catch((err) => console.log(err));
};

/*=============================================
  Get Degree count acording to level status
==============================================*/
export const getDegreeCount = (level) => (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  axios
    .get(`${url}/api/leads/count?key=degree&value=${level}`, {
      headers: headers,
    })
    .then((res) => {
      if (level === "SUPER_HOT") {
        dispatch({
          type: SET_SUPER_HOT_COUNT,
          payload: res.data,
        });
      } else if (level === "COLD") {
        dispatch({
          type: SET_COLD_COUNT,
          payload: res.data,
        });
      } else if (level === "HOT") {
        dispatch({
          type: SET_HOT_COUNT,
          payload: res.data,
        });
      } else if (level === "WARM") {
        dispatch({
          type: SET_WARM_COUNT,
          payload: res.data,
        });
      }
    })
    .catch((err) => console.log(err));
};

/*====================================
    Get Active Customer Count
=====================================*/
export const getActiveCustomersCount = () => (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  axios
    .get(`${url}/api/customers/count?key=status&value=ACTIVE`, {
      headers: headers,
    })
    .then((res) => {
      dispatch({
        type: SET_ACTIVE_CUSTOMERS_COUNT,
        payload: res.data,
      });
    })
    .catch((err) => console.log(err));
};

/*====================================
          Get Taks List Count
=====================================*/
export const getTaskListCount = () => (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  axios
    .get(`${url}/api/tasks/count`, { headers: headers })
    .then((res) => {
      dispatch({
        type: SET_TASK_LIST_COUNT,
        payload: res.data,
      });
    })
    .catch((err) => console.log(err));
};

/*=====================================
        Get all lEad Count
======================================*/
export const getAllLeadCount = () => (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  axios
    .get(`${url}/api/leads`, { headers: headers })
    .then((res) => {
      dispatch({
        type: SET_ALL_LEADS_COUNT,
        payload: res.data,
      });
    })
    .catch((err) => console.log(err));
};

/*==================================================================================================
                                            Others Section
====================================================================================================




/*=================================================
                Dashboard Notifications
==================================================*/
export const getDashBoardNotification = (pageSize, pageNo) => (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  axios
    .get(`${url}/api/notifications?pageSize=${pageSize}&pageNo=${pageNo}`, {
      headers: headers,
    })
    .then((res) => {
      dispatch({
        type: SET_DASHBOARD_NOTIFICATION,
        payload: res.data,
      });
    })
    .catch((err) => console.log(err));
};

/*===================================================
              Read Notifications
====================================================*/
export const readDashBoardNotification = (notificationId, pageNo) => (
  dispatch
) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  axios
    .put(`${url}/api/notifications/${notificationId}/read`, {
      headers: headers,
    })
    .then((res) => {
      dispatch(getDashBoardNotification("10", pageNo));
    })
    .catch((err) => console.log(err));
};

/*===================================================
                Performance Score Borad
====================================================*/
export const performanceScoreBoard = (period) => (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  axios
    .get(`${url}/api/leads/leaderboard?period=${period}`, { headers: headers })
    .then((res) => {
      if (period === "current") {
        dispatch({
          type: SET_PERFORMANCE_LEADERBOARD_CURRENT,
          payload: res.data,
        });
      } else {
        dispatch({
          type: SET_PERFORMANCE_LEADERBOARD_PREVIOUS,
          payload: res.data,
        });
      }
    })
    .catch((err) => console.log(err));
};
export const performanceScoreBoardprevious = (period) => (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  axios
    .get(`${url}/api/leads/leaderboard?period=${period}`, { headers: headers })
    .then((res) => {
      dispatch({
        type: SET_PERFORMANCE_LEADERBOARD_PREVIOUS,
        payload: res.data,
      });
    })
    .catch((err) => console.log(err));
};

/*===================================================
                 Get All FollowUPs 
===================================================*/
export const getTodaysFollowUps = (isOrganisation) => (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  axios
    .get(
      `${url}/api/leads/today/all?type=followup&isOrganisation=${isOrganisation}`,
      { headers: headers }
    )
    .then((res) => {
      dispatch({
        type: SET_TODAYS_MEET_AND_FOLLOWUP,
        payload: res.data,
      });
    })
    .catch((err) => console.log(err));
};

/*==================================================
                Get All Meetings
===================================================*/
export const getTodaysMeetings = (isOrganisation) => (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  axios
    .get(
      `${url}/api/leads/today/all?type=meeting&isOrganisation=${isOrganisation}`,
      { headers: headers }
    )
    .then((res) => {
      dispatch({
        type: SET_TODAYS_MEET,
        payload: res.data,
      });
    })
    .catch((err) => console.log(err));
};

/*=====================================================
                Get Todays Tasks All
======================================================*/
export const getTodaysTasksAll = (isOraganisation) => (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  axios
    .get(
      `${url}/api/tasks/widget?widgetNo=1&isOrganisation=${isOraganisation}`,
      { headers: headers }
    )
    .then((res) =>
      dispatch({
        type: SET_TODAYS_TASKS,
        payload: res.data,
      })
    )
    .catch((err) => console.log(err));
};

/*================================================================================================
                                          Graph Sections
==================================================================================================*/

/*======================================
    Your Prdiction Graph
========================================*/
export const getYourPredictionGraph = () => (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  axios
    .get(`${url}/api/graph/leads/prediction?type=revenue`, { headers: headers })
    .then((res) => {
      dispatch({
        type: SET_YOUR_PREDICTION_GRAPH,
        payload: res.data,
      });
    })
    .catch((err) => console.log(err));
};

/*=======================================
        Customer Status chart
========================================*/
export const getCustomerStatusChart = (year) => (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  axios
    .get(`${url}/api/graph/customer/status?year=${year}`, { headers: headers })
    .then((res) => {
      dispatch({
        type: SET_CUSTOMER_STATUS_GRAPH,
        payload: res.data,
      });
    })
    .catch((err) => console.log(err));
};

/*=========================================
        My Target graph
==========================================*/
export const getMyTargetGraphData = () => (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  axios
    .get(`${url}/api/graph/users/target`, { headers: headers })
    .then((res) => {
      dispatch({
        type: SET_USER_TARGET_GRAPH,
        payload: res.data,
      });
    })
    .catch((err) => console.log(err));
};

/*============================================
  Calender Widget Dashboard get all data
=============================================*/
export const getAllDataCalenderWidget = (month, year) => (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  axios
    .get(`${url}/api/calender/all?month=${month}&year=${year}`, {
      headers: headers,
    })
    .then((res) => {
      dispatch({
        type: SET_DASHBOARD_CALENDER_WIDGET_MEET_FOLLOWUP,
        payload: res.data,
      });
    })
    .catch((err) => console.log(err));
};

/*==================================================
            Leads month status count
====================================================*/
export const getLeadsMonthStatusCount = (
  isOrganization,
  startDate,
  endDate
) => (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  axios
    .get(
      `${url}/api/leads/widget?widgetNo=2&isOrganisation=${isOrganization}&startDate=${startDate}&endDate=${endDate}`,
      { headers: headers }
    )
    .then((res) => {
      let graphData = res.data.normalData;
      // sort top 4 labels
      // let graphDataLabel = res.data.grapghData.labels.slice(0, 4);
      // // sort top 4 values
      // let graphDataValues = res.data.grapghData.values.slice(0, 4);
      // graphData.labels = graphDataLabel;
      // graphData.values = graphDataValues;
      // console.log(res.data);
      dispatch({
        type: SET_DASHBOARD_MONTH_STATUS_COUNT,
        payload: graphData,
      });
    })
    .catch((err) => console.log(err));
};

/*=====================================================
              Leads Source By Revenue
=======================================================*/
export const getLeadSourceRevenueGraph = (isOrganisation) => (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  axios
    .get(
      `${url}/api/leads/widget?widgetNo=4&isOrganisation=${isOrganisation}`,
      { headers: headers }
    )
    .then((res) =>
      dispatch({
        type: SET_LEADS_SOURCE_BY_REVENUE,
        payload: res.data,
      })
    )
    .catch((err) => console.log(err));
};

/*========================================================
               Dashboard Deals in pipeline
=========================================================*/
export const getDealsInPipeline = () => (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  axios
    .get(`${url}/api/leads/widget?widgetNo=1`, { headers: headers })
    .then((res) => {
      dispatch({
        type: SET_DEALS_IN_PIPELINE,
        payload: res.data,
      });
    })
    .catch((err) => console.log(err));
};

/*=========================================================
          Monthly Targets doller value
==========================================================*/
export const getMonthlyTargetByDoller = (isOrganisation) => (dispacth) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  var userData = JSON.parse(localStorage.getItem("Data"));
  let startDate = dateFns.startOfMonth(new Date()).toISOString();
  let endDate = dateFns.endOfMonth(new Date()).toISOString();

  if (isOrganisation) {
    axios
      .get(
        `${url}/api/otargets/orgmondollar?startDate=${startDate}&endDate=${endDate}`,
        { headers: headers }
      )
      .then((res) =>
        dispacth({
          type: SET_MONTHLY_TARGET_BY_DOLLER,
          payload: res.data,
        })
      )
      .catch((err) => console.log(err));
  } else {
    axios
      .get(
        `${url}/api/itargets/indmondollar?user=${userData.id}&startDate=${startDate}&endDate=${endDate}`
      )
      .then((res) =>
        dispacth({
          type: SET_MONTHLY_TARGET_BY_DOLLER,
          payload: res.data,
        })
      )
      .catch((err) => console.log(err));
  }
};

/*=========================================================
          Monthly Targets By Leads
==========================================================*/
export const getMonthlyTargetByLead = (isOrganisation) => (dispacth) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  var userData = JSON.parse(localStorage.getItem("Data"));
  let startDate = dateFns.startOfMonth(new Date()).toISOString();
  let endDate = dateFns.endOfMonth(new Date()).toISOString();

  if (isOrganisation) {
    axios
      .get(
        `${url}/api/otargets/orgmonthlyleadwise?startDate=${startDate}&endDate=${endDate}`,
        { headers: headers }
      )
      .then((res) =>
        dispacth({
          type: SET_MONTHLY_TARGET_BY_LEAD,
          payload: res.data,
        })
      )
      .catch((err) => console.log(err));
  } else {
    axios
      .get(
        `${url}/api/itargets/indmonthlyleadwise?user=${userData.id}&startDate=${startDate}&endDate=${endDate}`,
        { headers: headers }
      )
      .then((res) =>
        dispacth({
          type: SET_MONTHLY_TARGET_BY_LEAD,
          payload: res.data,
        })
      )
      .catch((err) => console.log(err));
  }
};

/*=============================================================================
    Pending leads and Leads closed count and monthly revenue, quaterly revenue 
==============================================================================*/

export const getMonthlyRevenueAndQuaterlyRevenue = () => (dispatch) => {
  var userData = JSON.parse(localStorage.getItem("Data"));
  let startDate = dateFns.startOfMonth(new Date()).toISOString();
  let endDate = dateFns.endOfMonth(new Date()).toISOString();
  let quarterStartDate = dateFns.startOfQuarter(new Date()).toISOString();
  let quarterEndDate = dateFns.endOfQuarter(new Date()).toISOString();
  let prevMonth = dateFns.subMonths(new Date(), 1);

  let prevMonthStartDate = dateFns.startOfMonth(prevMonth).toISOString();
  let prevMonthEndDate = dateFns.endOfMonth(prevMonth).toISOString();
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  axios
    .get(
      `${url}/api/itargets/quarterdata?user=${userData.id}&quarterStart=${quarterStartDate}&quarterEnd=${quarterEndDate}&monthStart=${startDate}&monthEnd=${endDate}&prevMonStart=${prevMonthStartDate}&prevMonEnd=${prevMonthEndDate}`,
      { headers: headers }
    )
    .then((res) => {
      dispatch({
        type: SET_MONTHLY_AND_QUATERLY_REVENUE,
        payload: res.data,
      });
    })
    .catch((err) => console.log(err));
};

/*===================================================
                Revenue Forecast
====================================================*/

export const getRevenueForcastGraph = () => (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  axios
    .get(`${url}/api/revenues/revpredictchart`, { headers: headers })
    .then((res) => {
      dispatch({
        type: SET_REVENUE_FORCAST_GRAPH_DATA,
        payload: res.data,
      });
    })
    .catch((err) => console.log(err));
};

/*====================================================
        Expected revenue vs aquired revenue
======================================================*/
export const getExpectedRevenueAndAquiredRevenue = () => (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  var userData = JSON.parse(localStorage.getItem("Data"));
  axios
    .get(`${url}/api/itargets/indrevgraph?user=${userData.id}`, {
      headers: headers,
    })
    .then((res) => {
      dispatch({
        type: SET_EXPECTED_VS_AQUIRED_REVENUE,
        payload: res.data,
      });
    })
    .catch((err) => console.log(err));
};
