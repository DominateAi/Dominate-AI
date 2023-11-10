import axios from "axios";
import {
  SET_ERRORS,
  GET_API_STATUS,
  SET_LOGIN,
  LOGOUT_USER,
  GET_PLANS,
  SET_LOADER,
  CLEAR_LOADER,
  MAKE_PAYMENT,
  GET_ALL_ROLES,
  SET_EMPTY_STATUS,
  VERIFY_EMPLOYEE,
  SET_SIGNUP_USER_INFO,
  SET_ORGANIZATION_DETAILS,
  SET_ORGANIZATION_UPLOADED_IMAGE,
  GET_INVITE_LINK_USERS,
} from "./../types";
import setAuthToken from "./../utils/setAuthToken";
import Alert from "react-s-alert";
import { getStripeCustomerObject } from "./paymentAction";
import { getAllEmployeesWithAdmin } from "./../actions/employeeAction";
import { createReferral } from "./../actions/referralAction";

import { workspaceId } from "./config";
import { url } from "./config";
import cookie from "react-cookies";
import isEmpty from "../validations/is-empty";

/*================================
    Check if user exist o not 
==================================*/

export const checkIfUserExist = (payload) => {
  let response = {};
  return async (dispatch) => {
    try {
      response = await axios.get(
        `${url}/public/userinworkspace/exist`,
        payload
      );

      const { status, data = {} } = response || {};

      if (status === false) {
        console.log(payload);
      } else if (status === true) {
      }
    } catch (err) {
      console.log("err signup", err);
      throw err;
    }

    return response;
  };
};

/*================================
    CREATE ORGANIZATION API
==================================*/

export const createOrganization = (payload) => {
  let response = {};
  return async (dispatch) => {
    try {
      response = await axios.post(`${url}/api/organizations`, payload);

      const { status, data = {} } = response || {};

      if (status !== 200) {
        console.log(payload);
      } else if (status === 200) {
        Alert.success("<h4>Organization data added</h4>", {
          position: "top-right",
          effect: "slide",
          beep: false,
          html: true,
          timeout: 5000,
          // offset: 100
        });
        dispatch(getOrganizationDetaisAction());
      }
    } catch (err) {
      console.log("err signup", err);
      throw err;
    }

    return response;
  };
};

/*================================
   GET ALL ROLES PUBLIC API
==================================*/

export const getAllRolesPublic = (payload) => {
  let response = {};
  return async (dispatch) => {
    try {
      response = await axios.get(`${url}/public/getallroles/open`, payload);

      const { status, data = {} } = response || {};

      if (status === false) {
        console.log(payload);
      } else if (status === true) {
      }
    } catch (err) {
      console.log("err signup", err);
      throw err;
    }

    return response;
  };
};

/*================================
    checking token expire or not
==================================*/
export const replaceRefreshToken = (formData) => (dispatch) => {
  axios
    .post(`${url}/public/token/refresh`, formData)
    .then((res) => {
      let previousData = localStorage.getItem("Data");
      previousData = JSON.parse(previousData);
      const resData = res.data;
      Object.keys(previousData).forEach((key) => {
        Object.keys(resData).forEach((rkey) => {
          if (rkey === key && key !== "role") {
            previousData[key] = resData[rkey];
          }
        });
      });
      previousData.token = res.data.token;
      previousData.refresh_token = res.data.refresh_token;
      previousData.tokenExpiresOn = res.data.tokenExpiresOn;
      // localStorage.removeItem("Data");
      localStorage.setItem("Data", JSON.stringify(previousData));
      setAuthToken(res.data.token);
      dispatch({ type: SET_LOGIN, payload: previousData });
      // dispatch(getOrganizationDetaisAction(workspaceId));
    })
    .catch((err) => console.log(err));
};

/*=========================== 
    SignUp User 
=============================*/

