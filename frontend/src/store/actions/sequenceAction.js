import axios from "axios";
import { url } from "./config";
import { workspaceId } from "./config";
import {
  SET_CONTACTS_WITH_EMAILS,
  SET_ELIST_CONTACTS,
  SET_ALL_ELISTS,
  SET_SINGLE_ELIST_DATA,
  SET_ALL_REGITERED_AND_NOT_MAILS,
  SET_ALL_CAMPAIGNS,
  SET_SINGLE_CAMPAIGN_ALL_DATA,
  SET_CAMPAIGN_EMAIL_TEMPLATES,
  SET_LOADER,
  CLEAR_LOADER,
} from "./../types";
import Alert from "react-s-alert";

/*================================================================================================================
                                       CREATE SEQUENCE LIST ACTIONS
=================================================================================================================*/

/*===========================================================
                    CREATE ELIST ACTION
============================================================*/

export const createElistAction =
  (formData, callBackCreateList) => async (dispatch) => {
    const headers = {
      "Content-Type": "application/json",
      workspaceId: workspaceId,
    };
    dispatch({
      type: SET_LOADER,
    });
    try {
      let { data, status } = await axios.post(`${url}/api/elists`, formData, {
        headers: headers,
      });
      if (data) {
        dispatch(getContactsOfElistByElistId(data._id));
        dispatch(getElistDataByElistId(data._id));
        const formData = {
          query: {},
        };
        dispatch(getAllElistSearchApi(formData));
        callBackCreateList(status, data);
        dispatch({
          type: CLEAR_LOADER,
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

/*===========================================================
                GET ALL ESLIST BY SEARCH
============================================================*/

export const getAllElistSearchApi = (formData) => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data } = await axios.post(`${url}/api/elists/search`, formData, {
      headers: headers,
    });
    if (data) {
      dispatch({
        type: SET_ALL_ELISTS,
        payload: data,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

/*===========================================================
                    VERIFY EMAIL BY ELIST ID
============================================================*/

export const verifyEmailByElistId =
  (elistId, callBackVerifyContacts) => async (dispatch) => {
    const headers = {
      "Content-Type": "application/json",
      workspaceId: workspaceId,
    };
    dispatch({
      type: SET_LOADER,
    });
    try {
      let { data } = await axios.get(`${url}/api/elists/verify/${elistId}`, {
        headers: headers,
      });
      if (data) {
        console.log(data);
        dispatch(getContactsOfElistByElistId(elistId));
        callBackVerifyContacts();
        dispatch({
          type: CLEAR_LOADER,
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

/*===========================================================
             GET CONTACTS OF ELIST BY ELIST ID
============================================================*/

export const getContactsOfElistByElistId = (elistId) => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  dispatch({
    type: SET_LOADER,
  });
  try {
    let { data } = await axios.get(
      `${url}/api/elists/contactsByElist/${elistId}`,
      { headers: headers }
    );
    if (data) {
      dispatch({
        type: SET_ELIST_CONTACTS,
        payload: data,
      });
      dispatch({
        type: CLEAR_LOADER,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

/*===========================================================
                KEEP VALIDATE ELIST BY ELIST ID
============================================================*/

export const keepValidateElist =
  (elistId, callBackKeppValidate) => async (dispatch) => {
    const headers = {
      "Content-Type": "application/json",
      workspaceId: workspaceId,
    };
    dispatch({
      type: SET_LOADER,
    });
    try {
      let { data } = await axios.get(
        `${url}/api/elists/keepValidated/${elistId}`,
        { headers: headers }
      );
      if (data) {
        callBackKeppValidate();
        dispatch({
          type: CLEAR_LOADER,
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

/*===========================================================
                INVALID ELIST BY ELIST ID
============================================================*/

export const inValidElist =
  (elistId, callBackIsInvalid) => async (dispatch) => {
    const headers = {
      "Content-Type": "application/json",
      workspaceId: workspaceId,
    };
    try {
      let { data } = await axios.get(`${url}/api/elists/isInvalid/${elistId}`, {
        headers: headers,
      });
      if (data) {
        callBackIsInvalid(data);
      }
    } catch (err) {
      console.log(err);
    }
  };

/*===========================================================
        GET ALL CONTACTS WHICH HAVING EMAILS IN IT
============================================================*/

export const getContactsWithEmails = (formData) => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data } = await axios.post(`${url}/api/contacts/search`, formData, {
      headers: headers,
    });
    if (data) {
      let finalContacts = [];
      data.forEach((element) => {
        element.checked = false;
        finalContacts.push(element);
      });

      dispatch({
        type: SET_CONTACTS_WITH_EMAILS,
        payload: finalContacts,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

/*===========================================================
                GET ELIST DATA BY ID
============================================================*/

export const getElistDataByElistId = (elistId) => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data } = await axios.get(`${url}/api/elists/${elistId}`, {
      headers: headers,
    });
    if (data) {
      dispatch({
        type: SET_SINGLE_ELIST_DATA,
        payload: data,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

/*===========================================================
                 DELETE ELIST BY ELIST ID
============================================================*/

export const deleteElistByElistId = (elistId) => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data } = await axios.delete(`${url}/api/elists/${elistId}`, {
      headers: headers,
    });
    dispatch({
      type: SET_LOADER,
    });
    if (data) {
      Alert.success("<h4>Email list deleted</h4>", {
        position: "top-right",
        effect: "slide",
        beep: false,
        html: true,
        timeout: 5000,
        // offset: 100
      });
      const formData = {
        query: {},
      };
      dispatch(getAllElistSearchApi(formData));
      dispatch({
        type: CLEAR_LOADER,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

/*===========================================================
                UPDATE ELIST BY ELIST ID
============================================================*/

export const updateElistDataByElistId =
  (elistId, formData, callBackUpdateList) => async (dispatch) => {
    const headers = {
      "Content-Type": "application/json",
      workspaceId: workspaceId,
    };
    try {
      let { data, status } = await axios.put(
        `${url}/api/elists/${elistId}`,
        formData,
        {
          headers: headers,
        }
      );
      if (data) {
        dispatch(getContactsOfElistByElistId(data._id));
        const formData = {
          query: {},
        };
        dispatch(getAllElistSearchApi(formData));
        callBackUpdateList(status);
      }
    } catch (err) {
      console.log(err);
    }
  };

/*================================================================================================================
                                       REGISTERS EAMILS ACTIONS
=================================================================================================================*/

/*===========================================================
                 CREATE REGISTERED EMAIL
============================================================*/

export const createRegisteredEmail =
  (formData, callBackCreateRegisteredEmail) => async (dispatch) => {
    const headers = {
      "Content-Type": "application/json",
      workspaceId: workspaceId,
    };
    dispatch({
      type: SET_LOADER,
    });
    try {
      let { data, status } = await axios.post(
        `${url}/api/regdemails`,
        formData,
        {
          headers: headers,
        }
      );
      if (data) {
        Alert.success("<h4>Verification link sent</h4>", {
          position: "top-right",
          effect: "slide",
          beep: false,
          html: true,
          timeout: 5000,
          // offset: 100
        });
        const getAddedMails = {
          query: {},
        };

        dispatch(getAllRegisteredEmailSearch(getAddedMails));
        callBackCreateRegisteredEmail(status);
        dispatch({
          type: CLEAR_LOADER,
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

/*===========================================================
              CREATE REGISTERED EMAIL BY SEARCH
============================================================*/

export const getAllRegisteredEmailSearch = () => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data, status } = await axios.get(
      `${url}/api/regdemails`,

      {
        headers: headers,
      }
    );
    if (data) {
      dispatch({
        type: SET_ALL_REGITERED_AND_NOT_MAILS,
        payload: data,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

/*===========================================================
                 VERIFY ADDED EAMIL
============================================================*/

export const verifyAddedMail =
  (emailId, callBackVerifyEmail) => async (dispatch) => {
    const headers = {
      "Content-Type": "application/json",
      workspaceId: workspaceId,
    };
    dispatch({
      type: SET_LOADER,
    });
    try {
      let { data, status } = await axios.get(
        `${url}/api/regdemails/verify/${emailId}`,

        {
          headers: headers,
        }
      );
      if (data) {
        Alert.success("<h4>Verification link sent</h4>", {
          position: "top-right",
          effect: "slide",
          beep: false,
          html: true,
          timeout: 5000,
          // offset: 100
        });
        callBackVerifyEmail();
        dispatch({
          type: CLEAR_LOADER,
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

/*================================================================================================================
                                       CREATE EAMILS SEQUENCE ACTIONS
=================================================================================================================*/

/*===========================================================
                CREATE CAMPLAING ACTION
============================================================*/

export const createCampaign = (formData, history) => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };

  try {
    let { data, status } = await axios.post(`${url}/api/campaigns`, formData, {
      headers: headers,
    });
    if (data) {
      // console.log(data);
      history.push(`/add-email-sequence/${data._id}`);
    }
  } catch (err) {
    console.log(err);
  }
};

/*===========================================================
                CREATE CAMPLAING ACTION
============================================================*/

export const getAllCampaignBySearch = (formData) => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data, status } = await axios.post(
      `${url}/api/campaigns/search`,
      formData,
      {
        headers: headers,
      }
    );
    if (data) {
      dispatch({
        type: SET_ALL_CAMPAIGNS,
        payload: data,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

/*===========================================================
            UPDATE CAMPLAING BY ID ACTION
============================================================*/

export const updateCampaignById =
  (campaignId, formData, callBackUpdate) => async (dispatch) => {
    const headers = {
      "Content-Type": "application/json",
      workspaceId: workspaceId,
    };
    try {
      let { data, status } = await axios.put(
        `${url}/api/campaigns/${campaignId}`,
        formData,
        {
          headers: headers,
        }
      );
      if (data) {
        // console.log(data);
        dispatch(getCampaignById(data._id));
        callBackUpdate(status);
      }
    } catch (err) {
      console.log(err);
    }
  };

/*===========================================================
            GET CAMPLAING BY ID 
============================================================*/

export const getCampaignById = (campaignId) => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data, status } = await axios.get(
      `${url}/api/campaigns/${campaignId}`,

      {
        headers: headers,
      }
    );
    if (data) {
      dispatch({
        type: SET_SINGLE_CAMPAIGN_ALL_DATA,
        payload: data,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

/*===========================================================
           CAMPAIGN PROFILE COMPLETED CHECK
============================================================*/

export const campaignProfileCompleted =
  (campaignId, callBackProfileCompleted) => async (dispatch) => {
    const headers = {
      "Content-Type": "application/json",
      workspaceId: workspaceId,
    };
    dispatch({
      type: SET_LOADER,
    });
    try {
      let { data, status } = await axios.get(
        `${url}/api/campaigns/campaignProfileCompleted/${campaignId}`,

        {
          headers: headers,
        }
      );
      if (data) {
        // console.log(data);
        callBackProfileCompleted(status, data);
        dispatch({
          type: CLEAR_LOADER,
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

/*====================================
      Save Campaign Template
=====================================*/
export const saveCampaignEmailTemplate = (formData) => (dispatch) => {
  axios
    .post(`${url}/api/emailTemplates`, formData)
    .then((res) => {
      Alert.success("<h4>Saved as Template</h4>", {
        position: "top-right",
        effect: "slide",
        beep: false,
        html: true,
        timeout: 5000,
        // offset: 100
      });
      dispatch(getAllCampaignTemapltes());
    })
    .catch((err) => console.log(err));
};

/*======================================
    Get All Email Templates
=======================================*/
export const getAllCampaignTemapltes = () => (dispatch) => {
  axios
    .get(`${url}/api/emailTemplates`)
    .then((res) => {
      dispatch({
        type: SET_CAMPAIGN_EMAIL_TEMPLATES,
        payload: res.data,
      });
    })
    .catch((err) => console.log(err));
};

/*=====================================
    Delete email Template
=======================================*/
export const deleteCampaignTemplate = (templateId) => (dispatch) => {
  axios
    .delete(`${url}/api/emailTemplates/${templateId}`)
    .then((res) => {
      Alert.success("<h4>Template Deleted</h4>", {
        position: "top-right",
        effect: "slide",
        beep: false,
        html: true,
        timeout: 5000,
        // offset: 100
      });
      dispatch(getAllCampaignTemapltes());
    })
    .catch((err) => console.log(err));
};

/*=====================================
   Disable campaign
=======================================*/
export const disableCampaign = (formData) => (dispatch) => {
  axios
    .post(`${url}/api/campaigns/changeStatus`, formData)
    .then((res) => {
      Alert.success("<h4>Sequence disabled</h4>", {
        position: "top-right",
        effect: "slide",
        beep: false,
        html: true,
        timeout: 5000,
        // offset: 100
      });
      const getSequences = {
        query: {},
      };
      dispatch(getAllCampaignBySearch(getSequences));
    })
    .catch((err) => console.log(err));
};
