import React from "react";
import PropTypes from "prop-types";

const CustomEditDropdown = ({
  id,
  name,
  value,
  readOnly,
  onInputChangeHandler,
  dropDownToggler,
  dropDown,
  suggestionList,
  dropDownSelect,
  placeholder,
  error
}) => {
  return (
    <>
      {console.log(readOnly)}
      <div className="main-dropdown-class" id={id}>
        <span onClick={dropDownToggler}>
          <i className="fa fa-angle-down" aria-hidden="true"></i>
        </span>
        {readOnly ? (
          <input
            type="text"
            className="dropdown-input-class cursor-pointer"
            placeholder={placeholder}
            onClick={dropDownToggler}
            name={name}
            value={value}
            onChange={onInputChangeHandler}
            autoComplete="off"
            readOnly
          />
        ) : (
          <input
            type="text"
            className="dropdown-input-class"
            placeholder={placeholder}
            onFocus={dropDownToggler}
            name={name}
            value={value}
            onChange={onInputChangeHandler}
            autoComplete="off"
          />
        )}
        <div className="dropdown-list">
          {dropDown ? (
            <ul className="dropdown-ul">
              {suggestionList.map((element, index) => (
                <li
                  key={index}
                  className={
                    element === value ? "dropdown-li_selected" : "dropdown-li"
                  }
                >
                  {console.log(index)}
                  <button
                    id={`dropdown-ul_${index}`}
                    onClick={dropDownSelect(element)}
                  >
                    {element}
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
      {error && (
        <div className="is-invalid add-lead-form-field-errors ml-4">
          {error}
        </div>
      )}
    </>
  );
};

CustomEditDropdown.defaultProps = {
  readOnly: false
};

CustomEditDropdown.propTypes = {
  readOnly: PropTypes.bool
};

export default CustomEditDropdown;
