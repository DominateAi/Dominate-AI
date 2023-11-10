import { SET_ALL_FOLDERS, SET_FILES_OF_FOLDER } from "./../types";

const initialState = {
  allFolders: [],
  allFilesOfFolder: [],
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_ALL_FOLDERS:
      return {
        ...state,
        allFolders: action.payload,
      };
    case SET_FILES_OF_FOLDER:
      return {
        ...state,
        allFilesOfFolder: action.payload,
      };
    default:
      return state;
  }
}
