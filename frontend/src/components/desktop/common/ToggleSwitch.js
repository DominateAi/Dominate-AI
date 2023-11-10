import React from "react";

const ToggleSwitch = ({
  name,
  toggleclass,
  type,
  toggleinputclass,
  spantext1,
  spantext2,
  currentState,
  onChange,
  defaultChecked
}) => {
  return (
    <React.Fragment>
      <div className={toggleclass}>
        <span className="resp-font-12-regular">
          {currentState ? <b>{spantext1}</b> : spantext1}
        </span>

        <div className="toggle-chk-circle">
          <input
            type={type}
            name={name}
            // className={`${toggleinputclass}`}
            onChange={onChange}
            defaultChecked={defaultChecked}
          />
          <span className={toggleinputclass}></span>
        </div>
        <span className="resp-font-12-regular">
          {currentState ? spantext2 : <b>{spantext2}</b>}
        </span>
      </div>
    </React.Fragment>
  );
};

export default ToggleSwitch;
