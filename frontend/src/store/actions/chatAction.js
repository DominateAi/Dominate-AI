import axios from "axios";
import { url } from "./config";
import {
  SET_ALL_CHAT_USERS,
  SET_ALL_CHATING_OF_USERS,
  SET_DEFAULT_CHAT_USER_ID,
} from "./../types";

/*=====================================
     Get all Chats Action 
======================================*/
export const getAllChatsAction =
  (toChatUser, pageNo, pageSizze) => (dispatch) => {
    axios
      .get(`${url}/api/chats/${toChatUser}?pageSize=10&pageNo=1`)
      .then((res) => {
        dispatch({
          type: SET_ALL_CHATING_OF_USERS,
          payload: res.data,
        });
      })
      .catch((err) => console.log(err));
  };

export const getAllUsersForChat = (userId) => (dispatch) => {
  axios
    .get(`${url}/api/users`)
    .then((res) => {
      if (res.data) {
        // let users = res.data.filter(
        //   user => user._id !== userId && user.status === "ACTIVE"
        // );

        let users = res.data.filter((user) => user._id !== userId);

        dispatch({
          type: SET_ALL_CHAT_USERS,
          payload: users,
        });
        dispatch(getAllChatsAction(users[0]._id));
      }
    })
    .catch((err) => console.log(err));
};
