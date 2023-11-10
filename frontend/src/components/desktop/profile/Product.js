import React from "react";
import getSymbolFromCurrency from "currency-symbol-map";
// import "./App.css";

const Product = ({ product, index, allUsersCount }) => {
  let organizationData = JSON.parse(localStorage.getItem("oraganiationData"));
  // console.log(allUsersCount);

  if (organizationData.planStatus === "PAID") {
    return (
      <div
        className={
          allUsersCount <= 5 && product.Name === "ASTRONAUT"
            ? "profile_product_card active_plan_card"
            : allUsersCount > 5 &&
              allUsersCount <= 10 &&
              product.Name === "ROVER"
            ? "profile_product_card active_plan_card"
            : allUsersCount > 10 &&
              allUsersCount <= 15 &&
              product.Name === "SPACESHIP"
            ? "profile_product_card active_plan_card"
            : allUsersCount > 15 && product.Name === "SPACESTATION"
            ? "profile_product_card active_plan_card"
            : "profile_product_card "
        }
      >
        <div className="profile_product_card_img_block">
          <img
            src={
              product.Name === "ASTRONAUT"
                ? "/img/desktop-dark-ui/plans/astronaut.png"
                : product.Name === "ROVER"
                ? "/img/desktop-dark-ui/plans/rover.png"
                : product.Name === "SPACESHIP"
                ? "/img/desktop-dark-ui/plans/spaceship.png"
                : product.Name === "SPACESTATION"
                ? "/img/desktop-dark-ui/plans/spacestation.png"
                : ""
            }
            alt={product.Name}
            className={
              product.Name === "ASTRONAUT"
                ? "profile_card_img1"
                : product.Name === "ROVER"
                ? "profile_card_img2"
                : product.Name === "SPACESHIP"
                ? "profile_card_img3"
                : product.Name === "SPACESTATION"
                ? "profile_card_img4"
                : ""
            }
          />
        </div>
        {/* justify-content-between row mx-0 align-items-start flex-nowrap */}
        <div className="profile_product_card_text-div ">
          <div className="row mx-0 align-items-center flex-nowrap justify-content-between">
            <p className="profile_product_card_name">{product.Name}</p>
            <p className="profile_product_card_price">
              {product.Price}{" "}
              {organizationData.currency === "inr"
                ? "Rs."
                : getSymbolFromCurrency(
                    organizationData.currency.toUpperCase()
                  )}
            </p>
          </div>{" "}
          <div className="row mx-0 align-items-center flex-nowrap justify-content-between">
            <p className="profile_product_card_tier">{product.Tier}</p>
            <p className="profile_product_card_per_user">Per user/Month</p>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="profile_product_card">
        <div className="profile_product_card_img_block">
          <img
            src={
              product.Name === "ASTRONAUT"
                ? "/img/desktop-dark-ui/plans/astronaut.png"
                : product.Name === "ROVER"
                ? "/img/desktop-dark-ui/plans/rover.png"
                : product.Name === "SPACESHIP"
                ? "/img/desktop-dark-ui/plans/spaceship.png"
                : product.Name === "SPACESTATION"
                ? "/img/desktop-dark-ui/plans/spacestation.png"
                : ""
            }
            alt={product.Name}
            className={
              product.Name === "ASTRONAUT"
                ? "profile_card_img1"
                : product.Name === "ROVER"
                ? "profile_card_img2"
                : product.Name === "SPACESHIP"
                ? "profile_card_img3"
                : product.Name === "SPACESTATION"
                ? "profile_card_img4"
                : ""
            }
          />
        </div>
        {/* justify-content-between row mx-0 align-items-start flex-nowrap */}
        <div className="profile_product_card_text-div ">
          <div className="row mx-0 align-items-center flex-nowrap justify-content-between">
            <p className="profile_product_card_name">{product.Name}</p>
            <p className="profile_product_card_price">
              {" "}
              {product.Price}{" "}
              {organizationData.currency === "inr"
                ? "Rs."
                : getSymbolFromCurrency(
                    organizationData.currency.toUpperCase()
                  )}
            </p>
          </div>{" "}
          <div className="row mx-0 align-items-center flex-nowrap justify-content-between">
            <p className="profile_product_card_tier">{product.Tier}</p>
            <p className="profile_product_card_per_user">Per user/Month</p>
          </div>
        </div>
      </div>
    );
  }
};

export default Product;
