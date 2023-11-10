import React, { Component, Fragment } from "react";
import MembersNewContent from "./MembersNewContent";
import Navbar from "../header/Navbar";
import { connect } from "react-redux";

import store from "./../../../store/store";
import { SET_PAGETITLE } from "./../../../store/types";
import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import BreadcrumbMenu from "../header/BreadcrumbMenu";

class MembersNew extends Component {
  constructor() {
    super();
    this.state = {
      loading: true,
    };
  }

  demoAsyncCall = () => {
    return new Promise((resolve) => setTimeout(() => resolve(), 1000));
  };

  /*========================================
             Lifecycle methods
  =========================================*/
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
      payload: "Members",
    });

    this.demoAsyncCall().then(() => this.setState({ loading: false }));
  }
  render() {
    // if (this.state.loading) {
    //   // if your component doesn't have to wait for an async action, remove this block
    //   return (
    //     <Loader type="Triangle" color="#ffffff" className="dominate-loader" />
    //   ); // render null when app is not ready
    // }
    return (
      <Fragment>
        <Navbar />
        <BreadcrumbMenu
          menuObj={[
            {
              title: "Members",
            },
          ]}
        />
        <div className="leads-container members-new-container px-0">
          <MembersNewContent />
        </div>
      </Fragment>
    );
  }
}

export default connect(null, {})(MembersNew);
