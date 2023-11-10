import React, { Component } from "react";
import Dropdown from "react-dropdown";
import DropdownIcon from "rc-dropdown";
import "react-dropdown/style.css";
import {
  Accordion,
  AccordionItem,
  AccordionItemButton,
  AccordionItemHeading,
  AccordionItemPanel,
} from "react-accessible-accordion";
import Menu, { Item as RCMenuItem, Divider } from "rc-menu";

import Pagination from "rc-pagination";
import "rc-pagination/assets/index.css";
import { connect } from "react-redux";
import {
  getAllLeads,
  getAllHiddenleads,
  getMyLeads,
} from "./../../../store/actions/leadAction";
import store from "./../../../store/store";
import { SET_FILTER_NAME } from "./../../../store/types";
import isEmpty from "./../../../store/validations/is-empty";

import MobileNavbar from "../common/MobileNavbar";
import LeadsMobileCard from "./LeadsMobileCard";
import LeadsMobileCardDetails from "./LeadsMobileCardDetails";
import LeadsMobileSearchBlock from "./LeadsMobileSearchBlock";
import FloatingButton from "../common/FloatingButton";
import LeadsMobileFilterBlock from "./LeadsMobileFilterBlock";
// import LeadsMobileEditLeads from "./LeadsMobileEditLeads";

const allLeadOptions = ["My Leads", "All Leads", "Hidden Leads"];
const emojiOptions = ["🌋", "☀️", "☕", "❄️️"];
let newList = null;

// dropdown
function onSelect({ key }) {
  console.log(`${key} selected`);
}

function onVisibleChange(visible) {
  console.log(visible);
}

const menu = (
  <Menu onSelect={onSelect}>
    <RCMenuItem key="addFollowUp">&#43; New Follow Up</RCMenuItem>
    <Divider />
    <RCMenuItem key="editLead">
      Edit Lead{/* <LeadsMobileEditLeads /> */}
    </RCMenuItem>
    <Divider />
    <RCMenuItem key="deleteLead">Delete Lead</RCMenuItem>
    <Divider />
    <RCMenuItem key="hideLead">Hide Lead</RCMenuItem>
  </Menu>
);

// search
let searchedList = [];
let isDataFound = false;
let isSearchClick = false;

// pagination
const totalRecordsInOnePage = 5;

class LeadsMobile extends Component {
  constructor() {
    super();
    this.state = {
      searchText: "",
      isFilterIconClick: false,
      allLeadDefaultOption: allLeadOptions[0],
      // api
      loginUserId: "",
      allLeads: [],
      // pagination
      currentPagination: 1,
    };
  }

  /*========================================
            Lifecycle Methods
  =========================================*/
  componentDidMount() {
    const { loginUserId } = this.state;
    // console.log(loginUserId);
    if (!isEmpty(loginUserId)) {
      store.dispatch({
        type: SET_FILTER_NAME,
        payload: this.state.allLeadDefaultOption,
      });
      const myLeadQuery = {
        // pageNo: 10,
        // pageSize: 0,
        query: {
          assigned: loginUserId,
        },
      };
      this.props.getMyLeads(myLeadQuery);
    }
  }

  static getDerivedStateFromProps(nextProps, nextState) {
    if (nextProps.allLeads !== nextState.allLeads) {
      return {
        allLeads: nextProps.allLeads,
      };
    }
    if (
      !isEmpty(nextProps.userId) &&
      nextProps.userId !== nextState.loginUserId
    ) {
      return {
        loginUserId: nextProps.userId,
      };
    }
    return null;
  }

  // handlers on main leads page
  handleOnChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  handleClickSearchTextSubmit = (e) => {
    e.preventDefault();
    this.setState({
      [e.target.name]: e.target.value,
    });

    isSearchClick = true;

    if (!isEmpty(this.state.allLeads)) {
      searchedList = this.state.allLeads.filter((data) =>
        data.name.toLowerCase().includes(e.target.value.toLowerCase())
      );

      if (!isEmpty(searchedList)) {
        isDataFound = true;
      } else {
        isDataFound = false;
      }
    }
  };

  handleFilterClick = () => {
    this.setState({
      isFilterIconClick: true,
    });
  };

  handleCloseFilterBlock = () => {
    this.setState({
      isFilterIconClick: false,
    });
  };

  // handlers on leads card page
  onAllLeadDropdownSelect = (e) => {
    // console.log("Selected: " + e.value);
    isSearchClick = false;
    this.setState({
      searchText: "",
    });
    store.dispatch({
      type: SET_FILTER_NAME,
      payload: e.value,
    });
    const { loginUserId } = this.state;
    if (e.value === "All Leads") {
      const allLeadQuery = {
        // pageNo: 10,
        // pageSize: 0,
        query: {},
      };
      this.props.getAllLeads(allLeadQuery);
    } else if (e.value === "Hidden Leads") {
      const hiddenLeadQuery = {
        // pageNo: 10,
        // pageSize: 0,
        query: {
          isHidden: true,
        },
      };
      this.props.getAllHiddenleads(hiddenLeadQuery);
    } else if (e.value === "Archive Leads") {
      const archiveLeads = {
        // pageNo: 10,
        // pageSize: 0,
        query: {
          status: "ARCHIVE",
        },
      };
      this.props.leadsFilterByStatus(archiveLeads);
    } else {
      const myLeadQuery = {
        // pageNo: 10,
        // pageSize: 0,
        query: {
          assigned: loginUserId,
        },
      };
      this.props.getMyLeads(myLeadQuery);
    }
    this.setState({
      allLeadDefaultOption: e.value,
    });
  };

