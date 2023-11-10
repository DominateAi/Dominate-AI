import React, { useReducer, useEffect } from "react";
import EmailContext from "./emailContext";
import EmailReducer from "./emailReducer";
import {
  SET_MESSAGE,
  SET_MESSAGES,
  CLEAR_MESSAGES,
  SET_LOADING,
  SET_CURRENT_LABEL,
  SET_NEXT_PAGE_TOKEN,
  SET_HAS_MORE_MESSAGES,
  SET_MESSAGE_SECTION,
  HIDE_MESSAGE_SECTION,
  SET_CONTACTS,
  SET_EVENTS,
} from "../types";
import axios from "axios";
import cookie from "react-cookies";

const googleToken = cookie.loadAll();

const EmailState = (props) => {
  const initialState = {
    messages: [],
    contacts: [],
    events: [],
    message: null,
    currentLabel: "INBOX",
    nextPageToken: "",
    hasMoreMessages: true,
    isAuthorize: false,
    loading: false,
    showMessage: false,
  };

  const [state, dispatch] = useReducer(EmailReducer, initialState);

  // load contacts api
  function loadPeopleApi() {
    window.gapi.client.load(
      "https://people.googleapis.com/$discovery/rest",
      "v1",
      getAllContactsData
    );
  }

  // Send reques to get IDs of 20 Messages and call getMessagesData(Ids)
  const getMessages = (labelIds = state.currentLabel) => {
    // Set Loading to true
    setLoading();

    // Empty previous messages
    clearMessages();

    loadPeopleApi();

    getAllEvents();

    const request = window.gapi.client.gmail.users.messages.list({
      access_token: `${googleToken.googleApiToken}`,
      userId: "me",
      labelIds: labelIds,
      maxResults: 20,
    });

    request.execute((resp) => {
      // Set NextPageToken
      if (resp.result.nextPageToken) {
        setNextPageToken(resp.result.nextPageToken);
        setHasMoreMessages(true);
      } else {
        setNextPageToken("");
        setHasMoreMessages(false);
      }
      // Send Id list to getMessagesData to get Message Data foreach Id
      getMessagesData(resp);
    });
  };

  // get All Contacts

  const getAllContactsData = () => {
    var contactRequest = window.gapi.client.people.people.connections.list({
      access_token: `${googleToken.googleApiToken}`,
      resourceName: "people/me",
      pageSize: 100,
      "requestMask.includeField":
        "person.phone_numbers,person.organizations,person.email_addresses,person.names,person.photos",
    });

    contactRequest.execute((resp) => {
      console.log(resp);
      dispatch({
        type: SET_CONTACTS,
        payload: resp.connections,
      });
    });
  };

  // Get All Events
  const getAllEvents = () => {
    console.log(cookie.loadAll());

    let gapiToken = JSON.parse(localStorage.getItem("gapi"));
    let gapiEmail = JSON.parse(localStorage.getItem("gapiProfile"));

    let config = {
      headers: {
        Authorization:
          "Bearer " +
          `${
            process.env.NODE_ENV !== "development"
              ? googleToken.googleApiToken
              : gapiToken
          }`,
      },
    };
    axios
      .get(
        `https://www.googleapis.com/calendar/v3/calendars/${gapiEmail}/events`,
        config
      )
      .then((res) => {
        console.log(res);
        dispatch({
          type: SET_EVENTS,
          payload: res.data.items,
        });
      })
      .catch((err) => console.log(err));
  };

  const getMessagesQuery = (query) => {
    // Set Loading to true
    setLoading();

    // Empty previous messages
    clearMessages();

    // Get List of 20 message's Id
    const request = window.gapi.client.gmail.users.messages.list({
      access_token: `${googleToken.googleApiToken}`,
      userId: "me",
      q: query,
    });

    // Send Id list to getMessagesData to get Message Data foreach Id
    request.execute(getMessagesData);
  };

  // Send Request to get data of each message
  const getMessagesData = (resp) => {
    const messages = resp.result.messages ? resp.result.messages : [];

    // Get Data for each message
    messages.forEach((message) => {
      const request = window.gapi.client.gmail.users.messages.get({
        access_token: `${googleToken.googleApiToken}`,
        userId: "me",
        id: message.id,
      });

      request.execute((resp) => {
        dispatch({
          type: SET_MESSAGES,
          payload: resp.result,
        });
      });
    });
  };

  // Get Message
  const getOneMessage = (messageId) => {
    const request = window.gapi.client.gmail.users.messages.get({
      access_token: `${googleToken.googleApiToken}`,
      userId: "me",
      id: messageId,
    });

    request.execute((resp) => {
      console.log(resp);
      setMessage();
      dispatch({
        type: SET_MESSAGE,
        payload: resp.result,
      });
    });
  };

  // Load More Messages
  const loadMoreMessages = (labelIds = state.currentLabel) => {
    const request = window.gapi.client.gmail.users.messages.list({
      access_token: `${googleToken.googleApiToken}`,
      userId: "me",
      labelIds: labelIds,
      maxResults: 20,
      pageToken: state.nextPageToken,
    });

    request.execute((resp) => {
      if (resp.result.nextPageToken) {
        setNextPageToken(resp.result.nextPageToken);
        setHasMoreMessages(true);
      } else {
        setNextPageToken("");
        setHasMoreMessages(false);
      }

      getMessagesData(resp);
    });
  };

  // hide message section when onClick prev button

  const hideMessageSection = () => {
    dispatch({ type: HIDE_MESSAGE_SECTION });
  };

  // Set Next Page Token
  const setNextPageToken = (token) =>
    dispatch({ type: SET_NEXT_PAGE_TOKEN, payload: token });

  // Set Has More Messages
  const setHasMoreMessages = (bool) =>
    dispatch({ type: SET_HAS_MORE_MESSAGES, payload: bool });

  // Set Current Label
  const setCurrentLabel = (labelId) =>
    dispatch({ type: SET_CURRENT_LABEL, payload: labelId });

  // Clear Messages
  const clearMessages = () => dispatch({ type: CLEAR_MESSAGES });

  // Set Loading
  const setLoading = () => dispatch({ type: SET_LOADING });

  // Set Message when click on it

  const setMessage = () => dispatch({ type: SET_MESSAGE_SECTION });

  return (
    <EmailContext.Provider
      value={{
        messages: state.messages,
        message: state.message,
        contacts: state.contacts,
        events: state.events,
        currentLabel: state.currentLabel,
        nextPageToken: state.nextPageToken,
        hasMoreMessages: state.hasMoreMessages,
        loading: state.loading,
        showMessage: state.showMessage,
        getMessages,
        getMessagesQuery,
        getOneMessage,
        setCurrentLabel,
        loadMoreMessages,
        setLoading,
        hideMessageSection,
        getAllContactsData,
        getAllEvents,
      }}
    >
      {props.children}
    </EmailContext.Provider>
  );
};

export default EmailState;
