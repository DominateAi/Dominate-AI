import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import SuperAdminNavbar from "../header/SuperAdminNavbar";
import Cards from "../common/Cards";
import SearchBlock from "../common/SearchBlock";
import { connect } from "react-redux";
import {
  getOrganizationUsers,
  singleOrganizationOverview,
  filterSingleOrganizationByLevel
} from "./../../../../store/actions/superAdminActions";
import isEmpty from "./../../../../store/validations/is-empty";

import Pagination from "rc-pagination";
import "rc-pagination/assets/index.css";

import dateFns from "date-fns";

// const tempRow = ["1", "2", "3"];

// pagination
const totalRecordsInOnePage = 5;

class Users extends Component {
  constructor(props) {
    super(props);
    this.state = {
      search: "",
      workspaceInfo: {},
      // pagination
      currentPagination: 1,
      // api
      getItemsList: {}
    };
  }

  /*=====================================
    Componenet Lifecycle method
======================================*/
  componentDidMount() {
    this.props.getOrganizationUsers(this.props.history.location.state.detail);
    this.props.singleOrganizationOverview(
      this.props.history.location.state.detail
    );
  }

  static getDerivedStateFromProps(nextProps, nextState) {
    if (
      !isEmpty(nextProps.workspaceInfo) &&
      nextProps.workspaceInfo !== nextState.workspaceInfo
    ) {
      return {
        workspaceInfo: nextProps.workspaceInfo,
        getItemsList: nextProps.workspaceInfo
        // getItemsList: nextProps.allOrganizations
      };
    }
    if (
      !isEmpty(nextProps.singleOrganizationOverviewData) &&
      nextProps.singleOrganizationOverviewData !==
        nextState.singleOrganizationOverviewData
    ) {
      return {
        singleOrganizationOverviewData: nextProps.singleOrganizationOverviewData
      };
    }
    return null;
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.workspaceInfo !== this.state.workspaceInfo) {
      this.setState({
        workspaceInfo: this.props.workspaceInfo,
        getItemsList: this.props.workspaceInfo
      });
    }
  }

  onCardClickFilter = cardName => e => {
    console.log(cardName);
    if (cardName === "totalUsers") {
      this.props.getOrganizationUsers(this.props.history.location.state.detail);
    } else if (cardName === "activeUsers") {
      this.props.filterSingleOrganizationByLevel(
        this.props.history.location.state.detail,
        "ACTIVE"
      );
    } else {
      this.props.filterSingleOrganizationByLevel(
        this.props.history.location.state.detail,
        "INACTIVE"
      );
    }
  };

  // pagination
  onChangePagination = page => {
    this.setState({
      currentPagination: page
    });
  };

  onSearchChange = e => {
    this.setState({
      search: e.target.value
    });
  };

  /*
   * handlers
   */
  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    console.log(this.state);
  };

  /*
   * renderOverview
   */
  renderOverview = () => {
    const { singleOrganizationOverviewData } = this.state;
    return (
      <>
        <h1 className="font-24-semibold mb-30">
          <Link to="/organization">
            <i className="fa fa-angle-left mr-30"></i>
          </Link>
          {this.props.history.location.state.organization}
        </h1>

        <div className="row mx-0 mb-48 pb-10">
          <Cards
            gradient="sa-users-gradient1"
            onClick={this.onCardClickFilter("totalUsers")}
            count={
              !isEmpty(singleOrganizationOverviewData) &&
              singleOrganizationOverviewData.total
            }
            desc="Total Users"
          />
          <Cards
            gradient="sa-users-gradient2"
            onClick={this.onCardClickFilter("activeUsers")}
            count={
              !isEmpty(singleOrganizationOverviewData) &&
              singleOrganizationOverviewData.active
            }
            desc="Active Users"
          />
          <Cards
            gradient="sa-users-gradient2"
            onClick={this.onCardClickFilter("inActiveUsers")}
            count={
              !isEmpty(singleOrganizationOverviewData) &&
              singleOrganizationOverviewData.inactive
            }
            desc="Inactive Users"
          />
        </div>
      </>
    );
  };

  /*
   * renderList
   */
  renderList = () => {
    const { workspaceInfo } = this.state;
    // Search

    let filtereddata = [];
    if (this.state.search) {
      let search = new RegExp(this.state.search, "i");
      filtereddata = workspaceInfo.filter(getall => {
        if (search.test(getall.name)) {
          return getall;
        }
        if (search.test(getall.email)) {
          return getall;
        }
        if (search.test(getall.jobTitle)) {
          return getall;
        }
      });
      console.log(filtereddata);
    } else {
      filtereddata = workspaceInfo;
    }

    console.log(workspaceInfo);
    let dataToken = JSON.parse(localStorage.getItem("Data"));
    return (
      <>
        <h1 className="font-24-semibold mb-48">All Users</h1>
        <SearchBlock
          name="search"
          className="sa-users-search"
          searchVal={this.state.search}
          handleChange={this.onSearchChange}
          handleSubmit={this.handleSubmit}
        />
        <div className="row mx-0">
          <div className="sa-workspaces__list">
            <div className="sa-workspaces__list-heading">
              <div className="sa-workspaces__list-heading-block">User Name</div>
              <div className="sa-workspaces__list-heading-block">
                Joining Date
              </div>
              <div className="sa-workspaces__list-heading-block">
                User Email
              </div>
              <div className="sa-workspaces__list-heading-block">
                Last logged on
              </div>
            </div>

            <div className="sa-workspaces__list-content-container">
              <Fragment>
                {!isEmpty(workspaceInfo) ? (
                  filtereddata.map((workspace, index) => {
                    return (
                      index >=
                        (this.state.currentPagination - 1) *
                          totalRecordsInOnePage &&
                      index <
                        this.state.currentPagination *
                          totalRecordsInOnePage && (
                        <div
                          key={index}
                          className="sa-workspaces__list-content"
                        >
                          <div className="sa-workspaces__list-content-block row mx-0 align-items-center">
                            <img
                              src={`${workspace.profileImage}&token=${dataToken.token}`}
                              alt="person"
                              className="sa-workspaces__table-person-img"
                            />
                            {workspace.name}
                          </div>
                          <div className="sa-workspaces__list-content-block">
                            {dateFns.format(
                              workspace.dateOfJoining,
                              "Do MMM YYYY"
                            )}
                          </div>
                          <div className="sa-workspaces__list-content-block">
                            {workspace.email}
                          </div>
                          <div className="sa-workspaces__list-content-block">
                            {dateFns.format(workspace.loggedOff, "Do MMM YYYY")}
                          </div>
                        </div>
                      )
                    );
                  })
                ) : (
                  <div className="empty-div">
                    <h3>No Users Found</h3>
                  </div>
                )}
              </Fragment>
            </div>
          </div>
          <div className="sa-pagination">
            <Pagination
              onChange={this.onChangePagination}
              current={this.state.currentPagination}
              defaultPageSize={totalRecordsInOnePage}
              total={this.state.getItemsList.length}
              showTitle={false}
            />
          </div>
        </div>
      </>
    );
  };

  render() {
    console.log(this.state.singleOrganizationOverviewData);
    return (
      <div>
        <SuperAdminNavbar />
        <div className="sa-workspaces">
          {this.renderOverview()}
          {this.renderList()}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  workspaceInfo: state.superAdmin.singleWorkspaceInfo,
  singleOrganizationOverviewData: state.superAdmin.singleOrganizationOverview
});

export default connect(mapStateToProps, {
  getOrganizationUsers,
  singleOrganizationOverview,
  filterSingleOrganizationByLevel
})(Users);
