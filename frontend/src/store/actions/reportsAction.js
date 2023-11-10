import axios from "axios";
import { url } from "./config";
import {
  SET_EMAIL_GRAPH,
  SET_SOCIAL_MEDIA_GRAPH,
  SET_LEADS_CLOSED_GRAPH,
  SET_LEADS_CLOSED_GRAPH_MONTHLY,
  SET_LEADS_CLOSED_GRAPH_WEEKLY,
  SET_LEADS_REVENU_GRAPH_YEARLY,
  SET_LEADS_REVENU_GRAPH_MONTHLY,
  SET_LEADS_REVENU_GRAPH_WEEKLY,
  SET_LEADS_COUNT,
  SET_REPORTS_LEADS_DROP,
  SET_LEADS_LEVELS_GRAPH_DATA,
  SET_OWNER_WISE_LEADS,
  SET_ACCOUNT_WITH_MAX_REVENUE,
  SET_TOTAL_REVENUE_GENERATED_MONTHWISE,
  SET_REVENUE_GENERATED_FROM_RECURRING_DEALS,
  SET_BIGGEST_DEAL_REVENUE,
  SET_FUTURE_REVENUE_PROJECTION,
  SET_FUTURE_REVENUE_PREDICTION,
  SET_DEALS_AND_LEADS_OF_ACCOUNT_CHART,
  GET_CLOSED_DEAL_BY_MONTH_CHART,
  SET_TOTAL_REVENUE_GENERATED_BY_ACCOUNT,
} from "./../types";
import dateFns from "date-fns";
import { workspaceId } from "./config";

/*========================================
            Leads count graph
==========================================*/
export const getLeadsCountGraph = () => (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  axios
    .get(`${url}/api/graph/leads/status`, { headers: headers })
    .then((res) => {
      dispatch({
        type: SET_LEADS_COUNT,
        payload: res.data,
      });
    })
    .catch((err) => console.log(err));
};

/*========================================
              Email Graphs
==========================================*/
export const getEmailGraphData = (startDate, endDate) => (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  axios
    .get(`${url}/api/graph/email?startDate=${startDate}&endDate=${endDate}`, {
      headers: headers,
    })
    .then((res) => {
      dispatch({
        type: SET_EMAIL_GRAPH,
        payload: res.data,
      });
    })
    .catch((err) => console.log(err));
};

/*============================================
  Leads Generated through social media graph
===============================================*/
export const getSocialMediaGraph = (isOrganisation, startDate, endDate) => (
  dispatch
) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  axios
    .get(
      `${url}/api/graph/lead/media?startDate=${startDate}&endDate=${endDate}`,
      { headers: headers }
    )
    .then((res) => {
      dispatch({
        type: SET_SOCIAL_MEDIA_GRAPH,
        payload: res.data,
      });
    })
    .catch((err) => console.log(err));
};

/*=======================================
        Leads closed graph
========================================*/
export const getLeadsClosedGraphYearly = (type) => (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  axios
    .get(`${url}/api/graph/lead?view=${type}`, { headers: headers })
    .then((res) => {
      dispatch({
        type: SET_LEADS_CLOSED_GRAPH,
        payload: res.data,
      });
    })
    .catch((err) => console.log(err));
};

export const getLeadsClosedGraphMonthly = (type, year) => (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  axios
    .get(`${url}/api/graph/lead?view=${type}&year=${year}`, {
      headers: headers,
    })
    .then((res) => {
      dispatch({
        type: SET_LEADS_CLOSED_GRAPH_MONTHLY,
        payload: res.data,
      });
    })
    .catch((err) => console.log(err));
};

export const getLeadsClosedGraphWeekly = (type, year, month) => (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  axios
    .get(`${url}/api/graph/lead?view=${type}&year=${year}&month=${month}`, {
      headers: headers,
    })
    .then((res) => {
      dispatch({
        type: SET_LEADS_CLOSED_GRAPH_WEEKLY,
        payload: res.data,
      });
    })
    .catch((err) => console.log(err));
};

/*=======================================
        Leads Revenu graph
========================================*/
export const getLeadsRevenuGraphYearly = (type) => (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  axios
    .get(`${url}/api/graph/lead?view=${type}&revenue=true`, {
      headers: headers,
    })
    .then((res) => {
      dispatch({
        type: SET_LEADS_REVENU_GRAPH_YEARLY,
        payload: res.data,
      });
    })
    .catch((err) => console.log(err));
};

export const getLeadsRevenuGraphMonthly = (type, year) => (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  axios
    .get(`${url}/api/graph/lead?view=${type}&year=${year}&revenue=true`, {
      headers: headers,
    })
    .then((res) => {
      dispatch({
        type: SET_LEADS_REVENU_GRAPH_MONTHLY,
        payload: res.data,
      });
    })
    .catch((err) => console.log(err));
};

export const getLeadsRevenuGraphWeekly = (type, year, month) => (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  axios
    .get(
      `${url}/api/graph/lead?view=${type}&year=${year}&month=${month}&revenue=true`,
      { headers: headers }
    )
    .then((res) => {
      dispatch({
        type: SET_LEADS_REVENU_GRAPH_WEEKLY,
        payload: res.data,
      });
    })
    .catch((err) => console.log(err));
};

/*=================================================
              Reason For Lead Drop
==================================================*/

