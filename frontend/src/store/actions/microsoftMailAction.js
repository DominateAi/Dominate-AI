import axios from "axios";
import { url } from "./config";
import {
  SET_ALL_MICROSOFT_FOLDERS,
  SET_FOLDERS_MESSEGES,
  SET_ALL_MICROSOFT_CONTACTS,
  SET_ALL_MICROSOFT_EVENTS,
} from "./../types";
import Alert from "react-s-alert";
import cookie from "react-cookies";

/*======================================================================================================
                                              MICROSOFT MAIL SECTION
========================================================================================================*/

/*====================================================================
                        Send Mail Action
======================================================================*/

export const sendMailAction = (formData, callBackSentMail) => async (
  dispatch
) => {
  let microsoftData = JSON.parse(localStorage.getItem("microsoftData"));
  let allCokkies = cookie.loadAll();
  // console.log(allCokkies);

  let token =
    process.env.NODE_ENV === "development"
      ? microsoftData.accessToken
      : allCokkies.microsoftAccessToke;
  var headers = {
    Authorization: "Bearer " + token,
  };
  try {
    let { data, status } = await axios.post(
      `https://graph.microsoft.com/v1.0/me/sendMail`,
      formData,
      {
        headers: headers,
      }
    );
    if (status === 202) {
      callBackSentMail();
    }
  } catch (err) {
    console.log(err);
  }
};

/*====================================================================
                      Get user action
======================================================================*/

