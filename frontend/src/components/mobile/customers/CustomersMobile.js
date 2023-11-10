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
import MobileNavbar from "../common/MobileNavbar";
import CustomersMobileCardDetails from "./CustomersMobileCardDetails";
// import CustomersOverview from "../../desktop/customers/CustomersOverview";
import FloatingButton from "../common/FloatingButton";
import CustomersMobileEditCustomers from "./CustomersMobileEditCustomers";
import LeadsMobileSearchBlock from "../leads/LeadsMobileSearchBlock";

const allCustomersOptions = [
  "All Customers",
  "Archive Customers",
  "Active Customers"
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
    <RCMenuItem key="edit">{/* <CustomersMobileEditCustomers /> */}</RCMenuItem>
  </Menu>
);

class CustomersMobile extends Component {
  constructor() {
    super();
    this.state = {
      searchText: "",
      status: false
    };
  }

  handleOnChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  handleClickSearchTextSubmit = e => {
    e.preventDefault();
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  // status toggler handler
  toggleFunction = e => {
    this.setState({
      [e.target.name]: e.target.checked
    });
    console.log(e.target.checked);
  };

  // render card
  renderCard = () => {
    return (
      <AccordionItem>
        <div className="dropdown-on-card">
          <DropdownIcon
            trigger={["click"]}
            overlay={menu}
            animation="none"
            onVisibleChange={onVisibleChange}
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
                  src={require("../../../assets/img/dashboard/person.png")}
                  alt="person"
                  className="resp-leads-content-img resp-mr-16"
                />
              </div>
              <div>
                <h1 className="resp-font-18-medium">Customer Name</h1>
                <h2 className="resp-font-12-italic color-gray-resp">
                  Email address
                </h2>
                <h3 className="resp-font-12-regular color-gray-resp">
                  Company Name
                </h3>
              </div>
            </div>
          </AccordionItemButton>
        </AccordionItemHeading>
        <AccordionItemPanel>
          <CustomersMobileCardDetails
            mobileNo="+91 8412XXXXXX"
            status={this.state.status}
            toggleFunction={this.toggleFunction}
          />
        </AccordionItemPanel>
      </AccordionItem>
    );
  };

  render() {
    return (
      <>
        <div>
          {/* <MobileNavbar textTitle="Customers" /> */}

          {/* CustomersOverview reused from desktop view */}
          {/* <CustomersOverview /> */}

          <LeadsMobileSearchBlock
            name="searchText"
            value={this.state.searchText}
            placeholder="search for customers name"
            handleClickSearchTextSubmit={this.handleClickSearchTextSubmit}
          />

          <div className="resp-dropdown-filter-block">
            <div>
              <Dropdown
                className="lead-status-dropDown lead-status-dropDown--importExport lead-status-dropDown--importExport--all-lead"
                options={allCustomersOptions}
                value={allCustomersOptions[0]}
                onChange={this.onAllLeadDropdownSelect}
              />
            </div>
          </div>

          <div className="block-16-18 mb-61 leads-overflow-block-resp">
            <Accordion
              className="leads-accordion leads-accordion--customers"
              allowZeroExpanded={true}
            >
              {this.renderCard()}
              {this.renderCard()}
              {this.renderCard()}
              {this.renderCard()}
            </Accordion>
          </div>
        </div>

        {/* floating button */}
        <FloatingButton isActiveVal={"customers"} />
      </>
    );
  }
}

export default CustomersMobile;
