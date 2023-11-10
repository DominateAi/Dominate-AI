import React, { Component, Fragment } from "react";
import Modal from "react-responsive-modal";
import { Link } from "react-router-dom";
import "../common/CustomModalStyle.css";
import { connect } from "react-redux";
import store from "./../../../store/store";
import { SET_WALKTHROUGH_PAGE } from "./../../../store/types";

class OverviewDemoNewSalesCentre1 extends Component {
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

  // onClickNext = () => {
  //   this.setState({
  //     open: false,
  //   });
  //   window.location.href = "/sales-centre#track";
  //   store.dispatch({
  //     type: SET_WALKTHROUGH_PAGE,
  //     payload: "sales-centre-2",
  //   });
  // };

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
              "customModal customModal--walkthrough customModal--walkthrough-sales-centre-1",
            closeButton: "customCloseButton",
          }}
        >
          <span className="closeIconInModal" onClick={this.onCloseModal} />
          <div className="overlay-new-walkthrough">
            <div className="new-walkthrough">
              <div className="row mx-0">
                <div className="col-11 px-0">
                  <h2 className="new-walkthrough__title font-24-semibold mb-25">
                    Welcome to the Sales Centre
                  </h2>
                  <p className="new-walkthrough__desc">
                    You can Engage , Track and Search prospective leads here.
                    click on these tabs to find out what each section has in
                    store for you
                  </p>
                  <p className="new-walkthrough__desc">
                    {/*Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do eiusmod tempor*/}
                    Our Major Activity will lie in The Track part. Lets take a
                    closer look
                  </p>
                </div>
              </div>
              <div className="row mx-0">
                <div className="col-8 px-0">
                  {/* <Link to="/sales-centre#engage"> */}
                  {/* <p className="new-walkthrough__click-here">
                    Lets' get your sales centre setup
                  </p> */}
                  {/* </Link> */}
                  {/* <div className="new-walkthrough__see-through-block ">
                    <button
                      className="new-walkthrough__button-white-border"
                      onClick={this.onClickNext}
                    >
                      Next
                    </button>
                  </div> */}
                  <div className="mt-25">
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
                    src={require("../../../assets/img/overview-demo-new/icons/sales-centre-1.svg")}
                    alt=""
                    className="new-walkthrough--sales-centre-1__img"
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

export default connect(mapStateToProps, {})(OverviewDemoNewSalesCentre1);
