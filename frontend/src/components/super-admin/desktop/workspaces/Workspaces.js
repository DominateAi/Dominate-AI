import React, { Component } from "react";
import { Link } from "react-router-dom";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
import SuperAdminNavbar from "../header/SuperAdminNavbar";
import Cards from "../common/Cards";
import SearchBlock from "../common/SearchBlock";
import { connect } from "react-redux";
import {
  // getOrganizationById,
  refundSubscriptionAmount,
} from "./../../../../store/actions/superAdminActions";
import {
  getAllOraganizations,
  getOragnizationOverview,
  filterAllOrganizationByLevel,
  getManualRetryRequest,
  updateManualRetryRequest,
  getManualRetryCount,
} from "./../../../../store/actions/superAdminActions";
import isEmpty from "./../../../../store/validations/is-empty";
import dateFns from "date-fns";

import Pagination from "rc-pagination";
import "rc-pagination/assets/index.css";

// pagination
const totalRecordsInOnePage = 10;

// const tempRow = ["1", "2", "3"];

const allPlansType = [
  "All",
  "Astronaut",
  "Rover",
  "Spaceship",
  "Space Station",
  "Colony",
];

const manualRetryOption = ["success", "Failur"];

class Workspaces extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filterName: "totalOrganizations",
      search: "",
      // pagination
      currentPagination: 1,
      // api
      getItemsList: {},
      manualRetryCount: {},
    };
  }

  /*=====================================
      Component Lifecycle Methods
  ======================================*/
  componentDidMount() {
    this.props.getAllOraganizations("1", "10");
    this.props.getOragnizationOverview();
    this.props.getManualRetryCount();
    this.props.getOrganizationById(this.props.history.location.state.detail);
    // console.log(this.props.history.location.state);
  }

  static getDerivedStateFromProps(nextProps, nextState) {
    if (
      !isEmpty(nextProps.allOrganizations) &&
      nextProps.allOrganizations !== nextState.allOrganizations
    ) {
      return {
        allOrganizations: nextProps.allOrganizations,
        getItemsList: nextProps.allOrganizations,
      };
    }
    if (
      !isEmpty(nextProps.allOrganizationOverview) &&
      nextProps.allOrganizationOverview !== nextState.allOrganizationOverview
    ) {
      return {
        allOrganizationOverview: nextProps.allOrganizationOverview,
      };
    }
    if (
      !isEmpty(nextProps.manualRetryCount) &&
      nextProps.manualRetryCount !== nextState.manualRetryCount
    ) {
      return {
        manualRetryCount: nextProps.manualRetryCount,
      };
    }
    return null;
  }

  componentDidUpdate() {
    if (this.props.allOrganizations !== this.state.allOrganizations) {
      this.setState({
        allOrganizations: this.props.allOrganizations,
        getItemsList: this.props.allOrganizations,
      });
    }
  }

  callBackRefundSubscription = () => {
    console.log("refund success");
  };

  onClickApproveRefund = (organizationData) => (e) => {
    console.log(organizationData);
    const formData = {
      plan: organizationData.billingType,
      workspaceId: organizationData.workspaceId,
    };

    this.props.refundSubscriptionAmount(
      organizationData._id,
      this.callBackRefundSubscription,
      this.state.currentPagination,
      "10",
      formData
    );
  };

  /*==================================
              Pagination
  ===================================*/
  // pagination
  onChangePagination = (page) => {
    const { filterName } = this.state;
    this.setState({
      currentPagination: page,
    });

    if (filterName === "activeOrganizations") {
      const query = {
        pageNo: page,
        pageSize: 10,
        query: {
          status: "ACTIVE",
        },
      };
      this.props.filterAllOrganizationByLevel(query);
    } else if (filterName === "paidOrganizations") {
      const query = {
        pageNo: page,
        pageSize: 10,
        query: {
          subscriptionType: "PAID",
        },
      };
      this.props.filterAllOrganizationByLevel(query);
    } else if (filterName === "freeOrganizations") {
      const query = {
        pageNo: page,
        pageSize: 10,
        query: {
          subscriptionType: "FREE",
        },
      };
      this.props.filterAllOrganizationByLevel(query);
    } else if (filterName === "expiredOrganizations") {
      const query = {
        pageNo: page,
        pageSize: 10,
        query: {
          status: "EXPIRED",
        },
      };
      this.props.filterAllOrganizationByLevel(query);
    } else if (filterName === "totalOrganizations") {
      this.props.getAllOraganizations(`${page}`, "10");
    }
  };

  /*
   * handlers
   */
  onSearchChange = (e) => {
    this.setState({
      search: e.target.value,
    });
  };

  onSelectPlanType = (e) => {
    console.log("Selected: " + e.value);
    if (e.value === "Astronaut") {
      const query = {
        // pageNo: this.state.currentPagination,
        // pageSize: 10,
        query: {
          billingType: "ASTRONAUT",
        },
      };
      this.props.filterAllOrganizationByLevel(query);
    } else if (e.value === "Rover") {
      const query = {
        // pageNo: this.state.currentPagination,
        // pageSize: 10,
        query: {
          billingType: "ROVER",
        },
      };
      this.props.filterAllOrganizationByLevel(query);
    } else if (e.value === "Spaceship") {
      const query = {
        // pageNo: this.state.currentPagination,
        // pageSize: 10,
        query: {
          billingType: "SPACESHIP",
        },
      };
      this.props.filterAllOrganizationByLevel(query);
    } else if (e.value === "Space Station") {
      const query = {
        // pageNo: this.state.currentPagination,
        // pageSize: 10,
        query: {
          billingType: "SPACESTATION",
        },
      };
      this.props.filterAllOrganizationByLevel(query);
    } else if (e.value === "Colony") {
      const query = {
        // pageNo: this.state.currentPagination,
        // pageSize: 10,
        query: {
          billingType: "COLONY",
        },
      };
      this.props.filterAllOrganizationByLevel(query);
    } else {
      this.props.getAllOraganizations("1", "10");
    }
  };

  onSelectManualRetry = (e) => {
    console.log(e.value);
    if (e.value === "success") {
      const formData = {
        organisation_id: "a8a3e1e0-7328-11ea-8d09-c353dd118ed2",
        status: "SUCCESS",
      };
      this.props.updateManualRetryRequest(
        formData,
        "Manual Retry success",
        this.state.currentPagination,
        totalRecordsInOnePage
      );
    } else {
      const formData = {
        organisation_id: "a8a3e1e0-7328-11ea-8d09-c353dd118ed2",
        status: "FAIL",
      };
      this.props.updateManualRetryRequest(
        formData,
        "Manual Retry failed",
        this.state.currentPagination,
        totalRecordsInOnePage
      );
    }
  };

  handleSubmit = (e) => {
    e.preventDefault();
    console.log(this.state);
  };

  onCardClickFilter = (cardName) => (e) => {
    this.setState({
      filterName: cardName,
      currentPagination: 1,
    });
    if (cardName === "activeOrganizations") {
      const query = {
        pageNo: 1,
        pageSize: 10,
        query: {
          status: "ACTIVE",
        },
      };
      this.props.filterAllOrganizationByLevel(query);
    } else if (cardName === "paidOrganizations") {
      const query = {
        pageNo: 1,
        pageSize: 10,
        query: {
          subscriptionType: "PAID",
        },
      };
      this.props.filterAllOrganizationByLevel(query);
    } else if (cardName === "freeOrganizations") {
      const query = {
        pageNo: 1,
        pageSize: 10,
        query: {
          subscriptionType: "FREE",
        },
      };
      this.props.filterAllOrganizationByLevel(query);
    } else if (cardName === "expiredOrganizations") {
      const query = {
        pageNo: 1,
        pageSize: 10,
        query: {
          status: "EXPIRED",
        },
      };
      this.props.filterAllOrganizationByLevel(query);
    } else if (cardName === "pendingOrganizations") {
      const query = {
        pageNo: 1,
        pageSize: 10,
        query: {
          status: "EXPIRED",
          isRefundRequested: true,
        },
      };
      this.props.filterAllOrganizationByLevel(query);
    } else if (cardName === "menualRetryOrganisations") {
      this.props.getManualRetryRequest(1, 10);
    } else {
      this.props.getAllOraganizations("1", "10");
    }
  };

  /*
   * renderOverview
   */
  renderOverview = () => {
    const { allOrganizationOverview, manualRetryCount } = this.state;
    return (
      <>
        <h1 className="font-24-semibold mb-30">Overview</h1>
        <div className="row mx-0 mb-48 pb-10">
          <Cards
            onClick={this.onCardClickFilter("totalOrganizations")}
            gradient="sa-workspaces-gradient1"
            count={
              !isEmpty(allOrganizationOverview) && allOrganizationOverview.total
            }
            desc="Total Users"
          />
          <Cards
            onClick={this.onCardClickFilter("paidOrganizations")}
            gradient="sa-workspaces-gradient2"
            count={
              !isEmpty(allOrganizationOverview) && allOrganizationOverview.paid
            }
            desc="Paid Users"
          />
          <Cards
            onClick={this.onCardClickFilter("activeOrganizations")}
            gradient="sa-workspaces-gradient3"
            count={
              !isEmpty(allOrganizationOverview) &&
              allOrganizationOverview.active
            }
            desc="Active Users"
          />
          <Cards
            onClick={this.onCardClickFilter("expiredOrganizations")}
            gradient="sa-workspaces-gradient4"
            count={
              !isEmpty(allOrganizationOverview) &&
              allOrganizationOverview.expired
            }
            desc="Expired Users"
          />
          <Cards
            onClick={this.onCardClickFilter("freeOrganizations")}
            gradient="sa-workspaces-gradient5"
            count={
              !isEmpty(allOrganizationOverview) && allOrganizationOverview.free
            }
            desc="Free Users"
          />
          <Cards
            onClick={this.onCardClickFilter("pendingOrganizations")}
            gradient="sa-workspaces-gradient1"
            count={
              !isEmpty(allOrganizationOverview) &&
              allOrganizationOverview.pending
            }
            desc="Refund Requests"
          />
          <Cards
            onClick={this.onCardClickFilter("menualRetryOrganisations")}
            gradient="sa-workspaces-gradient1"
            count={!isEmpty(manualRetryCount) && manualRetryCount}
            desc="Manual Requests"
          />
        </div>
      </>
    );
  };

  /*
   * renderDropdown
   */
  renderDropdown = () => {
    return (
      <Dropdown
        className="sa-plans-dropDown"
        options={allPlansType}
        onChange={this.onSelectPlanType}
        placeholder="Plan Type"
      />
    );
  };

  /*
   * renderList
   */
  renderList = () => {
    const {
      allOrganizations,
      allOrganizationOverview,
      filterName,
    } = this.state;

    // Search

    let filtereddata = [];
    if (this.state.search) {
      let search = new RegExp(this.state.search, "i");
      filtereddata = allOrganizations.filter((getall) => {
        if (search.test(getall.organizationName)) {
          return getall;
        }
        // if (search.test(getall.address)) {
        //   return getall;
        // }
        // if (search.test(getall.count)) {
        //   return getall;
        // }
      });
      console.log(filtereddata);
    } else {
      filtereddata = allOrganizations;
    }

    if (filterName === "menualRetryOrganisations") {
      return (
        <>
          <h1 className="font-24-semibold mb-48">All Workspaces</h1>
          <SearchBlock
            name="search"
            className="sa-users-search"
            searchVal={this.state.search}
            handleChange={this.onSearchChange}
            handleSubmit={this.handleSubmit}
          />
          <div className="row mx-0">
            <div className="sa-users__list">
              <div className="sa-workspaces__list-heading">
                <div className="sa-workspaces__list-heading-block">
                  Workspace Name
                </div>
                {/* <div className="sa-workspaces__list-heading-block">Admin</div> */}
                <div className="sa-workspaces__list-heading-block">
                  Joining Date
                </div>
                <div className="sa-workspaces__list-heading-block text-center">
                  Email address
                </div>
                <div className="sa-workspaces__list-heading-block">
                  Subscription ID
                </div>
                <div className="sa-workspaces__list-heading-block">
                  Request Status
                </div>
              </div>

              <div className="sa-workspaces__list-content-container">
                {!isEmpty(filtereddata) ? (
                  filtereddata.map((organization, index) => (
                    <div className="sa-workspaces__list-content" key={index}>
                      <div
                        key={index}
                        className="sa-workspaces__list-content-block row mx-0 align-items-center"
                      >
                        <img
                          src={require("../../../../assets/img/leads/ben-1.png")}
                          alt="person"
                          className="sa-workspaces__table-person-img"
                        />
                        {organization.workspaceId}
                      </div>
                      {/* <div className="sa-workspaces__list-content-block">
                        John Dorian
                      </div> */}
                      <div className="sa-workspaces__list-content-block">
                        {dateFns.format(organization.createdAt, "Do MMM YYYY")}
                      </div>
                      <div className="sa-workspaces__list-content-block text-center">
                        {organization.defaultUserEmailId}
                      </div>
                      <div className="sa-workspaces__list-content-block">
                        {organization.billingId}
                      </div>
                      <div className="sa-workspaces__list-content-block">
                        {organization.billingInfo
                          .isOrganisationAtPendingState &&
                          organization.billingInfo.isManualRequestFailed ===
                            false && (
                            <Dropdown
                              className="sa-plans-dropDown"
                              options={manualRetryOption}
                              onChange={this.onSelectManualRetry}
                              placeholder="Pending"
                            />
                          )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="empty-div">
                    <h3>No Organizations Found</h3>
                  </div>
                )}
              </div>
            </div>
          </div>

          {!isEmpty(allOrganizationOverview) && (
            <div className="sa-pagination">
              <Pagination
                onChange={this.onChangePagination}
                current={this.state.currentPagination}
                defaultPageSize={totalRecordsInOnePage}
                total={
                  filterName === "totalOrganizations"
                    ? allOrganizationOverview.total
                    : filterName === "paidOrganizations"
                    ? allOrganizationOverview.paid
                    : filterName === "activeOrganizations"
                    ? allOrganizationOverview.active
                    : filterName === "expiredOrganizations"
                    ? allOrganizationOverview.expired
                    : filterName === "freeOrganizations"
                    ? allOrganizationOverview.free
                    : ""
                }
                showTitle={false}
              />
            </div>
          )}
        </>
      );
    } else {
      return (
        <>
          <h1 className="font-24-semibold mb-48">All Workspaces</h1>
          <SearchBlock
            name="search"
            className="sa-users-search"
            searchVal={this.state.search}
            handleChange={this.onSearchChange}
            handleSubmit={this.handleSubmit}
          />
          <div className="row mx-0">
            <div className="sa-users__list">
              <div className="sa-workspaces__list-heading">
                <div className="sa-workspaces__list-heading-block">
                  Workspace Name
                </div>
                {/* <div className="sa-workspaces__list-heading-block">Admin</div> */}
                <div className="sa-workspaces__list-heading-block">
                  Joining Date
                </div>
                <div className="sa-workspaces__list-heading-block text-center">
                  Total Users
                </div>
                <div className="sa-workspaces__list-heading-block">
                  {this.renderDropdown()}
                </div>
                <div className="sa-workspaces__list-heading-block">Status</div>
                <div className="sa-workspaces__list-heading-block">Actions</div>
              </div>

              <div className="sa-workspaces__list-content-container">
                {!isEmpty(filtereddata) ? (
                  filtereddata.map((organization, index) => (
                    <div className="sa-workspaces__list-content" key={index}>
                      <div
                        key={index}
                        className="sa-workspaces__list-content-block row mx-0 align-items-center"
                      >
                        <img
                          src={require("../../../../assets/img/leads/ben-1.png")}
                          alt="person"
                          className="sa-workspaces__table-person-img"
                        />
                        {organization.workspaceId}
                      </div>
                      {/* <div className="sa-workspaces__list-content-block">
                        John Dorian
                      </div> */}
                      <div className="sa-workspaces__list-content-block">
                        {dateFns.format(organization.createdAt, "Do MMM YYYY")}
                      </div>
                      <div className="sa-workspaces__list-content-block text-center">
                        {organization.userCount}
                      </div>
                      <div className="sa-workspaces__list-content-block">
                        {organization.billingType === "INTERNAL"
                          ? "Internal"
                          : organization.billingType}
                      </div>
                      <div className="sa-workspaces__list-content-block">
                        <span className="approve_and_delete_section">
                          <p className="status_text">
                            {organization.status === "ACTIVE"
                              ? "Active"
                              : organization.status === "ARCHIVE"
                              ? "Archive"
                              : organization.status === "INACTIVE"
                              ? "Inactive"
                              : organization.status === "EXPIRED"
                              ? "Expired"
                              : ""}
                          </p>
                          {/* <i class="fa fa-trash" aria-hidden="true"></i> */}
                          {/* <button className="approve_button">
                            <img
                              src={require("../../../../assets/img/superadmin/Icon-material-delete.svg")}
                              alt="approve"
                              className="approve_img"
                            />
                            Approve
                          </button> */}
                        </span>
                      </div>
                      <div className="sa-workspaces__list-content-block">
                        <Link
                          to={{
                            pathname: "/organization-workspace",
                            state: {
                              detail: organization._id,
                              organization: organization.organizationName,
                            },
                          }}
                          key={index}
                        >
                          <img
                            src={require("../../../../assets/img/superadmin/view-details.png")}
                            alt="view"
                            className="sa-workspaces__view-details-img"
                          />
                        </Link>
                        {organization.isRefundRequested === true && (
                          <button
                            onClick={this.onClickApproveRefund(organization)}
                            className="approve_button"
                          >
                            <img
                              src={require("../../../../assets/img/superadmin/approve.svg")}
                              alt="approve"
                              className="approve_img"
                            />
                            Approve
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="empty-div">
                    <h3>No Organizations Found</h3>
                  </div>
                )}
              </div>
            </div>
          </div>

          {!isEmpty(allOrganizationOverview) && (
            <div className="sa-pagination">
              <Pagination
                onChange={this.onChangePagination}
                current={this.state.currentPagination}
                defaultPageSize={totalRecordsInOnePage}
                total={
                  filterName === "totalOrganizations"
                    ? allOrganizationOverview.total
                    : filterName === "paidOrganizations"
                    ? allOrganizationOverview.paid
                    : filterName === "activeOrganizations"
                    ? allOrganizationOverview.active
                    : filterName === "expiredOrganizations"
                    ? allOrganizationOverview.expired
                    : filterName === "freeOrganizations"
                    ? allOrganizationOverview.free
                    : ""
                }
                showTitle={false}
              />
            </div>
          )}
        </>
      );
    }
  };

  render() {
    console.log(this.state.allOrganizations);
    console.log(this.state.filterName);
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

const mapStateToProps = (state) => ({
  allOrganizations: state.superAdmin.allOrganizations,
  allOrganizationOverview: state.superAdmin.allOrganizationOverview,
  manualRetryCount: state.superAdmin.manualRetryCount.count,
});

export default connect(mapStateToProps, {
  getAllOraganizations,
  getOragnizationOverview,
  filterAllOrganizationByLevel,
  refundSubscriptionAmount,
  getManualRetryRequest,
  updateManualRetryRequest,
  getManualRetryCount,
})(Workspaces);
