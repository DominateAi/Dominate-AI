import React, { Fragment, useState, useEffect } from "react";
import AccountsDetailAllDealsCard from "./AccountsDetailAllDealsCard";
import isEmpty from "../../../store/validations/is-empty";
import { useSelector, useDispatch } from "react-redux";

const allLeadOptions = ["All Deals", "Reccurring", "One Time"];

function AccountDetailsDeals() {
  const dispatch = useDispatch();
  const [values, setValues] = useState({
    allLeadDefaultOption: allLeadOptions[0],
    dealsOfAccount: [],
  });

  const dealsOfAccount = useSelector((state) => state.account.dealsOfAccount);

  useEffect(() => {
    if (!isEmpty(dealsOfAccount)) {
      setValues({
        ...values,
        dealsOfAccount: dealsOfAccount,
      });
    } else {
      setValues({
        ...values,
        dealsOfAccount: [],
      });
    }
  }, [dealsOfAccount]);

  /*==========================================================
            handlers
     ==========================================================*/

  const onAllLeadDropdownSelect = (data) => (e) => {
    e.preventDefault();
    console.log(data);

    if (data === "Reccurring") {
      let recuuringDeals = !isEmpty(dealsOfAccount)
        ? dealsOfAccount.filter((deal) => deal.type === "RECURRING")
        : [];

      setValues({
        ...values,
        dealsOfAccount: recuuringDeals,
        allLeadDefaultOption: data,
      });
    } else if (data === "One Time") {
      let oneTimeDeals = !isEmpty(dealsOfAccount)
        ? dealsOfAccount.filter((deal) => deal.type === "ONETIME")
        : [];

      setValues({
        ...values,
        dealsOfAccount: oneTimeDeals,
        allLeadDefaultOption: data,
      });
    } else {
      setValues({
        ...values,
        dealsOfAccount: dealsOfAccount,
        allLeadDefaultOption: data,
      });
    }
  };

  return (
    <>
      <div className="leads-new-filter-button-block pl-0 pb-16">
        {allLeadOptions.map((data, index) => (
          <button
            key={index}
            onClick={onAllLeadDropdownSelect(data)}
            className={
              allLeadOptions[index] === values.allLeadDefaultOption
                ? "leads-new-filter-button leads-new-filter-button--active"
                : "leads-new-filter-button"
            }
          >
            {data}
          </button>
        ))}
      </div>
      {!isEmpty(values.dealsOfAccount) ? (
        <>
          <div className="row mx-0 align-items-center flex-nowrap accounts-details-all-deals-card-title-div">
            <h3 className="font-14-semibold accounts-details-all-deals-card-title-1">
              name
            </h3>
            <h3 className="font-14-semibold accounts-details-all-deals-card-title-2">
              lead
            </h3>
            <h3 className="font-14-semibold accounts-details-all-deals-card-title-3">
              sales person
            </h3>
            <h3 className="font-14-semibold accounts-details-all-deals-card-title-4">
              sales person
            </h3>
            <h3 className="font-14-semibold accounts-details-all-deals-card-title-5">
              worth amount
            </h3>
          </div>

          {values.dealsOfAccount.map((data, index) => (
            <Fragment key={index}>
              <AccountsDetailAllDealsCard
                dealData={data}
                allLeadDefaultOption={values.allLeadDefaultOption}
              />
            </Fragment>
          ))}
        </>
      ) : (
        <div className="text-center no-leads-found-div">
          <img
            src="/img/desktop-dark-ui/illustrations/accounts-deals-no-data.svg"
            alt="No Deals yet"
            className="account-details-leads-tabpanel-no-deals-img"
          />
          <p className="font-18-medium color-white-79 mb-30 text-center">
            No Deals yet
          </p>
        </div>
      )}
    </>
  );
}

export default AccountDetailsDeals;
