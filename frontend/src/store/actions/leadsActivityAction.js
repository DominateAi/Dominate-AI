import axios from "axios";
import Alert from "react-s-alert";
import { url } from "./config";
import {
  SET_ACTIVITY_EMAILS,
  GET_API_STATUS,
  SET_ACTIVITY_DATA,
  SET_ACTIVITY_NOTES,
  SET_EMAIL_TEMPLATES,
  SET_ACTIVITY_ARCHIVE_EMAILS,
  SET_LEAD_ACTIVITY_SUMMARY_INFO,
  SET_LEADS_TIMELINE,
  SET_LEAD_FILES,
  SET_LEAD_ACTIVITY_LOG,
  SET_SELECTED_NOTE,
} from "./../types";

// import isEmpty from "./../validations/is-empty";

/*===================================
    Get all Activity of Leads
=====================================*/
export const getAllLeadActivity = (leadId) => (dispatch) => {
  axios
    .get(`${url}/api/activities?entityType=LEAD&entityId=${leadId}`)
    .then((res) => {
      // console.log(res.data);
      dispatch({
        type: SET_ACTIVITY_DATA,
        payload: res.data,
      });
    })
    .catch((err) => console.log(err));
};

/*===================================
          Get Lead by Id
====================================*/
export const getLeadById = (leadId) => (dispatch) => {
  axios
    .get(`${url}/api/leads/${leadId}`)
    .then((res) => {
      dispatch({
        type: SET_LEAD_ACTIVITY_SUMMARY_INFO,
        payload: res.data,
      });
    })
    .catch((err) => console.log(err));
};

/*====================================
     Update lead activity summary
=====================================*/

export const updateLeadAction =
  (leadId, formData, callBackLeadUpdate) => (dispatch) => {
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
        Alert.success("<h4>Lead Updated</h4>", {
          position: "top-right",
          effect: "slide",
          beep: false,
          html: true,
          timeout: 5000,
          // offset: 100
        });
        dispatch(getLeadById(leadId));
        if (callBackLeadUpdate) {
          callBackLeadUpdate(res.status);
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

/*=====================================================================================
                                Email Sections
======================================================================================*/

/*===================================
          Send Lead Email
=====================================*/
export const sendEmailToLeads =
  (formData, leadId, callBackSendMail) => (dispatch) => {
    axios
      .post(`${url}/api/emails`, formData)
      .then((res) => {
        Alert.success("<h4>Email Sent</h4>", {
          position: "top-right",
          effect: "slide",
          beep: false,
          html: true,
          timeout: 5000,
          // offset: 100
        });

        dispatch(getAllLeadsEmail(leadId));
        dispatch(getAllLeadActivity(leadId));
        callBackSendMail(res.status);
      })
      .catch((err) => console.log(err));
  };

/*===================================
      Get Leads Emails Action
=====================================*/

export const getAllLeadsEmail = (leadId) => (dispatch) => {
  axios
    .get(`${url}/api/emails?entityType=LEAD&entityId=${leadId}&status=NEW`)
    .then((res) =>
      dispatch({
        type: SET_ACTIVITY_EMAILS,
        payload: res.data,
      })
    )
    .catch((err) => console.log(err));
};

/*===================================
      Get Leads archive Emails Action
=====================================*/

export const getAllLeadsArchiveEmail = (leadId) => (dispatch) => {
  axios
    .get(`${url}/api/emails?entityType=LEAD&entityId=${leadId}&status=ARCHIVE`)
    .then((res) =>
      dispatch({
        type: SET_ACTIVITY_ARCHIVE_EMAILS,
        payload: res.data,
      })
    )
    .catch((err) => console.log(err));
};

/*====================================
      Save Email As Template
=====================================*/
export const saveEmailTemplate = (formData) => (dispatch) => {
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
      dispatch(getAllEmailTemapltes());
    })
    .catch((err) => console.log(err));
};

/*====================================
      Save Email As Template
=====================================*/
export const updateTemplateById = (templateId, formData) => (dispatch) => {
  axios
    .put(`${url}/api/emailTemplates/${templateId}`, formData)
    .then((res) => {
      Alert.success("<h4>Template updated</h4>", {
        position: "top-right",
        effect: "slide",
        beep: false,
        html: true,
        timeout: 5000,
        // offset: 100
      });
      dispatch(getAllEmailTemapltes());
    })
    .catch((err) => console.log(err));
};