export const signUpAction =
  (formData, userExist, history) => async (dispatch) => {
    axios
      .post(`${url}/public/signup`, formData)
      .then((res) => {
        var referralCode = JSON.parse(
          localStorage.getItem("appliedReferralCode")
        );
        Alert.success("<h4>Sign Up Successfully</h4>", {
          position: "top-right",
          effect: "slide",
          beep: false,
          html: true,
          timeout: 5000,
          // offset: 100
        });

        let signupInfo = {
          email: formData.defaultUserEmailId,
          password: formData.defaultUserPassword,
        };

        if (userExist === false) {
          history.push({
            pathname: "/create-organization",
            state: { signupInfo: signupInfo },
          });
        } else {
          history.push({
            pathname: "/success-msg",
            state: { signupInfo: res.data },
          });
        }
      })
      .catch(
        (err) => console.log(err)
        // dispatch({
        //   type: SET_ERRORS,
        //   payload: err.response.data,
        // })
      );
  };

/*===========================
    SignUp User 
=============================*/

export const googleSignUpAction =
  (formData, socialRespone, callBackGoogleSignup) => async (dispatch) => {
    dispatch({
      type: SET_LOADER,
    });
    axios
      .post(`${url}/public/signup`, formData)
      .then((res) => {
        var referralCode = JSON.parse(
          localStorage.getItem("appliedReferralCode")
        );
        Alert.success("<h4>Sign Up Successfully</h4>", {
          position: "top-right",
          effect: "slide",
          beep: false,
          html: true,
          timeout: 5000,
          // offset: 100
        });
        if (!isEmpty(referralCode)) {
          dispatch(
            createReferral({
              referralCode: referralCode,
              toEmail: res.data.email,
              toID: res.data._id,
              toWorkspaceID: res.data.workspaceId,
              signedUpOn: new Date().toISOString(),
              status: "SIGNUP",
            })
          );
        }
        callBackGoogleSignup(res.status, socialRespone);
        // history.push({
        //   pathname: "/success-msg",
        //   state: { signupInfo: res.data },
        // });
      })
      .catch(
        (err) => console.log(err)
        // dispatch({
        //   type: SET_ERRORS,
        //   payload: err.response.data,
        // })
      );
  };

/*=============================
  Check Workspace exists or not 
===============================*/

export const getWorkspace = (workSpaceName, callBack) => async (dispatch) => {
  try {
    let { data } = await axios.get(
      `${url}/public/workspace/exist?workspaceId=${workSpaceName}`
    );
    if (data) {
      callBack(data);
      dispatch({
        type: SET_ERRORS,
        payload: data,
      });
    }
  } catch (err) {
    console.log(err);
  }
  // axios
  //   .get(`${url}/public/workspace/exist?workspaceId=${workSpaceName}`)
  //   .then((res) => {
  //     dispatch({
  //       type: SET_ERRORS,
  //       payload: res.data,
  //     }),
  //       callBack(res.data);
  //   })
  //   .catch((err) => console.log(err));
};

/*===================================================
        Update Organization Address And Logo
====================================================*/

export const updateOrganizationAddress =
  (organizationId, formData, alertTextName) => (dispatch) => {
    axios
      .patch(`${url}/api/organizations/user/${organizationId}`, formData)
      .then((res) => {
        // Alert.success(`<h4>${alertTextName}</h4>`, {
        //   position: "top-right",
        //   effect: "slide",
        //   beep: false,
        //   html: true,
        //   timeout: 5000,
        //   // offset: 100
        // });
        dispatch({
          type: GET_API_STATUS,
          payload: res.status,
        });
        localStorage.removeItem("oraganiationData");
        localStorage.setItem("oraganiationData", JSON.stringify(res.data));
        dispatch({
          type: SET_ORGANIZATION_DETAILS,
          payload: res.data,
        });
      })
      .catch((err) => console.log(err));
  };

