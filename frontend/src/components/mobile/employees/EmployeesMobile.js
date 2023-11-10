import React, { Component } from "react";
import Dropdown from "react-dropdown";
import DropdownIcon from "rc-dropdown";
import "react-dropdown/style.css";
import {
  Accordion,
  AccordionItem,
  AccordionItemButton,
  AccordionItemHeading,
  AccordionItemPanel
} from "react-accessible-accordion";
import Menu, { Item as RCMenuItem, Divider } from "rc-menu";
import dateFns from "date-fns";
import Pagination from "rc-pagination";
import "rc-pagination/assets/index.css";
import { connect } from "react-redux";
import {
  getAllEmployeesWithAdmin,
  searchAllEmployeeAction,
  filterAllEmployeesByLevelAction,
  searchWithStatusEmployeeAction,
  filterLevelByAlphabate
} from "./../../../store/actions/employeeAction";
import store from "./../../../store/store";
import { SET_FILTER_NAME } from "./../../../store/types";
import isEmpty from "./../../../store/validations/is-empty";

import MobileNavbar from "../common/MobileNavbar";
import EmployeesMobileCardDetails from "./EmployeesMobileCardDetails";
import EmployeesOverview from "../../desktop/employees/EmployeesOverview";
import FloatingButton from "../common/FloatingButton";
import EmployeesMobileEditEmployees from "./EmployeesMobileEditEmployees";
import LeadsMobileSearchBlock from "../leads/LeadsMobileSearchBlock";

// search
let searchedList = [];
let isDataFound = false;
let isSearchClick = false;

// pagination
const totalRecordsInOnePage = 5;

const allEmployeesOptions = [
  "All Members",
  "Archive Members",
  "Active Members"
];

// dropdown
function onSelect({ key }) {
  console.log(`${key} selected`);
}

function onVisibleChange(visible) {
  console.log(visible);
}

const menu = (
  <Menu onSelect={onSelect}>
    <RCMenuItem key="archive">Archive</RCMenuItem>
    <Divider />
    <RCMenuItem key="edit">
      <EmployeesMobileEditEmployees />
    </RCMenuItem>
  </Menu>
);

class EmployeesMobile extends Component {
  constructor() {
    super();
    this.state = {
      searchText: "",
      allEmployeesDefaultOption: allEmployeesOptions[0],
      // api
      allEmployeesList: [],
      // pagination
      currentPagination: 1
    };
  }

  static getDerivedStateFromProps(nextProps, nextState) {
    // console.log(nextProps.employeeList);
    if (
      !isEmpty(nextProps.employeeList) &&
      nextProps.employeeList !== nextState.allEmployeesList
    ) {
      return {
        allEmployeesList: nextProps.employeeList,
        getItemsList: nextProps.employeeList
      };
    }

    if (
      !isEmpty(nextProps.employeesFilterName) &&
      nextProps.employeesFilterName !== nextState.employeesFilterName
    ) {
      return {
        employeesFilterName: nextProps.employeesFilterName
      };
    }
    if (
      !isEmpty(nextProps.employeeLevelFilterName) &&
      nextProps.employeeLevelFilterName === "ApprovalPending"
    ) {
      return {
        employeeLevelFilterName: nextProps.employeeLevelFilterName,
        hasSetData: false
      };
    }

    return null;
  }

  componentDidMount() {
    this.props.getAllEmployeesWithAdmin();
  }

  handleOnChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  onAllLeadDropdownSelect = e => {
    // console.log("Selected: " + e.value);
    isSearchClick = false;
    this.setState({
      searchText: "",
      allEmployeesDefaultOption: e.value
    });
    store.dispatch({
      type: SET_FILTER_NAME,
      payload: e.value
    });
    if (e.value === "All Members") {
      const allEmployeeQuery = {
        // pageNo: 10,
        // pageSize: 0,
        query: {}
      };
      this.props.getAllEmployeesWithAdmin(allEmployeeQuery);
    } else if (e.value === "Archive Members") {
      const filterByLevel = {
        query: {
          status: "ARCHIVE"
        }
      };
      this.props.filterAllEmployeesByLevelAction(filterByLevel);
    } else if (e.value === "Active Members") {
      const filterByLevel = {
        query: {
          status: "ACTIVE"
        }
      };
      this.props.filterAllEmployeesByLevelAction(filterByLevel);
    } else {
      // console.log("not selected");
    }
  };

