import React, { Component, Fragment, useState, useEffect } from "react";
import Navbar from "./../header/Navbar";
import { connect } from "react-redux";

import isEmpty from "./../../../store/validations/is-empty";
import store from "./../../../store/store";
import { SET_KANBAN_VIEW, SET_PAGETITLE } from "./../../../store/types";
import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import LeadsNewTitleBlock from "./LeadsNewTitleBlock";
import OverviewDemoNewLeads1 from "../overview-demo-new/OverviewDemoNewLeads1";
import OverviewDemoNewLeads2 from "../overview-demo-new/OverviewDemoNewLeads2";
import OverviewDemoNewLeads3 from "../overview-demo-new/OverviewDemoNewLeads3";
import { getAllAccounts } from "./../../../store/actions/accountsAction";
import Confetti from "react-confetti";
// import { getAllCustomFieldsByEntity } from "./../../../store/actions/commandCenter";
import { singleLeadClosureProbablity } from "./../../../store/actions/leadAction";
import { getAllEmployeesWithAdmin } from "./../../../store/actions/employeeAction";
import { useSelector, useDispatch } from "react-redux";
import BreadcrumbMenu from "../header/BreadcrumbMenu";

function LeadsNew() {
  const dispatch = useDispatch();
  const [loading, setLoader] = useState(false);
  const [confetti, setconfettiAnimation] = useState(false);
  const [activeWalkthrough, setactiveWalkthroughPage] = useState(false);

  const confettiAnimation = useSelector(
    (state) => state.leads.confettiAnimation
  );
  const activeWalkthroughPage = useSelector(
    (state) => state.auth.activeWalkthroughPage
  );
  const loader = useSelector((state) => state.auth.loader);

  const demoAsyncCall = () => {
    return new Promise((resolve) => setTimeout(() => resolve(), 1000));
  };

  useEffect(() => {
    dispatch(getAllEmployeesWithAdmin());
    dispatch(getAllAccounts());
    // dispatch(getAllCustomFieldsByEntity("LEAD"));
    // dispatch(getAllCustomFieldsByEntity("ACCOUNT"));
    dispatch(singleLeadClosureProbablity());
    demoAsyncCall().then(() => setLoader({ loading: false }));
    store.dispatch({
      type: SET_PAGETITLE,
      // payload: "Leads",
      payload: "Sales Centre",
    });
  }, []);

  useEffect(() => {
    setconfettiAnimation(confettiAnimation);
  }, [confettiAnimation]);

  useEffect(() => {
    setactiveWalkthroughPage(activeWalkthroughPage);
  }, [activeWalkthroughPage]);
  useEffect(() => {
    setLoader(loader);
  }, [loader]);

  return (
    <Fragment>
      {confetti && (
        <div className="confetti_effect">
          <Confetti width={1500} height={1000} />
        </div>
      )}
      {loader && (
        <Loader
          type="Triangle"
          color="#502EFF"
          height={100}
          width={100}
          //  timeout={10000} //3 secs
          className="dominate-loader"
        />
      )}
      <Navbar />
      <BreadcrumbMenu
        menuObj={[
          {
            title: "Sales Centre",
            link: "/sales-centre#engage",
          },
          {
            title: "Leads Pipeline",
            link: "/leads-pipeline",
          },
          {
            title: "Leads",
          },
        ]}
      />

      {activeWalkthrough === "leads-1" && <OverviewDemoNewLeads1 />}

      {activeWalkthrough === "leads-2" && <OverviewDemoNewLeads2 />}

      {activeWalkthrough === "leads-3" && <OverviewDemoNewLeads3 />}

      <div className="leads-container px-0">
        <LeadsNewTitleBlock />
      </div>
    </Fragment>
  );
}

export default LeadsNew;
