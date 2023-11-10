import React, { Component } from "react";
import PropTypes from "prop-types";

class ActivitySummaryEmojiText extends Component {
  render() {
    const { emojiClassName, emoji, alt, text, link, rel } = this.props;
    return (
      <a
        className="contact-content-block mr-30"
        href={link}
        rel="noopener noreferrer"
        // rel={rel}
        target="_blank"
      >
        <div className="contact-content-block__imgDiv">
          <span className={emojiClassName} role="img" aria-labelledby={alt}>
            {emoji}
          </span>
        </div>
        <div>
          <span className="font-18-regular">{text}</span>
        </div>
      </a>
    );
  }
}

ActivitySummaryEmojiText.defaultProps = {
  rel: null
};

ActivitySummaryEmojiText.propTypes = {
  emojiClassName: PropTypes.string.isRequired,
  emoji: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  link: PropTypes.string.isRequired,
  rel: PropTypes.string
};

export default ActivitySummaryEmojiText;
