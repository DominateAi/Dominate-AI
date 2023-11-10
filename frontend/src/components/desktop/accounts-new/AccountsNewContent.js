import React, { Fragment, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AccountsNewCard from "./AccountsNewCard";
import isEmpty from "../../../store/validations/is-empty";
import AccountsNewPinnedCard from "./AccountsNewPinnedCard";
import AccumulatedRevenueCardGraph from "./AccumulatedRevenueCardGraph";
import AddAccount from "../accounts/AddAccount";
import { useSelector } from "react-redux";
import Pagination from "rc-pagination";
import "rc-pagination/assets/index.css";

const dummyData = [1, 2, 3];

// pagination
const totalRecordsInOnePage = 10;

function AccountsNewContent() {
  const [values, setValues] = useState({
    allAccounts: [],
    // pagination
  });
  const [currentPagination, setCurrentPagination] = useState(1);

  const allAccounts = useSelector((state) => state.account.allAccounts);
  const searchInAllPage = useSelector((state) => state.search.searchInAllPage);
  const activeWalkthroughPage = useSelector(
    (state) => state.auth.activeWalkthroughPage
  );

  useEffect(() => {
    console.log("allAccounts", allAccounts);
    if (!isEmpty(allAccounts)) {
      setValues({
        allAccounts: allAccounts,
      });
    } else {
      setValues({
        allAccounts: [],
      });
    }
  }, [allAccounts]);

  // pagination

  const onChangePagination = (page) => {
    // setValues({
    //   ...values,
    //   currentPagination: page,
    // });
    setCurrentPagination(page);
    // if (!isEmpty(overviewFilterName)) {
    //   //call according to overviewfilter name reducer
    // } else {
    //   //call according to filter name reducer
    // }
  };

  // Search
  let filtereddata = [];
  if (!isEmpty(searchInAllPage)) {
    let search = new RegExp(searchInAllPage, "i");
    filtereddata = allAccounts.filter((getall) => {
      if (search.test(getall.accountname)) {
        return getall;
      }
      // if (search.test(getall.company)) {
      //   return getall;
      // }
      // if (search.test(getall.email)) {
      //   return getall;
      // }
    });
    // console.log(filtereddata);
  } else {
    filtereddata = allAccounts;
  }

  return (
    <>
      <div className="account-new-cards-container">
        <div className="row flex-nowrap mx-0 align-items-start">
          <div className="accounts-new-colm1">
            {!isEmpty(filtereddata) ? (
              filtereddata.map((data, index) => {
                return (
                  index >= (currentPagination - 1) * totalRecordsInOnePage &&
                  index < currentPagination * totalRecordsInOnePage && (
                    <Fragment key={index}>
                      {/* <Link
                      to={{
                        pathname: "/accounts-detail-new",
                        state: { detail: data },
                      }}
                    > */}
                      <AccountsNewCard
                        cardData={data}
                        extraClassName={
                          activeWalkthroughPage === "accounts-2" && index === 0
                            ? "new-walkthrough-accounts-card-active"
                            : ""
                        }
                      />
                      {/* </Link> */}
                    </Fragment>
                  )
                );
              })
            ) : (
              <div className="no-account-found-div">
                <img
                  // src={require("../../../../src/assets/img/accounts-new/no_account.png")}
                  src="/img/desktop-dark-ui/illustrations/accounts-list-no-data.svg"
                  alt="account not found"
                />
                <p className="font-18-medium color-white-79 mb-21">
                  No Accounts Yet
                </p>
                <AddAccount isMobile={false} />
              </div>
            )}
            <div className="add-lead-pagination">
              <Pagination
                onChange={onChangePagination}
                current={currentPagination}
                defaultPageSize={totalRecordsInOnePage}
                total={values.allAccounts.length}
                showTitle={false}
              />
            </div>
          </div>

          <div>
            <div className="accounts-new-colm2-card">
              <div className="row mx-0 align-items-center accounts-new-colm2-card__title-row">
                <div className="accounts-new-revenue-card-icon-block">
                  <img
                    src={require("../../../assets/img/accounts-new/revenue-icon.svg")}
                    alt=""
                  />
                </div>
                <h3 className="accounts-new-card-gray-text">
                  Accumulated Revenue
                </h3>
              </div>
              <div className="accounts-new-colm2-card-graph-div">
                <AccumulatedRevenueCardGraph />
              </div>
            </div>
            <AccountsNewPinnedCard />
          </div>
        </div>
      </div>
    </>
  );
}

export default AccountsNewContent;
