import React from "react";

export default function CommandCentreImgTextBorder({
  isDisplayImage,
  imgPath,
  title,
}) {
  return (
    <div className="cmd-centre-overview__title--org mb-30">
      {isDisplayImage && (
        <img src={imgPath} alt="" className="cmd-centre-headings-circle-img" />
      )}
      <h3 className="cmd-centre-overview__title mb-0">{title}</h3>
      <span className="cmd-centre-overview__title__border"></span>
    </div>
  );
}

CommandCentreImgTextBorder.defaultProps = {
  imgPath: "/img/desktop-dark-ui/icons/white-person-star.svg",
  isDisplayImage: true,
};
