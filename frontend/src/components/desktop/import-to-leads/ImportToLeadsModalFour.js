import React, { Component } from "react";

export class ImportToLeadsModalFour extends Component {
  render() {
    return (
      <div className="import-to-leads-modal-div">
        <h4 className="import-to-leads-modal-title font-30-bold">
          Import Leads
        </h4>
        <div className="import-modal-four-img-div">
          <img
            src={require("../../../assets/img/sales-contact/check.svg")}
            alt="import leads checks"
            className="import-modal-four-img"
          />
        </div>
        <h5 className="font-16-semibold import-leads-modal-four-text">
          All contacts have been imported to leads <br /> successfully
        </h5>
      </div>
    );
  }
}

export default ImportToLeadsModalFour;
