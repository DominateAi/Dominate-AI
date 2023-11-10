import React, { Component, Fragment } from "react";
import {
  Link,
  // Redirect
} from "react-router-dom";
import Modal from "react-responsive-modal";
import "../common/CustomModalStyle.css";

import { connect } from "react-redux";

import store from "./../../../store/store";
import { SET_WALKTHROUGH_PAGE } from "./../../../store/types";

class OverviewDemoNewDealPipelines3 extends Component {
  constructor() {
    super();
    this.state = {
      open: true,
      // redirectToCmd: false,
      // redirectToReports: false,
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

  // onClickNext = () => {
  //   this.setState({
  //     open: false,
  //   });
  //   if (this.props.userRole === "Administrator") {
  //     this.setState({
  //       redirectToCmd: true,
  //     });
  //     store.dispatch({
  //       type: SET_WALKTHROUGH_PAGE,
  //       payload: "command-centre-1",
  //     });
  //   } else {
  //     this.setState({
  //       redirectToReports: true,
  //     });
  //     store.dispatch({
  //       type: SET_WALKTHROUGH_PAGE,
  //       payload: "",
  //     });
  //   }
  // };

  /*=================================
      main
  ===================================*/
  render() {
    // const { redirectToCmd, redirectToReports } = this.state;
    return (
      <Fragment>
        {/* {redirectToCmd && <Redirect to="/command-centre" />}
        {redirectToReports && <Redirect to="/admin-reports" />} */}
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
              "customModal customModal--walkthrough customModal--walkthrough-deal-pipelines-3",
            closeButton: "customCloseButton",
          }}
        >
          <span className="closeIconInModal" onClick={this.onCloseModal} />
          <div className="overlay-new-walkthrough">
            <div className="new-walkthrough">
              <div className="row mx-0">
                <div className="col-11 px-0">
                  <h2 className="new-walkthrough__title font-24-semibold mb-25">
                    Lorem ipsum dolor sit amet consectetur
                  </h2>
                  <p className="new-walkthrough__desc">
                    Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                    Quis recusandae accusamus nihil eius quo ad, culpa officiis
                    dolores dolor veniam expedita, ratione maiores totam iure
                    dicta amet. Accusantium, porro dicta?
                  </p>
                </div>
              </div>
              <div className="row mx-0">
                <div className="col-8 px-0">
                  <div className="new-walkthrough__see-through-block">
                    {/* <button
                      className="new-walkthrough__button-white-border"
                      onClick={this.onClickNext}
                    >
                      Next
                    </button> */}

                    {this.props.userRole === "Administrator" ? (
                      <Link
                        to="/command-centre"
                        onClick={() =>
                          store.dispatch({
                            type: SET_WALKTHROUGH_PAGE,
                            payload: "command-centre-1",
                          })
                        }
                      >
                        <span className="new-walkthrough__button-white-border">
                          Next
                        </span>
                      </Link>
                    ) : (
                      <Link
                        to="/admin-reports"
                        onClick={() =>
                          store.dispatch({
                            type: SET_WALKTHROUGH_PAGE,
                            payload: "reports-1",
                          })
                        }
                      >
                        <span className="new-walkthrough__button-white-border">
                          Next
                        </span>
                      </Link>
                    )}
                  </div>
                </div>
                <div className="col-4 px-0 text-right align-self-end">
                  <img
                    src={require("../../../assets/img/overview-demo-new/icons/deal-pipelines-2.svg")}
                    alt=""
                    className="new-walkthrough--deal-pipelines-2__img"
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

const mapStateToProps = (state) => ({
  userRole: state.auth.user.role.name,
});

export default connect(mapStateToProps, {})(OverviewDemoNewDealPipelines3);
