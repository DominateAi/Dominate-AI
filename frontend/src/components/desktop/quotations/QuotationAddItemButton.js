import React, { useState } from "react";
import AddProductAndServices from "../products-and-services/AddProductAndServices";

export default function QuotationAddItemButton() {
  const [isTrue, setIsTrue] = useState(false);

  const toggle = () => {
    setIsTrue(!isTrue);
  };

  return (
    <>
      <div className="quotation-add-product-services-div">
        <div className="quotation-add-product-services-btn" onClick={toggle}>
          <i className="fa fa-chevron-down"></i>
        </div>
        {isTrue ? (
          <div className="row mx-0 justify-content-between flex-nowrap align-items-end quotation-add-product-services-btn-div">
            <AddProductAndServices
              title={"Add Product"}
              isProduct={true}
              fromQuotation={true}
              fromQuotationClass={"quotation-add-product-btn"}
            />
            <AddProductAndServices
              title={"Add Service"}
              isAll={false}
              fromQuotation={true}
              fromQuotationClass={"quotation-add-product-btn"}
            />
          </div>
        ) : (
          ""
        )}
      </div>
    </>
  );
}