/*======================================
      Organization Detais actions
========================================*/
export const getOrganizationDetaisAction = () => (dispatch) => {
  axios
    .get(`${url}/api/organizations`)
    .then((res) => {
      console.log("res", res);
      if (!isEmpty(res.data)) {
        localStorage.setItem("oraganiationData", JSON.stringify(res.data[0]));
        dispatch({
          type: SET_ORGANIZATION_DETAILS,
          payload: res.data[0],
        });
      } else {
        let dummyData = {
          organizationName: "",
          logo: "",
          defaultUserEmailId: "",
          address: {
            city: "",
          },
        };

        localStorage.setItem("oraganiationData", JSON.stringify(dummyData));
        dispatch({
          type: SET_ORGANIZATION_DETAILS,
          payload: dummyData,
        });
      }
    })
    .catch((err) => console.log(err));

  // let organizationData = {
  //   isRefundRequested: false,
  //   features: ["call"],
  //   billingInfo: {
  //     cancellation_request: false,
  //     isOrganisationAtPendingState: false,
  //     isManualRequestGenerated: false,
  //     isManualRequestFailed: false,
  //   },
  //   _id: "78583470-dcc4-11ec-891d-7b9c188d65eb",
  //   organizationName: "adhere",
  //   workspaceId: "adhere",
  //   defaultUserEmailId: "akshaynagargoje0716@gmail.com",
  //   billingId: "",
  //   priceId: "",
  //   productId: "",
  //   planStatus: "FREE_PLAN",
  //   status: "ACTIVE",
  //   customerId: "cus_Ll7FIz8URvjfDE",
  //   subscriptionId: "sub_1L3b0iFHfcG4tGd9qLA8mwtE",
  //   workspaceUrl: "adhere.dominate.ai",
  //   createdBy: "akshaynagargoje0716@gmail.com",
  //   lastModifiedBy: "akshaynagargoje0716@gmail.com",
  //   subscriptionStarted: "2022-05-26T07:21:33.236Z",
  //   expirationDate: "2121-04-05T05:11:03.000Z",
  //   organizationType: "CUSTOMER",
  //   address: {
  //     companyAddress: "",
  //     state: "",
  //     city: "",
  //     pincode: "",
  //     country: "",
  //   },
  //   logo: "https://adhere.dominate.ai/public/download?filename=file-2021-05-11T12:57:39.537Z.png",
  //   createdAt: "2022-05-26T07:21:33.243Z",
  //   updatedAt: "2022-05-26T07:21:33.243Z",
  //   __v: 0,
  //   currency: "inr",
  // };

  // localStorage.setItem("oraganiationData", JSON.stringify(organizationData));
};

/*======================================
      Organization Imaga Upload
=======================================*/
export const uploadOrganizationImage = (formData) => (dispatch) => {
  const headers = {
    "Content-Type": "multipart/form-data",
  };
  axios
    .post(`${url}/api/upload`, formData, { headers: headers })
    .then((res) => {
      dispatch({
        type: SET_ORGANIZATION_UPLOADED_IMAGE,
        payload: res.data,
      });
    })
    .catch((err) => console.log(err));
};

/*==================================
        Login User Action
====================================*/

export const setCookie = () => async (dispatch) => {
  //variables
  var LastReportGenerated = "Jul 11 2013",
    baseDomain = ".dominate.ai",
    expireAfter = new Date();

  //setting up  cookie expire date after a week
  expireAfter.setDate(expireAfter.getDate() + 7);

  //now setup cookie
  document.cookie =
    "workspace=" +
    workspaceId +
    "; domain=" +
    baseDomain +
    "; expires=" +
    expireAfter +
    "; path=/";
};

