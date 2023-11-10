import axios from "axios";
import { url } from "./config";
import {
  BEFORE_PAYMENT_DATA,
  SET_LOGIN,
  SET_BILLING_HISTORY,
  SET_FUTURE_PAYMENT_INVOICE,
  SET_PAYMENT_HISTORY,
  SET_PAYMENT_SAVED_CARDS,
  SET_CUSTOMER_ACCOUTN_BALENCE,
} from "./../types";
import Alert from "react-s-alert";
import {
  getOrganizationDetaisAction,
  logoutUser,
  updateOrganizationAddress,
} from "./authAction";
import { workspaceId } from "./config";
import { json } from "body-parser";
import isEmpty from "../validations/is-empty";

/*=============================================
            Before Payment Action
===============================================*/
export const beforePaymentAction = (formData, payApiCallback) => (dispatch) => {
  axios
    .post(`${url}/api/pay`, formData)
    .then((res) => {
      payApiCallback(res.status);
      dispatch({
        type: BEFORE_PAYMENT_DATA,
        payload: res.data,
      });
    })
    .catch((err) => console.log(err));
};

/*==============================================
            After Payment Success
===============================================*/

export const afterPaymentSuccessAction = (formData, history) => (dispatch) => {
  axios
    .post(`${url}/api/pay/success`, formData)
    .then((res) => {
      dispatch(history.push("/payment-success"));
      console.log(res.data);
      // dispatch({
      //   type:SET_AFTER_PAYMENT_DATA,
      //   payload:res.data
      // })
    })
    .catch((err) => console.log(err));
};

/*===============================================
          Upgrade plans for paid users
=================================================*/
export const upgradePlansOfPaidUsers =
  (organizationId, formData, callBackSubscriptionUpdate, workspaceId) =>
  (dispatch) => {
    axios
      .post(`${url}/api/organizations/upgrade/${organizationId}`, formData)
      .then((res) => {
        callBackSubscriptionUpdate(res.data);
        dispatch(getOrganizationDetaisAction(workspaceId));
        Alert.success(`<h4>Subscription updated</h4>`, {
          position: "top-right",
          effect: "slide",
          beep: false,
          html: true,
          timeout: 5000,
          // offset: 100
        });
      })
      .catch((err) => {
        Alert.success(`<h4>Already subscribed</h4>`, {
          position: "top-right",
          effect: "slide",
          beep: false,
          html: true,
          timeout: 5000,
          // offset: 100
        });
      });
  };

/*================================================
          Cancel Subscription Of User
=================================================*/
export const cancelUserSubscriptin =
  (organizationId, formData, callBackSubscriptionCancel, workspaceId) =>
  (dispatch) => {
    axios
      .post(`${url}/api/organizations/cancel/${organizationId}`, formData)
      .then((res) => {
        callBackSubscriptionCancel(res.status);
        dispatch(getOrganizationDetaisAction(workspaceId));
        dispatch(cancelNextSubscription(organizationId, formData, workspaceId));
      })
      .catch((err) => callBackSubscriptionCancel(err));
  };

/*=================================================
        Cancel Next Month Subscription
===================================================*/
export const cancelNextSubscription =
  (organisationId, formData, workspaceId) => (dispatch) => {
    axios
      .post(`${url}/api/organizations/cancelUpdate/${organisationId}`, formData)
      .then((res) => {
        dispatch(getOrganizationDetaisAction(workspaceId));
        Alert.success(`<h4>Next subscription canceled</h4>`, {
          position: "top-right",
          effect: "slide",
          beep: false,
          html: true,
          timeout: 5000,
          // offset: 100
        });
      })
      .catch((err) => console.log(err));
  };

/*===================================================
            Resume current Subscription
====================================================*/
export const resumeSubscription =
  (organisationId, workspaceId) => (dispatch) => {
    axios
      .post(`${url}/api/organizations/resume/${organisationId}`)
      .then((res) => {
        Alert.success(`<h4>Subscription resume successfully</h4>`, {
          position: "top-right",
          effect: "slide",
          beep: false,
          html: true,
          timeout: 5000,
          // offset: 100
        });
        // localStorage.removeItem("oraganiationData");
        // localStorage.setItem("oraganiationData", JSON.stringify(res.data));
        dispatch(getOrganizationDetaisAction(workspaceId));
      })
      .catch((err) => console.log(err));
  };