/*======================================
            Delete Email
=======================================*/
export const deleteEmail = (emailId, leadId) => (dispatch) => {
  axios
    .delete(`${url}/api/emails/${emailId}`)
    .then((res) => {
      Alert.success("<h4>Email Deleted</h4>", {
        position: "top-right",
        effect: "slide",
        beep: false,
        html: true,
        timeout: 5000,
        // offset: 100
      });
      dispatch(getAllLeadsEmail(leadId));
      dispatch(getAllLeadsArchiveEmail(leadId));
    })
    .catch((err) => console.log(err));
};

/*======================================
    Get All Email Templates
=======================================*/
export const getAllEmailTemapltes = () => (dispatch) => {
  axios
    .get(`${url}/api/emailTemplates`)
    .then((res) => {
      dispatch({
        type: SET_EMAIL_TEMPLATES,
        payload: res.data,
      });
    })
    .catch((err) => console.log(err));
};

/*=====================================
    Delete email Template
=======================================*/
export const deleteEmailTemplate = (templateId) => (dispatch) => {
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
      dispatch(getAllEmailTemapltes());
    })
    .catch((err) => console.log(err));
};

/*==============================================================================================
              Notes Section
===============================================================================================*/
/*===================================
             Add Notes
=====================================*/
export const addLeadNotes =
  (formData, leadId, callBackAddNote) => (dispatch) => {
    axios
      .post(`${url}/api/notes`, formData)
      .then((res) => {
        Alert.success("<h4>Note Added</h4>", {
          position: "top-right",
          effect: "slide",
          beep: false,
          html: true,
          timeout: 5000,
          // offset: 100
        });

        dispatch(getAllLeadsNotes(leadId));
        callBackAddNote(res.status);
      })
      .catch((err) => console.log(err));
  };

/*===================================
        Get All Notes action
====================================*/
export const getAllLeadsNotes = (leadId) => (dispatch) => {
  axios
    .get(`${url}/api/notes?entityType=LEAD&entityId=${leadId}`)
    .then((res) => {
      dispatch({
        type: SET_ACTIVITY_NOTES,
        payload: res.data,
      });
    })
    .catch((err) => console.log(err));
};

/*===================================
            Delete Notes
====================================*/
export const deleteNotesAction =
  (noteId, leadId, callBackDelete) => (dispatch) => {
    axios
      .delete(`${url}/api/notes/${noteId}`)
      .then((res) => {
        Alert.success("<h4>Note Deleted</h4>", {
          position: "top-right",
          effect: "slide",
          beep: false,
          html: true,
          timeout: 5000,
          // offset: 100
        });
        dispatch(getAllLeadsNotes(leadId));
        callBackDelete();
      })
      .catch((err) => console.log(err));
  };

