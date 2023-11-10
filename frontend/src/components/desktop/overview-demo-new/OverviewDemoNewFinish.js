import React, { Component, Fragment } from "react";
import { Redirect } from "react-router-dom";
import Modal from "react-responsive-modal";
import "../common/CustomModalStyle.css";

import store from "./../../../store/store";
import { SET_WALKTHROUGH_PAGE } from "./../../../store/types";
import { connect } from "react-redux";
import { updateUserDemoWalkthroughFlag } from "./../../../store/actions/authAction";

class OverviewDemoNewFinish extends Component {
  constructor() {
    super();
    this.state = {
      open: true,
      redirect: false,
    };
  }

  /*===============================
      Model Open Handlers
  =================================*/

  onOpenModal = () => {
    this.setState({
      open: true,
    });
  };

  // onCloseModal = () => {
  //   this.setState({
  //     open: false,
  //   });
  // };

  callBackWalkthroughFlag = (status) => {
    console.log(status);
    if (status === 200) {
      this.setState({
        open: false,
        redirect: true,
      });
      store.dispatch({
        type: SET_WALKTHROUGH_PAGE,
        payload: "",
      });
    }
  };

  onCloseModal = () => {
    var userData = JSON.parse(localStorage.getItem("Data"));
    let newUserData = userData;
    newUserData.demo = false;

    localStorage.setItem("activeWalkthrough", "");
    this.props.updateUserDemoWalkthroughFlag(
      userData.id,
      newUserData,
      this.callBackWalkthroughFlag
    );
  };

  /*=================================
      main
  ===================================*/
  render() {
    const { redirect } = this.state;
    return (
      <Fragment>
        {redirect && <Redirect to="/dashboard" />}
        {/* content */}
        <Modal
          open={this.state.open}
          onClose={this.onCloseModal}
          closeOnEsc={true}
          closeOnOverlayClick={false}
          center
          classNames={{
            overlay: "customOverlay customOverlay--walkthrough",
            modal:
              "customModal customModal--walkthrough customModal--walkthrough-finish",
            closeButton: "customCloseButton",
          }}
        >
          {/* <span className="closeIconInModal" onClick={this.onCloseModal} /> */}
          <div className="overlay-new-walkthrough">
            <div className="new-walkthrough new-walkthrough--finish">
              <div className="new-walkthrough--finish__img-block">
                <img
                  src={require("../../../assets/img/overview-demo-new/icons/finish.svg")}
                  alt=""
                />
              </div>
              <h2 className="new-walkthrough__title font-33-bold">
                That finishes the walkthrough!
              </h2>
              <p className="new-walkthrough__desc new-walkthrough__desc--finish">
                You are ready to start using dominate! If you need any more help
                you can ask us questions anytime!
              </p>
              <div className="new-walkthrough__see-through-block justify-content-center">
                <button
                  className="new-walkthrough__button-white-border new-walkthrough__button-white-border--finish"
                  onClick={this.onCloseModal}
                >
                  Start Using
                </button>
              </div>
            </div>
          </div>
        </Modal>
      </Fragment>
    );
  }
}

export default connect(null, { updateUserDemoWalkthroughFlag })(
  OverviewDemoNewFinish
);
