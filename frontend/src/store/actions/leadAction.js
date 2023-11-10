import axios from "axios";
import {
  GET_ALL_LEAD,
  GET_LEADS_OVERVIEW,
  GET_API_STATUS,
  GET_KANBAN_LEADS,
  GET_CURRENT_LEAD_ADDED_DATA,
  GET_STATUS_COUNT,
  GET_LEADS_COUNT,
  GET_LEAD_COUNT_BY_STATUS,
  GET_KANBAN_STATUS_CHANGE,
  GET_ALL_ACTIVE_LEAD,
  SET_ERRORS,
  SET_LEAD_ACTIVITY_SUMMARY_INFO,
  SET_OVERVIEW_FILTERNAME,
  SET_LOADER,
  CLEAR_LOADER,
  SET_SINGLE_LEAD_CLOSURE_PROBABLITY,
} from "./../types";
import { getDealsInPipeline } from "./../actions/dashBoardAction";
import {
  createAchievementForUser,
  MatchAchievementForUser,
  createFieldValue,
} from "./../actions/commandCenter";
import Alert from "react-s-alert";
import { url } from "./config";
import isEmpty from "../validations/is-empty";

/*===================================
          ADD LEADS API
=====================================*/
export const addLeadAction =
  (
    formData,
    filterName,
    userId,
    leadsCustomFields,
    customTextboxfieldData,
    customeDropdownFieldData,
    callBackAddLead
  ) =>
  (dispatch) => {
    axios
      .post(`${url}/api/leads`, formData)
      .then((res) => {
        Alert.success("<h4>Lead Added</h4>", {
          position: "top-right",
          effect: "slide",
          beep: false,
          html: true,
          timeout: 5000,
          // offset: 100
        });

        const formData = {
          user: res.data.assigned,
          lead: res.data._id,
          value: res.data.worth,
          onDate: new Date().toISOString(),
          type: res.data.status,
        };
        dispatch(createAchievementForUser(formData));

        dispatch({
          type: GET_CURRENT_LEAD_ADDED_DATA,
          payload: res.data,
        });
        callBackAddLead(res.status);
        dispatch({
          type: SET_OVERVIEW_FILTERNAME,
          payload: {},
        });
        const allLeadQuery = {
          query: {},
        };
        dispatch(getAllActiveLeads(allLeadQuery));
        dispatch(singleLeadClosureProbablity());
        if (filterName === "My Leads") {
          const myLeadQuery = {
            query: {
              assigned: userId,
              status: { $ne: "ARCHIVE" },
            },
          };
          const myLeadOverviewQuery = {
            assigned: userId,
            status: { $ne: "ARCHIVE" },
          };
          dispatch(getMyLeads(myLeadQuery));
          // dispatch(getLeadsOverview());
          setTimeout(() => {
            dispatch(getOverviewFilterForCount(myLeadOverviewQuery));
          }, 50);

          dispatch(getFunelView());
          dispatch(getKanBanLeads(userId));
          dispatch(getAllLeadsCount());
        } else if (filterName === "All Leads") {
          const allLeadQuery = {
            query: {
              status: { $ne: "ARCHIVE" },
            },
          };
          const overviewQuery = {
            status: { $ne: "ARCHIVE" },
          };
          dispatch(getAllLeads(allLeadQuery));
          // dispatch(getLeadsOverview());
          setTimeout(() => {
            dispatch(getOverviewFilterForCount(overviewQuery));
          }, 50);

          dispatch(getFunelView());
          dispatch(getKanBanLeads(userId));
          dispatch(getAllLeadsCount());
        } else if (filterName === "Hidden Leads") {
          const hiddenLeadQuery = {
            query: {
              isHidden: true,
            },
          };
          const hiddenLeadOverviewQuery = {
            isHidden: true,
          };
          dispatch(getAllHiddenleads(hiddenLeadQuery));
          // dispatch(getLeadsOverview());
          setTimeout(() => {
            dispatch(getOverviewFilterForCount(hiddenLeadOverviewQuery));
          }, 50);

          dispatch(getFunelView());
          dispatch(getKanBanLeads(userId));
          dispatch(getAllLeadsCount());
        } else {
          const archiveLeads = {
            query: {
              status: "ARCHIVE",
            },
          };
          const archiveLeadOverviewQuery = {
            status: "ARCHIVE",
          };
          dispatch(leadsFilterByStatus(archiveLeads));
          // dispatch(getLeadsOverview());
          setTimeout(() => {
            dispatch(getOverviewFilterForCount(archiveLeadOverviewQuery));
          }, 50);

          dispatch(getFunelView());
          dispatch(getKanBanLeads(userId));
          dispatch(getAllLeadsCount());
        }

        //ADDING FIELD VALUE FOR CUSTOM FIELDS
        if (!isEmpty(leadsCustomFields)) {
          leadsCustomFields.forEach((element) => {
            if (element.type === "TEXTBOX") {
              element.name = element.name.split(" ").join("");
              const sendData = {
                field: element._id,
                entity_Id: res.data._id,
                value: customTextboxfieldData[element.name],
              };
              // console.log(sendData);

              dispatch(createFieldValue(sendData));
            } else if (element.type === "DROPDOWN") {
              element.name = element.name.split(" ").join("");
              const sendData = {
                field: element._id,
                entity_Id: res.data._id,
                value: isEmpty(customeDropdownFieldData)
                  ? ""
                  : customeDropdownFieldData[element.name].value,
              };
              // console.log(sendData);

              dispatch(createFieldValue(sendData));
            }
          });
        }
      })
      .catch((err) => {
        dispatch({
          type: SET_ERRORS,
          payload: err,
        });
        // Alert.error(`<h4>${err.response.data.message}</h4>`, {
        //   position: "top-right",
        //   effect: "slide",
        //   beep: false,
        //   html: true,
        //   timeout: 5000,
        //   // offset: 100
        // });
      });
  };

