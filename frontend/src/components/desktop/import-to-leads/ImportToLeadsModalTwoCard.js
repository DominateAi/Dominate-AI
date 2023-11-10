import React, { Component } from "react";
import check from "../../../assets/img/sales-contact/check.svg";
import save from "../../../assets/img/sales-contact/save.svg";
import isEmpty from "./../../../store/validations/is-empty";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";

const imagesPath = {
  save: save,
  check: check,
};

export class ImportToLeadsModalTwoCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      change: true,
    };
  }

  static getDerivedStateFromProps(nextProps, nextState) {
    if (
      !isEmpty(nextProps.cardData) &&
      nextProps.cardData !== nextState.cardData
    ) {
      return {
        cardData: nextProps.cardData,
      };
    }
    return null;
  }

  changeImage = () => {
    this.setState((state) => ({ change: !state.change }));
    console.log(this.state);
  };

  getImageName = () => (this.state.change ? "save" : "check");

  handleDropdownChange = (e) => {
    this.setState({ assignLead: e, statusLeadValue: e.value });
    console.log(`Option selected:`, e);
  };

  render() {
    const { cardData } = this.state;
    const imageName = this.getImageName();
    return (
      <div className="import-to-lead-modal-two-card-div">
        <h5 className="font-20-semibold import-to-lead-modal-lead-name">
          {cardData.name}
        </h5>

        <div className="row mx-0 import-to-leads-modal-two-card-row flex-nowrap align-items-end ">
          <div className="import-to-leads-modal-two-card-colm">
            <h5 className="import-to-leads-modal-two-card-subtitle">
              phone number
            </h5>
            <div className="import-to-leads-modal-two-card-text-div">
              <h5 className="font-16-semibold">
                {cardData.additionalInfo.phoneCode + cardData.phone}
              </h5>
            </div>
          </div>
          {/* <div className="import-to-leads-modal-two-card-colm">
            <h5 className="import-to-leads-modal-two-card-subtitle">
              account name
            </h5>
         
            <h3 className="font-16-semibold">
              <Dropdown
                className="lead-status-dropDown lead-status-dropDown--import-to-leads "
                options={this.props.assignLeadOption}
                value={cardData.selectedAccount}
                onChange={(e) => this.props.handleDropdownChange(e, cardData)}
              />
            </h3>
           
          </div> */}
          <div className="import-to-leads-modal-two-card-colm">
            <h5 className="import-to-leads-modal-two-card-subtitle">
              email address
            </h5>
            <div className="import-to-leads-modal-two-card-text-div">
              <h5 className="font-16-semibold">{cardData.email}</h5>
            </div>
          </div>
          <div className="import-to-leads-modal-two-card-save-div">
            {/* <img
              className="import-to-leads-modal-two-card-save-img"
              src={imagesPath[imageName]}
              alt={this.imageName}
              onClick={this.changeImage}
            /> */}
          </div>
        </div>
      </div>
    );
  }
}

export default ImportToLeadsModalTwoCard;
