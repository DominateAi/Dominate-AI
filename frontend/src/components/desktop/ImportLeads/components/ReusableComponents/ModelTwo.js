import React from "react";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
import isEmpty from "../../../../../store/validations/is-empty";

const mappingDataOptions = [
  {
    type: "group",
    name: "Primary Fields",
    items: [
      { value: "name", tags: ["name"], label: "Name" },
      { value: "_id", tags: ["_id"], label: "leadId" },
      {
        value: "combineName",
        tags: ["FirstName", "Lastname", "name"],
        label: "Combine first name + last name",
      },
      {
        value: "company",
        tags: ["company", "company name"],
        label: "Company Name",
      },
      {
        value: "email",
        tags: ["email", "email address"],
        label: "Email Address",
      },
      {
        value: "phone",
        tags: ["phone", "phone number", "Mobile Number"],
        label: "Phone Number",
      },
    ],
  },
  {
    type: "group",
    name: "Shipping Address",
    items: [
      // {
      //   value: "shippingAddress.state",
      //   tags: ["State", "state"],
      //   label: "State",
      // },
      // { value: "shippingAddress.city", tags: ["Town", "City"], label: "City" },
      // { value: "shippingAddress.pincode", tags: ["Pincode"], label: "Pincode" },
      // {
      //   value: "shippingAddress.website",
      //   tags: ["website", "url"],
      //   label: "Website",
      // },
      {
        value: "phoneCode",
        tags: ["Country Code"],
        label: "Country Code",
      },
      // { value: "livingAddress", tags: ["Address"], label: "Address" },
    ],
  },
  {
    type: "group",
    name: "Other Information",
    items: [
      {
        value: "billingAddress",
        tags: ["Billing address"],
        label: "Billing Address",
      },
      { value: "worth", tags: ["worht amount"], label: "Worth Amount" },
      {
        value: "source",
        tags: ["Lead Sources", "source"],
        label: "Lead Source",
      },
      {
        value: "additionalInfo.additionalInfo",
        tags: ["Addition Info"],
        label: "Addition Information",
      },
    ],
  },
  {
    type: "group",
    name: "Media Source",
    items: [
      {
        value: "media.facebook",
        tags: ["Facebook"],
        label: "Facebook Address",
      },
      {
        value: "media.linkedIn",
        tags: ["LinkedIn"],
        label: "LinkedIn Address",
      },
      {
        value: "media.instagram",
        tags: ["Instagram"],
        label: "Instagram Address",
      },
      { value: "media.skype", tags: ["Skype"], label: "Skype Address" },
      { value: "media.other", tags: ["Other"], label: "Other urls" },
    ],
  },
];

// const mappingDataForBackendPrimary = [
//   { id: "name", tags: ["name"], label: "Name" },
//   {
//     id: "combineName",
//     tags: ["FirstName", "Lastname", "name"],
//     label: "Combine first name + last name",
//   },
//   { id: "company", tags: ["company", "company name"], label: "Company Name" },
//   { id: "email", tags: ["email", "email address"], label: "Email Address" },
//   {
//     id: "phone",
//     tags: ["phone", "phone number", "Mobile Number"],
//     label: "Phone Number",
//   },
// ];

// const mappingDataforShippingAddress = [
//   { id: "shippingAddress.state", tags: ["State", "state"], label: "State" },
//   { id: "shippingAddress.city", tags: ["Town", "City"], label: "City" },
//   { id: "shippingAddress.pincode", tags: ["Pincode"], label: "Pincode" },
//   { id: "shippingAddress.website", tags: ["website", "url"], label: "Website" },
//   {
//     id: "shippingAddress.countryCode",
//     tags: ["Country Code"],
//     label: "Country Code",
//   },
//   { id: "livingAddress", tags: ["Address"], label: "Address" },
// ];

// const mappingBillingAddress = [
//   { id: "billingAddress", tags: ["Billing address"], label: "Billing Address" },
//   { id: "worth", tags: ["worht amount"], label: "Worth Amount" },
//   { id: "source", tags: ["Lead Sources", "source"], label: "Lead Source" },
//   {
//     id: "additionalInfo.additionalInfo",
//     tags: ["Addition Info"],
//     label: "Addition Information",
//   },
// ];