export const getMicrosoftUsers = () => async (dispatch) => {
  let microsoftData = JSON.parse(localStorage.getItem("microsoftData"));
  var headers = {
    Authorization: "Bearer " + microsoftData.accessToken,
  };
  try {
    let { data, status } = await axios.get(
      `https://graph.microsoft.com/v1.0/users`,
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

/*====================================================================
                       Get All Mail Folders
======================================================================*/

export const getMicrosoftAllFolders = () => async (dispatch) => {
  let microsoftData = JSON.parse(localStorage.getItem("microsoftData"));
  let allCokkies = cookie.loadAll();
  // console.log(allCokkies);

  let token =
    process.env.NODE_ENV === "development"
      ? microsoftData.accessToken
      : allCokkies.microsoftAccessToke;
  var headers = {
    Authorization: "Bearer " + token,
  };
  try {
    let { data, status } = await axios.get(
      `https://graph.microsoft.com/v1.0/me/mailFolders`,
      {
        headers: headers,
      }
    );
    if (data) {
      // console.log(data);
      dispatch({
        type: SET_ALL_MICROSOFT_FOLDERS,
        payload: data,
      });
      dispatch(getMicrosoftMailboxUsingFolderId(data.value[0].id));
    }
  } catch (err) {
    console.log(err);
  }
};

/*====================================================================
            GET MAILBOX , DRAFTS AND OTHERS USING FOLDER ID
======================================================================*/
export const getMicrosoftMailboxUsingFolderId = (folderId) => async (
  dispatch
) => {
  let microsoftData = JSON.parse(localStorage.getItem("microsoftData"));
  let allCokkies = cookie.loadAll();
  // console.log(allCokkies);
  let token =
    process.env.NODE_ENV === "development"
      ? microsoftData.accessToken
      : allCokkies.microsoftAccessToke;
  var headers = {
    Authorization: "Bearer " + token,
  };
  try {
    let { data, status } = await axios.get(
      `https://graph.microsoft.com/v1.0/me/mailFolders/${folderId}/messages
        `,
      {
        headers: headers,
      }
    );
    if (data) {
      dispatch({
        type: SET_FOLDERS_MESSEGES,
        payload: data,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

/*====================================================================
                        Delete Mail Action
======================================================================*/

export const deleteMailAction = (mailId, callBackDelete) => async (
  dispatch
) => {
  let microsoftData = JSON.parse(localStorage.getItem("microsoftData"));
  let allCokkies = cookie.loadAll();
  // console.log(allCokkies);

  let token =
    process.env.NODE_ENV === "development"
      ? microsoftData.accessToken
      : allCokkies.microsoftAccessToke;
  var headers = {
    Authorization: "Bearer " + token,
  };
  try {
    let { data, status } = await axios.delete(
      `https://graph.microsoft.com/v1.0/me/messages/${mailId}`,
      {
        headers: headers,
      }
    );
    if (status === 204) {
      callBackDelete();
      // callBackDeleteMail();
    }
  } catch (err) {
    console.log(err);
  }
};

/*====================================================================
                        Forward mail action
======================================================================*/

export const forwardMailAction = (mailId, formData, callBackForward) => async (
  dispatch
) => {
  let microsoftData = JSON.parse(localStorage.getItem("microsoftData"));
  let allCokkies = cookie.loadAll();
  // console.log(allCokkies);

  let token =
    process.env.NODE_ENV === "development"
      ? microsoftData.accessToken
      : allCokkies.microsoftAccessToke;
  var headers = {
    Authorization: "Bearer " + token,
  };
  try {
    let { data, status } = await axios.post(
      `https://graph.microsoft.com/v1.0/me/messages/${mailId}/forward`,
      formData,
      {
        headers: headers,
      }
    );
    if (status === 202) {
      callBackForward();
    }
  } catch (err) {
    console.log(err);
  }
};

/*====================================================================
                        Forward mail action
======================================================================*/

export const replyToMailAction = (mailId, formData, callBackReply) => async (
  dispatch
) => {
  let microsoftData = JSON.parse(localStorage.getItem("microsoftData"));
  let allCokkies = cookie.loadAll();
  // console.log(allCokkies);

  let token =
    process.env.NODE_ENV === "development"
      ? microsoftData.accessToken
      : allCokkies.microsoftAccessToke;
  var headers = {
    Authorization: "Bearer " + token,
  };
  try {
    let { data, status } = await axios.post(
      `https://graph.microsoft.com/v1.0/me/messages/${mailId}/reply`,
      formData,
      {
        headers: headers,
      }
    );
    if (status === 202) {
      callBackReply();
    }
  } catch (err) {
    console.log(err);
  }
};

/*====================================================================
            Get next page messages of folder
======================================================================*/
export const getNextPageMesages = (api, callBackNextPageApi) => async (
  dispatch
) => {
  let microsoftData = JSON.parse(localStorage.getItem("microsoftData"));
  let allCokkies = cookie.loadAll();
  // console.log(allCokkies);
  let token =
    process.env.NODE_ENV === "development"
      ? microsoftData.accessToken
      : allCokkies.microsoftAccessToke;
  var headers = {
    Authorization: "Bearer " + token,
  };
  try {
    let { data, status } = await axios.get(
      `${api}
        `,
      {
        headers: headers,
      }
    );
    if (data) {
      callBackNextPageApi(data);
    }
  } catch (err) {
    console.log(err);
  }
};

/*===================================================================================================
                                              CONTACTS SECTION
=====================================================================================================*/

/*====================================================================
                  Create Contact
======================================================================*/

export const createContactAction = (formData, callBackUpdate) => async (
  dispatch
) => {
  let microsoftData = JSON.parse(localStorage.getItem("microsoftData"));
  let allCokkies = cookie.loadAll();
  // console.log(allCokkies);

  let token =
    process.env.NODE_ENV === "development"
      ? microsoftData.accessToken
      : allCokkies.microsoftAccessToke;
  var headers = {
    Authorization: "Bearer " + token,
  };
  try {
    let { data, status } = await axios.post(
      `https://graph.microsoft.com/v1.0/me/contacts`,
      formData,
      {
        headers: headers,
      }
    );
    if (data) {
      Alert.success("<h4>Contact Created</h4>", {
        position: "top-right",
        effect: "slide",
        beep: false,
        html: true,
        timeout: 5000,
        // offset: 100
      });
      callBackUpdate();
      dispatch(getMicrosoftContacts());
    }
  } catch (err) {
    console.log(err);
  }
};

/*====================================================================
                       Get All Contacts
======================================================================*/

export const getMicrosoftContacts = () => async (dispatch) => {
  let microsoftData = JSON.parse(localStorage.getItem("microsoftData"));
  let allCokkies = cookie.loadAll();
  // console.log(allCokkies);

  let token =
    process.env.NODE_ENV === "development"
      ? microsoftData.accessToken
      : allCokkies.microsoftAccessToke;
  var headers = {
    Authorization: "Bearer " + token,
  };
  try {
    let { data, status } = await axios.get(
      `https://graph.microsoft.com/v1.0/me/contacts`,
      {
        headers: headers,
      }
    );
    if (data) {
      dispatch({
        type: SET_ALL_MICROSOFT_CONTACTS,
        payload: data,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

/*====================================================================
                    Delete Contact By Contact ID
======================================================================*/

export const deleteContactByContactId = (contactId) => async (dispatch) => {
  let microsoftData = JSON.parse(localStorage.getItem("microsoftData"));
  let allCokkies = cookie.loadAll();
  // console.log(allCokkies);

  let token =
    process.env.NODE_ENV === "development"
      ? microsoftData.accessToken
      : allCokkies.microsoftAccessToke;
  var headers = {
    Authorization: "Bearer " + token,
  };
  try {
    let { data, status } = await axios.delete(
      `https://graph.microsoft.com/v1.0/me/contacts/${contactId}`,
      {
        headers: headers,
      }
    );
    if (status === 204) {
      Alert.success("<h4>Contact Deleted</h4>", {
        position: "top-right",
        effect: "slide",
        beep: false,
        html: true,
        timeout: 5000,
        // offset: 100
      });
      dispatch(getMicrosoftContacts());
    }
  } catch (err) {
    console.log(err);
  }
};

/*====================================================================
                      Update Contact Action
======================================================================*/

export const updateContactById = (
  contactId,
  formData,
  callBackUpdate
) => async (dispatch) => {
  let microsoftData = JSON.parse(localStorage.getItem("microsoftData"));
  let allCokkies = cookie.loadAll();
  // console.log(allCokkies);

  let token =
    process.env.NODE_ENV === "development"
      ? microsoftData.accessToken
      : allCokkies.microsoftAccessToke;
  var headers = {
    Authorization: "Bearer " + token,
  };
  try {
    let { data, status } = await axios.patch(
      `https://graph.microsoft.com/v1.0/me/contacts/${contactId}`,
      formData,
      {
        headers: headers,
      }
    );
    if (data) {
      Alert.success("<h4>Contact Updated</h4>", {
        position: "top-right",
        effect: "slide",
        beep: false,
        html: true,
        timeout: 5000,
        // offset: 100
      });
      callBackUpdate();
      dispatch(getMicrosoftContacts());
    }
  } catch (err) {
    console.log(err);
  }
};

/*===================================================================================================
                                             MICROSOFT EVENTS SECTION
=====================================================================================================*/

/*====================================================================
                          Get All Events
======================================================================*/

export const getMicrosoftEvents = () => async (dispatch) => {
  let microsoftData = JSON.parse(localStorage.getItem("microsoftData"));
  let allCokkies = cookie.loadAll();
  // console.log(allCokkies);

  let token =
    process.env.NODE_ENV === "development"
      ? microsoftData.accessToken
      : allCokkies.microsoftAccessToke;
  var headers = {
    Authorization: "Bearer " + token,
  };
  try {
    let { data, status } = await axios.get(
      `https://graph.microsoft.com/v1.0/me/calendar/events`,
      {
        headers: headers,
      }
    );
    if (data) {
      dispatch({
        type: SET_ALL_MICROSOFT_EVENTS,
        payload: data,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

/*====================================================================
                        Create microsoft Event 
======================================================================*/

export const createMicrosoftEvent = (formData, callBackAddEvent) => async (
  dispatch
) => {
  let microsoftData = JSON.parse(localStorage.getItem("microsoftData"));
  let allCokkies = cookie.loadAll();
  // console.log(allCokkies);

  let token =
    process.env.NODE_ENV === "development"
      ? microsoftData.accessToken
      : allCokkies.microsoftAccessToke;
  var headers = {
    Authorization: "Bearer " + token,
  };
  try {
    let { data, status } = await axios.post(
      `https://graph.microsoft.com/v1.0/me/calendar/events`,
      formData,
      {
        headers: headers,
      }
    );
    if (data) {
      Alert.success("<h4>Event Added</h4>", {
        position: "top-right",
        effect: "slide",
        beep: false,
        html: true,
        timeout: 5000,
        // offset: 100
      });
      callBackAddEvent();
      dispatch(getMicrosoftEvents());
    }
  } catch (err) {
    console.log(err);
  }
};

/*====================================================================
                    Delete Event By Event ID
======================================================================*/

export const deleteEventByEventId = (eventId) => async (dispatch) => {
  let microsoftData = JSON.parse(localStorage.getItem("microsoftData"));
  let allCokkies = cookie.loadAll();
  // console.log(allCokkies);

  let token =
    process.env.NODE_ENV === "development"
      ? microsoftData.accessToken
      : allCokkies.microsoftAccessToke;
  var headers = {
    Authorization: "Bearer " + token,
  };
  try {
    let { data, status } = await axios.delete(
      `https://graph.microsoft.com/v1.0/me/calendar/events/${eventId}`,
      {
        headers: headers,
      }
    );
    if (status === 204) {
      Alert.success("<h4>Event Deleted</h4>", {
        position: "top-right",
        effect: "slide",
        beep: false,
        html: true,
        timeout: 5000,
        // offset: 100
      });
      dispatch(getMicrosoftEvents());
    }
  } catch (err) {
    console.log(err);
  }
};

/*====================================================================
                      Update Event Action
======================================================================*/

export const updateEventAction = (eventId, formData, callBackUpdate) => async (
  dispatch
) => {
  let microsoftData = JSON.parse(localStorage.getItem("microsoftData"));
  let allCokkies = cookie.loadAll();
  // console.log(allCokkies);

  let token =
    process.env.NODE_ENV === "development"
      ? microsoftData.accessToken
      : allCokkies.microsoftAccessToke;
  var headers = {
    Authorization: "Bearer " + token,
  };
  try {
    let { data, status } = await axios.patch(
      `https://graph.microsoft.com/v1.0/me/calendar/events/${eventId}`,
      formData,
      {
        headers: headers,
      }
    );
    if (data) {
      Alert.success("<h4>Event Updated</h4>", {
        position: "top-right",
        effect: "slide",
        beep: false,
        html: true,
        timeout: 5000,
        // offset: 100
      });
      callBackUpdate();
      dispatch(getMicrosoftEvents());
    }
  } catch (err) {
    console.log(err);
  }
};
