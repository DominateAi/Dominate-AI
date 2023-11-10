import axios from "axios";
// import { url } from "./actions/config";
// import Modal from "react-responsive-modal";
// import React from "react";
import store from "./store";
import { SET_ERROR_CODE } from "./types";

// Add a request interceptor
axios.interceptors.request.use(
  (config) => {
    // console.log("asdad one", config);
    // config.headers['Content-Type'] = 'application/json';
    return config;
  },
  (error) => {
    // console.log("asdad two", error.config);
    Promise.reject(error);
  }
);

//Add a response interceptor

axios.interceptors.response.use(
  (response) => {
    // var data = JSON.parse(localStorage.getItem("Data"));
    // console.log(data);
    return response;
  },
  function (error) {
    // const originalRequest = error.config;
    // console.log(error.response.status);
    if (error.response.status === 405) {
      store.dispatch({
        type: SET_ERROR_CODE,
        payload: error.response.status,
      });
    }

    return Promise.reject(error);
  }
);

// import axios from "axios";
// import { url } from "./actions/config";

// // LocalstorageService
// // const localStorageService = LocalStorageService.getService();

// // Add a request interceptor
// axios.interceptors.request.use(
//   (config) => {
//     console.log(config);
//     // config.headers['Content-Type'] = 'application/json';
//     return config;
//   },
//   (error) => {
//     Promise.reject(error);
//   }
// );

// //Add a response interceptor

// axios.interceptors.response.use(
//   (response) => {
//     var data = JSON.parse(localStorage.getItem("Data"));
//     console.log(data);
//     return response;
//   },
//   function (error) {
//     const originalRequest = error.config;

//     if (
//       error.response.status === 401 &&
//       originalRequest.url === `${url}/public/token/refresh`
//     ) {
//       console.log("sd");
//       return Promise.reject(error);
//     }

//     if (error.response.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;
//       //   const refreshToken = localStorageService.getRefreshToken();
//       let userData = JSON.parse(localStorage.getItem("Data"));
//       const formData = { refresh_token: userData.refresh_token };
//       return axios.post(`${url}/public/token/refresh`, formData).then((res) => {
//         console.log(res);
//         if (res.status === 201) {
//           console.log(res.status);
//           //    localStorageService.setToken(res.data);
//           //    axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorageService.getAccessToken();
//           return axios(originalRequest);
//         }
//       });
//     }
//     return Promise.reject(error);
//   }
// );
