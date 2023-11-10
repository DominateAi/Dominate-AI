import React from "react";
import Checkbox from "rc-checkbox";
import "rc-checkbox/assets/index.css";
import AddLeadsFormField from "./AddLeadsFormField";
import PropTypes from "prop-types";

const AddLeadFormMediaAccount = ({
  checkboxId,
  checkboxLabelName,
  handleCheckboxChange,
  inputId,
  inputPlaceholder,
  inputOnChange,
  inputValue,
  checkboxState,
  error
}) => {
  let placeholderCustom = checkboxLabelName.toString().toLowerCase();
  return (
    <>
      <div className="customCheckbox">
        <label htmlFor={checkboxId}>
          <Checkbox
            id={checkboxId}
            onChange={handleCheckboxChange}
            value={checkboxState}
            checked={checkboxState}
            //   defaultChecked={false}
          />
          <span className="font-21-regular pl-2">{checkboxLabelName}</span>
        </label>
      </div>
      <AddLeadsFormField
        checkboxClass="add-lead-input-field--checkbox-label-input"
        htmlFor={inputId}
        labelName={""}
        id={inputId}
        name={inputId}
        placeholder={
          checkboxLabelName === "Others"
            ? "any other url"
            : `https://www.${placeholderCustom}.com/`
        }
        onChange={inputOnChange}
        value={inputValue}
        error={error}
      />
    </>
  );
};

AddLeadFormMediaAccount.propTypes = {
  checkboxId: PropTypes.string,
  checkboxLabelName: PropTypes.string,
  handleCheckboxChange: PropTypes.func,
  inputId: PropTypes.string,
  inputPlaceholder: PropTypes.string,
  inputOnChange: PropTypes.func,
  inputValue: PropTypes.string,
  checkboxState: PropTypes.bool
};

export default AddLeadFormMediaAccount;
