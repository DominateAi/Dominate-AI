import React from "react";
import AccumulatedRevenueBarChart from "./AccumulatedRevenueBarChart";
import dateFns from "date-fns";
import { Link } from "react-router-dom";
import DropdownIcon from "rc-dropdown";
import "rc-dropdown/assets/index.css";
import Menu, { Item as MenuItem, Divider } from "rc-menu";
import AccountEditModal from "../accounts/AccountEditModal";
import { deleteAccount } from "./../../../store/actions/accountsAction";
import AccountsDeletePopup from "./AccountsDeletePopup";
import { useDispatch } from "react-redux";
import displaySmallText from "./../../../store/utils/sliceString";

function AccountsNewCard({ cardData, extraClassName }) {
  const dispatch = useDispatch();

  /*==================================================
    handlers
  ===================================================*/

  const onVisibleChange = (visible) => {
    console.log(visible);
  };

  // const onSelect = () => {
  //   // const { cardData } = this.props;
  //   dispatch(deleteAccount(cardData._id));
  // };

  const menu = (
    <Menu>
      {/*<MenuItem onClick={() => this.onSelect("edit")}>Edit</MenuItem>*/}
      <MenuItem>
        <AccountEditModal
          cardData={cardData}
          title={"Edit Account"}
          buttonClassName="rc-button-edit-account"
        />
      </MenuItem>
      <Divider />
      {/*<MenuItem onClick={() => this.onSelect("delete")}>Delete</MenuItem>*/}
      <MenuItem>
        <AccountsDeletePopup cardData={cardData._id} />
      </MenuItem>
    </Menu>
  );

  return (
    <div className={`accounts-new-colm1-card ${extraClassName}`}>
      <div>
        <div className="row mx-0 flex-nowrap align-items-center justify-content-between accounts-new-colm1-card__row1">
          <div className="account-new-card-profile-img-block">
            <img
              src={require("../../../assets/img/accounts-new/account-profile.svg")}
              alt="account"
            />
          </div>
          <div className="accounts-new-acc-name-text-block">
            <h3 className="accounts-new-acc-name">
              {" "}
              {displaySmallText(cardData.accountname, 15, true)}
            </h3>
            <p className="accounts-new-card-gray-text">
              {cardData.leadsCount} Leads
            </p>
          </div>
          <p className="accounts-new-card-gray-text">
            Accumulated Revenue(USD)
          </p>
          <div className="account-new-card-graph-block">
            {/* <img
                src={require("../../../assets/img/accounts-new/graph-icon.svg")}
                alt="graph"
              /> */}
            <AccumulatedRevenueBarChart />
          </div>
          <p className="accounts-new-text-count">
            {cardData.accumulatedRevenue}
          </p>
          <p className="accounts-new-card-gray-text accounts-new-card-gray-text--project-revenue">
            <i className="fa fa-circle"></i>
            Projected Revenue(USD)
          </p>
          <p className="accounts-new-text-count">
            {cardData.projectedRevenue.toFixed()}
          </p>
          <DropdownIcon
            trigger={["click"]}
            overlay={menu}
            animation="none"
            onVisibleChange={onVisibleChange}
            overlayClassName="add-account-dropdown"
          >
            <img
              className="accounts-new-card-edit-card-img"
              src={require("./../../../assets/img/icons/edit-card-icon.svg")}
              alt=""
            />
          </DropdownIcon>
        </div>

        <div className="row mx-0 flex-nowrap align-items-center justify-content-between accounts-new-colm1-card__row2">
          <p className="accounts-new-card-gray-text">Owner</p>
          <div className="account-new-card-owner-profile-img-block">
            <img
              src={require("../../../assets/img/accounts-new/blue-circle-icon.svg")}
              alt=""
            />
          </div>
          <div className="accounts-new-colm1-card__row2__owner-name-block">
            <p className="accounts-new-card-gray-text">Owner Name</p>
          </div>

          <p className="accounts-new-card-gray-text">
            <i className="fa fa-circle"></i>
            Joined on{" "}
            <span className="accounts-new-card-gray-text--date">
              {dateFns.format(cardData.createdAt, "DD/MM/YYYY")}
            </span>
          </p>
          <p className="accounts-new-card-gray-text">
            <i className="fa fa-circle"></i>
            Deal Status
          </p>
          <p className="accounts-new-text-count accounts-new-text-count--blue">
            {cardData.closedDealsCount}
          </p>
          <p className="accounts-new-card-gray-text accounts-new-card-gray-text--closed">
            Closed
          </p>
          <p className="accounts-new-text-count accounts-new-text-count--yellow">
            {cardData.openDealsCount}
          </p>
          <p className="accounts-new-card-gray-text accounts-new-card-gray-text--closed">
            Open
          </p>
          <p className="accounts-new-card-gray-text">
            <i className="fa fa-circle"></i>Last Contacted
          </p>
          <p className="accounts-new-card-gray-text accounts-new-card-gray-text--date">
            {dateFns.format(cardData.updatedAt, "DD/MM/YYYY")}
          </p>
          <Link
            to={{
              pathname: "/accounts-detail-new",
              state: { detail: cardData },
            }}
          >
            <button className="account-card-button">View Details</button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default AccountsNewCard;