export const loginUser = (formData, history) => (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  axios
    .post(`${url}/public/login`, formData, { headers: headers })
    .then((res) => {
      dispatch(setCookie());
      if (res.data.role.name === "SuperAdmin") {
        // Alert.success("<h4>Login Successfully</h4>", {
        //   position: "top-right",
        //   effect: "slide",
        //   beep: false,
        //   html: true,
        //   timeout: 5000,
        //   // offset: 100
        // });
        // Save token to localstorage
        const { token } = res.data;
        localStorage.setItem("Data", JSON.stringify(res.data));

        // localStorage.setItem("isUserLoggedIn", true);
        dispatch({ type: SET_LOGIN, payload: res.data });
        // Set token to auth header
        setAuthToken(token);
        dispatch(history.push("/organization"));
      } else {
        // console.log(res.data);
        // localStorage.setItem(
        //   "WarningBeforeFreeTrialEnded",
        //   JSON.stringify({ WarningBeforeFreeTrialEnded: true })
        // );
        // Alert.success("<h4>Login Successfully</h4>", {
        //   position: "top-right",
        //   effect: "slide",
        //   beep: false,
        //   html: true,
        //   timeout: 5000,
        //   // offset: 100
        // });
        // Save token to localstorage
        const { token } = res.data;
        localStorage.setItem("Data", JSON.stringify(res.data));

        // localStorage.setItem("isUserLoggedIn", true);
        dispatch({ type: SET_LOGIN, payload: res.data });
        // Set token to auth header
        setAuthToken(token);
        dispatch(getOrganizationDetaisAction());

        // if (token) {
        //   setInterval(function () {
        //     console.log("set interval called");
        //     dispatch(
        //       replaceRefreshToken({ refresh_token: res.data.refresh_token })
        //     );
        //   }, 3000);
        // }

        dispatch(history.push("/dashboard"));
      }
    })
    .catch((err) => {
      dispatch({
        type: SET_ERRORS,
        payload: err.response,
      });
    });
};

export const loginUserAfterSignup = (formData, history) => (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  axios
    .post(`${url}/public/login`, formData, { headers: headers })
    .then((res) => {
      const { token } = res.data;
      localStorage.setItem("Data", JSON.stringify(res.data));

      // localStorage.setItem("isUserLoggedIn", true);
      dispatch({ type: SET_LOGIN, payload: res.data });
      // Set token to auth header
      setAuthToken(token);
    })
    .catch((err) => {
      dispatch({
        type: SET_ERRORS,
        payload: err.response,
      });
    });
};

/*==================================
            Logout Action
====================================*/

export const logoutUser = (history) => (dispatch) => {
  Alert.success("<h4>Successfully logout</h4>", {
    position: "top-right",
    effect: "slide",
    beep: false,
    html: true,
    timeout: 5000,
    // offset: 100
  });

  //remove cookie

  //variables
  var LastReportGenerated = "Jul 11 2013",
    baseDomain = ".dominate.ai",
    expireAfter = new Date();

  //setting up  cookie expire date after a week
  expireAfter.setDate(expireAfter.getDate() + 7);

  //now setup cookie
  document.cookie =
    "workspace=" +
    "" +
    "; domain=" +
    baseDomain +
    "; expires=" +
    expireAfter +
    "; path=/";

  document.cookie =
    "socialLoginInfo=" +
    "" +
    "; domain=" +
    baseDomain +
    "; expires=" +
    expireAfter +
    "; path=/";

  document.cookie =
    "startFreeTrail=" +
    "" +
    "; domain=" +
    baseDomain +
    "; expires=" +
    expireAfter +
    "; path=/";

  //remove token from localstorage
  // localStorage.removeItem("Data");
  // localStorage.removeItem("oraganiationData");
  localStorage.clear();
  dispatch({
    type: LOGOUT_USER,
  });

  //remove token from header
  setAuthToken(false);
  if (process.env.NODE_ENV !== "development") {
    // history.push("/login");
    // window.location.href = "https://login.dominate.ai";
  } else {
    // history.push("/login");
    // window.location.href = "/login";
  }
};

/*=======================================
        Update Usesr AfterLogout
========================================*/
export const updateUserAfterLogout = (userId) => (dispatch) => {
  axios
    .put(`${url}/api/users/logout/${userId}`)
    .then((res) => {})
    .catch((err) => console.log(err));
};

