import React, { Component, Fragment } from "react";
import Modal from "react-responsive-modal";
import "../common/CustomModalStyle.css";

import store from "./../../../store/store";
import { SET_WALKTHROUGH_PAGE } from "./../../../store/types";
import { connect } from "react-redux";
import { updateUserDemoWalkthroughFlag } from "./../../../store/actions/authAction";

class OverviewDemoNewDashboard1 extends Component {
  constructor() {
    super();
    this.state = {
      open: true,
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

  callBackWalkthroughFlag = (status) => {
    console.log(status);
    if (status === 200) {
      this.setState({
        open: false,
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

  onClickNext = () => {
    this.setState({
      open: false,
    });
    store.dispatch({
      type: SET_WALKTHROUGH_PAGE,
      payload: "dashboard-2",
    });
  };

  /*=================================
      main
  ===================================*/
  render() {
    return (
      <Fragment>
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
              "customModal customModal--walkthrough customModal--walkthrough-dashboard-1",
            closeButton: "customCloseButton",
          }}
        >
          {/* <span className="closeIconInModal" onClick={this.onCloseModal} /> */}
          <div className="overlay-new-walkthrough">
            <div className="new-walkthrough new-walkthrough--dashboard-1">
              <p
                className="skip-walkthrough-text text-right"
                onClick={this.onCloseModal}
              >
                Skip Walkthrough <i className="fa fa-caret-right"></i>
              </p>

              <div className="row mx-0">
                <div className="col-6 px-0">
                  <h2 className="new-walkthrough__title font-28-bold mb-25">
                    Welcome to Dominate's Walkthrough
                  </h2>
                  <p className="new-walkthrough__desc">
                    {/*Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do eiusmod tempor*/}
                    Let's take a tour around your new workspace and check out
                    the various features.
                  </p>
                  <div className="new-walkthrough__see-through-block ">
                    <button
                      className="font-24-semibold new-walkthrough__button-white"
                      onClick={this.onClickNext}
                    >
                      Let's start
                    </button>
                  </div>
                </div>
                <div className="col-6 px-0 text-right">
                  <img
                    src={require("../../../assets/img/overview-demo-new/icons/dashboard-1.svg")}
                    alt=""
                    className="new-walkthrough--dashboard-1__img"
                  />
                </div>
              </div>
            </div>
          </div>
        </Modal>
      </Fragment>
    );
  }
}

export default connect(null, { updateUserDemoWalkthroughFlag })(
  OverviewDemoNewDashboard1
);
