import React, { Component, Fragment } from "react";
import EmployeesOverview from "./EmployeesOverview";
import EmployeesContent from "./EmployeesContent";
import Navbar from "../header/Navbar";
import { connect } from "react-redux";
import store from "./../../../store/store";
import { SET_PAGETITLE } from "./../../../store/types";
import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

class AdminEmployees extends Component {
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
        <EmployeesOverview />
        <EmployeesContent />
      </Fragment>
    );
  }
}

export default connect(null, {})(AdminEmployees);