/*===================================
        Update Notes
====================================*/
export const updateNote =
  (formData, noteId, leadId, callBackUpdate) => (dispatch) => {
    axios
      .put(`${url}/api/notes/${noteId}`, formData)
      .then((res) => {
        Alert.success("<h4>Note Updated</h4>", {
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
        dispatch(getAllLeadsNotes(leadId));
        dispatch(getNotesById(noteId));
        callBackUpdate();
      })
      .catch((err) => console.log(err));
  };

/*===================================
       Get Notes By Id
====================================*/
export const getNotesById = (noteId) => (dispatch) => {
  axios
    .get(`${url}/api/notes/${noteId}`)
    .then((res) => {
      dispatch({
        type: SET_SELECTED_NOTE,
        payload: res.data,
      });
    })
    .catch((err) => console.log(err));
};

/*============================================
              Leads Timeline Action
==============================================*/
export const leadsTimelineAction = (leadId) => (dispatch) => {
  axios
    .get(`${url}/api/leads/timeline/${leadId}`)
    .then((res) => {
      dispatch({
        type: SET_LEADS_TIMELINE,
        payload: res.data,
      });
    })
    .catch((err) => console.log(err));
};

/*=====================================================================
                      Activity Files Section
=======================================================================*/
export const leadsActivityFilesUpload =
  (formData, userSetFileDescription, leadId, callBackUpload) => (dispatch) => {
    const headers = {
      "Content-Type": "multipart/form-data",
    };
    axios
      .post(`${url}/api/upload`, formData, { headers: headers })
      .then((res) => {
        const fileData = {
          entityType: "LEAD",
          entityId: leadId,
          name: userSetFileDescription,
          url: res.data.fileUrl,
          originalName: res.data.originalname,
          systemName: res.data.systemFileName,
          isFile: true,
          parent: "root",
          starred: false,
          archived: false,
          tags: ["abc", "acd", "sd"],
        };

        dispatch(
          leadActivityFileUploadToServer(fileData, leadId, callBackUpload)
        );
      })
      .catch((err) => console.log(err));
  };

export const leadActivityFileUploadToServer =
  (formData, leadId, callBackUpload) => (dispatch) => {
    axios
      .post(`${url}/api/vaults`, formData)
      .then((res) => {
        Alert.success("<h4>File Added</h4>", {
          position: "top-right",
          effect: "slide",
          beep: false,
          html: true,
          timeout: 5000,
          // offset: 100
        });

        dispatch(getAllFilesAction(leadId));
        callBackUpload(res.status);
      })
      .catch((err) => console.log(err));
  };

/*========================================
        Get All Files Action
=========================================*/
export const getAllFilesAction = (leadId) => (dispatch) => {
  axios
    .get(`${url}/api/vaults?entityType=LEAD&entityId=${leadId}`)
    .then((res) => {
      dispatch({
        type: SET_LEAD_FILES,
        payload: res.data,
      });
    })
    .catch((err) => console.log(err));
};

/*========================================
            Delete Lead File
=========================================*/
export const deleteLeadFile = (fileId, leadId) => (dispatch) => {
  axios
    .delete(`${url}/api/vaults/${fileId}`)
    .then((res) => {
      Alert.success("<h4>File Deleted</h4>", {
        position: "top-right",
        effect: "slide",
        beep: false,
        html: true,
        timeout: 5000,
        // offset: 100
      });
      dispatch(getAllFilesAction(leadId));
    })
    .catch((err) => console.log(err));
};

/*===========================================================================================
                                  Lead Add To Log Actions
=============================================================================================*/
/*==================================
              Add To Log
===================================*/
export const addToLog = (formData, addToLogCallback) => async (dispatch) => {
  try {
    let { data, status } = await axios.post(`${url}/api/logs`, formData);
    if (data) {
      Alert.success("<h4>Activity log added</h4>", {
        position: "top-right",
        effect: "slide",
        beep: false,
        html: true,
        timeout: 5000,
        // offset: 100
      });
      const getFormData = {
        query: {
          lead: data.lead,
        },
      };
      dispatch(getLeadActivityLog(getFormData));
      addToLogCallback(status);

      // console.log(data);
    }
  } catch (err) {
    console.log(err);
  }
};

/*==================================
    Get Lead Activity Log
===================================*/
export const getLeadActivityLog = (formData) => async (dispatch) => {
  try {
    let { data, status } = await axios.post(`${url}/api/logs/search`, formData);
    if (data) {
      dispatch({
        type: SET_LEAD_ACTIVITY_LOG,
        payload: data,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

/*==================================
      Update log by id
===================================*/
export const updateLogById =
  (logId, formData, leadId, updateLogCallback) => async (dispatch) => {
    try {
      let { data, status } = await axios.put(
        `${url}/api/logs/${logId}`,
        formData
      );
      if (data) {
        Alert.success("<h4>Log Updated</h4>", {
          position: "top-right",
          effect: "slide",
          beep: false,
          html: true,
          timeout: 5000,
          // offset: 100
        });
        updateLogCallback(status);
        const formData = {
          query: {
            lead: leadId,
          },
        };

        dispatch(getLeadActivityLog(formData));
        // console.log(data);
      }
    } catch (err) {
      console.log(err);
    }
  };

/*=====================================================================
                      Upload files to log
=======================================================================*/
export const uploadFileToLog =
  (formData, logData, leadId) => async (dispatch) => {
    const headers = {
      "Content-Type": "multipart/form-data",
    };
    try {
      let { data } = await axios.post(`${url}/api/upload`, formData, {
        headers: headers,
      });
      if (data) {
        console.log(data);
        let formData = logData;
        formData.files.push(data.systemFileName);

        dispatch(updateLogById(formData._id, formData, leadId));
      }
    } catch (err) {
      console.log(err);
    }
  };
