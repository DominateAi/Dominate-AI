import React, { Component, Fragment } from "react";
import Navbar from "../header/Navbar";
import Modal from "react-responsive-modal";
import "../common/CustomModalStyle.css";
import CustomEditDropdown from "../common/CustomEditDropdown";
import isEmpty from "./../../../store/validations/is-empty";
import io from "socket.io-client";
import { connect } from "react-redux";
import {
  getAllChatsAction,
  getAllUsersForChat,
} from "./../../../store/actions/chatAction";
import { getOrganizationDetaisAction } from "./../../../store/actions/authAction";
import { SET_ALL_CHATING_OF_USERS } from "./../../../store/types";

import store from "./../../../store/store";
import { SET_PAGETITLE } from "./../../../store/types";
import Alert from "react-s-alert";
import BreadcrumbMenu from "../header/BreadcrumbMenu";
// const tempCardArray = [1, 2, 3, 4, 5, 6, 7, 8];

// emoji array
const emojiArray = [
  "😀",
  "😀",
  "😀",
  "😀",
  "😀",
  "😀",
  "😀",
  "😀",
  "😀",
  "😀",
  "😀",
  "😀",
  "🗺️",
  "⌛",
  "⏲️",
  "⏱️",
  "🎁",
  "🎉",
  "🎈",
  "💎",
  "💻",
  "📞",
  "📱",
  "📱",
  "🖨️",
  "💻",
  "📞",
  "📱",
  "📱",
];

let dataToken = JSON.parse(localStorage.getItem("Data"));
const socket = io("http://localhost:9010", {
  transports: ["false", "websocket"],
  query: {
    token: !isEmpty(dataToken) && dataToken.token,
  },
});

// new chat modal
const list = ["Aaron McIntosh", "John Bell", "Aaron Bell"];

class Message extends Component {
  constructor() {
    super();
    this.state = {
      messageSearch: "",
      messageText: "",
      fileName: "",
      isMainEmojiClick: "",
      active: 0,
      // new chat modal
      open: false,
      selectedOption: "",
      dropdown: false,
      suggestionList: list,
      messageSent: [],
      messageRecieve: [],
      //chat
      toChatUser: {},
      allChating: [],
      selectedUserInfoForChat: {},
      firstTimeChat: true,
      allChatUsers: [],
    };
  }

  /*
   * lifecycle methods for dropdown
   */

  componentDidMount() {
    let organisationData = JSON.parse(localStorage.getItem("oraganiationData"));
    // if (
    //   organisationData.planStatus === "CANCELLED" ||
    //   organisationData.planStatus === "PAYMENT_FAILED"
    // ) {
    //   this.props.history.push("/profile");
    // }
    store.dispatch({
      type: SET_PAGETITLE,
      payload: "Chats",
    });

    this.props.getAllUsersForChat(this.props.logedInUserId);
    //
    /*=============================
      Socket Connection
==============================*/

    socket.on("connect", (data) => {
      console.log("socket connected successfully");
      console.log(data);
    });

    socket.on("receive_message", (data) => {
      console.log(data);
      // let messageRecieveArray = this.state.allChating;
      // messageRecieveArray.push({
      //   createdAt: new Date().toISOString(),
      //   from: this.state.toChatUser,
      //   message: data.message,
      //   to: this.props.logedInUserId,
      // });
      // this.setState({
      //   allChating: messageRecieveArray,
      // });
    });

    document.addEventListener("click", this.onDropdownClick);
    document.addEventListener("keypress", this.onDropdownKeyPress);
  }

  static getDerivedStateFromProps(nextProps, nextState) {
    // if (nextProps.allchats && nextProps.allchats !== nextState.allchats) {
    //   return {
    //     allchats: nextProps.allchats
    //   };
    // }

    if (
      !isEmpty(nextProps.allChatUsers) &&
      nextProps.allChatUsers !== nextState.allChatUsers
    ) {
      return {
        allChatUsers: nextProps.allChatUsers,
        toChatUser: nextProps.allChatUsers[0]._id,
        selectedUserInfoForChat: nextProps.allChatUsers[0],
      };
    }
    if (
      !isEmpty(nextProps.allChating) &&
      nextProps.allChating !== nextState.allChating
    ) {
      return {
        allChating: nextProps.allChating.reverse(),
      };
    }
    if (
      !isEmpty(nextProps.userInfo) &&
      nextProps.userInfo !== nextState.userInfo
    ) {
      return {
        userInfo: nextProps.userInfo,
      };
    }
    return null;
  }

