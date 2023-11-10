import React, { Component } from "react";
import PropTypes from "prop-types";
const recentTagsList = ["Follow up", "Meeting", "High Priority"];

class AddLeadFormSelectFewTags extends Component {
  render() {
    const { id, name, onChange, onKeyDown, onClick, value, maxLength } =
      this.props;

    const tagsList = recentTagsList.map((list, index) => (
      <div className="representative-recent-img-text-block__block" key={index}>
        <button
          type="button"
          className="font-18-regular tag-border-block"
          onClick={onClick}
          value={list}
        >
          {list}
        </button>
      </div>
    ));

    return (
      <div>
        <div className="mb-30">
          <label htmlFor={id} className="add-lead-label font-24-semibold">
            Add a new tag
          </label>
          <br />
          <input
            type="text"
            id={id}
            name={name}
            className="add-lead-input-field font-18-regular"
            placeholder="Eg. Follow up, Meeting"
            onChange={onChange}
            onKeyDown={onKeyDown}
            value={value}
            autoFocus
            maxLength={maxLength}
          />
        </div>
        <div className="mb-10">
          <label
            htmlFor="leadSelectFewTags"
            className="add-lead-label font-24-semibold pt-10"
          >
            Recents{" "}
            <span className="font-15-regular">
              (use any of these existing tags)
            </span>
          </label>
          <br />

          <div className="representative-recent-img-text-block">{tagsList}</div>
        </div>
      </div>
    );
  }
}

AddLeadFormSelectFewTags.propTypes = {
  // id: PropTypes.string.isRequired,
  // name: PropTypes.string.isRequired,
  // value: PropTypes.array.isRequired,
  // onChange: PropTypes.func.isRequired,
  // onKeyDown: PropTypes.func.isRequired,
  // onClick: PropTypes.func.isRequired
};

export default AddLeadFormSelectFewTags;
