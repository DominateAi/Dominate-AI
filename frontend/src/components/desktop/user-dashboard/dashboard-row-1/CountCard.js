import React from "react";

function CountCard({ className, count, name }) {
  return (
    <div className={className}>
      <span>{count}</span>
      <p>{name}</p>
    </div>
  );
}

export default CountCard;