  componentDidUpdate() {
    if (this.props.allChating !== this.state.allChating) {
      this.setState({
        allChating: this.props.allChating,
      });
    }
  }

  componentWillUnmount() {
    document.removeEventListener("click", this.onDropdownClick);
    document.removeEventListener("keypress", this.onDropdownKeyPress);
  }

  /*
   * Model Event Handlers
   */

  onOpenModal = () => {
    this.setState({
      open: true,
      selectedOption: "",
      dropdown: false,
      suggestionList: list,
    });
  };

  onCloseModal = () => {
    this.setState({
      open: false,
    });
  };

  onDropdownKeyPress = (e) => {
    if (this.state.dropdown) {
      if (e.keyCode === 13) {
        this.dropDownToggler();
      }
    }
  };

  onDropdownClick = (e) => {
    if (this.state.dropdown) {
      if (!document.getElementById("selectedOption").contains(e.target)) {
        this.dropDownToggler();
      }
    }

    if (!document.getElementById("message-emoji-block-id").contains(e.target)) {
      this.setState({
        isMainEmojiClick: false,
      });
    }
  };

  onDropdownChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  dropDownToggler = (e) => {
    this.setState({
      dropdown: !this.state.dropdown,
    });
  };

  dropDownSelect = (value) => (e) => {
    this.setState({
      selectedOption: value,
      dropdown: !this.state.dropdown,
    });
  };

  handleSubmitNewChat = (e) => {
    e.preventDefault();
    console.log(this.state);
    this.onCloseModal();
  };

  /*
   * Model Event Handlers end
   */

  /*
   *  handlers
   */
  handleOnChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  handleOnChangeFile = (e) => {
    this.setState({
      fileName:
        e.target.files.length > 0 ? e.target.files[0].name : e.target.value,
    });

    console.log("file selected: ", e.target.files[0].name);
  };

  handleOnClickMainEmoji = () => {
    this.setState({
      isMainEmojiClick: true,
    });
  };

  handleOnClickSelectEmoji = (emoji) => (e) => {
    e.preventDefault();
    let msg = this.state.messageText;
    this.setState({
      isMainEmojiClick: false,
      messageText: msg + emoji,
    });
  };

  handleOnClickMessageCard = (val, user) => (e) => {
    e.preventDefault();
    this.setState({
      allChating: [],
      active: val,
      toChatUser: user._id,
      selectedUserInfoForChat: user,
    });
    this.props.getAllChatsAction(user._id);
  };

  handleOnSubmitSearch = (e) => {
    e.preventDefault();
    console.log(this.state.messageSearch);
  };

