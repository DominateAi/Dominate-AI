import React, { Component, Fragment } from "react";
import Modal from "react-responsive-modal";
import "../common/CustomModalStyle.css";

import store from "./../../../store/store";
import { SET_WALKTHROUGH_PAGE } from "./../../../store/types";

class OverviewDemoNewDashboard2 extends Component {
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

  onCloseModal = () => {
    this.setState({
      open: false,
    });
    localStorage.setItem("activeWalkthrough", "");
    store.dispatch({
      type: SET_WALKTHROUGH_PAGE,
      payload: "",
    });
  };

  onClickNext = () => {
    this.setState({
      open: false,
    });
    store.dispatch({
      type: SET_WALKTHROUGH_PAGE,
      payload: "dashboard-3",
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
              "customModal customModal--walkthrough customModal--walkthrough-dashboard-2",
            closeButton: "customCloseButton",
          }}
        >
          <span className="closeIconInModal" onClick={this.onCloseModal} />
          <div className="overlay-new-walkthrough">
            <div className="new-walkthrough">
              {/* row  1 */}
              <div className="row mx-0">
                <div className="col-9 px-0">
                  <h2 className="new-walkthrough__title font-24-semibold mb-25">
                    This is the Dashboard
                  </h2>
                  <p className="new-walkthrough__desc">
                    {/*Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua. Ut enim ad minim veniam, quis nostrud*/}
                    The dashboard is filled with widgets to help you get an
                    overview of your workspace, your team and most importantly
                    your revenue and your leads. It will help you stay on top of
                    your sales tracking
                  </p>
                  {/*<p className="new-walkthrough__desc">
                    We have currently added dummy data to help you understand
                    the function of each widget
                  </p>*/}
                </div>
                <div className="col-3 px-0 text-right align-self-end">
                  <img
                    src={require("../../../assets/img/overview-demo-new/icons/dashboard-2.svg")}
                    alt=""
                    className="new-walkthrough--dashboard-2__img"
                  />
                </div>
              </div>
              {/* row 2 */}
              <div className="new-walkthrough__see-through-block">
                <button
                  className="new-walkthrough__button-white-border"
                  onClick={this.onClickNext}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </Modal>
      </Fragment>
    );
  }
}

export default OverviewDemoNewDashboard2;
