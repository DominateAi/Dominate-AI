import axios from "axios";
import { url } from "./config";
import {
  SET_ALL_CONTACT,
  CLEAR_LOADER,
  SET_SELECTED_CONTACTS,
  SET_SEARCH_IN_ALL_PAGE,
} from "./../types";
import Alert from "react-s-alert";
import { createFieldValue } from "./commandCenter";
import isEmpty from "./../validations/is-empty";

/*=================================================
                Create Contact
===================================================*/
export const createContact =
  (formData, callBackAddContact) => async (dispatch) => {
    try {
      let { data, status } = await axios.post(`${url}/api/contacts`, formData);
      if (data) {
        Alert.success(`<h4>Contact Added</h4>`, {
          position: "top-right",
          effect: "slide",
          beep: false,
          html: true,
          timeout: 5000,
          // offset: 100
        });
        callBackAddContact(status);
        dispatch(getAllContacts());
      }
    } catch (err) {
      console.log(err);
    }
  };

/*=================================================
                Get All Accounts
===================================================*/
export const getAllContacts = () => async (dispatch) => {
  try {
    let { data } = await axios.get(`${url}/api/contacts?pageNo=1&pageSize=20`);
    if (data) {
      data.forEach((element) => {
        element.checked = false;
      });

      dispatch({
        type: SET_ALL_CONTACT,
        payload: data,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

/*=================================================
                Get All Accounts
===================================================*/
export const updateCheckboxCheckedContacts =
  (checkedContacts, callBackUpdateHeaderCheckbox) => async (dispatch) => {
    try {
      let { data } = await axios.get(
        `${url}/api/contacts?pageNo=1&pageSize=20`
      );
      if (data) {
        data.forEach((element) => {
          element.checked = false;
        });

        // mark checked data elements which are present in checkedContacts
        let filteredData = [];
        if (!isEmpty(checkedContacts)) {
          checkedContacts.map((checkedContactData, index) => {
            filteredData = data.filter((a) => a._id === checkedContactData._id);
            if (!isEmpty(filteredData)) {
              filteredData[0].checked = true;
            }
          });
        }

        if (
          !isEmpty(checkedContacts) &&
          !isEmpty(data) &&
          checkedContacts.length === data.length
        ) {
          let checkFalseValPresent = data.filter((a) => a.checked === false);
          if (isEmpty(checkFalseValPresent)) {
            callBackUpdateHeaderCheckbox(true);
          }
        }

        // console.log(data.map((data, index) => data.checked));

        dispatch({
          type: SET_SELECTED_CONTACTS,
          payload: checkedContacts,
        });

        dispatch({
          type: SET_ALL_CONTACT,
          payload: data,
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

/*=================================================
        Delete Contact By Contact Id
===================================================*/
export const deleteContactById =
  (contactId, isEmptySearchList, callBackDeleteContact) => async (dispatch) => {
    try {
      let { data } = await axios.delete(`${url}/api/contacts/${contactId}`);
      if (data) {
        Alert.success(`<h4>Contact Deleted</h4>`, {
          position: "top-right",
          effect: "slide",
          beep: false,
          html: true,
          timeout: 5000,
          // offset: 100
        });
        // dispatch(getAllContacts());

        console.log(isEmptySearchList);

        if (isEmptySearchList) {
          dispatch({
            type: SET_SEARCH_IN_ALL_PAGE,
            payload: [],
          });
        }

        callBackDeleteContact();
      }
    } catch (err) {
      console.log(err);
    }
  };

/*=================================================
          Update Contact With Id
===================================================*/
export const updateContactById =
  (contactId, formData, callBackUpdateContact) => async (dispatch) => {
    try {
      let { data, status } = await axios.put(
        `${url}/api/contacts/${contactId}`,
        formData
      );
      if (data) {
        Alert.success(`<h4>Contact Updated</h4>`, {
          position: "top-right",
          effect: "slide",
          beep: false,
          html: true,
          timeout: 5000,
          // offset: 100
        });
        callBackUpdateContact(status);
        dispatch(getAllContacts());
      }
    } catch (err) {
      console.log(err);
    }
  };

/*==========================================================
             Contact Search
===========================================================*/

export const searchContact = (formData) => async (dispatch) => {
  try {
    let { data } = await axios.post(`${url}/api/contacts/search`, formData);
    if (data) {
      data.forEach((element) => {
        element.checked = false;
      });

      dispatch({
        type: SET_ALL_CONTACT,
        payload: data,
      });
      // console.log(data);
    }
  } catch (err) {
    console.log(err);
  }
};

/*==========================================================
               Check Contact exist or not
===========================================================*/

export const checkIfContactExistOrNot =
  (email, callbackContactExist) => (dispatch) => {
    axios
      .get(`${url}/api/contacts/emailExist?email=${email}`)
      .then((res) => {
        callbackContactExist(res.data.isExist);
      })
      .catch((err) => console.log(err));
  };

/*=================================================
            Contacts Bulk Delete
===================================================*/
export const contactBulkDelete = (formData) => async (dispatch) => {
  try {
    let { data } = await axios.post(`${url}/api/contacts/bulkdelete`, formData);
    if (data) {
      dispatch({
        type: SET_SELECTED_CONTACTS,
        payload: [],
      });
      dispatch({
        type: SET_SEARCH_IN_ALL_PAGE,
        payload: [],
      });
      Alert.success(`<h4>Contacts deleted</h4>`, {
        position: "top-right",
        effect: "slide",
        beep: false,
        html: true,
        timeout: 5000,
        // offset: 100
      });

      dispatch(getAllContacts());
    }
  } catch (err) {
    console.log(err);
  }
};

/*=================================================
                Import Contacts
===================================================*/
export const importContacts =
  (formData, callBackImportContact) => async (dispatch) => {
    const headers = {
      "Content-Type": "multipart/form-data",
    };

    try {
      let { data, status } = await axios.post(
        `${url}/api/contacts/import`,
        formData,
        {
          headers: headers,
        }
      );
      if (data) {
        Alert.success(`<h4>Contacts imported</h4>`, {
          position: "top-right",
          effect: "slide",
          beep: false,
          html: true,
          timeout: 5000,
          // offset: 100
        });
        callBackImportContact(status);
        dispatch(getAllContacts());
        dispatch({
          type: CLEAR_LOADER,
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

/*=================================================
                Export Contacts
===================================================*/
export const exportContacts = (callBackExport) => async (dispatch) => {
  try {
    let { data } = await axios.get(`${url}/api/contacts/export`);
    if (data) {
      callBackExport(data);
      console.log(data);
    }
  } catch (err) {
    console.log(err);
  }
};

/*=================================================
        Import Contact To Leads
===================================================*/
export const importContactsToLead =
  (formData, assignId, assignAccoountId, callBackImportContatcToLeads) =>
  async (dispatch) => {
    try {
      let { data, status } = await axios.post(
        `${url}/api/leads/import/contactstoleads?assignedTo=${assignId}?&accountId=${assignAccoountId}`,
        formData
      );
      if (data) {
        Alert.success(`<h4>Contacts imported to leads</h4>`, {
          position: "top-right",
          effect: "slide",
          beep: false,
          html: true,
          timeout: 5000,
          // offset: 100
        });
        callBackImportContatcToLeads(status);
      }
    } catch (err) {
      console.log(err);
    }
  };