/*===================================
          Get Plans Action
=====================================*/

export const getPlansAction = (formData) => (dispatch) => {
  dispatch({
    type: SET_LOADER,
  });
  axios
    .post(`${url}/public/tierplans`, formData)
    .then((res) => {
      // console.log(res.data);
      // let filteredPlan = res.data.filter(
      //   (plan) => plan.name !== "Free Forever"
      // );
      dispatch({
        type: CLEAR_LOADER,
      });
      dispatch({
        type: GET_PLANS,
        payload: res.data,
      });
    })
    .catch((err) => console.log(err));
};

/*==================================
            Pay Action
====================================*/
export const payAction = (data) => (dispatch) => {
  axios
    .post(`${url}/public/pay`, { data })
    .then((res) => {
      dispatch({
        type: MAKE_PAYMENT,
        payload: res.data,
      });
    })
    .catch((err) => console.log(err));
};

/*==================================
  Get All Roles
===================================*/
export const getAllRolesAction = () => (dispatch) => {
  axios
    .get(`${url}/api/roles`)
    .then((res) => {
      dispatch({
        type: GET_ALL_ROLES,
        payload: res.data,
      });
    })
    .catch((err) => console.log(err));
};

/*====================================
      Upgrade Organisation
=====================================*/

export const upgradeOrganisation =
  (organisationId, formData, history) => (dispatch) => {
    axios
      .post(`${url}/api/organizations/upgrade/${organisationId}`, formData)
      .then((res) => {
        history.push("/workspace-login");
      })
      .catch((err) => console.log(err));
  };

/*============================
    Verify Employee Action
==============================*/

export const verifyUserAction = (authCode, workspaceName) => (dispatch) => {
  console.log(authCode);
  axios
    .get(`${url}/public/authCode/verify?authCode=${authCode}`, {
      headers: {
        workspaceId: workspaceId,
      },
    })
    .then((res) => {
      dispatch({
        type: VERIFY_EMPLOYEE,
        payload: res.data,
      });
    })
    .catch((err) => console.log(err));
};

/*================================
  User Forget password Email link
==================================*/
export const sendForgetPasswordLink =
  (userEmail, history, workspaceName) => (dispatch) => {
    const headers = {
      "Content-Type": "application/json",
      workspaceId: workspaceId,
    };
    axios
      .get(`${url}/public/forgotPassword?email=${userEmail}`, {
        headers: headers,
      })
      .then((res) => {
        Alert.success("<h4>Link Sent</h4>", {
          position: "top-right",
          effect: "slide",
          beep: false,
          html: true,
          timeout: 5000,
          // offset: 100
        });
        dispatch(history.push("/confirmation"));
      })
      .catch((err) => console.log(err));
  };

/*================================
  User Reset password Action
================================*/
export const userPasswordResetAction =
  (workspaceName, formData, authCode, history, errorHandler) =>
  async (dispatch) => {
    // let workspaceName = window.location.host.split(".")[0];
    const headers = {
      "Content-Type": "application/json",
      workspaceId: workspaceId,
    };
    axios
      .patch(`${url}/public/users?authCode=${authCode}`, formData, {
        headers: headers,
      })
      .then((res) => {
        dispatch(loginUser(formData, history, workspaceName));
      })
      .catch((err) => {
        errorHandler(err.response.data);
      });
  };

/*===========================================================================
                Verify Email Link Send
============================================================================*/

export const verifyEmailLinkSend =
  (callBackVerifyLinkSend) => async (dispatch) => {
    const headers = {
      "Content-Type": "application/json",
      workspaceId: workspaceId,
    };
    try {
      var userData = JSON.parse(localStorage.getItem("Data"));

      let { data } = await axios.get(
        `${url}/public/verifyEmail?email=${userData.email}`,
        {
          headers: headers,
        }
      );
      if (data) {
        callBackVerifyLinkSend(data);
      }
    } catch (err) {
      console.log(err);
    }
  };