  handleClickSearchTextSubmit = e => {
    e.preventDefault();
    this.setState({
      [e.target.name]: e.target.value
    });

    isSearchClick = true;

    if (!isEmpty(this.state.allEmployeesList)) {
      searchedList = this.state.allEmployeesList.filter(data =>
        data.name.toLowerCase().includes(e.target.value.toLowerCase())
      );

      if (!isEmpty(searchedList)) {
        isDataFound = true;
      } else {
        isDataFound = false;
      }
    }
  };

  // pagination
  onChangePagination = page => {
    this.setState({
      currentPagination: page
    });
  };

  // render card
  renderCard = () => {
    let dataToken = JSON.parse(localStorage.getItem("Data"));
    let newList = isDataFound
      ? searchedList
      : !isDataFound && isSearchClick
      ? []
      : this.state.allEmployeesList;

    return (
      <>
        {!isEmpty(newList) ? (
          newList.map(
            (data, index) =>
              index >=
                (this.state.currentPagination - 1) * totalRecordsInOnePage &&
              index < this.state.currentPagination * totalRecordsInOnePage && (
                <AccordionItem key={index}>
                  <div className="dropdown-on-card">
                    <DropdownIcon
                      trigger={["click"]}
                      overlay={menu}
                      animation="none"
                      onVisibleChange={this.onVisibleChange}
                      overlayClassName="dashboard-profile-dropdown"
                    >
                      <img
                        className="resp-edit-img"
                        src={require("./../../../assets/img/leads/edit-icon.png")}
                        alt="edit"
                      />
                    </DropdownIcon>
                  </div>
                  <AccordionItemHeading>
                    <AccordionItemButton>
                      <div className="card-title-block-outer__1">
                        <div>
                          <img
                            src={`${data.profileImage}&token=${dataToken.token}`}
                            // src={require("../../../assets/img/dashboard/person.png")}
                            alt="person"
                            className="resp-leads-content-img resp-mr-16"
                          />
                        </div>
                        <div className="mr-40">
                          <h1 className="resp-font-18-medium">{data.name}</h1>
                          <h2 className="resp-font-12-regular color-gray-resp">
                            {data.role.category}
                          </h2>
                        </div>
                      </div>
                    </AccordionItemButton>
                  </AccordionItemHeading>
                  <AccordionItemPanel>
                    <EmployeesMobileCardDetails
                      data={data}
                      email={data.email}
                      dateOfJoining={dateFns.format(
                        data.dateOfJoining,
                        "MM/DD/YYYY"
                      )}
                    />
                  </AccordionItemPanel>
                </AccordionItem>
              )
          )
        ) : (
          <>
            <div className="text-center">
              <h2 className="resp-font-12-medium color-gray-resp">
                No Employeess Found
              </h2>
            </div>
          </>
        )}

        {newList.length !== 0 && (
          <div className="add-lead-pagination">
            <Pagination
              onChange={this.onChangePagination}
              current={this.state.currentPagination}
              defaultPageSize={totalRecordsInOnePage}
              total={newList.length}
              showTitle={false}
            />
          </div>
        )}
      </>
    );
  };

  render() {
    return (
      <>
        <div>
          {/* <MobileNavbar textTitle="Employees" /> */}

          {/* CustomersOverview reused from desktop view */}
          {/* <EmployeesOverview /> */}

          <LeadsMobileSearchBlock
            name="searchText"
            value={this.state.searchText}
            placeholder="search for employees name"
            handleClickSearchTextSubmit={this.handleClickSearchTextSubmit}
          />

          <div className="resp-dropdown-filter-block">
            <div>
              <Dropdown
                className="lead-status-dropDown lead-status-dropDown--importExport lead-status-dropDown--importExport--all-lead"
                options={allEmployeesOptions}
                value={this.state.allEmployeesDefaultOption}
                onChange={this.onAllLeadDropdownSelect}
              />
            </div>
          </div>

          <div className="block-16-18 mb-61">
            <Accordion
              className="leads-accordion leads-accordion--customers"
              allowZeroExpanded={true}
            >
              {this.renderCard()}
            </Accordion>
          </div>
        </div>

        {/* floating button */}
        <FloatingButton isActiveVal={"employees"} />
      </>
    );
  }
}

const mapStateToProps = state => ({
  employeeList: state.employee.allEmployees,
  employeesFilterName: state.filterName.filterName,
  employeeLevelFilterName: state.filterName.employeeLevelName,
  allPendingLeaves: state.calender.pendingLeaves
});

export default connect(mapStateToProps, {
  getAllEmployeesWithAdmin,
  searchAllEmployeeAction,
  filterAllEmployeesByLevelAction,
  searchWithStatusEmployeeAction,
  filterLevelByAlphabate
})(EmployeesMobile);
