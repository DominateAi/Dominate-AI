import React, { Fragment, useEffect } from "react";
import AccountsNewOverview from "./AccountsNewOverview";
import AccountsNewContent from "./AccountsNewContent";
import Navbar from "../header/Navbar";
import store from "./../../../store/store";
import { SET_PAGETITLE } from "./../../../store/types";
import { getAllAccounts } from "./../../../store/actions/accountsAction";
import OverviewDemoNewAccounts1 from "../overview-demo-new/OverviewDemoNewAccounts1";
import OverviewDemoNewAccounts2 from "../overview-demo-new/OverviewDemoNewAccounts2";
import OverviewDemoNewAccounts3 from "../overview-demo-new/OverviewDemoNewAccounts3";
import {
  searchAccount,
  getAccountOverview,
  getAccountAccumulatedRevenueChart,
  getAccountsWithTotalDealChart,
} from "./../../../store/actions/accountsAction";
import AccountsNewSearchBlock from "./AccountsNewSearchBlock";
// import { getAllCustomFieldsByEntity } from "./../../../store/actions/commandCenter";

import { useDispatch, useSelector } from "react-redux";
import BreadcrumbMenu from "../header/BreadcrumbMenu";

function AccountsNew() {
  const dispatch = useDispatch();

  const activeWalkthroughPage = useSelector(
    (state) => state.auth.activeWalkthroughPage
  );

  useEffect(() => {
    const formData = {
      // pageNo: 1,
      // pageSize: 3,
      query: {},
    };
    dispatch(searchAccount(formData));
    dispatch(getAccountOverview());
    //dispatch(getAllAccounts();
    dispatch(getAccountAccumulatedRevenueChart());
    dispatch(getAccountsWithTotalDealChart());
    // dispatch(getAllCustomFieldsByEntity("ACCOUNT"));
    store.dispatch({
      type: SET_PAGETITLE,
      // payload: "Accounts",
      payload: "Sales Centre",
    });
    localStorage.removeItem("defaultAccountTab");
  }, []);

  return (
    <Fragment>
      <Navbar />
      <BreadcrumbMenu
        menuObj={[
          {
            title: "Sales Centre",
            link: "/sales-centre#engage",
          },
          {
            title: "Accounts",
          },
        ]}
      />

      {activeWalkthroughPage === "accounts-1" && <OverviewDemoNewAccounts1 />}

      {activeWalkthroughPage === "accounts-2" && <OverviewDemoNewAccounts2 />}

      {activeWalkthroughPage === "accounts-3" && <OverviewDemoNewAccounts3 />}

      <div className="new-quotation-background">
        <AccountsNewOverview />
        <AccountsNewSearchBlock />
        <AccountsNewContent />
      </div>
    </Fragment>
  );
}

export default AccountsNew;
