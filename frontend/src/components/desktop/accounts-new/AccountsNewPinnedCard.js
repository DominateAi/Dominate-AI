import React, { Component } from "react";
import AccountsNewDealsBar from "./AccountsNewDealsBar";

const dummyData = [1, 2, 3, 4];

export class AccountsNewPinnedCard extends Component {
  constructor() {
    super();
    this.state = {
      isEditClicked: false,
    };
  }

  /*==================================================================
        handlers
  ==================================================================*/

  handleOnClickEdit = () => {
    this.setState({
      isEditClicked: true,
    });
  };

  handleOnClickRemove = () => {
    this.setState({
      isEditClicked: false,
    });
  };

  /*==================================================================
        main
  ==================================================================*/
  render() {
    const { isEditClicked } = this.state;
    return (
      <div className="accounts-new-colm2-card accounts-new-colm2-card--pin">
        <div className="row mx-0 align-items-center justify-content-between accounts-new-colm2-card__title-row">
          <div className="row mx-0 align-items-center">
            <div className="accounts-new-revenue-card-icon-block">
              <img
                src={require("../../../assets/img/accounts-new/target-icon.svg")}
                alt=""
              />
            </div>
            {/*<h3 className="accounts-new-card-gray-text">Accounts pinned</h3>*/}
            <h3 className="accounts-new-card-gray-text">
              Accounts with total deals
            </h3>
          </div>
          {/*!isEditClicked && (
            <button
              className="accounts-new-pinned-card-edit-button"
              onClick={this.handleOnClickEdit}
            >
              <img
                src={require("../../../assets/img/accounts-new/edit-circle-icon.svg")}
                alt="edit"
              />
            </button>
          )*/}
        </div>
        {/* cards 
        <div className="row mx-0 align-items-start">
          {dummyData.map((data, index) => (
            <div
              key={index}
              className="accounts-new-colm2-card-pin-card row ml-0 align-items-center flex-nowrap"
            >
              {isEditClicked && (
                <button
                  className="accounts-new-colm2-card-pin-card__remove-icon-block"
                  onClick={this.handleOnClickRemove}
                >
                  <img
                    src={require("../../../assets/img/accounts-new/minus-circle-icon.svg")}
                    alt="minus"
                  />
                </button>
              )}
              <div className="accounts-new-colm2-card-pin-card__img-block">
                <img
                  src={require("../../../assets/img/accounts-new/account-profile.svg")}
                  alt="account"
                />
              </div>
              <p className="font-18-medium accounts-new-colm2-card-pin-card__text">
                Account Name
              </p>
            </div>
          ))}
        </div>*/}
        <AccountsNewDealsBar />
      </div>
    );
  }
}

export default AccountsNewPinnedCard;