/*================================================
  Update plan and expiration token after success 
==================================================*/
export const updateDataAfterPaymentSuccess = () => (dispatch) => {
  axios
    .get(`${url}/api/organizations/${workspaceId}`)
    .then((res) => {
      let previousData = localStorage.getItem("Data");
      previousData = JSON.parse(previousData);
      // previousData.billingType = res.data.billingType;
      // previousData.expirationDate = res.data.expirationDate;
      // const resData = res.data;
      // Object.keys(previousData).forEach((key) => {
      //   Object.keys(resData).forEach((rkey) => {
      //     if (rkey === key && key !== "role") {
      //       previousData[key] = resData[rkey];
      //     }
      //   });
      // });
      // localStorage.clear();
      localStorage.removeItem("oraganiationData");
      // localStorage.removeItem("Data");
      // localStorage.setItem("Data", JSON.stringify(previousData));
      localStorage.setItem("oraganiationData", JSON.stringify(res.data));
      // dispatch({ type: SET_LOGIN, payload: previousData });
      // console.log(res.data);
    })
    .catch((err) => console.log(err));
};

/*=========================================================
                    Api Billings
==========================================================*/
export const getAllPaymentHistory = (organizationId) => (dispatch) => {
  axios
    .get(`${url}/api/billings/organization/${organizationId}`)
    .then((res) => {
      dispatch({
        type: SET_BILLING_HISTORY,
        payload: res.data,
      });
    })
    .catch((err) => console.log(err));
};

/*===========================================================
                  Send Menual Retry 
============================================================*/
export const sendMenualRetry =
  (formData, manualRetryCallback, workspaceId) => (dispatch) => {
    axios
      .post(`${url}/api/organizations/manual/retry`, formData)
      .then((res) => {
        dispatch(getOrganizationDetaisAction(workspaceId));
        manualRetryCallback(res.status);
        Alert.success(`<h4>Manual Retry Send</h4>`, {
          position: "top-right",
          effect: "slide",
          beep: false,
          html: true,
          timeout: 5000,
          // offset: 100
        });
      })
      .catch((err) => console.log(err));
  };

/*============================================================
      Cancel subscription after payment failed flow
=============================================================*/
export const cancelImmediateSubscription = (formData) => (dispatch) => {
  axios
    .post(`${url}/api/organizations/manual/cancel`, formData)
    .then((res) => {
      Alert.success(`<h4>Subscription Canceled</h4>`, {
        position: "top-right",
        effect: "slide",
        beep: false,
        html: true,
        timeout: 5000,
        // offset: 100
      });
      dispatch(logoutUser());
    })
    .catch((err) => console.log(err));
};

