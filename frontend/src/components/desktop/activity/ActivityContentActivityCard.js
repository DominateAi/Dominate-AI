import React, { Component } from "react";
import PropTypes from "prop-types";
import Checkbox from "rc-checkbox";
import "rc-checkbox/assets/index.css";

class ActivityContentActivityCard extends Component {
  render() {
    const {
      //   checkboxId,
      //   handleCheckboxChange,
      emoji,
      emojiAlt,
      time
    } = this.props;
    return (
      <div className="ac-activity-card">
        <div className="d-flex align-items-center">
          {/* <div className="customCheckbox">
                        <Checkbox
                            id={checkboxId}
                            onChange={handleCheckboxChange}
                        />
                    </div> */}
          <span
            className="font-24-semibold ac-activity-emoji"
            role="img"
            aria-labelledby={emojiAlt}
          >
            {emoji}
          </span>
        </div>
        <div className="justify-content-space-between">
          {this.props.children}
          <div>
            <h6 className="font-20-regular">{time}</h6>
          </div>
        </div>
      </div>
    );
  }
}

ActivityContentActivityCard.propTypes = {
  emoji: PropTypes.string,
  emojiAlt: PropTypes.string,
  time: PropTypes.string
};

export default ActivityContentActivityCard;