  handleOnSubmitMessage = (e) => {
    e.preventDefault();
    alert("asdd");

    socket.emit("online_users", {});

    socket.on("online_users", (data) => {
      console.log(data);
    });

    socket.emit("send_message", {
      to: "c3f44f10-2a93-11ec-82dc-e7628c88de6a",
      message: "asdasd",
      files: [{ sdsad: "hello" }],
      messageType: "FILES",
    });

    socket.on("receive_message", (data) => {
      console.log(data);
      // let messageRecieveArray = this.state.allChating;
      // messageRecieveArray.push({
      //   createdAt: new Date().toISOString(),
      //   from: this.state.toChatUser,
      //   message: data.message,
      //   to: this.props.logedInUserId,
      // });
      // this.setState({
      //   allChating: messageRecieveArray,
      // });
    });

    const { selectedUserInfoForChat, messageText } = this.state;

    if (isEmpty(selectedUserInfoForChat)) {
      Alert.success("<h4>Please select a user</h4>", {
        position: "top-right",
        effect: "slide",
        beep: false,
        html: true,
        timeout: 5000,
        // offset: 100
      });
    } else if (isEmpty(messageText)) {
      Alert.success("<h4>Please type some message</h4>", {
        position: "top-right",
        effect: "slide",
        beep: false,
        html: true,
        timeout: 5000,
        // offset: 100
      });
    } else {
      /*=============================
          Socket Connection
    ==============================*/
      let dataToken = JSON.parse(localStorage.getItem("Data"));
      const socket = io("http://localhost:9010", {
        transports: ["false", "websocket"],
        query: {
          token: !isEmpty(dataToken) && dataToken.token,
        },
      });

      let messageSentArray = this.state.allChating;

      console.log(this.state.toChatUser);
      socket.emit("send_message", {
        to: "c3f44f10-2a93-11ec-82dc-e7628c88de6a",
        message: "asdasd",
      });
      console.log("sent");
      // messageSentArray.push({
      //   createdAt: new Date().toISOString(),
      //   from: this.props.logedInUserId,
      //   message: this.state.messageText,
      //   to: this.state.toChatUser,
      // });
      console.log(messageSentArray);
      this.setState({
        // allChating: messageSentArray,
        messageText: "",
      });

      store.dispatch({
        type: SET_ALL_CHATING_OF_USERS,
        payload: messageSentArray,
      });

      socket.on("receive_message", (data) => {
        console.log(data);
        // let messageRecieveArray = this.state.allChating;
        // messageRecieveArray.push({
        //   createdAt: new Date().toISOString(),
        //   from: this.state.toChatUser,
        //   message: data.message,
        //   to: this.props.logedInUserId,
        // });
        // this.setState({
        //   allChating: messageRecieveArray,
        // });
      });
    }
  };

  /*
   * renderStartNewChatModal
   */

  renderStartNewChatModal = () => {
    return (
      <>
        {/* modal link */}
        {/* <img
          src={require("../../../assets/img/icons/add.png")}
          alt="new chat"
          className="dashboard-message__colm1__row1__img2"
          onClick={this.onOpenModal}
        /> */}
        {/* modal content */}
        <Modal
          open={this.state.open}
          onClose={this.onCloseModal}
          closeOnEsc={false}
          closeOnOverlayClick={false}
          center
          classNames={{
            overlay: "customOverlay",
            modal: "customModal customModal--addLead",
            closeButton: "customCloseButton",
          }}
        >
          <span className="closeIconInModal" onClick={this.onCloseModal} />

          <div className="message-new-chat-modal-container">
            <h1 className="font-30-bold mb-30">New Chat</h1>

            <form noValidate>
              <h6 className="font-24-semibold mb-30">Select member</h6>

              <div className="follow-up-select mb-30">
                <input readOnly className="invisible d-none" autoFocus />

                <CustomEditDropdown
                  id="selectedOption"
                  name="selectedOption"
                  value={this.state.selectedOption}
                  onInputChangeHandler={this.onDropdownChange}
                  dropDownToggler={this.dropDownToggler}
                  dropDown={this.state.dropdown}
                  suggestionList={this.state.suggestionList}
                  dropDownSelect={this.dropDownSelect}
                  placeholder={"e.g. Aaron Bell"}
                />
              </div>
            </form>

            <div className="text-right">
              <button
                className="btn-funnel-view btn-funnel-view--add-lead-save-btn mt-20"
                onClick={this.handleSubmitNewChat}
              >
                Start
              </button>
            </div>
          </div>
        </Modal>
      </>
    );
  };

  /*
   * renderColm1TitleBlock
   */
  renderColm1TitleBlock = () => {
    const { userInfo } = this.state;

    let dataToken = JSON.parse(localStorage.getItem("Data"));
    return (
      <div className="row m-0 dashboard-message__colm1__row1">
        <img
          src={`${
            !isEmpty(this.props.userInfo) && this.props.userInfo.proSImage
          }&token=${dataToken.token}`}
          alt="person"
          className="dashboard-message__colm1__row1__img"
        />
        <div className="row m-0 justify-content-between align-items-start flex-grow-1">
          <h1 className="font-21-semibold mr-30">
            {!isEmpty(userInfo) && userInfo.name}
          </h1>
          {this.renderStartNewChatModal()}
        </div>
      </div>
    );
  };
  /*
   * renderColm1SearchBlock
   */
  renderColm1SearchBlock = () => {
    return (
      <>
        {/* search block */}
        <div className="message-search-block message-search-block--chat">
          <form onSubmit={this.handleOnSubmitSearch}>
            <input
              type="text"
              id="messageSearch"
              name="messageSearch"
              className="message-search-block__input message-search-block__input--msg"
              placeholder="Search"
              onChange={this.handleOnChange}
              value={this.state.messageSearch}
            />
            <img
              src="/img/desktop-dark-ui/icons/search-icon.svg"
              alt="search"
              className="message-search-block__icon message-search-block__icon--chat"
              onClick={this.handleOnSubmitSearch}
            />
          </form>
        </div>
      </>
    );
  };

