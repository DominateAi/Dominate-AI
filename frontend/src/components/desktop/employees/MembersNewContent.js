import React, { Component, Fragment } from "react";
import { Tabs, Tab, TabPanel, TabList } from "react-web-tabs";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import AlphabatesFilter from "../common/AlphabatesFilter";
import MembersNewListView from "./MembersNewListView";
import MembersNewBlockView from "./MembersNewBlockView";
import TeamLeaves from "./TeamLeaves";
import { connect } from "react-redux";
import {
  getAllEmployeesWithAdmin,
  searchAllEmployeeAction,
  filterAllEmployeesByLevelAction,
  searchWithStatusEmployeeAction,
  filterLevelByAlphabate,
} from "./../../../store/actions/employeeAction";

import Pagination from "rc-pagination";
import "rc-pagination/assets/index.css";

import { SET_FILTER_NAME } from "./../../../store/types";

import isEmpty from "./../../../store/validations/is-empty";
import {
  SET_APPROVAL_PENDING,
  SET_SEARCH_IN_ALL_PAGE,
} from "./../../../store/types";
import store from "./../../../store/store";
import MembersNewOverview from "./MembersNewOverview";
import MembersNewAddEmployees from "./MembersNewAddEmployees";
import MembersNewLog from "./MembersNewLog";
import UserDashboardFreePlanWarning from "./../user-dashboard-add-forms/UserDashboardFreePlanWarning";
import { workspace } from "./../../../store/utils/enterprizeAccount.json";
import { workspaceId } from "./../../../store/actions/config";

const allEmployeesOptions = [
  "All Members",
  "Archive Members",
  "Active Members",
];

// pagination
const totalRecordsInOnePage = 5;

