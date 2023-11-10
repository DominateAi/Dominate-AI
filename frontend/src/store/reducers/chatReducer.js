import { SET_ALL_CHAT_USERS, SET_ALL_CHATING_OF_USERS } from "./../types";
import isEmpty from "./../validations/is-empty";

const initialState = {
  messageSentReacieve: [
    {
      mesageSent: "sent hello",
      messageRecieve: "recieve hello"
    }
  ],
  allChatUsers: {},
  allChating: {}
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_ALL_CHAT_USERS:
      return {
        ...state,
        allChatUsers: action.payload
      };
    case SET_ALL_CHATING_OF_USERS:
      return {
        ...state,
        allChating: action.payload
      };

    default:
      return state;
  }
}
