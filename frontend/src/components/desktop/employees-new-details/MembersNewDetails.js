import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Tabs, Tab, TabPanel, TabList } from "react-web-tabs";
import Navbar from "../header/Navbar";
// api
import isEmpty from "./../../../store/validations/is-empty";
import { connect } from "react-redux";
import {
  updateEmployee,
  getEmployeeDataById,
} from "./../../../store/actions/employeeAction";
import {
  getEmployeeActivity,
  getEmployeeLeadsOwned,
  getEmployeePerformanceGraph,
} from "./../../../../src/store/actions/employeeActivityAction";
// api end
import activeTabCircleImg from "../../../../src/assets/img/leads-new/leads-new-inner-page-active-tab-circle.svg";
import MembersNewDetailsProfileForm from "./MembersNewDetailsProfileForm";
import MembersNewDetailsProfileFormDisplay from "./MembersNewDetailsProfileFormDisplay";
import MembersNewDetailsContent from "./MembersNewDetailsContent";
import MembersNewDetailsProfile from "./MembersNewDetailsProfile";
import { validateAddEmployee } from "./../../../store/validations/employeeValidation/addEmployeeValidation";
import BreadcrumbMenu from "../header/BreadcrumbMenu";

class MembersNewDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isProfileFormDoubleClicked: false,
      employeeData: [],
      allEmaployeeActivity: [],
      employeeLeadsOwn: [],
      errors: {},
    };
  }

  /*=======================================
              Lifecycle Method
  =========================================*/
  componentDidMount() {
    window.scrollTo(0, 0);
    this.props.getEmployeeActivity(this.props.location.state.detail._id);
    this.props.getEmployeeDataById(this.props.location.state.detail._id);
    const newQuery = {
      query: { assigned: this.props.location.state.detail._id },
    };
    this.props.getEmployeeLeadsOwned(newQuery);
    this.props.getEmployeePerformanceGraph(
      this.props.location.state.detail._id
    );
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
    if (
      !isEmpty(nextProps.singleEmployeeDetail) &&
      nextProps.singleEmployeeDetail !== nextState.singleEmployeeDetail
    ) {
      return {
        employeeData: nextProps.singleEmployeeDetail,
      };
    }

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
    // if (this.props.apiStatus && this.state.isProfileFormDoubleClicked) {
    //   this.setState({
    //     isProfileFormDoubleClicked: !this.state.isProfileFormDoubleClicked,
    //   });
    // }
  }

  /*===========================================
            Lifecycle Methods end
  =============================================*/

  handleOnDoubleClickProfileForm = () => {
    this.setState({
      isProfileFormDoubleClicked: !this.state.isProfileFormDoubleClicked,
      errors: {},
    });
  };

  callBackUpdate = (status) => {
    if (status === 200) {
      this.setState({
        isProfileFormDoubleClicked: !this.state.isProfileFormDoubleClicked,
      });
    }
  };

  handleOnClickSaveButton = (data) => (e) => {
    e.preventDefault();
    // console.log(data);

    const { errors, isValid } = validateAddEmployee(data);
    console.log(errors);
    if (!isValid) {
      this.setState({
        errors: errors,
      });
    }
    if (isValid) {
      this.setState({
        // isProfileFormDoubleClicked: !this.state.isProfileFormDoubleClicked,
        errors: {},
      });

      console.log(data);

      const updateEmployeeData = {
        email: data.employeesEmailId,
        firstName: data.employeesFirstName,
        lastName: data.employeesLastName,
        // role: data.empRole,
        dateOfJoining: data.dateOfJoining,
        jobTitle: data.employeesJobTitle,
      };
      this.props.updateEmployee(
        data.employeeId,
        updateEmployeeData,
        this.props.employeesFilterName,
        this.callBackUpdate
      );
    }
  };

  handleOnClickCancelButton = () => {
    this.setState({
      isProfileFormDoubleClicked: false,
    });
  };

  /*===========================================
      main
  =============================================*/
  render() {
    const {
      employeeData,
      isProfileFormDoubleClicked,
      employeePerformanceGraph,
    } = this.state;
    // console.log(employeeData);
    return (
      <>
        <Navbar />
        <BreadcrumbMenu
          menuObj={[
            {
              title: "Members",
              link: "/members-new",
            },
            {
              title: "Member",
            },
          ]}
        />

        <div className="cmd-centre-block cmd-centre-block--leadsNew cmd-centre-block--leadsNewDetailsPage">
          {/* <Link to="/members-new" className="leads-new-details-close-block">
            <span className="font-18-semibold">
              <i className="fa fa-times"></i> Close
            </span>
          </Link> */}

          <Tabs defaultTab="one">
            <TabList>
              <Tab tabFor="one">
                <img src={activeTabCircleImg} alt="" />
                Profile
              </Tab>
              <Tab tabFor="two">
                <img src={activeTabCircleImg} alt="" />
                Activity Log
              </Tab>
              <Tab tabFor="three">
                <img src={activeTabCircleImg} alt="" />
                Leads Owned
              </Tab>
              <Tab tabFor="four">
                <img src={activeTabCircleImg} alt="" />
                Performance
              </Tab>
            </TabList>
            <TabPanel tabId="one">
              <MembersNewDetailsProfile employeeData={employeeData} />
              <div
                className="leads-new-details-content-card-bg leads-new-details-content-card-shadow"
                onDoubleClick={this.handleOnDoubleClickProfileForm}
              >
                {isProfileFormDoubleClicked ? (
                  <MembersNewDetailsProfileForm
                    employeeData={employeeData}
                    handleOnClickCancelButton={
                      this.handleOnDoubleClickProfileForm
                    }
                    handleOnClickSaveButton={this.handleOnClickSaveButton}
                    errors={this.state.errors}
                  />
                ) : (
                  <MembersNewDetailsProfileFormDisplay
                    employeeData={employeeData}
                    handleOnClickCancelButton={this.handleOnClickCancelButton}
                  />
                )}
              </div>
            </TabPanel>
            <TabPanel tabId="two">
              <div className="leads-new-details-content-card-bg">
                <MembersNewDetailsContent
                  allEmaployeeActivity={
                    !isEmpty(this.state.allEmaployeeActivity) &&
                    this.state.allEmaployeeActivity
                  }
                  employeeLeadsOwn={
                    !isEmpty(this.state.employeeLeadsOwn) &&
                    this.state.employeeLeadsOwn
                  }
                  employeePerformanceGraph={
                    !isEmpty(employeePerformanceGraph) &&
                    employeePerformanceGraph
                  }
                  tab1={"activity"}
                  tab2={""}
                  tab3={""}
                />
              </div>
            </TabPanel>
            <TabPanel tabId="three">
              <div className="leads-new-details-content-card-bg">
                <MembersNewDetailsContent
                  allEmaployeeActivity={
                    !isEmpty(this.state.allEmaployeeActivity) &&
                    this.state.allEmaployeeActivity
                  }
                  employeeLeadsOwn={
                    !isEmpty(this.state.employeeLeadsOwn) &&
                    this.state.employeeLeadsOwn
                  }
                  employeePerformanceGraph={
                    !isEmpty(employeePerformanceGraph) &&
                    employeePerformanceGraph
                  }
                  tab1={""}
                  tab2={"email"}
                  tab3={""}
                />
              </div>
            </TabPanel>
            <TabPanel tabId="four">
              <div className="leads-new-details-content-card-bg">
                <MembersNewDetailsContent
                  allEmaployeeActivity={
                    !isEmpty(this.state.allEmaployeeActivity) &&
                    this.state.allEmaployeeActivity
                  }
                  employeeLeadsOwn={
                    !isEmpty(this.state.employeeLeadsOwn) &&
                    this.state.employeeLeadsOwn
                  }
                  employeePerformanceGraph={
                    !isEmpty(employeePerformanceGraph) &&
                    employeePerformanceGraph
                  }
                  tab1={""}
                  tab2={""}
                  tab3={"performance"}
                />
              </div>
            </TabPanel>
          </Tabs>
        </div>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  apiStatus: state.auth.status,
  allEmaployeeActivity: state.employee.employeeActivity,
  employeeLeadsOwn: state.employee.employeeLeadsOwn,
  employeePerformanceGraph: state.employee.employeePerformanceGraph,
  singleEmployeeDetail: state.employee.singleEmployeeDetail,
});

export default connect(mapStateToProps, {
  updateEmployee,
  getEmployeeActivity,
  getEmployeeLeadsOwned,
  getEmployeePerformanceGraph,
  getEmployeeDataById,
})(MembersNewDetails);
