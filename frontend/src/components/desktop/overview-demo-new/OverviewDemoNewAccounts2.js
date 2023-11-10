import React, { Component, Fragment } from "react";
import Modal from "react-responsive-modal";
import "../common/CustomModalStyle.css";

// import store from "./../../../store/store";
// import { SET_WALKTHROUGH_PAGE } from "./../../../store/types";

class OverviewDemoNewAccounts2 extends Component {
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
    // store.dispatch({
    //   type: SET_WALKTHROUGH_PAGE,
    //   payload: "",
    // });
  };

  onClickNext = () => {
    this.setState({
      open: false,
    });
    window.location.href = "/sales-centre#track";
    localStorage.setItem("activeWalkthrough", "sales-centre-3");
    // store.dispatch({
    //   type: SET_WALKTHROUGH_PAGE,
    //   payload: "sales-centre-3",
    // });
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
              "customModal customModal--walkthrough customModal--walkthrough-accounts-2",
            closeButton: "customCloseButton",
          }}
        >
          <span className="closeIconInModal" onClick={this.onCloseModal} />
          <div className="overlay-new-walkthrough">
            <div className="new-walkthrough">
              <div className="row mx-0">
                <div className="col-11 px-0">
                  <h2 className="new-walkthrough__title font-24-semibold mb-25">
                    A New Account is created!
                  </h2>
                  <p className="new-walkthrough__desc mt-20">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                    ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    Duis aute irure dolor in
                  </p>
                </div>
              </div>
              <div className="row mx-0 mt-20">
                <div className="col-8 px-0">
                  <div className="new-walkthrough__see-through-block ">
                    <button
                      className="new-walkthrough__button-white-border"
                      onClick={this.onClickNext}
                    >
                      Next
                    </button>
                  </div>
                </div>
                <div className="col-4 px-0 text-right align-self-end">
                  <img
                    src={require("../../../assets/img/overview-demo-new/icons/accounts-2.svg")}
                    alt=""
                    className="new-walkthrough--accounts-2__img"
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

export default OverviewDemoNewAccounts2;