/*=====================================
    Update Lead api
======================================*/
export const updateLeadAction =
  (leadId, formData, userId, filterName, callBackHandleSave) => (dispatch) => {
    axios
      .put(`${url}/api/leads/${leadId}`, formData)
      .then((res) => {
        if (
          formData.status === "NEW_LEAD" ||
          formData.status === "CONTACTED_LEADS" ||
          formData.status === "CONVERTED"
        ) {
          dispatch(
            MatchAchievementForUser(res.data._id, res.data.status, res.data)
          );
        }
        // dispatch({
        //   type: GET_CURRENT_LEAD_ADDED_DATA,
        //   payload: res.data
        // });
        dispatch({
          type: GET_API_STATUS,
          payload: res.status,
        });
        if (callBackHandleSave) {
          callBackHandleSave(res.status);
        }
        dispatch(getLeadById(leadId));
        Alert.success("<h4>Lead Updated</h4>", {
          position: "top-right",
          effect: "slide",
          beep: false,
          html: true,
          timeout: 5000,
          // offset: 100
        });
        if (filterName === "My Leads") {
          const myLeadQuery = {
            query: {
              assigned: userId,
              status: { $ne: "ARCHIVE" },
            },
          };
          const myLeadOverviewQuery = {
            assigned: userId,
            status: { $ne: "ARCHIVE" },
          };
          dispatch(getMyLeads(myLeadQuery));
          // dispatch(getLeadsOverview());
          setTimeout(() => {
            dispatch(getOverviewFilterForCount(myLeadOverviewQuery));
          }, 50);

          dispatch(getKanBanLeads(userId));
          dispatch(getDealsInPipeline());
          dispatch(getFunelView());
        } else if (filterName === "All Leads") {
          const allLeadQuery = {
            query: {
              status: { $ne: "ARCHIVE" },
            },
          };
          const overviewQuery = {
            status: { $ne: "ARCHIVE" },
          };
          dispatch(getAllLeads(allLeadQuery));
          // dispatch(getLeadsOverview());
          setTimeout(() => {
            dispatch(getOverviewFilterForCount(overviewQuery));
          }, 50);

          dispatch(getKanBanLeads(userId));
          dispatch(getDealsInPipeline());
          dispatch(getFunelView());
        } else if (filterName === "Hidden Leads") {
          const hiddenLeadQuery = {
            query: {
              isHidden: true,
            },
          };
          const hiddenLeadOverviewQuery = {
            isHidden: true,
          };
          dispatch(getAllHiddenleads(hiddenLeadQuery));
          // dispatch(getLeadsOverview());
          setTimeout(() => {
            dispatch(getOverviewFilterForCount(hiddenLeadOverviewQuery));
          }, 50);

          dispatch(getKanBanLeads(userId));
          dispatch(getDealsInPipeline());
          dispatch(getFunelView());
        } else {
          const archiveLeads = {
            query: {
              status: "ARCHIVE",
            },
          };
          const archiveLeadOverviewQuery = {
            status: "ARCHIVE",
          };
          dispatch(leadsFilterByStatus(archiveLeads));
          // dispatch(getLeadsOverview());
          setTimeout(() => {
            dispatch(getOverviewFilterForCount(archiveLeadOverviewQuery));
          }, 50);

          dispatch(getKanBanLeads(userId));
          dispatch(getDealsInPipeline());
          dispatch(getFunelView());
        }
      })
      .catch((err) => {
        Alert.error(`<h4>${err}</h4>`, {
          position: "top-right",
          effect: "slide",
          beep: false,
          html: true,
          timeout: 5000,
          // offset: 100
        });
      });
  };

/*=====================================
    Update Lead api
======================================*/
export const dropLeadAction =
  (leadId, formData, userId, leadUpdateCallbackAction) => (dispatch) => {
    axios
      .put(`${url}/api/leads/${leadId}`, formData)
      .then((res) => {
        leadUpdateCallbackAction(res.status);

        Alert.success("<h4>Lead Updated</h4>", {
          position: "top-right",
          effect: "slide",
          beep: false,
          html: true,
          timeout: 5000,
          // offset: 100
        });
        dispatch(getKanBanLeads(userId));
      })
      .catch((err) => {
        Alert.error(`<h4>${err}</h4>`, {
          position: "top-right",
          effect: "slide",
          beep: false,
          html: true,
          timeout: 5000,
          // offset: 100
        });
      });
  };