/*=========================================================================================================
                                         Stripe Payment Apis
==========================================================================================================*/
/*=========================================================================
                       get customer object
==========================================================================*/
export const getStripeCustomerObject = (customerId) => async (dispatch) => {
  let formData = {
    customerId: customerId,
  };
  try {
    let { data } = await axios.post(`${url}/api/get-customer-object`, formData);
    if (data) {
      localStorage.setItem("customerStripeObject", JSON.stringify(data));
      dispatch({
        type: SET_CUSTOMER_ACCOUTN_BALENCE,
        payload: data,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

/*=========================================================================
                       Update Customer Address
==========================================================================*/
export const updateCustomerAddress =
  (formData, callBackAddAdress) => async (dispatch) => {
    try {
      let { data, status } = await axios.post(
        `${url}/api/update-customer`,
        formData
      );
      if (data) {
        localStorage.setItem("customerStripeObject", JSON.stringify(data));
        Alert.success(`<h4>Address updated</h4>`, {
          position: "top-right",
          effect: "slide",
          beep: false,
          html: true,
          timeout: 5000,
          // offset: 100
        });
        dispatch(getStripeCustomerObject(formData.customerId));
        callBackAddAdress(status);
      }
    } catch (err) {
      console.log(err);
    }
  };

/*=========================================================================
                        Stripe Price id by productId
==========================================================================*/

export const getPriceIdByProduct =
  (formData, callBackGetPrice) => async (dispatch) => {
    try {
      let { data } = await axios.post(`${url}/api/get-price`, formData);
      if (data) {
        callBackGetPrice(data.data[0].id);
      }
    } catch (err) {
      console.log(err);
    }
  };

/*=========================================================================
                        Stripe Get Future Invoice
==========================================================================*/
export const getFutureInvoice = (newPriceId) => async (dispatch) => {
  let organisationData = JSON.parse(localStorage.getItem("oraganiationData"));
  const formData = {
    customerId: organisationData.customerId,
    subscriptionId: organisationData.subscriptionId,
    newPriceId: newPriceId,
  };
  try {
    let { data } = await axios.post(`${url}/api/get-future-invoice`, formData);
    if (data) {
      dispatch({
        type: SET_FUTURE_PAYMENT_INVOICE,
        payload: data,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

/*=========================================================================
                        Stripe Subscription by sub id
==========================================================================*/

export const getSubscriptionById = () => async (dispatch) => {
  let organisationData = JSON.parse(localStorage.getItem("oraganiationData"));

  try {
    let { data } = await axios.get(
      `${url}/api/get-subscription/${organisationData.subscriptionId}`
    );
    if (data) {
      console.log(data);
    }
  } catch (err) {
    console.log(err);
  }
};

/*=========================================================================
                Gte Stripe payment history by customer id
==========================================================================*/
export const getPaymentHistoryByCustomerId = () => async (dispatch) => {
  let organisationData = JSON.parse(localStorage.getItem("oraganiationData"));
  let formData = {
    customerId: organisationData.customerId,
  };

  try {
    let { data } = await axios.post(`${url}/api/get-payment-intents`, formData);
    if (data) {
      dispatch({
        type: SET_PAYMENT_HISTORY,
        payload: data.data,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

/*=========================================================================
               Get Saved Cards Of Customer
==========================================================================*/
export const getCustomerSavedCards = () => async (dispatch) => {
  let organisationData = JSON.parse(localStorage.getItem("oraganiationData"));
  let formData = {
    customerId: organisationData.customerId,
  };

  try {
    let { data } = await axios.post(
      `${url}/api/get-payment-method-for-customer`,
      formData
    );
    if (data) {
      dispatch({
        type: SET_PAYMENT_SAVED_CARDS,
        payload: data.data,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

/*=========================================================================
                        Attach card for customer
==========================================================================*/
export const AddNewCardForCustomer =
  (formData, callBackAddCard) => async (dispatch) => {
    let organisationData = JSON.parse(localStorage.getItem("oraganiationData"));
    try {
      let { data, status } = await axios.post(
        `${url}/api/attach-payment-method`,
        formData
      );
      if (data) {
        Alert.success(`<h4>Card added</h4>`, {
          position: "top-right",
          effect: "slide",
          beep: false,
          html: true,
          timeout: 5000,
          // offset: 100
        });
        dispatch(getCustomerSavedCards(organisationData.customerId));

        if (organisationData.planStatus === "PAYMENT_FAILED") {
          organisationData.planStatus = "PAID";
          dispatch(
            updateOrganizationAddress(organisationData._id, organisationData)
          );
        }
        callBackAddCard(status);
      }
    } catch (err) {
      console.log(err);
    }
  };

/*=========================================================================
                        Detach card for customer
==========================================================================*/
export const RemoveCardForCustomer = (formData) => async (dispatch) => {
  let organisationData = JSON.parse(localStorage.getItem("oraganiationData"));
  try {
    let { data } = await axios.post(
      `${url}/api/detach-payment-method`,
      formData
    );
    if (data) {
      Alert.success(`<h4>Card remove</h4>`, {
        position: "top-right",
        effect: "slide",
        beep: false,
        html: true,
        timeout: 5000,
        // offset: 100
      });
      dispatch(getCustomerSavedCards(organisationData.customerId));
    }
  } catch (err) {
    console.log(err);
  }
};

/*=========================================================================
                 Stripe Set Default Payment Method 
==========================================================================*/

export const setDefaultPaymentCardAction = (formData) => async (dispatch) => {
  try {
    let { data } = await axios.post(`${url}/api/make-default`, formData);
    if (data) {
      Alert.success(`<h4>Set as default card</h4>`, {
        position: "top-right",
        effect: "slide",
        beep: false,
        html: true,
        timeout: 5000,
        // offset: 100
      });

      dispatch(getStripeCustomerObject(formData.customerId));
      dispatch(getCustomerSavedCards(formData.customerId));
    }
  } catch (err) {
    console.log(err);
  }
};

/*=========================================================================
              GET USERS QUANTITY TO UPDATE SUBSCRIPTION
==========================================================================*/

export const getAllActiveUserQuantity = () => async (dispatch) => {
  try {
    let { data } = await axios.get(`${url}/api/users`);
    if (data) {
      console.log(data);
      let activeUsers = !isEmpty(data)
        ? data.filter((ele) => ele.status === "ACTIVE")
        : [];

      // console.log(activeUsers);
      let organisationData = JSON.parse(
        localStorage.getItem("oraganiationData")
      );
      const formData = {
        subscriptionId: organisationData.subscriptionId,
        quantity: activeUsers.length,
      };
      dispatch(updateQuantity(formData));
    }
  } catch (err) {
    console.log(err);
  }
};

/*=========================================================================
                       UPDATE SUBSCRIPTION
==========================================================================*/

export const updateQuantity = (formData) => async (dispatch) => {
  try {
    let { data } = await axios.post(`${url}/api/update-quantity`, formData);
    if (data) {
      console.log(data);
    }
  } catch (err) {
    console.log(err);
  }
};

/*=====================================================================================================
                                             NEW PAYMENT FLOW
=======================================================================================================*/

/*=========================================================================
         Create customer source using source id --> step 2
==========================================================================*/

// export const createCustomerSourceUsingSourceId = (formData) => async (
//   dispatch
// ) => {
//   try {
//     let { data } = await axios.post(
//       `${url}/api/create-customer-source`,
//       formData
//     );
//     if (data) {
//       alert("Customer source created");
//       const customerUpdateData = {
//         customerId: data.id,
//         payLoad: {
//           address: {
//             city: "pune",
//             country: "IN",
//             line1: "line one address",
//             line2: null,
//             postal_code: "444604",
//             state: "maharashtra",
//           },
//         },
//       };

//       await dispatch(updateCustomer(customerUpdateData));

//       // console.log(data);
//       const formData = {
//         customer: data.id,
//         card: data.default_source,
//         url:
//           process.env.NODE_ENV === "development"
//             ? "http://localhost:3000/payment-success"
//             : `http://${workspaceId}.dominate.ai/payment-success`,
//         amount: "100",
//         currency: "inr",
//       };
//       dispatch(createSecureSource(formData));
//     }
//   } catch (err) {
//     console.log(err);
//   }
// };

/*=========================================================================
              Create secure source --> step 3
==========================================================================*/

// export const createSecureSource = (formData) => async (dispatch) => {
//   try {
//     let { data } = await axios.post(
//       `${url}/api/create-secure-source`,
//       formData
//     );
//     if (data) {
//       console.log(data);
//       alert("Secure source created");
//       localStorage.setItem("secureSource", JSON.stringify(data));
//       window.location.href = data.redirect.url;
//     }
//   } catch (err) {
//     console.log(err);
//   }
// };

/*=========================================================================
              Create Charge --> step 4
==========================================================================*/

// export const createCharge = (formData) => async (dispatch) => {
//   try {
//     let { data } = await axios.post(`${url}/api/create-charge`, formData);
//     if (data) {
//       console.log(data);
//       await alert("Charge created");
//       const formData = {
//         customer: data.customer,
//         price: "price_1IVzesFHfcG4tGd9PqJ7Jbzt",
//         trial_end: 1616466774,
//       };
//       dispatch(createSubsciptionTrial(formData));
//     }
//   } catch (err) {
//     console.log(err);
//   }
// };

/*=========================================================================
              Create Subscription trial --> step 6
==========================================================================*/

// export const createSubsciptionTrial = (formData) => async (dispatch) => {
//   try {
//     let { data } = await axios.post(`${url}/api/create-subs-trial`, formData);
//     if (data) {
//       alert("subscription trial created");
//       console.log(data);
//     }
//   } catch (err) {
//     console.log(err);
//   }
// };

/*=========================================================================
                       Update Customer Address
==========================================================================*/
// export const updateCustomer = (formData) => async (dispatch) => {
//   try {
//     let { data, status } = await axios.post(
//       `${url}/api/update-customer`,
//       formData
//     );
//     if (data) {
//       alert("Customer updated");
//     }
//   } catch (err) {
//     console.log(err);
//   }
// };
