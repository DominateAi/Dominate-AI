import axios from "axios";
import { url } from "./config";
import {
  SET_ALL_ACCOUNTS,
  SET_SINGLE_ACCOUNT_DATA,
  SET_DEALS_OF_ACCOUNT,
  SET_LEADS_OF_ACCOUNT,
  SET_ACCOUNTS_OVERVIEW,
  SET_REVENUE_OVERVIEW,
  SET_DEALS_AND_THEIR_REVENUE,
  SET_REVENUE_FORCAST_GRAPH,
  SET_ACCOUNT_ACTIVITY,
  GET_API_STATUS,
  SET_ACCOUNT_ACCUMULATED_GRAPH,
  SET_ACCOUNTS_WITH_DEALS_CHART,
  SET_ACCOUNT_NOTES,
  GET_NOTE_DATA,
} from "./../types";
import Alert from "react-s-alert";
import dateFns from "date-fns";
import { workspaceId } from "./config";
import {
  createFieldValue,
  updateFieldValueById,
} from "./../actions/commandCenter";
import isEmpty from "../validations/is-empty";

/*=====================================================================================
                               Account Overview
=======================================================================================*/
export const getAccountOverview = () => async (dispatch) => {
  try {
    let { data } = await axios.get(
      `${url}/api/accounts/widget?startDate=2020-02-01T05:17:37.000Z&endDate=2020-10-30T05:17:37.000Z`
    );
    if (data) {
      dispatch({
        type: SET_ACCOUNTS_OVERVIEW,
        payload: data,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

/*===========================================
      Accounts Accumulated Revenue Chart
=============================================*/

export const getAccountAccumulatedRevenueChart = () => async (dispatch) => {
  try {
    let { data } = await axios.get(`${url}/api/accounts/acc-rev-chart`);
    if (data) {
      dispatch({
        type: SET_ACCOUNT_ACCUMULATED_GRAPH,
        payload: data,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

/*===========================================
      Accounts Accumulated Revenue Chart
=============================================*/

export const getAccountsWithTotalDealChart = () => async (dispatch) => {
  try {
    let { data } = await axios.get(`${url}/api/accounts/acc-deal-count`);
    if (data) {
      dispatch({
        type: SET_ACCOUNTS_WITH_DEALS_CHART,
        payload: data,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

/*=====================================================================================
                               Acoount Main actions
=======================================================================================*/

/*=================================================
                Create Account
===================================================*/
export const createAccount =
  (
    formData,
    accountCustomFields,
    customTextboxfieldData,
    customeDropdownFieldData,
    callBackAddAccount
  ) =>
  async (dispatch) => {
    try {
      let { data, status } = await axios.post(`${url}/api/accounts`, formData);
      if (data) {
        Alert.success(`<h4>Account Created</h4>`, {
          position: "top-right",
          effect: "slide",
          beep: false,
          html: true,
          timeout: 5000,
          // offset: 100
        });
        callBackAddAccount(status);
        dispatch(getAccountOverview());
        dispatch(getAllAccounts());
        console.log(status);
        dispatch({
          type: GET_API_STATUS,
          payload: status,
        });
        //ADDING FIELD VALUE FOR CUSTOM FIELDS
        if (!isEmpty(accountCustomFields)) {
          accountCustomFields.forEach((element) => {
            if (element.type === "TEXTBOX") {
              element.name = element.name.split(" ").join("");
              const sendData = {
                field: element._id,
                entity_Id: data._id,
                value: customTextboxfieldData[element.name],
              };
              // console.log(sendData);

              dispatch(createFieldValue(sendData));
            } else if (element.type === "DROPDOWN") {
              element.name = element.name.split(" ").join("");
              const sendData = {
                field: element._id,
                entity_Id: data._id,
                value: isEmpty(customeDropdownFieldData)
                  ? ""
                  : customeDropdownFieldData[element.name].value,
              };
              // console.log(sendData);
              dispatch(createFieldValue(sendData));
            }
          });
        }
        // console.log(data);
      }
    } catch (err) {
      console.log(err);
    }
  };

/*=================================================
                Get All Accounts
===================================================*/
export const getAllAccounts = () => async (dispatch) => {
  try {
    let { data } = await axios.get(
      `${url}/api/accounts?pageNo=1&pageSize=1000`
    );
    if (data) {
      dispatch({
        type: SET_ALL_ACCOUNTS,
        payload: data,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

/*==========================================================
             Account Search
===========================================================*/

export const searchAccount = (formData) => async (dispatch) => {
  try {
    let { data } = await axios.post(`${url}/api/accounts/search`, formData);
    if (data) {
      // console.log(data);
      dispatch({
        type: SET_ALL_ACCOUNTS,
        payload: data,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

/*=================================================
            Update Account By Id
===================================================*/
export const updateAccountById =
  (
    accountId,
    formData,
    customTextboxfieldData,
    customeDropdownFieldData,
    accountCustomFields,
    callBackUpdateAccount
  ) =>
  async (dispatch) => {
    try {
      let { data, status } = await axios.put(
        `${url}/api/accounts/${accountId}`,
        formData
      );
      if (data) {
        Alert.success(`<h4>Account updated</h4>`, {
          position: "top-right",
          effect: "slide",
          beep: false,
          html: true,
          timeout: 5000,
          // offset: 100
        });
        callBackUpdateAccount(status);
        dispatch(getAccountOverview());
        dispatch(getAllAccounts());
        dispatch(getAccountById(accountId));

        //UPDATING FIELD VALUE FOR CUSTOM FIELDS
        if (!isEmpty(accountCustomFields)) {
          accountCustomFields.forEach((element) => {
            if (element.fieldData.type === "TEXTBOX") {
              element.fieldData.name = element.fieldData.name
                .split(" ")
                .join("");
              let sendData = element;
              sendData.value = isEmpty(customTextboxfieldData)
                ? ""
                : customTextboxfieldData[element.fieldData.name];

              dispatch(updateFieldValueById(sendData));
            } else if (element.fieldData.type === "DROPDOWN") {
              element.fieldData.name = element.fieldData.name
                .split(" ")
                .join("");
              let sendData = element;
              sendData.value = isEmpty(customeDropdownFieldData)
                ? ""
                : customeDropdownFieldData[element.fieldData.name].value;

              dispatch(updateFieldValueById(sendData));
            }
          });
        }
        // console.log(data);
      }
    } catch (err) {
      console.log(err);
    }
  };

/*=================================================
                Delete Account
===================================================*/
export const deleteAccount =
  (accountId, callbackDelete) => async (dispatch) => {
    try {
      let { data, status } = await axios.delete(
        `${url}/api/accounts/${accountId}`
      );
      if (data) {
        Alert.success(`<h4>Account Deleted</h4>`, {
          position: "top-right",
          effect: "slide",
          beep: false,
          html: true,
          timeout: 5000,
          // offset: 100
        });
        dispatch(getAccountOverview());
        dispatch(getAllAccounts());
        callbackDelete(status);
        // console.log(data);
      }
    } catch (err) {
      console.log(err);
    }
  };

/*=======================================
      Check If Account Is exist or not
========================================*/

export const checkIfAccountExistOrNot =
  (formData, callbackAccountExist) => (dispatch) => {
    axios
      .post(`${url}/api/accounts/search`, formData)
      .then((res) => {
        if (!isEmpty(res.data)) {
          callbackAccountExist(true);
        } else {
          callbackAccountExist(false);
        }
      })
      .catch((err) => console.log(err));
  };

/*=====================================================================================
                               Acoount details page actions
=======================================================================================*/

/*=================================================
                Get account by id
===================================================*/
export const getAccountById = (accountId) => async (dispatch) => {
  try {
    let { data } = await axios.get(`${url}/api/accounts/${accountId}`);
    if (data) {
      dispatch({
        type: SET_SINGLE_ACCOUNT_DATA,
        payload: data,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

/*=================================================
          get deals of perticular account
===================================================*/
export const getDealsOfPerticulerAccount = (accountId) => async (dispatch) => {
  try {
    let { data } = await axios.get(
      `${url}/api/deals/dealsbyacc?account=${accountId}`
    );
    if (data) {
      dispatch({
        type: SET_DEALS_OF_ACCOUNT,
        payload: data,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

/*=================================================
          get leads of perticular account
===================================================*/
export const getLeadsOfPerticulerAccount = (formData) => async (dispatch) => {
  try {
    let { data } = await axios.post(
      `${url}/api/leads/search`,

      formData
    );
    if (data) {
      dispatch({
        type: SET_LEADS_OF_ACCOUNT,
        payload: data,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

/*=====================================
    Update Lead in account deatils
======================================*/
export const updateLeadInAccountDetails =
  (leadId, formData, filterName) => async (dispatch) => {
    try {
      let { data } = await axios.put(
        `${url}/api/leads/${leadId}`,

        formData
      );
      if (data) {
        var userData = JSON.parse(localStorage.getItem("Data"));
        Alert.success("<h4>Lead Updated</h4>", {
          position: "top-right",
          effect: "slide",
          beep: false,
          html: true,
          timeout: 5000,
          // offset: 100
        });
        console.log(data);

        if (filterName === "My Leads") {
          const formLeadData = {
            query: {
              account_id: data.account_id,
              assigned: userData.id,
              status: { $ne: "ARCHIVE" },
            },
          };
          dispatch(getLeadsOfPerticulerAccount(formLeadData));
        } else if (filterName === "Hidden Leads") {
          const formLeadData = {
            query: {
              account_id: data.account_id,
              isHidden: true,
            },
          };
          dispatch(getLeadsOfPerticulerAccount(formLeadData));
        } else if (filterName === "Archive Leads") {
          const formLeadData = {
            query: {
              account_id: data.account_id,
              status: "ARCHIVE",
            },
          };
          dispatch(getLeadsOfPerticulerAccount(formLeadData));
        } else {
          const formLeadData = {
            query: {
              account_id: data.account_id,
              status: { $ne: "ARCHIVE" },
            },
          };
          dispatch(getLeadsOfPerticulerAccount(formLeadData));
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

/*=====================================
    Update Lead in account deatils
======================================*/
export const addLeadInAccountDetails =
  (leadId, formData, accountId, callBackAddLead) => async (dispatch) => {
    try {
      let { data, status } = await axios.put(
        `${url}/api/leads/${leadId}`,

        formData
      );
      if (data) {
        Alert.success("<h4>Lead added to account</h4>", {
          position: "top-right",
          effect: "slide",
          beep: false,
          html: true,
          timeout: 5000,
          // offset: 100
        });
        callBackAddLead(status);
        const formLeadData = {
          query: {
            account_id: accountId,
            status: { $ne: "ARCHIVE" },
          },
        };
        dispatch(getLeadsOfPerticulerAccount(formLeadData));
      }
    } catch (err) {
      console.log(err);
    }
  };

/*=====================================
    delete Lead in account deatils
======================================*/
export const deleteLeadInAccountDetails =
  (leadId, accountId) => async (dispatch) => {
    try {
      let { data } = await axios.delete(`${url}/api/leads/${leadId}`);
      if (data) {
        Alert.success("<h4>Lead Archive</h4>", {
          position: "top-right",
          effect: "slide",
          beep: false,
          html: true,
          timeout: 5000,
          // offset: 100
        });
        const formLeadData = {
          query: {
            account_id: data.account_id,
            status: { $ne: "ARCHIVE" },
          },
        };
        dispatch(getLeadsOfPerticulerAccount(formLeadData));
      }
    } catch (err) {
      console.log(err);
    }
  };

/*=====================================================================================
                                 Revenue Tab
=====================================================================================*/
/*=================================================
          Get Revenue forcast chart
===================================================*/
export const getRevenueForcastGraph = (accountId) => async (dispatch) => {
  try {
    let { data } = await axios.get(
      `${url}/api/revenues/revforecast?account=${accountId}`
    );
    if (data) {
      dispatch({
        type: SET_REVENUE_FORCAST_GRAPH,
        payload: data,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

/*=================================================
      get total account revenue overview
===================================================*/
export const getRevenueOverview = (accountId) => async (dispatch) => {
  let startDate = dateFns.startOfMonth(new Date()).toISOString();
  let endDate = dateFns.endOfMonth(new Date()).toISOString();
  try {
    let { data } = await axios.get(
      `${url}/api/revenues/widget?account=${accountId}&startDate=${startDate}&endDate=${endDate}`
    );
    if (data) {
      dispatch({
        type: SET_REVENUE_OVERVIEW,
        payload: data,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

/*=================================================
              deals and their revenue
===================================================*/
export const getDealsAndTheirRevenue = (accountId) => async (dispatch) => {
  try {
    let { data } = await axios.get(
      `${url}/api/revenues/highrevdeal?account=${accountId}`
    );
    if (data) {
      dispatch({
        type: SET_DEALS_AND_THEIR_REVENUE,
        payload: data,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

/*=====================================================================================
                                 Timeline Tab
=====================================================================================*/
/*=================================================
            Get account Timeline
===================================================*/
export const getAccountTimeline = (accountId) => async (dispatch) => {
  try {
    let { data } = await axios.get(
      `${url}/api/activities?pageNo=1&pageSize=100&entityId=${accountId}&entityType=ACCOUNT`
    );
    if (data) {
      let filterData = data.filter(
        (activity) => activity.entityType === "ACCOUNT"
      );
      // console.log(filterData);
      dispatch({
        type: SET_ACCOUNT_ACTIVITY,
        payload: filterData,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

/*=================================================================================================
                                         Account Details Note
===================================================================================================*/

/*=================================================
                     Create Note
===================================================*/
export const createNote = (formData, callbackAddTask) => async (dispatch) => {
  try {
    let { data, status } = await axios.post(`${url}/api/notes`, formData);
    if (data) {
      Alert.success("<h4>Note Created</h4>", {
        position: "top-right",
        effect: "slide",
        beep: false,
        html: true,
        timeout: 5000,
        // offset: 100
      });

      const allNotesQuery = {
        query: {
          entityType: "ACCOUNT",
          entityId: formData.entityId,
        },
      };
      dispatch(getAllNotes(allNotesQuery));
      callbackAddTask(status);
    }
  } catch (err) {
    console.log(err);
  }
};

/*=================================================
                     Get All Notes
===================================================*/
export const getAllNotes = (formData) => async (dispatch) => {
  try {
    let { data } = await axios.post(`${url}/api/notes/search`, formData);
    if (data) {
      dispatch({
        type: SET_ACCOUNT_NOTES,
        payload: data,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

/*=================================================
            Get Note By Id
===================================================*/
export const getNoteById = (noteId) => async (dispatch) => {
  try {
    let { data } = await axios.get(`${url}/api/notes/${noteId}`);
    if (data) {
      dispatch({
        type: GET_NOTE_DATA,
        payload: data,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

/*=================================================
                     Get All Notes
===================================================*/
export const deleteNoteById = (noteId, accountId) => async (dispatch) => {
  try {
    let { data } = await axios.delete(`${url}/api/notes/${noteId}`);
    if (data) {
      Alert.success("<h4>Note deleted</h4>", {
        position: "top-right",
        effect: "slide",
        beep: false,
        html: true,
        timeout: 5000,
        // offset: 100
      });

      const allNotesQuery = {
        query: {
          entityType: "ACCOUNT",
          entityId: accountId,
        },
      };
      dispatch(getAllNotes(allNotesQuery));
    }
  } catch (err) {
    console.log(err);
  }
};

/*=================================================
              Update note by id
===================================================*/

export const updateNoteById =
  (noteId, formData, callbackUpdateTask) => async (dispatch) => {
    try {
      let { data, status } = await axios.put(
        `${url}/api/notes/${noteId}`,
        formData
      );
      if (data) {
        Alert.success("<h4>Note Updated</h4>", {
          position: "top-right",
          effect: "slide",
          beep: false,
          html: true,
          timeout: 5000,
          // offset: 100
        });

        callbackUpdateTask(status);
        const allNotesQuery = {
          query: {
            entityType: "ACCOUNT",
            entityId: formData.entityId,
          },
        };
        dispatch(getAllNotes(allNotesQuery));
        dispatch(getNoteById(data._id));
      }
    } catch (err) {
      console.log(err);
    }
  };