// const mappingDataMedia = [
//   { id: "media.facebook", tags: ["Facebook"], label: "Facebook Address" },
//   { id: "media.linkedIn", tags: ["LinkedIn"], label: "LinkedIn Address" },
//   { id: "media.instagram", tags: ["Instagram"], label: "Instagram Address" },
//   { id: "media.skype", tags: ["Skype"], label: "Skype Address" },
//   { id: "media.other", tags: ["Other"], label: "Other urls" },
// ];

const ModelTwo = (props) => {
  let file_keys = props.importLeads.import_lead.file_keys;
  let display_warning = false;
  display_warning =
    Object.keys(props.state.mappingData).includes("name") &&
    // ||
    //   Object.keys(props.state.mappingData).includes("combineName")
    Object.keys(props.state.mappingData).includes("email") &&
    Object.keys(props.state.mappingData).includes("phone")
      ? false
      : true;
  return (
    <div className="modal_two_main_container">
      <div className="font-26-semibold message_display">
        Please select the titles to match the data
      </div>
      <div className="file_titile_headline">
        <div className="font-24-medium lead_file_keys">
          Title detected in file
        </div>
        <div className="font-24-medium lead_backend_keys">
          Dominate Lead titles
        </div>
      </div>
      <div className="field_mapping_container">
        {file_keys.map((key, index) => (
          <Dominate_leads key={index} data={key} {...props} />
        ))}
      </div>
      <div className="button_models_model_two">
        <div className="warning_sign">
          {display_warning ? (
            <span>Primary fields need to be selected</span>
          ) : null}
        </div>
        <button
          className="button_css button_css--modal-two"
          onClick={
            !display_warning
              ? props.changeModalIdHandler(3)
              : () => window.alert("Primary Field need to selected")
          }
        >
          Save and Preview
        </button>
      </div>
    </div>
  );
};

export default ModelTwo;

export const Dominate_leads = (props) => {
  let dropDownVal = !isEmpty(props.state.mappingDataOptions_ReactDropdown)
    ? props.state.mappingDataOptions_ReactDropdown.filter(
        (a) => a.key === props.data
      )
    : "";
  let mappingNewOption = [];
  let standeredFields = props.importLeads.import_lead.standered_fields;
  !isEmpty(standeredFields) &&
    standeredFields.forEach((element) => {
      mappingNewOption.push({ value: element, label: element });
    });
  return (
    <div className="dominate_leads">
      <div className="dominate_lead_left">
        <div className="lead_label">{props.data}</div>
      </div>
      <div className="dominate_lead_left">
        {/* {console.log(dropDownVal)} */}
        <Dropdown
          className="lead-status-dropDown lead-status-dropDown--import-leads-modal-dropdown"
          options={mappingNewOption}
          value={isEmpty(dropDownVal) ? "Select" : dropDownVal[0].label}
          onChange={props.mappingOnChangeHandler(props.data)}
        />

        {/* <div className="lead_label">
          <select
            className="lead_label_selection"
            onChange={props.mappingOnChangeHandler(props.data)}
          >
            <option value="">Select a key value</option>
            <optgroup label="Primary Fields">
              {mappingDataForBackendPrimary.map((option, index) => (
                <option key={index} value={option.id}>
                  {option.label}
                </option>
              ))}
            </optgroup>
            <optgroup label="Shipping Address">
              {mappingDataforShippingAddress.map((option, index) => (
                <option key={index} value={option.id}>
                  {option.label}
                </option>
              ))}
            </optgroup>
            <optgroup label="Other Information">
              {mappingBillingAddress.map((option, index) => (
                <option key={index} value={option.id}>
                  {option.label}
                </option>
              ))}
            </optgroup>
            <optgroup label="Media Source">
              {mappingDataMedia.map((option, index) => (
                <option key={index} value={option.id}>
                  {option.label}
                </option>
              ))}
            </optgroup>
          </select>
        </div>
       */}
      </div>
    </div>
  );
};