export const verifyEmailAuthcode = (authCode, callBack) => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data } = await axios.get(
      `${url}/public/authCode/verify?authCode=${authCode}`,
      {
        headers: headers,
      }
    );
    if (data) {
      await dispatch(patchEmailVerify(authCode, {}));
      dispatch({
        type: VERIFY_EMPLOYEE,
        payload: data,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

export const patchEmailVerify = (authCode, formData) => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data } = await axios.patch(
      `${url}/public/users/verifyemail?authCode=${authCode}`,
      formData,
      { headers: headers }
    );
    if (data) {
      let previousData = localStorage.getItem("Data");
      previousData = JSON.parse(previousData);
      previousData.verified = true;
      const resData = data;
      Object.keys(previousData).forEach((key) => {
        Object.keys(resData).forEach((rkey) => {
          if (rkey === key && key !== "role") {
            previousData[key] = resData[rkey];
          }
        });
      });
      // localStorage.clear();
      localStorage.removeItem("Data");
      localStorage.setItem("Data", JSON.stringify(previousData));
      dispatch({ type: SET_LOGIN, payload: previousData });

      Alert.success("<h4>Email Verified Successfully</h4>", {
        position: "top-right",
        effect: "slide",
        beep: false,
        html: true,
        timeout: 5000,
        // offset: 100
      });
    }
  } catch (err) {
    console.log(err);
  }
};

/*======================================
        Make Empty Status
=======================================*/

export const statusEmpty = () => (dispatch) => {
  dispatch({
    type: SET_EMPTY_STATUS,
  });
};

/*=======================================
        User Profile Update
========================================*/
export const userProfileUpload = (formData) => (dispatch) => {
  const headers = {
    "Content-Type": "application/x-www-form-urlencoded",
  };
  axios
    .post(`${url}/upload`, formData, { headers: headers })
    .then((res) => console.log(res.data))
    .catch((err) => console.log(err));
};

/********************************************
 * @DESC - IMAGE UPLOADER - PROPOSAL
 ********************************************/
export const normalImageUpload = async (formData) => {
  try {
    const headers = { "Content-Type": "multipart/form-data" };
    let { data } = await axios.post(`${url}/api/upload`, formData, {
      headers: headers,
    });
    if (data) {
      return { success: true, imageResponse: data };
    }
  } catch (err) {
    return { success: false, imageResponse: err };
  }
};

/*=======================================
            Update Usesr
========================================*/
export const updateUser = (userId, formData) => (dispatch) => {
  axios
    .put(`${url}/api/users/${userId}`, formData)
    .then((res) => {
      Alert.success("<h4>User Updated</h4>", {
        position: "top-right",
        effect: "slide",
        beep: false,
        html: true,
        timeout: 5000,
        // offset: 100
      });
      let previousData = localStorage.getItem("Data");
      previousData = JSON.parse(previousData);
      previousData.firstname = res.data.firstname;
      const resData = res.data;
      Object.keys(previousData).forEach((key) => {
        Object.keys(resData).forEach((rkey) => {
          if (rkey === key && key !== "role") {
            previousData[key] = resData[rkey];
          }
        });
      });
      // localStorage.clear();
      localStorage.removeItem("Data");
      localStorage.setItem("Data", JSON.stringify(previousData));
      dispatch({ type: SET_LOGIN, payload: previousData });

      // console.log(JSON.parse(previousData));
      // dispatch({ type: SET_LOGIN, payload: previousData });
      // Alert.success("<h4>User Updated</h4>", {
      //   position: "top-right",
      //   effect: "slide",
      //   beep: false,
      //   html: true,
      //   timeout: 5000
      //   // offset: 100
      // });
    })
    .catch((err) => console.log(err));
};

/*====================================
  Update Profile Image in backend
======================================*/
export const updateUserProfileImg = (userId, formData) => (dispatch) => {
  axios
    .put(`${url}/api/users/${userId}`, formData)
    .then((res) => {})
    .catch((err) => console.log(err));
};