  // handlers on leads card details page
  onEmojiDropdownSelect = (e) => {
    console.log(e.value);
  };

  handleOnclickEmail = () => {
    console.log("clicked on text email");
  };

  handleOnclickCall = () => {
    console.log("clicked on text call");
  };

  // pagination
  onChangePagination = (page) => {
    this.setState({
      currentPagination: page,
    });
  };

  // render card
  renderCard = () => {
    newList = isDataFound
      ? searchedList
      : !isDataFound && isSearchClick
      ? []
      : this.state.allLeads;

    return (
      <>
        {!isEmpty(newList) ? (
          newList.map(
            (data, index) =>
              index >=
                (this.state.currentPagination - 1) * totalRecordsInOnePage &&
              index < this.state.currentPagination * totalRecordsInOnePage && (
                <AccordionItem key={index}>
                  <div className="absolute-block-accordion-item">
                    <div>
                      <Dropdown
                        className="font-30-bold lead-status-dropDown lead-status-dropDown--emoji ml-0"
                        options={emojiOptions}
                        value={
                          data.degree === "SUPER_HOT"
                            ? emojiOptions[0]
                            : data.degree === "HOT"
                            ? emojiOptions[1]
                            : data.degree === "WARM"
                            ? emojiOptions[2]
                            : data.degree === "COLD"
                            ? emojiOptions[3]
                            : ""
                        }
                        onChange={this.onEmojiDropdownSelect}
                      />
                    </div>

                    <div>
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
                  </div>
                  <AccordionItemHeading>
                    <AccordionItemButton>
                      <LeadsMobileCard
                        name={data.name}
                        email={data.email}
                        status={
                          data.status === "NEW_LEAD"
                            ? "New Lead"
                            : data.status === "QUALIFIED_LEADS"
                            ? "Qualified Lead"
                            : data.status === "ON_HOLD"
                            ? "On Hold Lead"
                            : data.status === "CONTACTED_LEADS"
                            ? "Contacted Lead"
                            : data.status === "OPPORTUNITIES"
                            ? "Opportunity Lead"
                            : data.status === "CONVERTED"
                            ? "Converted Lead"
                            : ""
                        }
                      />
                    </AccordionItemButton>
                  </AccordionItemHeading>
                  <AccordionItemPanel>
                    <LeadsMobileCardDetails
                      data={data}
                      assignedTo={data.assigned.name}
                      companyName={data.company}
                      mobileNo={data.phone}
                      handleOnclickCall={this.handleOnclickCall}
                    />
                  </AccordionItemPanel>
                </AccordionItem>
              )
          )
        ) : (
          <>
            <div className="text-center">
              <h2 className="resp-font-12-medium color-gray-resp">
                No Leads Found
              </h2>
            </div>
          </>
        )}
      </>
    );
  };

  render() {
    return (
      <>
        <div>
          {/* <MobileNavbar textTitle="Leads" /> */}

          <LeadsMobileSearchBlock
            name="searchText"
            value={this.state.searchText}
            placeholder="search for leads name"
            handleClickSearchTextSubmit={this.handleClickSearchTextSubmit}
          />

          <div className="resp-dropdown-filter-block">
            <div>
              <Dropdown
                className="lead-status-dropDown lead-status-dropDown--importExport lead-status-dropDown--importExport--all-lead"
                options={allLeadOptions}
                value={this.state.allLeadDefaultOption}
                onChange={this.onAllLeadDropdownSelect}
              />
            </div>
            <div>
              <img
                className="resp-leads__search-icon"
                src={require("./../../../assets/img/icons/Dominate-Icon_mobile-filter-new.svg")}
                alt="filter"
                onClick={this.handleFilterClick}
              />
            </div>
          </div>

          <div className="block-16-18 mb-61 leads-overflow-block-resp">
            <Accordion className="leads-accordion" allowZeroExpanded={true}>
              {this.renderCard()}
            </Accordion>
          </div>
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
        </div>
        {/* floating button */}
        <FloatingButton isActiveVal={"leads"} />

        {/* filter block */}
        {this.state.isFilterIconClick && (
          <LeadsMobileFilterBlock
            className="active"
            handleCloseFilterBlock={this.handleCloseFilterBlock}
          />
        )}
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  allLeads: state.leads.allLeads,
  userId: state.auth.user.id,
});

export default connect(mapStateToProps, {
  getAllLeads,
  getAllHiddenleads,
  getMyLeads,
})(LeadsMobile);
