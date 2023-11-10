import React from "react";
import Select from "react-select";
import isEmpty from "../../../store/validations/is-empty";

function AddMemberSelectAndDisplayList({
  selectedOptionValue,
  handleChangeSelectClient,
  options,
  displayListSelected,
  handleRemoveMember,
  error,
  customText,
  customSelectedText,
}) {
  return (
    <div className="add-member-select-display-container">
      <div>
        <h3 className="font-24-semibold mb-20">
          {customText ? <>{customText}</> : "Select Account"}
        </h3>
        <Select
          className="react-select-container mb-20"
          classNamePrefix="react-select-elements"
          value={selectedOptionValue}
          onChange={handleChangeSelectClient}
          options={options}
          placeholder="Select"
          isSearchable={true}
        />
        {error ? (
          <p className="is-invalid add-member-select-display-container__error">
            {error}
          </p>
        ) : (
          <p className="is-invalid opacity-0">0</p>
        )}
      </div>
      {/* selected */}
      <div className="mb-40">
        <h3 className="font-24-semibold mb-20">
          {customSelectedText ? <>{customSelectedText}</> : "Selected Accounts"}
        </h3>
        <div className="row mx-0 flex-nowrap add-project-member-modal-list-overflow">
          {!isEmpty(displayListSelected) &&
            displayListSelected.map((data, index) => (
              <div
                key={index}
                className="create-project-add-member-img-text-block"
              >
                <div className="create-project-add-member-img-block">
                  <img
                    // src={require("./../../../assets/img/accounts/profile.svg")}
                    src="/img/desktop-dark-ui/icons/blue-cirlce-icon.png"
                    alt="member"
                    className="create-project-add-member-img-block__imgMember"
                  />
                  <i
                    className="fa fa-close create-project-add-member-img-block__remove"
                    onClick={handleRemoveMember(index)}
                  ></i>
                </div>
                <h4 className="create-project-add-member-img-block__text">
                  {data.label}
                </h4>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default AddMemberSelectAndDisplayList;