/*=====================================
    Update Lead In Quoattion api 
======================================*/
export const updateLeadInQuotation = (leadId, formData) => (dispatch) => {
  axios
    .put(`${url}/api/leads/${leadId}`, formData)
    .then((res) => {})
    .catch((err) => {
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

/*=====================================
    Update Lead Tags api
======================================*/
export const updateLeadTags = (leadId, userId, formData) => (dispatch) => {
  axios
    .put(`${url}/api/leads/${leadId}`, formData)
    .then((res) => {
      // dispatch({
      //   type: GET_CURRENT_LEAD_ADDED_DATA,
      //   payload: res.data
      // });

      Alert.success("<h4>Lead Tags Updated</h4>", {
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
      dispatch(getKanBanLeads(userId));
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
    });
};

/*=====================================
    Update lead Level action
=======================================*/
export const updateLeadLevelAction =
  (leadId, formData, filterName, loginUserId) => (dispatch) => {
    console.log(filterName);
    axios
      .put(`${url}/api/leads/${leadId}`, formData)
      .then((res) => {
        // dispatch({
        //   type: GET_CURRENT_LEAD_ADDED_DATA,
        //   payload: res.data
        // });
        dispatch({
          type: GET_API_STATUS,
          payload: res.status,
        });
        Alert.success("<h4>Level Updated</h4>", {
          position: "top-right",
          effect: "slide",
          beep: false,
          html: true,
          timeout: 5000,
          // offset: 100
        });
        if (filterName === "My Leads") {
          const myLeadQuery = {
            query: {
              assigned: loginUserId,
              status: { $ne: "ARCHIVE" },
            },
          };
          const myLeadOverviewQuery = {
            assigned: loginUserId,
            status: { $ne: "ARCHIVE" },
          };

          dispatch(getMyLeads(myLeadQuery));
          setTimeout(() => {
            dispatch(getOverviewFilterForCount(myLeadOverviewQuery));
          }, 50);

          // dispatch(getLeadsOverview());
          dispatch(getDealsInPipeline());
        } else if (filterName === "All Leads") {
          const allLeadQuery = {
            query: {
              status: { $ne: "ARCHIVE" },
            },
          };

          const overviewQuery = {
            status: { $ne: "ARCHIVE" },
          };

          dispatch(getAllLeads(allLeadQuery));
          // dispatch(getLeadsOverview());
          setTimeout(() => {
            dispatch(getOverviewFilterForCount(overviewQuery));
          }, 50);

          dispatch(getDealsInPipeline());
        } else if (filterName === "Hidden Leads") {
          const hiddenLeadQuery = {
            query: {
              isHidden: true,
            },
          };
          const hiddenLeadOverviewQuery = {
            isHidden: true,
          };

          dispatch(getAllHiddenleads(hiddenLeadQuery));
          // dispatch(getLeadsOverview());
          setTimeout(() => {
            dispatch(getOverviewFilterForCount(hiddenLeadOverviewQuery));
          }, 50);

          dispatch(getDealsInPipeline());
        } else if (filterName === "Archive Leads") {
          const archiveLeads = {
            query: {
              status: "ARCHIVE",
            },
          };
          const archiveLeadOverviewQuery = {
            status: "ARCHIVE",
          };

          dispatch(leadsFilterByStatus(archiveLeads));
          // dispatch(getLeadsOverview());
          setTimeout(() => {
            dispatch(getOverviewFilterForCount(archiveLeadOverviewQuery));
          }, 50);

          dispatch(getDealsInPipeline());
        } else {
          console.log("nothing");
          dispatch(getDealsInPipeline());
        }
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
      });
  };

/*=====================================
    Update KANBAN Lead Lead api
======================================*/
export const updateKanBanLeadAction =
  (leadId, formData, userId, filterName) => (dispatch) => {
    axios
      .put(`${url}/api/leads/${leadId}`, formData)
      .then((res) => {
        if (
          formData.status === "NEW_LEAD" ||
          formData.status === "CONTACTED_LEADS" ||
          formData.status === "CONVERTED"
        ) {
          dispatch(
            MatchAchievementForUser(res.data._id, res.data.status, res.data)
          );
        }

        dispatch({
          type: GET_KANBAN_STATUS_CHANGE,
          payload: res.data,
        });
        dispatch({
          type: GET_API_STATUS,
          payload: res.status,
        });
        Alert.success("<h4>Status Updated</h4>", {
          position: "top-right",
          effect: "slide",
          beep: false,
          html: true,
          timeout: 5000,
          // offset: 100
        });

        if (filterName === "My Leads") {
          const myLeadQuery = {
            query: {
              assigned: userId,
              status: { $ne: "ARCHIVE" },
            },
          };
          const myLeadOverviewQuery = {
            assigned: userId,
            status: { $ne: "ARCHIVE" },
          };

          dispatch(getKanBanLeads(userId));
          dispatch(getFunelView());

          dispatch(getMyLeads(myLeadQuery));
          // dispatch(getLeadsOverview());
          setTimeout(() => {
            dispatch(getOverviewFilterForCount(myLeadOverviewQuery));
          }, 50);
        } else if (filterName === "All Leads") {
          const allLeadQuery = {
            query: {
              status: { $ne: "ARCHIVE" },
            },
          };
          const overviewQuery = {
            status: { $ne: "ARCHIVE" },
          };

          dispatch(getKanBanLeads(userId));
          dispatch(getFunelView());

          dispatch(getAllLeads(allLeadQuery));
          // dispatch(getLeadsOverview());
          setTimeout(() => {
            dispatch(getOverviewFilterForCount(overviewQuery));
          }, 50);
        } else if (filterName === "Hidden Leads") {
          const hiddenLeadQuery = {
            query: {
              isHidden: true,
            },
          };
          const hiddenLeadOverviewQuery = {
            isHidden: true,
          };
          dispatch(getKanBanLeads(userId));
          dispatch(getFunelView());

          dispatch(getAllHiddenleads(hiddenLeadQuery));
          // dispatch(getLeadsOverview());
          setTimeout(() => {
            dispatch(getOverviewFilterForCount(hiddenLeadOverviewQuery));
          }, 50);
        } else if (filterName === "Archive Leads") {
          const archiveLeads = {
            // pageNo: 500,
            // pageSize: 0,
            query: {
              status: "ARCHIVE",
            },
          };
          const archiveLeadsOverviewQuery = {
            status: "ARCHIVE",
          };
          dispatch(getKanBanLeads(userId));
          dispatch(getFunelView());

          dispatch(leadsFilterByStatus(archiveLeads));
          // dispatch(getLeadsOverview());
          setTimeout(() => {
            dispatch(getOverviewFilterForCount(archiveLeadsOverviewQuery));
          }, 50);
        } else {
          dispatch(getKanBanLeads(userId));
          dispatch(getFunelView());
          // dispatch(getLeadsOverview());
        }
      })
      .catch((err) => {
        Alert.error(`<h4>${err}</h4>`, {
          position: "top-right",
          effect: "slide",
          beep: false,
          html: true,
          timeout: 5000,
          // offset: 100
        });
      });
  };

/*===================================
          Leads Overview
=====================================*/
export const getLeadsOverview = () => (dispatch) => {
  axios
    .get(`${url}/api/leads/overview`)
    .then((res) => {
      dispatch({
        type: GET_LEADS_OVERVIEW,
        payload: res.data,
      });
    })
    .catch((err) => console.log(err));
};

/*===================================
         Search overview
=====================================*/
export const getOverviewFilterForCount = (formData) => (dispatch) => {
  axios
    .post(`${url}/api/leads/countOverview`, formData)
    .then((res) => {
      dispatch({
        type: GET_LEADS_OVERVIEW,
        payload: res.data,
      });
    })
    .catch((err) => console.log(err));
};

/*=====================================
  Get All Leads List View Except hidden 
=======================================*/
export const getAllLeads = (formData) => (dispatch) => {
  axios
    .post(`${url}/api/leads/search`, formData)
    .then((res) => {
      dispatch({
        type: GET_ALL_LEAD,
        payload: res.data,
      });
    })
    .catch((err) => console.log(err));
};

/*=====================================
      Search followups and leads
  =======================================*/

export const searchFollowupsAndMeetings = (formData) => async (dispatch) => {
  try {
    let { data } = await axios.post(`${url}/api/leads/search/entity`, formData);
    if (data) {
      dispatch({
        type: GET_ALL_LEAD,
        payload: data,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

/*======================================
          Get Lead By Id
========================================*/
export const getLeadById = (leadId) => (dispatch) => {
  axios
    .get(`${url}/api/leads/${leadId}`)
    .then((res) => {
      dispatch({ type: SET_LEAD_ACTIVITY_SUMMARY_INFO, payload: res.data });
    })
    .catch((err) => console.log(err));
};

/*=====================================
          Get All active leads
=======================================*/
export const getAllActiveLeads = (formData) => (dispatch) => {
  axios
    .post(`${url}/api/leads/search`, formData)
    .then((res) => {
      dispatch({
        type: GET_ALL_ACTIVE_LEAD,
        payload: res.data,
      });
    })
    .catch((err) => console.log(err));
};

/*==========================================
  Get All Leads including hidden 
============================================*/
export const getAllLeadsCount = () => (dispatch) => {
  const formData = { query: {} };
  axios
    .post(`${url}/api/leads/search`, formData)
    .then((res) => {
      dispatch({
        type: GET_LEADS_COUNT,
        payload: res.data.length,
      });
    })
    .catch((err) => console.log(err));
};

/*======================================
        Get all hidden Leads
=======================================*/
export const getAllHiddenleads = (formData) => (dispatch) => {
  axios
    .post(`${url}/api/leads/search`, formData)
    .then((res) => {
      dispatch({
        type: GET_ALL_LEAD,
        payload: res.data,
      });
    })
    .catch((err) => console.log(err));
};

/*======================================
        Get My leads
=======================================*/
export const getMyLeads = (formData) => (dispatch) => {
  axios
    .post(`${url}/api/leads/search`, formData)
    .then((res) => {
      dispatch({
        type: GET_ALL_LEAD,
        payload: res.data,
      });
    })
    .catch((err) => console.log(err));
};

/*=======================================
        Delete Lead Action 
========================================*/

export const hideLeadAfterDeleteAction = (leadId, formData) => (dispatch) => {
  axios
    .put(`${url}/api/leads/${leadId}`, formData)
    .then((res) => {})
    .catch((err) => console.log(err));
};

export const deleteLead =
  (leadId, filterName, loginUserId, callBackDelete) => (dispatch) => {
    console.log(loginUserId);
    axios
      .delete(`${url}/api/leads/${leadId}`)
      .then((res) => {
        Alert.success("<h4>Lead Archive</h4>", {
          position: "top-right",
          effect: "slide",
          beep: false,
          html: true,
          timeout: 5000,
          // offset: 100
        });
        dispatch(getLeadById(leadId));
        callBackDelete();
        // let resData = res.data;
        // resData.isHidden = true;
        // dispatch(hideLeadAfterDeleteAction(leadId, resData));
        if (filterName === "My Leads") {
          const myLeadQuery = {
            query: {
              assigned: loginUserId,
              status: { $ne: "ARCHIVE" },
            },
          };
          const myLeadOverviewQuery = {
            assigned: loginUserId,
            status: { $ne: "ARCHIVE" },
          };
          dispatch(getMyLeads(myLeadQuery));
          // dispatch(getLeadsOverview());
          setTimeout(() => {
            dispatch(getOverviewFilterForCount(myLeadOverviewQuery));
          }, 50);

          dispatch(getKanBanLeads(loginUserId));
        } else if (filterName === "All Leads") {
          const allLeadQuery = {
            // pageNo: 500,
            // pageSize: 0,
            query: {
              status: { $ne: "ARCHIVE" },
            },
          };
          const allLeadOverviewQuery = {
            status: { $ne: "ARCHIVE" },
          };
          dispatch(getAllLeads(allLeadQuery));
          // dispatch(getLeadsOverview());
          setTimeout(() => {
            dispatch(getOverviewFilterForCount(allLeadOverviewQuery));
          }, 50);

          dispatch(getKanBanLeads(loginUserId));
        } else if (filterName === "Hidden Leads") {
          const hiddenLeadQuery = {
            // pageNo: 500,
            // pageSize: 0,
            query: {
              isHidden: true,
            },
          };
          const hiddenLeadOverviewQuery = {
            // pageNo: 500,
            // pageSize: 0,

            isHidden: true,
          };
          dispatch(getAllHiddenleads(hiddenLeadQuery));
          // dispatch(getLeadsOverview());
          setTimeout(() => {
            dispatch(getOverviewFilterForCount(hiddenLeadOverviewQuery));
          }, 50);

          dispatch(getKanBanLeads(loginUserId));
        } else if (filterName === "Archive Leads") {
          const archiveLeads = {
            query: {
              status: "ARCHIVE",
            },
          };
          const archiveLeadsOverviewQuery = {
            status: "ARCHIVE",
          };
          dispatch(leadsFilterByStatus(archiveLeads));
          // dispatch(getLeadsOverview());
          setTimeout(() => {
            dispatch(getOverviewFilterForCount(archiveLeadsOverviewQuery));
          }, 50);

          dispatch(getKanBanLeads(loginUserId));
        } else {
          console.log("nothing");
        }
      })
      .catch((err) => console.log(err));
  };

export const callToAction = (types, loginUserId) => (dispatch) => {
  console.log(loginUserId);
  if (types === "My Leads") {
    const myLeadQuery = {
      // pageNo: 10,
      // pageSize: 0,
      query: {
        assigned: loginUserId,
        status: { $ne: "ARCHIVE" },
      },
    };
    dispatch(getMyLeads(myLeadQuery));
  } else if (types === "All Leads") {
    const allLeadQuery = {
      // pageNo: 10,
      // pageSize: 0,
      query: {
        status: { $ne: "ARCHIVE" },
      },
    };
    dispatch(getAllLeads(allLeadQuery));
  } else {
    const hiddenLeadQuery = {
      // pageNo: 10,
      // pageSize: 0,
      query: {
        isHidden: true,
      },
    };
    dispatch(getAllHiddenleads(hiddenLeadQuery));
  }
};

/*=======================================
      Add To Kanban Action 
========================================*/
export const addToKanBanAction =
  (leadId, formData, filterName, loginUserId, alertText) => (dispatch) => {
    // console.log(filterName);
    axios
      .put(`${url}/api/leads/${leadId}`, formData)
      .then((res) => {
        Alert.success(`<h4>${alertText}</h4>`, {
          position: "top-right",
          effect: "slide",
          beep: false,
          html: true,
          timeout: 5000,
          // offset: 100
        });
        dispatch(getLeadById(leadId));
        if (filterName === "My Leads") {
          const myLeadQuery = {
            query: {
              assigned: loginUserId,
              status: { $ne: "ARCHIVE" },
            },
          };
          const myLeadOverviewQuery = {
            assigned: loginUserId,
            status: { $ne: "ARCHIVE" },
          };
          dispatch(getMyLeads(myLeadQuery));
          // dispatch(getLeadsOverview());
          setTimeout(() => {
            dispatch(getOverviewFilterForCount(myLeadOverviewQuery));
          }, 50);
        } else if (filterName === "All Leads") {
          const allLeadQuery = {
            query: {
              status: { $ne: "ARCHIVE" },
            },
          };
          const allLeadOverviewQuery = {
            status: { $ne: "ARCHIVE" },
          };
          dispatch(getAllLeads(allLeadQuery));
          // dispatch(getLeadsOverview());
          setTimeout(() => {
            dispatch(getOverviewFilterForCount(allLeadOverviewQuery));
          }, 50);
        } else if (filterName === "Hidden Leads") {
          const hiddenLeadQuery = {
            query: {
              isHidden: true,
            },
          };
          const hiddenLeadOverviewQuery = {
            isHidden: true,
          };
          dispatch(getAllHiddenleads(hiddenLeadQuery));
          // dispatch(getLeadsOverview());
          setTimeout(() => {
            dispatch(getOverviewFilterForCount(hiddenLeadOverviewQuery));
          }, 50);
        } else if (filterName === "Archive Leads") {
          const archiveLeads = {
            query: {
              status: "ARCHIVE",
            },
          };
          const archiveLeadsOverviewQuery = {
            status: "ARCHIVE",
          };
          dispatch(leadsFilterByStatus(archiveLeads));
          // dispatch(getLeadsOverview());
          setTimeout(() => {
            dispatch(getOverviewFilterForCount(archiveLeadsOverviewQuery));
          }, 50);
        } else {
          console.log("nothing");
        }
      })
      .catch((err) => console.log(err));
  };

/*======================================
    Edit Follow up Action
=======================================*/
export const EditFollowUpLead = (leadId, formData) => (dispatch) => {
  axios
    .put(`${url}/api/leads/${leadId}`, formData)
    .then((res) => {
      dispatch({
        type: GET_API_STATUS,
        payload: res.status,
      });
      Alert.success("<h4>Follow Up Edited</h4>", {
        position: "top-right",
        effect: "slide",
        beep: false,
        html: true,
        timeout: 5000,
        // offset: 100
      });
      const allLeadQuery = {
        // pageNo: 10,
        // pageSize: 0,
        query: {
          status: { $ne: "ARCHIVE" },
        },
      };
      dispatch(getAllLeads(allLeadQuery));
      dispatch(getLeadsOverview());
    })
    .catch((err) => console.log(err));
};

/*=======================================
      Hide Lead action 
========================================*/
export const hideLeadAction =
  (leadId, formData, filterName, loginUserId) => (dispatch) => {
    axios
      .put(`${url}/api/leads/${leadId}`, formData)
      .then((res) => {
        Alert.success("<h4>Lead Hidden</h4>", {
          position: "top-right",
          effect: "slide",
          beep: false,
          html: true,
          timeout: 5000,
          // offset: 100
        });
        dispatch(getLeadById(leadId));
        if (filterName === "My Leads") {
          const myLeadQuery = {
            query: {
              assigned: loginUserId,
              status: { $ne: "ARCHIVE" },
            },
          };
          const myLeadOverviewQuery = {
            assigned: loginUserId,
            status: { $ne: "ARCHIVE" },
          };
          dispatch(getMyLeads(myLeadQuery));
          setTimeout(() => {
            dispatch(getOverviewFilterForCount(myLeadOverviewQuery));
          }, 50);
        } else if (filterName === "All Leads") {
          const allLeadQuery = {
            query: {
              status: { $ne: "ARCHIVE" },
            },
          };
          const allLeadOverviewQuery = {
            status: { $ne: "ARCHIVE" },
          };
          dispatch(getAllLeads(allLeadQuery));
          // dispatch(getLeadsOverview());
          setTimeout(() => {
            dispatch(getOverviewFilterForCount(allLeadOverviewQuery));
          }, 50);
        } else if (filterName === "Hidden Leads") {
          const hiddenLeadQuery = {
            query: {
              isHidden: true,
            },
          };
          const hiddenLeadOverviewQuery = {
            isHidden: true,
          };
          dispatch(getAllHiddenleads(hiddenLeadQuery));
          // dispatch(getLeadsOverview());
          setTimeout(() => {
            dispatch(getOverviewFilterForCount(hiddenLeadOverviewQuery));
          }, 50);
        } else {
          const archiveLeads = {
            query: {
              status: "ARCHIVE",
            },
          };
          const archiveLeadsOverviewQuery = {
            status: "ARCHIVE",
          };
          dispatch(leadsFilterByStatus(archiveLeads));
          // dispatch(getLeadsOverview());
          setTimeout(() => {
            dispatch(getOverviewFilterForCount(archiveLeadsOverviewQuery));
          }, 50);
        }
      })
      .catch((err) => console.log(err));
  };

/*=======================================
      Unhide Lead action 
========================================*/
export const unhideLeadAction =
  (leadId, formData, filterName, loginUserId) => (dispatch) => {
    axios
      .put(`${url}/api/leads/${leadId}`, formData)
      .then((res) => {
        Alert.success("<h4>Lead Unhidden</h4>", {
          position: "top-right",
          effect: "slide",
          beep: false,
          html: true,
          timeout: 5000,
          // offset: 100
        });
        dispatch(getLeadById(leadId));
        if (filterName === "My Leads") {
          const myLeadQuery = {
            query: {
              assigned: loginUserId,
              status: { $ne: "ARCHIVE" },
            },
          };
          const myLeadOverviewQuery = {
            assigned: loginUserId,
            status: { $ne: "ARCHIVE" },
          };
          dispatch(getMyLeads(myLeadQuery));
          setTimeout(() => {
            dispatch(getOverviewFilterForCount(myLeadOverviewQuery));
          }, 50);
        } else if (filterName === "All Leads") {
          const allLeadQuery = {
            query: {
              status: { $ne: "ARCHIVE" },
            },
          };
          const allLeadOverviewQuery = {
            status: { $ne: "ARCHIVE" },
          };
          dispatch(getAllLeads(allLeadQuery));
          // dispatch(getLeadsOverview());
          setTimeout(() => {
            dispatch(getOverviewFilterForCount(allLeadOverviewQuery));
          }, 50);
        } else if (filterName === "Hidden Leads") {
          const hiddenLeadQuery = {
            query: {
              isHidden: true,
            },
          };
          const hiddenLeadOverviewQuery = {
            isHidden: true,
          };
          dispatch(getAllHiddenleads(hiddenLeadQuery));
          // dispatch(getLeadsOverview());
          setTimeout(() => {
            dispatch(getOverviewFilterForCount(hiddenLeadOverviewQuery));
          }, 50);
        } else {
          const archiveLeads = {
            query: {
              status: "ARCHIVE",
            },
          };
          const archiveLeadsOverviewQuery = {
            status: "ARCHIVE",
          };
          dispatch(leadsFilterByStatus(archiveLeads));
          // dispatch(getLeadsOverview());
          setTimeout(() => {
            dispatch(getOverviewFilterForCount(archiveLeadsOverviewQuery));
          }, 50);
        }
      })
      .catch((err) => console.log(err));
  };

/*========================================
   Get Lead Kan Ban list
=========================================*/
export const getKanBanLeads = (userId) => (dispatch) => {
  axios
    .get(
      `${url}/api/leads?isKanban=true&isHidden=false&isNotes=true&isFollowups=true&assigned=${userId}`
    )
    .then((res) => {
      dispatch({
        type: GET_KANBAN_LEADS,
        payload: res.data,
      });
    })
    .catch((err) => console.log(err));
};

/*=========================================
          Leads Filter By Status
==========================================*/
// export const leadsFilterByStatus = () => {
//   axios
//     .get(`/api/leads/count?key=status&value=NEW_LEADS`)
//     .then(res => console.log(res.data))
//     .catch(err => console.log(err.response.data));
// };

/*==========================================
              Leads Funel View
============================================*/
export const getFunelView = () => (dispatch) => {
  dispatch({
    type: SET_LOADER,
  });
  axios
    .get(`${url}/api/leads/count?key=status`)
    .then((res) => {
      // console.log(newArray);
      dispatch({
        type: GET_LEAD_COUNT_BY_STATUS,
        payload: res.data,
      });
      dispatch({
        type: CLEAR_LOADER,
      });
    })
    .catch((err) => console.log(err));
};

/*=============================================
      Leads Search in all leads api
==============================================*/
export const searchLeadAction = (searchText) => (dispatch) => {
  axios
    .get(`${url}/api/leads/search/text?text=${searchText}`)
    .then((res) => {
      dispatch({
        type: GET_ALL_LEAD,
        payload: res.data,
      });
    })
    .catch((err) => console.log(err));
};

/*=============================================
      Leads Search in My leads only api
==============================================*/
export const myLeadSearchAction = (searchText, userId) => (dispatch) => {
  axios
    .get(
      `${url}/api/leads/search/text?text=${searchText}&isHidden=false&assigned=${userId}`
    )
    .then((res) => {
      dispatch({
        type: GET_ALL_LEAD,
        payload: res.data,
      });
    })
    .catch((err) => console.log(err));
};

/*=============================================
      Leads Search in Hidden leads only api
==============================================*/
export const hiddenLeadSearchAction = (searchText) => (dispatch) => {
  axios
    .get(`${url}/api/leads/search/text?text=${searchText}&isHidden=true`)
    .then((res) => {
      dispatch({
        type: GET_ALL_LEAD,
        payload: res.data,
      });
    })
    .catch((err) => console.log(err));
};

/*=============================================
      Leads Search in Archive leads only api
==============================================*/
export const archiveLeadSearchAction = (searchText) => (dispatch) => {
  axios
    .get(`${url}/api/leads/search/text?text=${searchText}&status=ARCHIVE`)
    .then((res) => {
      dispatch({
        type: GET_ALL_LEAD,
        payload: res.data,
      });
    })
    .catch((err) => console.log(err));
};

/*===============================================
            Leads Filter By Status
================================================*/

export const leadsFilterByStatus = (filterName) => (dispatch) => {
  axios
    .post(`${url}/api/leads/search`, filterName)
    .then((res) =>
      dispatch({
        type: GET_ALL_LEAD,
        payload: res.data,
      })
    )
    .catch((err) => console.log(err));
};

/*=================================================
      Leads Filter By Date in All Leads Only
==================================================*/
export const filterLeadsByDate = (startDate, endDate) => (dispatch) => {
  axios
    .get(
      `${url}/api/leads?startDate=${startDate}T00:00:00.178Z&endDate=${endDate}T23:59:59.178Z`
    )
    .then((res) => {
      dispatch({
        type: GET_ALL_LEAD,
        payload: res.data,
      });
    })
    .catch((err) => console.log(err));
};

/*=================================================
      Leads Filter By Date in Hidden Leads Only
==================================================*/
export const filterHiddenLeadsByDate = (startDate, endDate) => (dispatch) => {
  axios
    .get(
      `${url}/api/leads?isHidden=true&startDate=${startDate}T00:00:00.178Z&endDate=${endDate}T23:59:59.178Z`
    )
    .then((res) => {
      dispatch({
        type: GET_ALL_LEAD,
        payload: res.data,
      });
    })
    .catch((err) => console.log(err));
};

/*=================================================
      Leads Filter By Date in My Leads Only
==================================================*/
export const filterMyLeadsByDate =
  (startDate, endDate, userId) => (dispatch) => {
    axios
      .get(
        `${url}/api/leads?assigned=${userId}&isHidden=false&startDate=${startDate}T00:00:00.178Z&endDate=${endDate}T23:59:59.178Z`
      )
      .then((res) => {
        dispatch({
          type: GET_ALL_LEAD,
          payload: res.data,
        });
      })
      .catch((err) => console.log(err));
  };

/*=================================================
            Filter Leads By Level
// ===================================================*/
export const filterLeadsByLevel = (levelType) => (dispatch) => {
  axios
    .post(`${url}/api/leads/search`, levelType)
    .then((res) => {
      dispatch({
        type: GET_ALL_LEAD,
        payload: res.data,
      });
    })
    .catch((err) => console.log(err));
};

/*=====================================================
        Filter Leads By Mettings And Followups
======================================================*/

export const filterLeadsByfollowUpsAndMeet = (filterName) => (dispatch) => {
  axios
    .get(`${url}/api/leads/search/entity/${filterName}`)
    .then((res) => {
      dispatch({
        type: GET_ALL_LEAD,
        payload: res.data,
      });
    })
    .catch((err) => console.log(err));
};

/*====================================================
      Import Export Leads apis
=====================================================*/
export const importAllLeads = (formData) => (dispatch) => {
  const headers = {
    "Content-Type": "multipart/form-data",
  };
  axios
    .post(`${url}/api/leads/import`, formData, { headers: headers })
    .then((res) => console.log(res.data))
    .catch((err) => console.log(err));
};

export const exportAllLeads = (callBackCsvExport) => async (dispatch) => {
  try {
    let { data } = await axios.get(`${url}/api/leads/export`);
    if (data) {
      callBackCsvExport(data);
    }
  } catch (err) {
    console.log(err);
  }
};

/*=============================
  Check Lead name exists or not 
===============================*/

export const checkLeadExist =
  (leadName, callBackLeadExist) => async (dispatch) => {
    try {
      let { data } = await axios.get(`${url}/api/leads/exist?name=${leadName}`);
      if (data) {
        callBackLeadExist(data);
        // console.log(data);
      }
    } catch (err) {
      console.log(err);
    }
  };

/*=============================
  Check Lead name exists or not 
===============================*/

export const checkLeadEmailExist =
  (formData, callBackLeadEmailExist) => async (dispatch) => {
    try {
      let { data } = await axios.post(`${url}/api/leads/search`, formData);
      if (data) {
        if (!isEmpty(data)) {
          callBackLeadEmailExist(true);
        } else {
          callBackLeadEmailExist(false);
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

/*================================
  OVERALL LEAD CLOSURE EFFICIENCY
==================================*/

export const getOverallLeadClosureEfficiency =
  (callBackOverallLeadEfficiency) => async (dispatch) => {
    try {
      let { data } = await axios.get(`${url}/api/leads/avgcp`);
      if (data) {
        callBackOverallLeadEfficiency(data);
      }
    } catch (err) {
      console.log(err);
    }
  };

/*======================================
      SINGLE LEAD CLOSUER probality
========================================*/

export const singleLeadClosureProbablity = () => async (dispatch) => {
  try {
    let { data } = await axios.get(`${url}/api/leads/allLeadsCP`);
    if (data) {
      dispatch({
        type: SET_SINGLE_LEAD_CLOSURE_PROBABLITY,
        payload: data,
      });
    }
  } catch (err) {
    console.log(err);
  }
};
