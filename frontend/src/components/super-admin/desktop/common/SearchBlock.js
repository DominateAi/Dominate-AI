import React from "react";

function SearchBlock({
  name,
  className,
  searchVal,
  handleChange,
  handleSubmit
}) {
  return (
    <form onSubmit={handleSubmit}>
      <div className={className}>
        <i
          className="fa fa-search sa-users-search__fa"
          onClick={handleSubmit}
        ></i>
        <input
          name={name}
          className="sa-users-search__input"
          value={searchVal}
          onChange={handleChange}
          placeholder="search for anything"
        />
      </div>
    </form>
  );
}

export default SearchBlock;