  /*
   * renderColm1MessageCard
   */
  renderColm1MessageCard = () => {
    const { allChatUsers, messageSearch } = this.state;

    // Search

    let filtereddata = [];
    if (!isEmpty(messageSearch)) {
      let search = new RegExp(messageSearch, "i");
      filtereddata = allChatUsers.filter((getall) => {
        if (search.test(getall.name)) {
          return getall;
        }
        // if (search.test(getall.company)) {
        //   return getall;
        // }
        // if (search.test(getall.email)) {
        //   return getall;
        // }
      });
      // console.log(filtereddata);
    } else {
      filtereddata = allChatUsers;
    }

    let dataToken = JSON.parse(localStorage.getItem("Data"));
    if (!isEmpty(filtereddata)) {
      return filtereddata.map((user, index) => (
        <div
          key={index}
          className={
            index === this.state.active
              ? "message-colm1-card message-colm1-card__active"
              : "message-colm1-card"
          }
          onClick={this.handleOnClickMessageCard(index, user)}
        >
          <div className="message-colm1-card__text-img">
            <div>
              <img
                src={`${user.proSImage}&token=${dataToken.token}`}
                alt="person"
                className="message-colm1-card__img"
              />
            </div>
            <div className="mr-30">
              <h2>{user.name}</h2>
              <p>
                <i className="fa fa-caret-right"></i>
                Lorem ipsum dolor sit amet.
              </p>
            </div>
          </div>
          <div className="message-colm1-card__notification">
            <span>10</span>
          </div>
        </div>
      ));
    } else {
      return (
        <div className="no_users_found_for_chat">
          <h3 className="font-24-semibold">No Users Found</h3>
        </div>
      );
    }
  };

  /*
   * renderColm2MessageBlock
   */

  /*========================================================

              All Chat Display Fuctinality
   ==========================================================*/

  messageRecieve = (chat) => {
    return (
      <Fragment>
        {/* message received */}
        <div className="text-left">
          <div className="message-colm2-block__msg-received">
            <i className="fa fa-caret-left"></i>
            <p className="font-18-regular">{chat.message}</p>
          </div>
          <p className="message-colm2-block__msg-received-time">11:00 am</p>
        </div>
      </Fragment>
    );
  };

  messageSent = (chat) => {
    return (
      <Fragment>
        {/* message sent */}
        <div className="message-colm2-block__sent">
          <div>
            <div className="message-colm2-block__msg-sent">
              <i className="fa fa-caret-right"></i>
              <p className="font-18-regular">{chat.message}</p>
            </div>
            <p className="message-colm2-block__msg-received-time text-right">
              11:01 am
            </p>
          </div>
        </div>
      </Fragment>
    );
  };

