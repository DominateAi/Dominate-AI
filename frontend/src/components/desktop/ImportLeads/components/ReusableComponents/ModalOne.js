import React from "react";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
import isEmpty from "../../../../../store/validations/is-empty";

const dateFormatOptions = ["MM/DD/YYYY", "DD/MM/YYYY", "YYYY/MM/DD"];

const phone_formatOptions = ["+91-98765xxxxx", "+91 98765xxxxx"];

const ModalOne = (props) => {
  return (
    <div className="modal_one_main_container">
      <div className="file_section">
        <FileUploadSection {...props} />
        <FileOptionsSection {...props} />
      </div>
      {/* <div className="button_models">
        <button className="button_css" onClick={props.changeModalIdHandler(2)}>
          Next
        </button>
      </div> */}
    </div>
  );
};

export default ModalOne;

const FileUploadSection = (props) => {
  return (
    <div className="import-leads-file-upload-section">
      {/*<p onClick={props.backHandler}>Back</p>*/}
      <div className="file_upload_section">
        <div
          className="import-leads-file-upload-section-prev-icon"
          onClick={props.backHandler}
        >
          <img
            src={require("./../../../../../assets/img/icons/dominate-white-prev-arrow.png")}
            alt="previous"
          />
        </div>
        <div className="file_image">
          <i className="fa fa-upload" aria-hidden="true"></i>
        </div>
        <div className="text_file text-center">
          {props.state.fileName
            ? props.state.fileName
            : "Choose arranged .csv file to upload"}
        </div>
        <div className="upload_button">
          <label className="btn-file button_css">
            {props.state.fileName ? "Change File" : "Upload File"}
            <input
              type="file"
              onChange={props.onFileUpload}
              style={{ display: "none" }}
            />
          </label>
        </div>
        <div className="file-upload-section__note">
          We will automaticatlly remove the duplicate entries with Primary field
          called "email"
        </div>
      </div>
    </div>
  );
};

const FileOptionsSection = (props) => {
  let displayOperationLabel =
    !isEmpty(props.state.operationOptions_ReactDropdown) &&
    !isEmpty(props.state.operation)
      ? props.state.operationOptions_ReactDropdown.filter(
          (a) => a.value === props.state.operation
        )
      : "";

  let displayAssignedToLabel =
    !isEmpty(props.state.assignedOptions_ReactDropdown) &&
    !isEmpty(props.state.assigned)
      ? props.state.assignedOptions_ReactDropdown.filter(
          (a) => a.value === props.state.assigned
        )
      : "";

  return (
    <></>
    // <div className="file_options_section">
    //   <div className="file_label">Select Date format used in file</div>

    //   <Dropdown
    //     className="lead-status-dropDown lead-status-dropDown--import-leads-modal-dropdown"
    //     options={dateFormatOptions}
    //     value={props.state.dateformat}
    //     onChange={props.onChangeHandlerSelectDateFormat}
    //   />
    //   <div className="file_label">Select Operation Type</div>

    //   <Dropdown
    //     className="lead-status-dropDown lead-status-dropDown--import-leads-modal-dropdown"
    //     options={props.state.operationOptions_ReactDropdown}
    //     value={
    //       isEmpty(displayOperationLabel)
    //         ? "Select"
    //         : displayOperationLabel[0].label
    //     }
    //     onChange={props.onChangeHandlerSelectOperation}
    //   />
    //   <div className="file_label">Select Phone Number format</div>
    //   <Dropdown
    //     className="lead-status-dropDown lead-status-dropDown--import-leads-modal-dropdown"
    //     options={phone_formatOptions}
    //     value={
    //       props.state.phone_format === "-"
    //         ? phone_formatOptions[0]
    //         : props.state.phone_format === "space" && phone_formatOptions[1]
    //     }
    //     onChange={props.onChangeHandlerSelectPhoneFormat}
    //   />
    //   <div className="file_label">Assigned to</div>
    //   <Dropdown
    //     className="lead-status-dropDown lead-status-dropDown--import-leads-modal-dropdown"
    //     options={props.state.assignedOptions_ReactDropdown}
    //     value={
    //       isEmpty(displayAssignedToLabel)
    //         ? "Select"
    //         : displayAssignedToLabel[0].label
    //     }
    //     onChange={props.onChangeHandlerSelectAssigned}
    //   />
    // </div>
  );
};
