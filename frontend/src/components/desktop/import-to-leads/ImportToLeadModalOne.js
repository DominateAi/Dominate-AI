import React, { Component } from "react";
import { connect } from "react-redux";
import isEmpty from "./../../../store/validations/is-empty";

export class ImportToLeadModalOne extends Component {
  constructor() {
    super();
    this.state = {};
  }

  static getDerivedStateFromProps(nextProps, nextState) {
    if (
      !isEmpty(nextProps.selectedContacts) &&
      nextProps.selectedContacts !== nextState.selectedContacts
    ) {
      return {
        selectedContacts: nextProps.selectedContacts,
      };
    }
    return null;
  }

  render() {
    const { selectedContacts } = this.state;
    return (
      <div className="import-to-leads-modal-div">
        <h4 className="import-to-leads-modal-title font-30-bold">
          Import to Leads
        </h4>
        <h4 className="import-to-leads-modal-subtitle font-24-bold">
          contacts selected
        </h4>
        <div className="row mx-0 pt-25 align-items-center">
          <div className="import-modal-one-img-div">
            <img
              src={require("../../../assets/img/accounts/leads.svg")}
              alt="import to leads"
              className="import-modal-one-img"
            />
          </div>
          <h5 className="import-leads-modal-one-29-semibold">
            {!isEmpty(selectedContacts) && selectedContacts.length} Leads
          </h5>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  selectedContacts: state.contact.selectedContacts,
});

export default connect(mapStateToProps, {})(ImportToLeadModalOne);