  renderColm2MessageBlock = () => {
    const { allChating } = this.props;
    const { selectedUserInfoForChat, allChatUsers } = this.state;
    // console.log(selectedUserInfoForChat);
    let messageReciev = this.state.toChatUser;
    let messageSent = this.props.logedInUserId;
    // console.log(messageSent);
    let dataToken = JSON.parse(localStorage.getItem("Data"));
    const constMessagesSentReceive = () => {
      // console.log(allChating);
      return (
        <>
          {!isEmpty(allChating) &&
            allChating.map((chat, index) => {
              return (
                <Fragment key={index}>
                  {chat.from === messageReciev
                    ? this.messageRecieve(chat)
                    : this.messageSent(chat)}
                </Fragment>
              );
            })}
        </>
      );
    };
    return (
      <div>
        {/* title */}
        <div className="message-colm2-block__title">
          {!isEmpty(allChatUsers) ? (
            <img
              src={`${selectedUserInfoForChat.proSImage}&token=${dataToken.token}`}
              alt="person"
              className="dashboard-message__colm1__row1__img"
            />
          ) : (
            <h3 className="font-24-semibold">No User Found</h3>
          )}

          <h2 className="font-24-semibold">
            {!isEmpty(selectedUserInfoForChat) && selectedUserInfoForChat.name}
          </h2>
        </div>
        {/* messages */}
        <div className="message-colm2-block__container">
          {constMessagesSentReceive()}
          {/* {constMessagesSentReceive()}
          {constMessagesSentReceive()} */}
          {/* {constMessagesSentReceive()}
          {constMessagesSentReceive()} */}
        </div>

        <form onSubmit={this.handleOnSubmitMessage}>
          <div className="message-colm2-block__input-block">
            <input
              type="text"
              id="messageText"
              name="messageText"
              className="message-colm2-block__input"
              placeholder="Say Something.."
              onChange={this.handleOnChange}
              value={this.state.messageText}
              autoComplete="off"
            />
            <div className="message-colm2-block__element">
              <div className="message-colm2-block__element-S-block">
                <input
                  type="S"
                  title=""
                  className="message-colm2-block__element-S"
                  onChange={this.handleOnChangeFile}
                  id="message-file"
                  hidden
                />
                {/*<span
                  className="font-24-semibold"
                  role="img"
                  aria-labelledby="emoji"
                >
                  📎
                </span>*/}
                <label className="font-24-semibold" htmlFor="message-file">
                  📎
                </label>
              </div>

              <div
                className="message-main-emoji-block"
                id="message-emoji-block-id"
              >
                {this.state.isMainEmojiClick && (
                  <div className="message-main-emoji-block__block1">
                    <ul className="message-emoji-block">
                      {emojiArray.map((emoji, index) => (
                        <li
                          key={index}
                          className="font-24-semibold"
                          role="img"
                          aria-labelledby="emoji"
                          onClick={this.handleOnClickSelectEmoji(emoji)}
                        >
                          {emoji}
                        </li>
                      ))}
                    </ul>
                    <i className="fa fa-caret-down"></i>
                  </div>
                )}
                <span
                  className="font-24-semibold cursor-pointer"
                  role="img"
                  aria-labelledby="emoji"
                  onClick={this.handleOnClickMainEmoji}
                >
                  🙂
                </span>
              </div>
              <span className="message-colm2-block__border-gray-right"></span>
              <button className="btn-funnel-view btn-funnel-view--msg-colm2">
                Send
              </button>
            </div>
          </div>
        </form>
      </div>
    );
  };

  render() {
    // console.log(this.state.messageRecieve);
    // console.log(this.state.toChatUser);
    // console.log(this.state.allChating);
    // console.log(this.state.selectedUserInfoForChat);
    return (
      <>
        <Navbar />

        <div className="dashboard-message">
          <div className="dashboard-message__colm1">
            <BreadcrumbMenu
              menuObj={[
                {
                  title: "Chat",
                },
              ]}
            />

            <h2 className="page-title-new page-title-new--chat">Chat</h2>

            {/* {this.renderColm1TitleBlock()} */}
            {this.renderColm1SearchBlock()}
            <div className="dashboard-message__colm1__overflow-cards">
              {this.renderColm1MessageCard()}
            </div>
          </div>
          <div className="dashboard-message__colm2">
            {this.renderColm2MessageBlock()}
          </div>
        </div>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  allchats: state.chats.messageSentReacieve,
  userToken: state.auth.user.token,
  logedInUserId: state.auth.user.id,
  allChatUsers: state.chats.allChatUsers,
  allChating: state.chats.allChating,
  defaultChatId: state.chats.defaultChatId,
  userInfo: state.auth.user,
});

export default connect(mapStateToProps, {
  getAllChatsAction,
  getAllUsersForChat,
  getOrganizationDetaisAction,
})(Message);
