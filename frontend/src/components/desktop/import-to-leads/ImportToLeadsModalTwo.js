import React, { Component } from "react";
import ImportToLeadsModalTwoCard from "./ImportToLeadsModalTwoCard";
import ImportToLeadsModelTwoCardEdit from "./ImportToLeadsModelTwoCardEdit";
import { connect } from "react-redux";
import isEmpty from "./../../../store/validations/is-empty";
import { SET_SELECTED_CONTACTS } from "./../../../store/types";
import store from "./../../../store/store";
const dummyData = [1, 2, 3, 4];

// const assignLeadOption = [
//   { value: "default account", label: "default account" },
//   { value: "account1", label: "account1" },
// ];
export class ImportToLeadsModalTwo extends Component {
  constructor() {
    super();
    this.state = {
      // assignLeadOption: assignLeadOption[0].value,
      accountOption: [],
      selectedAccount: {},
      hasset: false,
    };
  }

  static getDerivedStateFromProps(nextProps, nextState) {
    if (
      !isEmpty(nextProps.selectedContacts) &&
      nextProps.selectedContacts !== nextState.selectedContacts
    ) {
      let newArray = !isEmpty(nextProps.allAccounts)
        ? nextProps.allAccounts.map((account) => ({
            value: account._id,
            label: account.accountname,
          }))
        : [];

      newArray.push({ value: "123", label: "None" });

      return {
        selectedContacts: nextProps.selectedContacts,
        accountOption: newArray,
      };
    }

    return null;
  }

  handleDropdownChange = (e, leadData) => {
    this.setState({ selectedAccount: e, statusLeadValue: e.value });
    let tempData = this.state.selectedContacts;

    tempData.forEach((element) => {
      if (element === leadData) {
        element.selectedAccount = e;
      }
    });
    store.dispatch({
      type: SET_SELECTED_CONTACTS,
      payload: tempData,
    });
  };

  render() {
    const { selectedContacts } = this.state;

    let incompleteContacts = [];

    let completeContacts = [];

    if (!isEmpty(selectedContacts)) {
      selectedContacts.forEach((ele) => {
        if (isEmpty(ele.phone) || isEmpty(ele.email)) {
          incompleteContacts.push(ele);
        } else {
          completeContacts.push(ele);
        }
      });
    }
    console.log("complete contacts", completeContacts);
    console.log("complete contacts", incompleteContacts);

    return (
      <div className="import-to-leads-modal-two-div">
        <h4 className="import-to-leads-modal-title font-30-bold">
          Import Leads
        </h4>
        {/* Contact Selected */}
        <div>
          <h4 className="import-to-leads-modal-subtitle font-24-bold">
            contacts selected
          </h4>
          <div className="row mx-0 align-items-center pt-25">
            <div className="import-modal-two-img-modal">
              <img
                src={require("../../../assets/img/accounts/leads.svg")}
                alt="import to leads"
                className="import-modal-two-img"
              />
            </div>
            <h5 className="import-leads-modal-two-sub-text font-20-semibold">
              {!isEmpty(selectedContacts) && selectedContacts.length} Leads
            </h5>
            <div
              //style={{ display: "flex" }}
              className="mt-20 row mx-0 align-items-start import-leads-modal-two-card-outer-div"
            >
              {!isEmpty(completeContacts) &&
                completeContacts.map((data, index) => (
                  <div key={index}>
                    <div className="import-to-leads-modal-two-name-tag">
                      <span>{data.name}</span>
                    </div>
                    {/* <ImportToLeadsModalTwoCard
                      cardData={data}
                      assignLeadOption={this.state.accountOption}
                      assignLead={this.state.selectedAccount}
                      handleDropdownChange={this.handleDropdownChange}
                    /> */}
                  </div>
                ))}
            </div>
          </div>
        </div>
        {/* mandatory fields missing in */}
        {/* <div>
          <h4 className="import-to-leads-modal-subtitle font-24-bold">
            mandatory fields missing in
          </h4>
          <div className="row mx-0 align-items-center pt-25">
            <div className="import-modal-two-img-modal">
              <img
                src={require("../../../assets/img/accounts/leads.svg")}
                alt="import to leads"
                className="import-modal-two-img"
              />
            </div>
            <h5 className="import-leads-modal-two-sub-text font-20-semibold">
              12 Leads
            </h5>
            <div className="import-modal-two-modal-span-img-div">
              <img
                src={require("../../../assets/img/sales-contact/spam-icon.svg")}
                alt="import to leads spam"
                className="import-modal-two-img"
              />
            </div>
          </div>
        </div> */}
        {/* list of contact */}
        <div className="row mx-0 align-items-center justify-content-between pr-55">
          <h5 className="import-to-leads-modal-subtitle font-24-bold">
            {!isEmpty(incompleteContacts) &&
              "list of contacts with missing data"}

            {/* Select account and other info for selected contacts */}
          </h5>
          {/* <div className="row mx-0 align-items-center">
            <div className="import-modal-two-modal-direction-img-div">
              <img
                src={require("../../../assets/img/sales-contact/back-arrow.svg")}
                alt="import to leads backword arrow"
                className="import-modal-two-img"
              />
            </div>
            <div className="import-modal-two-modal-direction-img-div mr-0">
              <img
                src={require("../../../assets/img/sales-contact/forword-arrow.svg")}
                alt="import to  leads forword arrow"
                className="import-modal-two-img"
              />
            </div>
          </div> */}
        </div>
        {/* card */}
        {!isEmpty(incompleteContacts) ? (
          <div className="pt-20 import-leads-modal-two-card-outer-div import-leads-modal-two-card-outer-div--edit">
            {!isEmpty(incompleteContacts) &&
              incompleteContacts.map((data, index) => (
                <div key={index}>
                  <ImportToLeadsModelTwoCardEdit
                    cardData={data}
                    assignLeadOption={this.state.accountOption}
                    assignLead={this.state.selectedAccount}
                    handleDropdownChange={this.handleDropdownChange}
                  />
                </div>
              ))}
          </div>
        ) : (
          ""
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  selectedContacts: state.contact.selectedContacts,
  allAccounts: state.account.allAccounts,
});

export default connect(mapStateToProps, {})(ImportToLeadsModalTwo);
