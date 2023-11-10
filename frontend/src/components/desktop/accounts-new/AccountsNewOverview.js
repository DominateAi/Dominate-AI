import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import AddAccount from "../accounts/AddAccount";

import SingleOverviewBlock from "./../../desktop/common/SingleOverviewBlock";
import isEmpty from "../../../store/validations/is-empty";
import AccountsNewSearchBlock from "./AccountsNewSearchBlock";
import { useSelector } from "react-redux";

function AccountsNewOverview() {
  const [values, setValues] = useState({
    windowWidth: window.innerWidth,
    accountOverview: [],
  });

  const accountOverview = useSelector((state) => state.account.accountOverview);
  const activeWalkthroughPage = useSelector(
    (state) => state.auth.activeWalkthroughPage
  );

  useEffect(() => {
    window.addEventListener("resize", handleWindowResize);

    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, []);

  useEffect(() => {
    if (!isEmpty(accountOverview)) {
      setValues({
        ...values,
        accountOverview: accountOverview,
      });
    }
  }, [accountOverview]);

  const handleWindowResize = () => {
    setValues({
      windowWidth: window.innerWidth,
    });
  };

  /*========================================================
        handlers        
  ========================================================*/

  const onClickAccountOverviewFilter = (level) => {
    console.log(level);
  };

  // settings for slider
  let settings = {
    dots: false,
    multiple: true,
    infinite: true,
    speed: 500,
    draggable: false,
    slidesToShow: 2,
    slidesToScroll: 2,
    className: "widgetListSlider",
  };

  const block1 = (
    <SingleOverviewBlock
      onClick={() => onClickAccountOverviewFilter("Accounts")}
      count={
        !isEmpty(values.accountOverview) && values.accountOverview.totalAccounts
      }
      status={"Total Accounts"}
      blockClassName={"leads-gradient-block bg-color-account-new1"}
    />
  );

  const block2 = (
    <SingleOverviewBlock
      onClick={() => onClickAccountOverviewFilter("Accounts")}
      count={
        !isEmpty(values.accountOverview) && values.accountOverview.accWithDeals
      }
      status={"Accounts with deals associated"}
      blockClassName={"leads-gradient-block bg-color-account-new2"}
    />
  );

  const block3 = (
    <SingleOverviewBlock
      onClick={() => onClickAccountOverviewFilter("Accounts")}
      count={
        !isEmpty(values.accountOverview) &&
        values.accountOverview.accWithRecurDeals
      }
      status={"Accounts with reoccurring deals"}
      blockClassName={"leads-gradient-block bg-color-account-new3"}
    />
  );

  const block4 = (
    <SingleOverviewBlock
      onClick={() => onClickAccountOverviewFilter("Accounts")}
      count={
        !isEmpty(values.accountOverview) &&
        `${values.accountOverview.revTillDate}`
      }
      status={"Total revenue till date($)"}
      blockClassName={"leads-gradient-block bg-color-account-new4"}
    />
  );

  const block5 = (
    <SingleOverviewBlock
      onClick={() => onClickAccountOverviewFilter("Accounts")}
      count={
        !isEmpty(values.accountOverview) &&
        `${values.accountOverview.monRevRecurDeals}`
      }
      status={"Reoccurring monthly revenue($)"}
      blockClassName={"leads-gradient-block bg-color-account-new5"}
    />
  );

  const block6 = (
    <SingleOverviewBlock
      onClick={() => onClickAccountOverviewFilter("Accounts")}
      count={
        !isEmpty(values.accountOverview) &&
        `${values.accountOverview.dealHighRev}`
      }
      status={"Deal with highest revenue"}
      blockClassName={"leads-gradient-block bg-color-account-new6"}
    />
  );

  return (
    <>
      {values.windowWidth >= 768 && (
        <div className="quotation-new-container">
          <div className="row mx-0 align-items-center justify-content-between">
            <div className="row mx-0 align-items-center">
              <button
                className="go-back-yellow-arrow-new-leads"
                onClick={(e) => (
                  (window.location.href = "/sales-centre#track"),
                  e.preventDefault()
                )}
              >
                <img
                  src="/img/desktop-dark-ui/icons/white-back-arrow-circle.svg"
                  alt="prev arrow"
                />
              </button>

              <h2 className="page-title-new pl-0">Accounts</h2>
            </div>
            <div
              className={
                activeWalkthroughPage === "accounts-1" &&
                "new-walkthrough-accounts-add-btn-active"
              }
            >
              <AddAccount isMobile={false} />
            </div>
          </div>
          <hr className="page-title-border-bottom page-title-border-bottom--account" />
          {/* <AccountsNewSearchBlock /> */}

          <div className="gradient-block-container gradient-block-container--accounts-new">
            {block1}
            {block2}
            {block3}
            {block4}
            {block5}
            {block6}
          </div>
        </div>
      )}

      {values.windowWidth <= 767 && (
        <div className="leads-mobile-overview-block">
          <Slider {...settings}>
            {block1}
            {block2}
            {block3}
            {block4}
            {block5}
            {block6}
          </Slider>
        </div>
      )}
    </>
  );
}

export default AccountsNewOverview;
