import axios from "axios";
import { url } from "./config";
import { SET_PRODUCT_AND_SERVICES } from "./../types";
import Alert from "react-s-alert";
import isEmpty from "../validations/is-empty";

/*=================================================
                Create Contact
===================================================*/
export const createProductOrService =
  (formData, callBackAddProductOrService, alertText) => async (dispatch) => {
    try {
      let { data, status } = await axios.post(`${url}/api/items`, formData);
      if (data) {
        Alert.success(`<h4>${alertText}</h4>`, {
          position: "top-right",
          effect: "slide",
          beep: false,
          html: true,
          timeout: 5000,
          // offset: 100
        });
        callBackAddProductOrService(status);
        dispatch(getAllProductOrServices());
      }
    } catch (err) {
      console.log(err);
    }
  };

/*=================================================
        Get All Product Or Services
===================================================*/
export const getAllProductOrServices = () => async (dispatch) => {
  try {
    let { data } = await axios.get(`${url}/api/items?pageNo=1&pageSize=100`);
    if (data) {
      dispatch({
        type: SET_PRODUCT_AND_SERVICES,
        payload: data,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

/*=================================================
        Delete product or services by id
===================================================*/
export const deleteProductOrServiceById =
  (id, alertText) => async (dispatch) => {
    try {
      let { data } = await axios.delete(`${url}/api/items/${id}`);
      if (data) {
        console.log(data);
        Alert.success(`<h4>${alertText}</h4>`, {
          position: "top-right",
          effect: "slide",
          beep: false,
          html: true,
          timeout: 5000,
          // offset: 100
        });
        dispatch(getAllProductOrServices());
      }
    } catch (err) {
      console.log(err);
    }
  };

/*=================================================
          Update product or service by id
===================================================*/
export const updateProductOrServiceById =
  (formData, id, callBackUpdateProductOrService) => async (dispatch) => {
    try {
      let { data, status } = await axios.put(
        `${url}/api/items/${id}`,
        formData
      );
      if (data) {
        console.log(data);
        Alert.success(`<h4>Item Updated</h4>`, {
          position: "top-right",
          effect: "slide",
          beep: false,
          html: true,
          timeout: 5000,
          // offset: 100
        });
        callBackUpdateProductOrService(status);
        dispatch(getAllProductOrServices());
      }
    } catch (err) {
      console.log(err);
    }
  };

/*=================================================
          Import Product and services
===================================================*/
export const importProductAndServices =
  (formData, callBackImportProductOrservice) => async (dispatch) => {
    const headers = {
      "Content-Type": "multipart/form-data",
    };
    try {
      let { data, status } = await axios.post(
        `${url}/api/items/import`,
        formData,
        {
          headers: headers,
        }
      );
      if (data) {
        Alert.success(`<h4>Products & Services imported</h4>`, {
          position: "top-right",
          effect: "slide",
          beep: false,
          html: true,
          timeout: 5000,
          // offset: 100
        });
        callBackImportProductOrservice(status);
        dispatch(getAllProductOrServices());
      }
    } catch (err) {
      console.log(err);
    }
  };

/*=================================================
       Product And Services Filter Api
===================================================*/
export const productAndServicesSearch = (formData) => async (dispatch) => {
  try {
    let { data } = await axios.post(`${url}/api/items/search`, formData);
    if (data) {
      dispatch({
        type: SET_PRODUCT_AND_SERVICES,
        payload: data,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

/*=================================================
       Product And Services Filter Api
===================================================*/
export const checkProductOrServiceIsExist =
  (formData, callBackProductExist) => async (dispatch) => {
    try {
      let { data } = await axios.post(`${url}/api/items/search`, formData);
      if (data) {
        console.log(data);
        if (!isEmpty(data)) {
          callBackProductExist(true);
        } else {
          callBackProductExist(true);
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

// /*=================================================
//                 Export Contacts
// ===================================================*/
// export const exportContacts = (callBackExport) => async (dispatch) => {
//   try {
//     let { data } = await axios.get(`${url}/api/contacts/export`);
//     if (data) {
//       callBackExport(data);
//       console.log(data);
//     }
//   } catch (err) {
//     console.log(err);
//   }
// };

// /*=================================================
//         Import Contact To Leads
// ===================================================*/
// export const importContactsToLead = (
//   formData,
//   assignId,
//   callBackImportContatcToLeads
// ) => async (dispatch) => {
//   try {
//     let { data, status } = await axios.post(
//       `${url}/api/leads/import/contactstoleads?assignedTo=${assignId}`,
//       formData
//     );
//     if (data) {
//       Alert.success(`<h4>Contacts imported to leads</h4>`, {
//         position: "top-right",import isEmpty from '../validations/is-empty';

//         effect: "slide",
//         beep: false,
//         html: true,
//         timeout: 5000,
//         // offset: 100
//       });
//       callBackImportContatcToLeads(status);
//     }
//   } catch (err) {
//     console.log(err);
//   }
// };
