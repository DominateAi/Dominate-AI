import React, { Component, Fragment } from "react";
import AlphabatesFilter from "../common/AlphabatesFilter";

import EmployeesListView from "./EmployeesListView";
import Employee from "./EmployeesBlockView";
import AddEmployees from "./AddEmployees";
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

import isEmpty from "./../../../store/validations/is-empty";
import {
  SET_APPROVAL_PENDING,
  SET_SEARCH_IN_ALL_PAGE,
} from "./../../../store/types";
import store from "./../../../store/store";

// pagination
const totalRecordsInOnePage = 5;

class EmployeesContent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      employessListView: true,
      employeesBlockView: false,
      employeeLeaves: false,
      allEmployeesList: {},
      employeeSearch: "",
      employeesFilterName: "",
      allPendingLeaves: "",
      activeAlphabate: "",
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
      console.log(this.props.employeeLevelFilterName);
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
    console.log(alphabate);
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

  /*============================
  Render List And Block Icon
==============================*/

  listIcon = () => {
    return (
      <button
        className="btn-funnel-view mr-0"
        onClick={this.employeesListViewHandler}
      >
        <img
          src={require("../../../assets/img/icons/list-view-icon.svg")}
          alt="list view"
        />
        List View
      </button>
    );
  };

  blockIcon = () => {
    return (
      <button
        className="btn-funnel-view mr-0"
        onClick={this.employeesBlockViewHandler}
      >
        <img
          src={require("../../../assets/img/icons/block-view-icon.svg")}
          alt="grid view"
        />
        Grid View
      </button>
    );
  };

  /*=========================
      render searchBlock
 ==========================*/
  renderSearchBlock = () => {
    return (
      <>
        {/* search block */}
        <div className="leads-title-block-container__new-search-title-block m-0 p-0 lead-search-block--cust">
          <form onSubmit={this.handleOnSubmitSearch}>
            <div className="message-search-block px-0 mb-md-0">
              <input
                type="text"
                id="employeeSearch"
                name="employeeSearch"
                className="message-search-block__input mb-0"
                placeholder="Search"
                onChange={this.handleOnChange}
                value={this.state.employeeSearch}
              />
              <img
                src="/img/desktop-dark-ui/icons/search-icon.svg"
                alt="search"
                className="message-search-block__icon"
                onClick={this.handleOnSubmitSearch}
              />
            </div>
          </form>
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
          <EmployeesListView
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
                <Employee
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

  render() {
    const { employeesBlockView } = this.state;
    // console.log(this.state.allPendingLeaves);
    return (
      <Fragment>
        <div className="alphabates-filter-container leads-title-block-container">
          <div className="filter-container w-100">
            <div className="title align-items-center">
              <AddEmployees isMobile={false} />
            </div>
            <div className="customers-search-block align-items-center">
              <span className="font-24-semibold mr-30">
                {this.renderSearchBlock()}
              </span>
              <div className="leads-title-block-container__new-search-title-block p-0 mb-0">
                {employeesBlockView ? this.listIcon() : this.blockIcon()}
              </div>
            </div>
          </div>
          {employeesBlockView ? (
            <div className="alphabates-filter">{this.renderAlphabets()}</div>
          ) : (
            ""
          )}
        </div>
        <div className="container-fluid employees-block-view-conatiner">
          <div className="row mx-0">
            {isEmpty(this.props.employeeList) ? (
              !this.state.employessListView ? (
                <h3 className="font-24-medium">
                  No Members Found with {this.state.activeAlphabate}{" "}
                </h3>
              ) : (
                <h3 className="font-24-medium">No Members Found</h3>
              )
            ) : (
              this.renderEmployeeBothView()
            )}
          </div>
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
})(EmployeesContent);
