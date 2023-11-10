import React from "react";

function Cards({ gradient, count, desc, onClick }) {
  return (
    <div onClick={onClick} className={`sa-workspaces__card ${gradient}`}>
      <h2 className="sa-workspaces__card-count">{count}</h2>
      <p className="sa-workspaces__card-desc">{desc}</p>
    </div>
  );
}

export default Cards;
