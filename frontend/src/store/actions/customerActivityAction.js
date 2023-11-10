import axios from "axios";
import Alert from "react-s-alert";
import { url } from "./config";
import {
  GET_API_STATUS,
  SET_CUSTOMER_EMAILS,
  SET_CUSTOMER_ARCHIVE_EMAILS,
  SET_EMAIL_TEMPLATES
} from "./../types";

/*=====================================================================================
                                Email Sections
======================================================================================*/

/*===================================
          Send Customer Email
=====================================*/
export const sendEmailToCustomer = (formData, customerId) => dispatch => {
  axios
    .post(`${url}/api/emails`, formData)
    .then(res => {
      Alert.success("<h4>Email Sent</h4>", {
        position: "top-right",
        effect: "slide",
        beep: false,
        html: true,
        timeout: 5000
        // offset: 100
      });
      dispatch({
        type: GET_API_STATUS,
        payload: res.status
      });
      dispatch(getAllCustomerEmail(customerId));
    })
    .catch(err => console.log(err));
};

/*===================================
      Get Customer Emails Action
=====================================*/

export const getAllCustomerEmail = customerId => dispatch => {
  axios
    .get(
      `${url}/api/emails?entityType=CUSTOMER&entityId=${customerId}&status=NEW`
    )
    .then(res =>
      dispatch({
        type: SET_CUSTOMER_EMAILS,
        payload: res.data
      })
    )
    .catch(err => console.log(err));
};

/*===================================
      Get Leads archive Emails Action
=====================================*/

export const getAllCustomerArchiveEmail = customerId => dispatch => {
  axios
    .get(
      `${url}/api/emails?entityType=CUSTOMER&entityId=${customerId}&status=ARCHIVE`
    )
    .then(res =>
      dispatch({
        type: SET_CUSTOMER_ARCHIVE_EMAILS,
        payload: res.data
      })
    )
    .catch(err => console.log(err));
};

/*====================================
      Save Email As Template
=====================================*/
export const saveEmailTemplate = formData => dispatch => {
  axios
    .post(`${url}/api/emailTemplates`, formData)
    .then(res => {
      Alert.success("<h4>Saved as Template</h4>", {
        position: "top-right",
        effect: "slide",
        beep: false,
        html: true,
        timeout: 5000
        // offset: 100
      });
      dispatch(getAllEmailTemapltes());
    })
    .catch(err => console.log(err));
};

/*======================================
            Delete Email
=======================================*/
export const deleteCustomerEmail = (emailId, customerId) => dispatch => {
  axios
    .delete(`${url}/api/emails/${emailId}`)
    .then(res => {
      Alert.success("<h4>Email Deleted</h4>", {
        position: "top-right",
        effect: "slide",
        beep: false,
        html: true,
        timeout: 5000
        // offset: 100
      });
      dispatch(getAllCustomerEmail(customerId));
      dispatch(getAllCustomerArchiveEmail(customerId));
    })
    .catch(err => console.log(err));
};

/*======================================
    Get All Email Templates
=======================================*/
export const getAllEmailTemapltes = () => dispatch => {
  axios
    .get(`${url}/api/emailTemplates`)
    .then(res => {
      dispatch({
        type: SET_EMAIL_TEMPLATES,
        payload: res.data
      });
    })
    .catch(err => console.log(err));
};

/*=====================================
    Delete email Template
=======================================*/
export const deleteEmailTemplate = templateId => dispatch => {
  axios
    .delete(`${url}/api/emailTemplates/${templateId}`)
    .then(res => {
      Alert.success("<h4>Template Deleted</h4>", {
        position: "top-right",
        effect: "slide",
        beep: false,
        html: true,
        timeout: 5000
        // offset: 100
      });
      dispatch(getAllEmailTemapltes());
    })
    .catch(err => console.log(err));
};
