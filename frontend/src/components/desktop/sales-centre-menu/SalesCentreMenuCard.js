import React from "react";
import { Link } from "react-router-dom";

export default function SalesCentreMenuCard({
  link,
  img,
  title,
  extraClassName,
}) {
  return (
    <Link
      to={link}
      className={`sales-centre-scrollspy__card-link ${extraClassName}`}
    >
      <div className="sales-centre-scrollspy__card">
        <div className="sales-centre-scrollspy__card-img-div">
          <img src={img} alt={title} />
        </div>
        {/* font-24-semibold */}
        <p className="font-20-medium sales-centre-scrollspy__card-text">
          {title}
        </p>
      </div>
    </Link>
  );
}
