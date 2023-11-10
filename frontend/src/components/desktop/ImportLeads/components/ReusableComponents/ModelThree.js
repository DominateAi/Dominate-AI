import React from "react";
import isEmpty from "../../../../../store/validations/is-empty";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";

const ModelThree = (props) => {
  const { existingLeads } = props.state;

  console.log(existingLeads);
  let displayOperationLabel =
    !isEmpty(props.state.operationOptions_ReactDropdown) &&
    !isEmpty(props.state.operation)
      ? props.state.operationOptions_ReactDropdown.filter(
          (a) => a.value === props.state.operation
        )
      : "";
  return (
    <div className="model_three_container">
      <div>
        <p>
          Folowing leads are already present in your account , please select
          opertaion which needs to perform on these leads
        </p>
        <div className="file_label">Select Operation Type</div>

        <Dropdown
          className="lead-status-dropDown lead-status-dropDown--import-leads-modal-dropdown"
          options={props.state.operationOptions_ReactDropdown}
          value={
            isEmpty(displayOperationLabel)
              ? "Select"
              : displayOperationLabel[0].label
          }
          onChange={props.onChangeHandlerSelectOperation}
        />
      </div>
      <div className="existing_leads_container">
        <table className="existing_leads_table table">
          <thead>
            <tr>
              <th scope="col">NO</th>
              <th scope="col">Lead name</th>
              <th scope="col">email address</th>
              <th scope="col">status</th>
            </tr>
          </thead>
          <tbody>
            {!isEmpty(existingLeads) &&
              existingLeads.map((lead, index) => {
                return (
                  <tr key={index}>
                    <th scope="row">{index + 1}</th>
                    <td>{lead.name}</td>
                    <td>{lead.email}</td>
                    <td>{lead.status}</td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>

      <button onClick={props.updateExistingLeads} className="button_css">
        Finish
      </button>
    </div>
  );
};

export default ModelThree;
