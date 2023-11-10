import React, { Component, Fragment } from "react";
import Navbar from "./../header/Navbar";
import MobileNavbar from "../../mobile/common/MobileNavbar";
import EmployeesDataActivityContent from "./EmployeesDataActivityContent";
import EmployeesDataActivitySummary from "./EmployeesDataActivitySummary";
import isEmpty from "./../../../store/validations/is-empty";
import { connect } from "react-redux";
import {
  getEmployeeActivity,
  getEmployeeLeadsOwned,
  getEmployeePerformanceGraph,
} from "./../../../../src/store/actions/employeeActivityAction";
import { SET_BLOCK_VIEW_EMPLOYEE } from "./../../../store/types";
import store from "./../../../store/store";

class EmployeesData extends Component {
  constructor() {
    super();
    this.state = {
      employeeData: [],
      allEmaployeeActivity: [],
      employeeLeadsOwn: [],
      // performance tab
      startDate: null,
      endDate: null,
    };
  }

  /*=======================================
              Lifecycle Method
  =========================================*/

  componentDidMount() {
    this.props.getEmployeeActivity(this.props.location.state.detail._id);
    const newQuery = {
      query: { assigned: this.props.location.state.detail._id },
    };
    this.props.getEmployeeLeadsOwned(newQuery);
    this.props.getEmployeePerformanceGraph(
      this.props.location.state.detail._id
    );
    this.setState({
      employeeData: this.props.location.state.detail,
    });
  }

  static getDerivedStateFromProps(nextProps, nextState) {
    if (
      !isEmpty(nextProps.employeePerformanceGraph) &&
      nextProps.employeePerformanceGraph !== nextState.employeePerformanceGraph
    ) {
      return {
        employeePerformanceGraph: nextProps.employeePerformanceGraph,
      };
    }
    if (
      !isEmpty(nextProps.employeeLeadsOwn) &&
      nextProps.employeeLeadsOwn !== nextState.employeeLeadsOwn
    ) {
      return {
        employeeLeadsOwn: nextProps.employeeLeadsOwn,
      };
    }
    if (
      !isEmpty(nextProps.allEmaployeeActivity) &&
      nextProps.allEmaployeeActivity !== nextState.allEmaployeeActivity
    ) {
      return {
        allEmaployeeActivity: nextProps.allEmaployeeActivity,
      };
    }
    // if (
    //   !isEmpty(nextProps.location.state) &&
    //   nextProps.location.state !== nextState.employeeData
    // ) {
    //   return {
    //     employeeData: nextProps.location.state.detail
    //   };
    // }

    return null;
  }

  componentDidUpdate() {
    if (this.props.employeeLeadsOwn !== this.state.employeeLeadsOwn) {
      this.setState({
        employeeLeadsOwn: this.props.employeeLeadsOwn,
      });
    }
    if (
      this.props.employeePerformanceGraph !==
      this.state.employeePerformanceGraph
    ) {
      this.setState({
        employeePerformanceGraph: this.props.employeePerformanceGraph,
      });
    }
    if (this.props.allEmaployeeActivity !== this.state.allEmaployeeActivity) {
      this.setState({
        allEmaployeeActivity: this.props.allEmaployeeActivity,
      });
    }
  }

  handleChangeStart = (date) => {
    this.setState({
      startDate: date,
    });
  };

  handleChangeEnd = (date) => {
    this.setState({
      endDate: date,
    });
  };

  backToBlockView = () => {
    store.dispatch({
      type: SET_BLOCK_VIEW_EMPLOYEE,
      payload: true,
    });
    this.props.history.push("admin-employees");
  };

  render() {
    // console.log(this.state.employeePerformanceGraph);
    const { employeePerformanceGraph } = this.state;
    return (
      <Fragment>
        <div>
          {/* for desktop view */}
          <Navbar />

          {/* for mobile view */}
          {/* <MobileNavbar textTitle="Activity" displayMenuIcons={false} /> */}

          <div className="activity-outer-container employee-data-container">
            <img
              onClick={this.backToBlockView}
              className="backtokanban_button"
              src={require("../../../assets/img/leads/backicon.svg")}
              alt="back"
            />
            <div className="activity-outer-container__colm1">
              <EmployeesDataActivitySummary
                useForEmployeeData={true}
                employeeData={
                  !isEmpty(this.state.employeeData) && this.state.employeeData
                }
              />
            </div>
            <div className="activity-outer-container__colm2">
              <EmployeesDataActivityContent
                allEmaployeeActivity={
                  !isEmpty(this.state.allEmaployeeActivity) &&
                  this.state.allEmaployeeActivity
                }
                employeeLeadsOwn={
                  !isEmpty(this.state.employeeLeadsOwn) &&
                  this.state.employeeLeadsOwn
                }
                employeePerformanceGraph={
                  !isEmpty(employeePerformanceGraph) && employeePerformanceGraph
                }
                tab1={"Activity"}
                tab2={"Leads Owned"}
                tab3={"Performance"}
                startDate={this.state.startDate}
                endDate={this.state.endDate}
                handleChangeStart={this.handleChangeStart}
                handleChangeEnd={this.handleChangeEnd}
              />
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  allEmaployeeActivity: state.employee.employeeActivity,
  employeeLeadsOwn: state.employee.employeeLeadsOwn,
  employeePerformanceGraph: state.employee.employeePerformanceGraph,
});

export default connect(mapStateToProps, {
  getEmployeeActivity,
  getEmployeeLeadsOwned,
  getEmployeePerformanceGraph,
})(EmployeesData);