/*=============================================
              Change User Profile
==============================================*/
export const changeUserProfile = (formData, userId, userData) => (dispatch) => {
  const headers = {
    "Content-Type": "multipart/form-data",
  };
  axios
    .post(`${url}/api/upload`, formData, { headers: headers })
    .then((res) => {
      Alert.success("<h4>Profile Img Updated</h4>", {
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
      let data = userData;
      userData.profileImage = res.data.fileUrl;
      dispatch(updateUserProfileImg(userId, data));

      let previousData = localStorage.getItem("Data");
      previousData = JSON.parse(previousData);
      previousData.profileImage = res.data.fileUrl;
      const resData = res.data;
      Object.keys(previousData).forEach((key) => {
        Object.keys(resData).forEach((rkey) => {
          if (rkey === key && key !== "role") {
            previousData[key] = resData[rkey];
          }
        });
      });
      // localStorage.clear();
      localStorage.removeItem("Data");
      localStorage.setItem("Data", JSON.stringify(previousData));
      dispatch({ type: SET_LOGIN, payload: previousData });
    })
    .catch((err) => console.log(err));
};

/*==========================================
      Update user demo overview flag
===========================================*/

// export const updateUserDemoWalkthroughFlag = (userId, formData) => (
//   dispatch
// ) => {
//   axios
//     .put(`${url}/api/users/${userId}`, formData)
//     .then((res) => {
//       let previousData = localStorage.getItem("Data");
//       previousData = JSON.parse(previousData);
//       previousData.demo = false;
//       const resData = res.data;
//       Object.keys(previousData).forEach((key) => {
//         Object.keys(resData).forEach((rkey) => {
//           if (rkey === key && key !== "role") {
//             previousData[key] = resData[rkey];
//           }
//         });
//       });
//       // localStorage.clear();
//       localStorage.removeItem("Data");
//       localStorage.setItem("Data", JSON.stringify(previousData));
//       dispatch({ type: SET_LOGIN, payload: previousData });
//     })
//     .catch((err) => console.log(err));
// };

export const updateUserDemoWalkthroughFlag =
  (userId, formData, callBackWalkthroughFlag) => async (dispatch) => {
    try {
      let { data, status } = await axios.put(
        `${url}/api/users/${userId}`,
        formData
      );
      if (data) {
        let previousData = localStorage.getItem("Data");
        previousData = JSON.parse(previousData);
        previousData.demo = false;
        const resData = data;
        Object.keys(previousData).forEach((key) => {
          Object.keys(resData).forEach((rkey) => {
            if (rkey === key && key !== "role") {
              previousData[key] = resData[rkey];
            }
          });
        });
        // localStorage.clear();
        localStorage.removeItem("Data");
        localStorage.setItem("Data", JSON.stringify(previousData));
        dispatch({ type: SET_LOGIN, payload: previousData });
        callBackWalkthroughFlag(status);
      }
    } catch (err) {
      console.log(err);
    }
  };

/*===================================================
      Check Workspace and email connected or not
====================================================*/

export const checkWorkspaceAndEmailConnectedOrNot =
  (checkFormData, socialRespone, callBackCheckWorkspace) => (dispatch) => {
    dispatch({
      type: SET_LOADER,
    });
    axios
      .post(`${url}/public/organizations/checkWorkspaceUser`, checkFormData)
      .then(
        (res) => callBackCheckWorkspace(res.data, socialRespone)
        // console.log(res.data)
      )
      .catch((err) => console.log(err));
  };

/*=============================================================================================
                                ADMIN SETTING PAGE ACTIONS
===============================================================================================*/

/*==============================================
        GET USER INVITE LINKS
================================================*/

export const getUsersInviteLinks = () => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data } = await axios.get(`${url}/api/users/inviteLinks`, {
      headers: headers,
    });
    if (data) {
      dispatch({
        type: GET_INVITE_LINK_USERS,
        payload: data,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

/*==============================================
        SEND USER INVITE LINK
================================================*/
export const sendInviteMailAgain = (formData) => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  try {
    let { data } = await axios.post(`${url}/api/users/inviteMail`, formData, {
      headers: headers,
    });
    if (data) {
      Alert.success("<h4>Invite Mail Sent</h4>", {
        position: "top-right",
        effect: "slide",
        beep: false,
        html: true,
        timeout: 5000,
        // offset: 100
      });

      console.log(data);
    }
  } catch (err) {
    console.log(err);
  }
};

/*==============================================
          USER COMPARE PASSWORD FUNCTION
================================================*/
export const userComparePassword =
  (formData, callBackComparePassword) => async (dispatch) => {
    const headers = {
      "Content-Type": "application/json",
      workspaceId: workspaceId,
    };
    try {
      let { data } = await axios.post(
        `${url}/api/users/comparePassword`,
        formData,
        {
          headers: headers,
        }
      );
      if (data) {
        console.log(data);
        if (data === true) {
          Alert.success("<h4>Password Verified</h4>", {
            position: "top-right",
            effect: "slide",
            beep: false,
            html: true,
            timeout: 5000,
            // offset: 100
          });
        }
        callBackComparePassword(data);
      }
    } catch (err) {
      console.log(err);
    }
  };

/*==============================================
          USER INVITE
================================================*/

export const inviteTeamMember = (formData) => async (dispatch) => {
  const headers = {
    "Content-Type": "application/json",
    workspaceId: workspaceId,
  };
  const recipients = [formData];
  try {
    let { data } = await axios.post(
      `${url}/api/users/invite`,
      { recipients },
      {
        headers: headers,
      }
    );
    if (data) {
      Alert.success("<h4>Invite Mail Sent</h4>", {
        position: "top-right",
        effect: "slide",
        beep: false,
        html: true,
        timeout: 5000,
        // offset: 100
      });
      const allEmployeeQuery = {
        // pageNo: 10,
        // pageSize: 0,
        query: {},
      };
      dispatch(getAllEmployeesWithAdmin(allEmployeeQuery));
      dispatch(getUsersInviteLinks());
    }
  } catch (err) {
    console.log(err);
  }
};

/*==============================================
              USER UPDATE
================================================*/

export const updateResourceAction =
  (resourceId, formData) => async (dispatch) => {
    const headers = {
      "Content-Type": "application/json",
      workspaceId: workspaceId,
    };
    try {
      let { data, status } = await axios.put(
        `${url}/api/users/${resourceId}`,
        formData,
        {
          headers: headers,
        }
      );
      if (data) {
        Alert.success("<h4>Member Updated</h4>", {
          position: "top-right",
          effect: "slide",
          beep: false,
          html: true,
          timeout: 5000,
          // offset: 100
        });
        const allEmployeeQuery = {
          // pageNo: 10,
          // pageSize: 0,
          query: {},
        };
        dispatch(getAllEmployeesWithAdmin(allEmployeeQuery));
        dispatch(getUsersInviteLinks());
      }
    } catch (err) {
      console.log(err);
    }
  };

/*=========================================================
             USER CHNAGE PASSWORD WITHOUT AUTHCODE
===========================================================*/

export const userUpdatePassword =
  (formData, callBackUpdatePassword) => async (dispatch) => {
    const headers = {
      "Content-Type": "application/json",
      workspaceId: workspaceId,
    };
    try {
      let { data, status } = await axios.post(
        `${url}/api/users/changePassword`,
        formData,
        {
          headers: headers,
        }
      );
      if (data) {
        Alert.success("<h4>Password Updated</h4>", {
          position: "top-right",
          effect: "slide",
          beep: false,
          html: true,
          timeout: 5000,
          // offset: 100
        });
        callBackUpdatePassword(status);
      }
    } catch (err) {
      console.log(err);
    }
  };
