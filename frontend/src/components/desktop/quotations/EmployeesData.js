import React, { Component, Fragment } from "react";
import Navbar from "./../header/Navbar";
import MobileNavbar from "../../mobile/common/MobileNavbar";
import EmployeesDataActivityContent from "./EmployeesDataActivityContent";
import EmployeesDataActivitySummary from "./EmployeesDataActivitySummary";
import isEmpty from "./../../../store/validations/is-empty";
import { connect } from "react-redux";
import {
  getEmployeeActivity,
  getEmployeeLeadsOwned
} from "./../../../../src/store/actions/employeeActivityAction";

class EmployeesData extends Component {
  constructor() {
    super();
    this.state = {
      employeeData: [],
      allEmaployeeActivity: [],
      employeeLeadsOwn: []
    };
  }

  /*=======================================
              Lifecycle Method
  =========================================*/

  componentDidMount() {
    this.props.getEmployeeActivity(this.props.location.state.detail._id);
    const newQuery = {
      query: { assigned: this.props.location.state.detail._id }
    };
    this.props.getEmployeeLeadsOwned(newQuery);
  }

  static getDerivedStateFromProps(nextProps, nextState) {
    if (
      !isEmpty(nextProps.employeeLeadsOwn) &&
      nextProps.employeeLeadsOwn !== nextState.employeeLeadsOwn
    ) {
      return {
        employeeLeadsOwn: nextProps.employeeLeadsOwn
      };
    }
    if (
      !isEmpty(nextProps.allEmaployeeActivity) &&
      nextProps.allEmaployeeActivity !== nextState.allEmaployeeActivity
    ) {
      return {
        allEmaployeeActivity: nextProps.allEmaployeeActivity
      };
    }
    if (
      !isEmpty(nextProps.location.state) &&
      nextProps.location.state !== nextState.employeeData
    ) {
      return {
        employeeData: nextProps.location.state.detail
      };
    }

    return null;
  }

  render() {
    console.log(this.state.employeeLeadsOwn);
    return (
      <Fragment>
        <div>
          {/* for desktop view */}
          <Navbar />

          {/* for mobile view */}
          {/* <MobileNavbar /> */}

          <div className="activity-outer-container employee-data-container">
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
                tab1={"Activity"}
                tab2={"Leads Owned"}
                tab3={"Performance"}
              />
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  allEmaployeeActivity: state.employee.employeeActivity,
  employeeLeadsOwn: state.employee.employeeLeadsOwn
});

export default connect(mapStateToProps, {
  getEmployeeActivity,
  getEmployeeLeadsOwned
})(EmployeesData);
