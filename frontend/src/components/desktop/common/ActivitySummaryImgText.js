import React, { Component } from 'react';
import PropTypes from 'prop-types';

class ActivitySummaryImgText extends Component {
    render() {
        const { imgClassName, imgPath, alt, text, link, rel } = this.props;
        return (
            <a className="contact-content-block"
                href={link}
                // rel={rel}
                rel="noopener noreferrer"
                target="_blank">
                <div className="contact-content-block__imgDiv" >
                    <img src={imgPath}
                        alt={alt}
                        className={imgClassName} />
                </div>
                <div>
                    <span className="font-18-regular">
                        {text}
                    </span>
                </div>
            </a>
        )
    }
};

ActivitySummaryImgText.defaultProps = {
    rel: null,
};


ActivitySummaryImgText.propTypes = {
    imgClassName: PropTypes.string.isRequired,
    imgPath: PropTypes.string.isRequired,
    alt: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    link: PropTypes.string.isRequired,
    rel: PropTypes.string,
}

export default ActivitySummaryImgText;
