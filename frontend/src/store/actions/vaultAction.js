import axios from "axios";
import { url } from "./config";
import {
  SET_ALL_FOLDERS,
  SET_FILES_OF_FOLDER,
  SET_LOADER,
  CLEAR_LOADER,
} from "./../types";
import Alert from "react-s-alert";

/*====================================================================
                        Create Folder Action
======================================================================*/

export const createFolder =
  (formData, callBackAddFolder) => async (dispatch) => {
    dispatch({
      type: SET_LOADER,
    });
    try {
      let { data, status } = await axios.post(`${url}/api/folders`, formData);
      if (data) {
        Alert.success(`<h4>Folder created</h4>`, {
          position: "top-right",
          effect: "slide",
          beep: false,
          html: true,
          timeout: 5000,
          // offset: 100
        });
        callBackAddFolder(status);
        dispatch(getAllFolder());
        dispatch({
          type: CLEAR_LOADER,
        });
      }
    } catch (err) {
      callBackAddFolder(err.response.status);
      dispatch({
        type: CLEAR_LOADER,
      });
    }
  };

/*====================================================================
                    Get All Folders
======================================================================*/

export const getAllFolder = () => async (dispatch) => {
  try {
    let { data } = await axios.get(`${url}/api/folders`);
    if (data) {
      dispatch({
        type: SET_ALL_FOLDERS,
        payload: data,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

/*====================================================================
                  DElete folder by Id
======================================================================*/

export const deleteFolderById =
  (folderId, detailPageId, history) => async (dispatch) => {
    dispatch({
      type: SET_LOADER,
    });
    try {
      let { data } = await axios.delete(`${url}/api/folders/${folderId}`);
      if (data) {
        Alert.success(`<h4>Folder deleted</h4>`, {
          position: "top-right",
          effect: "slide",
          beep: false,
          html: true,
          timeout: 5000,
          // offset: 100
        });
        dispatch(getAllFolder());
        dispatch({
          type: CLEAR_LOADER,
        });
        if (folderId === detailPageId) {
          history.push("/vault");
        }
      }
    } catch (err) {
      console.log(err);
      dispatch({
        type: CLEAR_LOADER,
      });
    }
  };

/*====================================================================
                        Create File  Inside folder
======================================================================*/

/*======================================
    Vault file Upload inside folder
=======================================*/
export const uploadFileInsideFolder =
  (formData, folderId, folderName) => (dispatch) => {
    dispatch({
      type: SET_LOADER,
    });
    const headers = {
      "Content-Type": "multipart/form-data",
    };
    axios
      .post(`${url}/api/upload`, formData, { headers: headers })
      .then((res) => {
        const formData = {
          name: "tfrevd",
          file: res.data,
          folderId: folderId,
        };
        dispatch(createFileInsideFolder(formData, folderName));
      })
      .catch((err) => console.log(err));
  };

export const createFileInsideFolder =
  (formData, folderName) => async (dispatch) => {
    try {
      let { data } = await axios.post(`${url}/api/files`, formData);
      if (data) {
        Alert.success(`<h4>File created</h4>`, {
          position: "top-right",
          effect: "slide",
          beep: false,
          html: true,
          timeout: 5000,
          // offset: 100
        });
        const getFileFormData = { folderId: formData.folderId };
        dispatch(getFilesByFolderId(getFileFormData));
        dispatch({
          type: CLEAR_LOADER,
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

/*====================================================================
                    Get Files Of Folder
======================================================================*/

export const getFilesByFolderId = (formData) => async (dispatch) => {
  try {
    let { data } = await axios.post(`${url}/api/files/search`, formData);
    if (data) {
      dispatch({
        type: SET_FILES_OF_FOLDER,
        payload: data,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

export const deleteFileById = (fileId, folderId) => async (dispatch) => {
  try {
    let { data } = await axios.delete(`${url}/api/files/${fileId}`);
    if (data) {
      Alert.success(`<h4>File deleted</h4>`, {
        position: "top-right",
        effect: "slide",
        beep: false,
        html: true,
        timeout: 5000,
        // offset: 100
      });
      const getFileFormData = { folderId: folderId };
      dispatch(getFilesByFolderId(getFileFormData));
    }
  } catch (err) {
    console.log(err);
  }
};
