import React, { Component, Fragment } from "react";
import { Link, Redirect } from "react-router-dom";
import Modal from "react-responsive-modal";
import "../common/CustomModalStyle.css";

import store from "./../../../store/store";
import { SET_WALKTHROUGH_PAGE } from "./../../../store/types";

class OverviewDemoNewDashboard3 extends Component {
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
      redirect: true,
    });
    store.dispatch({
      type: SET_WALKTHROUGH_PAGE,
      payload: "sales-centre-1",
    });
  };

  /*=================================
      main
  ===================================*/
  render() {
    const { redirect } = this.state;
    return (
      <Fragment>
        {redirect && <Redirect to="/sales-centre#engage" />}
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
              "customModal customModal--walkthrough customModal--walkthrough-dashboard-3",
            closeButton: "customCloseButton",
          }}
        >
          <span className="closeIconInModal" onClick={this.onCloseModal} />
          <div className="overlay-new-walkthrough">
            <div className="new-walkthrough">
              <div className="row mx-0">
                <div className="col-10 px-0">
                  <h2 className="new-walkthrough__title font-24-semibold mb-25">
                    Lets start with our Sales centre
                  </h2>
                  <p className="new-walkthrough__desc">The heart of Dominate</p>
                  <p className="new-walkthrough__desc">
                    Sales Centre has various features that can assist you in
                    finding leads up to adding them and closing deals with them
                  </p>
                </div>
              </div>
              <div className="row mx-0">
                <div className="col-9 px-0">
                  <p className="new-walkthrough__desc">
                    This is where you can get everything done with ease!
                  </p>
                  {/* <Link to="/sales-centre#engage">
                    <p className="new-walkthrough__click-here">
                      Click here to go to Sales Centre!
                    </p>
                  </Link> */}
                  <div className="new-walkthrough__see-through-block ">
                    <button
                      className="new-walkthrough__button-white-border"
                      onClick={this.onClickNext}
                    >
                      Next
                    </button>
                  </div>
                </div>
                <div className="col-3 px-0 text-right align-self-end">
                  <img
                    src={require("../../../assets/img/overview-demo-new/icons/dashboard-3.svg")}
                    alt=""
                    className="new-walkthrough--dashboard-3__img"
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

export default OverviewDemoNewDashboard3;