class MembersNewContent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      employessListView: false,
      employeesBlockView: true,
      employeeLeaves: false,
      allEmployeesList: {},
      employeeSearch: "",
      employeesFilterName: "",
      allPendingLeaves: "",
      activeAlphabate: "",
      startDate: null,
      endDate: null,
      allEmployeesDefaultOption: allEmployeesOptions[0],
      // pagination
      currentPagination: 1,
      // api
      getItemsList: {},
    };
  }

  /*==============================
        Lifecycle method
  ================================*/

  componentDidMount() {
    this.props.getAllEmployeesWithAdmin();
  }

  static getDerivedStateFromProps(nextProps, nextState) {
    // console.log(nextProps.employeeList);
    if (
      !isEmpty(nextProps.employeeList) &&
      nextProps.employeeList !== nextState.allEmployeesList
    ) {
      return {
        allEmployeesList: nextProps.employeeList,
        getItemsList: nextProps.employeeList,
      };
    }

    if (
      !isEmpty(nextProps.employeesFilterName) &&
      nextProps.employeesFilterName !== nextState.employeesFilterName
    ) {
      return {
        employeesFilterName: nextProps.employeesFilterName,
      };
    }
    if (
      !isEmpty(nextProps.employeeLevelFilterName) &&
      nextProps.employeeLevelFilterName === "ApprovalPending"
    ) {
      return {
        employeeLevelFilterName: nextProps.employeeLevelFilterName,
        hasSetData: false,
      };
    }

    return null;
  }

  componentDidUpdate() {
    // console.log(
    //   this.state.employeeLevelFilterName,
    //   this.state.employessListView,
    //   this.state.employeesBlockView
    // console.log(this.props.employeeLevelFilterName);
    // );
    if (
      this.props.employeeLevelFilterName === "ApprovalPending" &&
      ((this.state.employessListView && !this.state.employeesBlockView) ||
        (!this.state.employessListView && this.state.employeesBlockView)) &&
      !this.state.hasSetData
    ) {
      this.setState({
        employeeLeaves: true,
        employessListView: false,
        employeesBlockView: false,
        hasSetData: true,
        allMembers: false,
      });
    }
    if (
      this.props.employeeLevelFilterName === "OnLeave" &&
      ((this.state.employessListView && !this.state.employeesBlockView) ||
        (!this.state.employessListView && this.state.employeesBlockView)) &&
      !this.state.hasSetData
    ) {
      this.setState({
        employeeLeaves: true,
        employessListView: false,
        employeesBlockView: false,
        hasSetData: true,
        allMembers: false,
      });
    }
    if (
      this.props.employeeLevelFilterName === "UpcomingLeaves" &&
      ((this.state.employessListView && !this.state.employeesBlockView) ||
        (!this.state.employessListView && this.state.employeesBlockView)) &&
      !this.state.hasSetData
    ) {
      this.setState({
        employeeLeaves: true,
        employessListView: false,
        employeesBlockView: false,
        hasSetData: true,
        allMembers: false,
      });
    }
    if (
      this.props.employeeLevelFilterName === "AllMembers" &&
      !this.state.allMembers
    ) {
      // console.log(this.props.employeeLevelFilterName);
      this.setState({
        employeeLeaves: false,
        allMembers: true,
        employessListView: true,
        hasSetData: false,
        employeesBlockView: false,
        // hasSetData: true
      });
    }
  }

  // pagination
  onChangePagination = (page) => {
    this.setState({
      currentPagination: page,
    });
  };

  /*=============================
          Search Handler
  ==============================*/

  handleOnSubmitSearch = (e) => {
    e.preventDefault();
    // alert(this.state.leadSearch);
    // console.log(this.state.employeeSearch);
    const { employeesFilterName } = this.state;
    if (employeesFilterName === "All Members") {
      this.props.searchAllEmployeeAction(this.state.employeeSearch);
    } else if (employeesFilterName === "Archive Members") {
      this.props.searchWithStatusEmployeeAction(
        this.state.employeeSearch,
        "ARCHIVE"
      );
    } else {
      this.props.searchWithStatusEmployeeAction(
        this.state.employeeSearch,
        "ACTIVE"
      );
    }

    // this.props.searchLeadAction(this.state.leadSearch);
  };

  handleOnChange = (e) => {
    store.dispatch({
      type: SET_SEARCH_IN_ALL_PAGE,
      payload: e.target.value,
    });
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  /*==============================
   Employees Block View Handler 
   ===============================*/
  employeesBlockViewHandler = (e) => {
    store.dispatch({
      type: SET_APPROVAL_PENDING,
      payload: "",
    });
    this.setState({
      employessListView: false,
      employeesBlockView: true,
      allMembers: false,
      hasSetData: false,
      employeeLeaves: false,
    });
  };
  /*===============================
   Employees List View Handler 
===================================*/
  employeesListViewHandler = (e) => {
    store.dispatch({
      type: SET_APPROVAL_PENDING,
      payload: "",
    });
    this.setState({
      employessListView: true,
      employeesBlockView: false,
      hasSetData: false,
      employeeLeaves: false,
    });
  };
  /*===============================
    Employee On Alphabates Handler 
  ==================================*/
  onClickAlphabates = (alphabate) => {
    // console.log(alphabate);
    this.setState({
      activeAlphabate: alphabate,
    });
    const newFilter = {
      pageNo: 10,
      pageSize: 0,
      query: {
        name: {
          $regex: `^${alphabate}`,
          $options: "i",
        },
      },
    };
    this.props.filterLevelByAlphabate(newFilter);
  };

  /*=================================
      Render Alphabates In Ui
   =================================*/
  renderAlphabets = () => {
    let i,
      list = [];
    for (i = 65; i <= 90; i++) {
      let value = String.fromCharCode(i);
      list.push(
        <AlphabatesFilter
          activeAlphabate={this.state.activeAlphabate}
          onClick={() => this.onClickAlphabates(value)}
          key={i}
          alphabate={value}
        />
      );
    }
    return list;
  };
  /*=========================
      render datepicker
 ==========================*/

  handleChangeStart = (date) => {
    if (date === null) {
      this.setState({
        startDate: new Date(),
      });
    } else {
      this.setState({
        startDate: date,
      });
    }
  };

  handleChangeEnd = (date) => {
    if (date === null) {
      this.setState({
        endDate: new Date(),
      });
    } else {
      this.setState({
        endDate: date,
      });
    }
  };

  handleDateChangeRaw = (e) => {
    e.preventDefault();
  };

  renderDatePicker = () => {
    return (
      <>
        {/* datepicker */}
        <div className="leads-title-block-container__date-picker mr-0">
          {/* datepicker */}
          <DatePicker
            selected={this.state.startDate}
            selectsStart
            startDate={this.state.startDate}
            endDate={this.state.endDate}
            onChange={this.handleChangeStart}
            placeholderText="mm/dd/yyyy"
            onChangeRaw={this.handleDateChangeRaw}
          />
          <span className="font-18-medium">to</span>
          <DatePicker
            selected={this.state.endDate}
            selectsEnd
            startDate={this.state.startDate}
            endDate={this.state.endDate}
            onChange={this.handleChangeEnd}
            minDate={this.state.startDate}
            placeholderText="mm/dd/yyyy"
            onChangeRaw={this.handleDateChangeRaw}
          />
          <img
            onClick={this.submitDateHandler}
            src="/img/desktop-dark-ui/icons/purple-bg-arrow-next.svg"
            alt="next"
            className="leads-title-block-next-arrow-img"
          />
        </div>
      </>
    );
  };

  /*=========================
      render searchBlock
 ==========================*/
  renderSearchBlock = () => {
    return (
      <>
        <div className="leads-title-block-container__new-search-title-block m-0 p-0 lead-search-block--cust row mx-0 align-items-center">
          <div className="message-search-block px-0 mb-md-0">
            <form onSubmit={this.handleOnSubmitSearch}>
              <input
                type="text"
                name="leadSearch"
                className="message-search-block__input mb-0 mr-0"
                placeholder="Search"
                onChange={this.handleOnChange}
                value={this.state.leadSearch}
              />
              <img
                src="/img/desktop-dark-ui/icons/search-icon.svg"
                alt="search"
                className="message-search-block__icon"
                onClick={this.handleOnSubmitSearch}
              />
            </form>
          </div>
        </div>
      </>
    );
  };

  /*======================================
      Render Customer list and Card view
  =========================================*/
  renderEmployeeBothView = () => {
    const {
      employeesBlockView,
      employessListView,
      employeeLeaves,
      allEmployeesList,
    } = this.state;
    let dataToken = JSON.parse(localStorage.getItem("Data"));

    let filtereddata = [];
    if (!isEmpty(this.props.searchInAllPage)) {
      let search = new RegExp(this.props.searchInAllPage, "i");
      filtereddata = allEmployeesList.filter((getall) => {
        if (search.test(getall.name)) {
          return getall;
        }
        // if (search.test(getall.company)) {
        //   return getall;
        // }
        // if (search.test(getall.email)) {
        //   return getall;
        // }
      });
      // console.log(filtereddata);
    } else {
      filtereddata = this.state.allEmployeesList;
    }

    return (
      <Fragment>
        {employessListView === true ? (
          <MembersNewListView
            allEmployeesList={allEmployeesList}
            currentPagination={this.state.currentPagination}
            totalRecordsInOnePage={totalRecordsInOnePage}
          />
        ) : employeesBlockView === true ? (
          filtereddata.map((employee, index) => {
            return (
              index >=
                (this.state.currentPagination - 1) * totalRecordsInOnePage &&
              index < this.state.currentPagination * totalRecordsInOnePage && (
                <MembersNewBlockView
                  employeeData={employee}
                  key={index}
                  profileImg={
                    !isEmpty(employee) &&
                    `${employee.profileImage}&token=${dataToken.token}`
                  }
                  name={employee.name}
                  position={employee.role.name}
                />
              )
            );
          })
        ) : employeeLeaves === true ? (
          <TeamLeaves allPendingLeaves={this.state.allPendingLeaves} />
        ) : null}
        {employeeLeaves === false && (
          <div className="add-lead-pagination">
            <Pagination
              onChange={this.onChangePagination}
              current={this.state.currentPagination}
              defaultPageSize={totalRecordsInOnePage}
              total={this.state.getItemsList.length}
              showTitle={false}
            />
          </div>
        )}
      </Fragment>
    );
  };

  onAllEmployeesDropdownSelect = (data) => (e) => {
    // console.log("Selected: " + e.value);
    this.setState({
      allEmployeesDefaultOption: data,
    });
    store.dispatch({
      type: SET_FILTER_NAME,
      payload: data,
    });
    if (data === "All Members") {
      const allEmployeeQuery = {
        // pageNo: 10,
        // pageSize: 0,
        query: {},
      };
      this.props.getAllEmployeesWithAdmin(allEmployeeQuery);
    } else if (data === "Archive Members") {
      const filterByLevel = {
        query: {
          status: "ARCHIVE",
        },
      };
      this.props.filterAllEmployeesByLevelAction(filterByLevel);
    } else if (data === "Active Members") {
      const filterByLevel = {
        query: {
          status: "ACTIVE",
        },
      };
      this.props.filterAllEmployeesByLevelAction(filterByLevel);
    } else {
      // console.log("not selected");
    }
  };

  renderOverviewDropdownSearchBlock = () => {
    return (
      <>
        <div className="leads-new-filter-button-block">
          {allEmployeesOptions.map((data, index) => (
            <button
              key={index}
              onClick={this.onAllEmployeesDropdownSelect(data)}
              className={
                allEmployeesOptions[index] ===
                this.state.allEmployeesDefaultOption
                  ? "leads-new-filter-button leads-new-filter-button--active"
                  : "leads-new-filter-button"
              }
            >
              {data}
            </button>
          ))}
        </div>

        <MembersNewOverview />

        <div className="row mx-0 flex-nowrap leads-new-datepicker-search-block">
          {this.renderSearchBlock()}
          <span className="border-right mx-3"></span>
          {this.renderDatePicker()}
        </div>
      </>
    );
  };

  render() {
    // console.log(workspace);
    const { employeesBlockView } = this.state;
    let oraganiationData = JSON.parse(localStorage.getItem("oraganiationData"));
    // console.log(this.state.allPendingLeaves);

    let enterprizeMember = false;

    workspace.forEach((ele) => {
      if (ele.name === workspaceId) {
        enterprizeMember = true;
      }
    });

    return (
      <Fragment>
        <div className="cmd-centre-block cmd-centre-block--leadsNew">
          <div className="row mx-0 align-items-center justify-content-between cmd-centre-block--leadsNew__pageTitleRow">
            <div className="row mx-0 align-items-center">
              <div className="go-back-yellow-arrow-new-leads opacity-0 cursor-default">
                <img
                  src={require("../../../assets/img/icons/icon-prev-arrow-circle-yellow.svg")}
                  alt="prev arrow"
                />
              </div>
              <h3 className="font-42-medium new-leads-page-title">Members</h3>
            </div>
            {/* {oraganiationData.planStatus === "FREE_PLAN" &&
            !enterprizeMember ? (
              <UserDashboardFreePlanWarning member={true} />
            ) : (
            <MembersNewAddEmployees isMobile={false} />
             )} */}
          </div>
        </div>
        <hr className="page-title-border-bottom" />

        <div className="cmd-centre-block cmd-centre-block--leadsNew">
          <Tabs defaultTab="one">
            <TabList>
              <Tab tabFor="one">
                <i className="fa fa-circle" />
                Member Log
              </Tab>
              <Tab tabFor="two" onClick={this.employeesBlockViewHandler}>
                <i className="fa fa-circle" />
                Grid View
              </Tab>
              <Tab tabFor="three" onClick={this.employeesListViewHandler}>
                <i className="fa fa-circle" />
                List View
              </Tab>
            </TabList>
            <TabPanel tabId="one">
              <MembersNewLog />
            </TabPanel>
            <TabPanel tabId="two">
              {this.renderOverviewDropdownSearchBlock()}

              <div className="alphabates-filter-container alphabates-filter-container--members-new">
                <div className="alphabates-filter">
                  {this.renderAlphabets()}
                </div>
              </div>
              <div className="members-new-list-block-view-container">
                <div className="row mx-0">
                  {isEmpty(this.props.employeeList) ? (
                    <h3 className="font-24-medium">
                      No Members Found with {this.state.activeAlphabate}{" "}
                    </h3>
                  ) : (
                    this.renderEmployeeBothView()
                  )}
                </div>
              </div>
            </TabPanel>
            <TabPanel tabId="three">
              {this.renderOverviewDropdownSearchBlock()}

              <div className="members-new-list-block-view-container">
                <div className="row mx-0">
                  {isEmpty(this.props.employeeList) ? (
                    <h3 className="font-24-medium">No Members Found</h3>
                  ) : (
                    this.renderEmployeeBothView()
                  )}
                </div>
              </div>
            </TabPanel>
          </Tabs>
        </div>
      </Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  employeeList: state.employee.allEmployees,
  employeesFilterName: state.filterName.filterName,
  employeeLevelFilterName: state.filterName.employeeLevelName,
  allPendingLeaves: state.calender.pendingLeaves,
  searchInAllPage: state.search.searchInAllPage,
});

export default connect(mapStateToProps, {
  getAllEmployeesWithAdmin,
  searchAllEmployeeAction,
  filterAllEmployeesByLevelAction,
  searchWithStatusEmployeeAction,
  filterLevelByAlphabate,
})(MembersNewContent);
