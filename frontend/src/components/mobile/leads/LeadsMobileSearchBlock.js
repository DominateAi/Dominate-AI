import React from "react";

const LeadsMobileSearchBlock = ({
  name,
  value,
  placeholder,
  handleClickSearchTextSubmit
}) => {
  return (
    <>
      <div className="resp-search-input-block-outer">
        <div className="resp-search-input-block-border-right">
          <img
            className="resp-search-input-block-img"
            src={require("./../../../assets/img/icons/Dominate-Icon_mobile-search.svg")}
            alt="search"
            onClick={handleClickSearchTextSubmit}
          />
        </div>
        <input
          autoComplete="off"
          className="resp-search-input-block-input"
          type="text"
          name={name}
          value={value}
          placeholder={placeholder}
          onChange={handleClickSearchTextSubmit}
        />
      </div>
    </>
  );
};

export default LeadsMobileSearchBlock;