export const reasonsForLeadDrop = (isOrganization) => (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  axios
    .get(
      `${url}/api/leads/widget?widgetNo=3&isOrganisation=${isOrganization}`,
      { headers: headers }
    )
    .then((res) => {
      dispatch({
        type: SET_REPORTS_LEADS_DROP,
        payload: res.data,
      });
    })
    .catch((err) => console.log(err));
};

/*==================================================
               Leads level chart
====================================================*/
export const getLeadsLevelsChartGraph = (
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
      let graphData = res.data.grapghData;
      // sort top 4 labels
      let graphDataLabel = res.data.grapghData.labels.slice(0, 4);
      // sort top 4 values
      let graphDataValues = res.data.grapghData.values.slice(0, 4);
      graphData.labels = graphDataLabel;
      graphData.values = graphDataValues;
      // console.log(graphDataValues);
      dispatch({
        type: SET_LEADS_LEVELS_GRAPH_DATA,
        payload: graphData,
      });
    })
    .catch((err) => console.log(err));
};

/*===========================================================
                Reports Owner Wise Leads
============================================================*/
export const getOwnerWiseLeads = (isOrganisation) => (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  let startDate = dateFns.startOfMonth(new Date()).toISOString();
  let endDate = dateFns.endOfMonth(new Date()).toISOString();
  axios
    .get(
      `${url}/api/itargets/ownerwise?startDate=${startDate}&endDate=${endDate}`,
      { headers: headers }
    )
    .then((res) => {
      // console.log(res.data);
      dispatch({
        type: SET_OWNER_WISE_LEADS,
        payload: res.data,
      });
    })
    .catch((err) => console.log(err));
};

/*===========================================================
              Accounts with Max Revenue
============================================================*/
export const getAccountWithMaxRevenueChart = () => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data } = await axios.get(`${url}/api/revenues/maxrevchart`, {
      headers: headers,
    });
    if (data) {
      dispatch({
        type: SET_ACCOUNT_WITH_MAX_REVENUE,
        payload: data,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

/*===========================================================
              Total Revenue Generated ($)
============================================================*/
export const totalRevenueGeneratedMonthWise = () => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data } = await axios.get(`${url}/api/revenues/monrevchart`, {
      headers: headers,
    });
    if (data) {
      dispatch({
        type: SET_TOTAL_REVENUE_GENERATED_MONTHWISE,
        payload: data,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

/*===========================================================
              Revenue from Reoccurring deals($)
============================================================*/
export const revenueFromRecurringDealsChart = (startDate, endDate) => async (
  dispatch
) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  // let startDate = dateFns.startOfMonth(new Date()).toISOString();
  // let endDate = dateFns.endOfMonth(new Date()).toISOString();
  try {
    let {
      data,
    } = await axios.get(
      `${url}/api/revenues/recurdealchart?startDate=${startDate}&endDate=${endDate}`,
      { headers: headers }
    );
    if (data) {
      dispatch({
        type: SET_REVENUE_GENERATED_FROM_RECURRING_DEALS,
        payload: data,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

/*===========================================================
              Biggest Deals
============================================================*/
export const biggestDeals = (startDate, endDate) => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  // let startDate = dateFns.startOfMonth(new Date()).toISOString();
  // let endDate = dateFns.endOfMonth(new Date()).toISOString();
  try {
    let {
      data,
    } = await axios.get(
      `${url}/api/revenues/bigdealchart?startDate=${startDate}&endDate=${endDate}`,
      { headers: headers }
    );
    if (data) {
      dispatch({
        type: SET_BIGGEST_DEAL_REVENUE,
        payload: data,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

/*===========================================================
          Future Reoccuring Revenue Projection
============================================================*/
export const futureRecurringRevnueProjection = () => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data } = await axios.get(`${url}/api/revenues/projectionchart`, {
      headers: headers,
    });
    if (data) {
      dispatch({
        type: SET_FUTURE_REVENUE_PROJECTION,
        payload: data,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

/*===========================================================
          Future Reoccuring Revenue Projection
============================================================*/
export const futureRevenuePrediction = () => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data } = await axios.get(`${url}/api/revenues/revpredictchart`, {
      headers: headers,
    });
    if (data) {
      dispatch({
        type: SET_FUTURE_REVENUE_PREDICTION,
        payload: data,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

/*===========================================================
              Deals & Leads in Accounts
============================================================*/
export const getDealsAndLeadsInAccounts = () => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data } = await axios.get(`${url}/api/accounts/aldchart?`, {
      headers: headers,
    });
    if (data) {
      dispatch({
        type: SET_DEALS_AND_LEADS_OF_ACCOUNT_CHART,
        payload: data,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

/*===========================================================
                 Closed deals by month
============================================================*/
export const getClosedDealsByMonthChart = () => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data } = await axios.get(`${url}/api/deals/mondealschart`, {
      headers: headers,
    });
    if (data) {
      dispatch({
        type: GET_CLOSED_DEAL_BY_MONTH_CHART,
        payload: data,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

/*===========================================================
          Total Revenue Generated by Account
============================================================*/
export const totalRvenueGeneratedByAccount = (accountId) => async (
  dispatch
) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let {
      data,
    } = await axios.get(
      `${url}/api/revenues/accmonrevchart?account=${accountId}`,
      { headers: headers }
    );
    if (data) {
      dispatch({
        type: SET_TOTAL_REVENUE_GENERATED_BY_ACCOUNT,
        payload: data,
      });
    }
  } catch (err) {
    console.log(err);
  }
};
