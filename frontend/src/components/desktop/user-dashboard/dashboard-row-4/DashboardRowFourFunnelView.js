import React, { useState, useEffect } from "react";
import DashboardRowFourFunnelViewCard from "./DashboardRowFourFunnelViewCard";
import { connect } from "react-redux";
import isEmpty from "../../../../store/validations/is-empty";
import { useSelector } from "react-redux";

function DashboardRowFourFunnelView() {
  const [values, setValues] = useState({
    leadStatusCount: {},
    allLeadCount: 0,
  });

  const [loading, setLoader] = useState(true);

  const leadStatusCount = useSelector((state) => state.leads.leadStatusCount);
  const allLeadCount = useSelector((state) => state.leads.allLeadCount);
  const loader = useSelector((state) => state.auth.loader);

  useEffect(() => {
    if (!isEmpty(leadStatusCount)) {
      // console.log(leadStatusCount);
      setValues({
        ...values,
        leadStatusCount: leadStatusCount,
      });
    }
  }, [leadStatusCount]);

  useEffect(() => {
    if (!isEmpty(allLeadCount)) {
      // console.log(allLeadCount);
      setValues({
        ...values,
        allLeadCount: allLeadCount,
      });
    }
  }, [allLeadCount]);

  useEffect(() => {
    if (!isEmpty(loader)) {
      setLoader(loader);
    }
  }, [loader]);

  // render new lead percantage

  const renderNewLeadsPercantage = () => {
    const { leadStatusCount, allLeadCount } = values;
    let newLeadCount = leadStatusCount.NEW_LEAD;

    let newLeadPercent = 0;
    if (newLeadCount !== 0 && allLeadCount !== 0) {
      newLeadPercent = (newLeadCount / allLeadCount) * 100;
    } else {
      newLeadPercent = 0;
    }

    return newLeadPercent;
  };

  // render contacted lead percantage

  const renderContactedLeadsPercantage = () => {
    const { leadStatusCount, allLeadCount } = values;
    let contactedLeadCount = leadStatusCount.CONTACTED_LEADS;
    let contactedLeadPercent = 0;
    if (contactedLeadCount !== 0 && allLeadCount !== 0) {
      contactedLeadPercent = (contactedLeadCount / allLeadCount) * 100;
    } else {
      contactedLeadPercent = 0;
    }

    return contactedLeadPercent;
  };

  // render qualified lead percantage

  const renderQualifiedLeadsPercantage = () => {
    const { leadStatusCount, allLeadCount } = values;
    let qualifiedLeadCount = leadStatusCount.QUALIFIED_LEADS;

    let qualifiedLeadPercent = 0;
    if (qualifiedLeadCount !== 0 && allLeadCount !== 0) {
      qualifiedLeadPercent = (qualifiedLeadCount / allLeadCount) * 100;
    } else {
      qualifiedLeadPercent = 0;
    }

    return qualifiedLeadPercent;
  };

  // render On Hold lead percantage

  const renderOnHoldLeadsPercantage = () => {
    const { leadStatusCount, allLeadCount } = values;
    let opportunityLeadCount = leadStatusCount.ON_HOLD;
    let opportunityLeadPercent = 0;
    if (opportunityLeadCount !== 0) {
      opportunityLeadPercent = (opportunityLeadCount / allLeadCount) * 100;
    } else {
      opportunityLeadPercent = 0;
    }

    return opportunityLeadPercent;
  };

  // render opportunity lead percantage

  const renderOpportunityLeadsPercantage = () => {
    const { leadStatusCount, allLeadCount } = values;
    let opportunityLeadCount = leadStatusCount.OPPORTUNITIES;
    let opportunityLeadPercent = 0;
    if (opportunityLeadCount !== 0 && allLeadCount !== 0) {
      opportunityLeadPercent = (opportunityLeadCount / allLeadCount) * 100;
    } else {
      opportunityLeadPercent = 0;
    }

    return opportunityLeadPercent;
  };

  //render converted leads percantage

  const renderConvertedLeadsPercantage = () => {
    const { leadStatusCount, allLeadCount } = values;
    let convertedLeadCount = leadStatusCount.CONVERTED;

    let convertedLeadPercent = 0;
    if (convertedLeadCount !== 0 && allLeadCount !== 0) {
      convertedLeadPercent = (convertedLeadCount / allLeadCount) * 100;
    } else {
      convertedLeadPercent = 0;
    }

    return convertedLeadPercent;
  };

  if (loading === true || values.allLeadCount === 0) {
    return (
      <>
        {/*"Show illustartion"*/}
        <div className="text-center">
          <img
            // src={require("../../../../assets/img/illustrations/dashboard-leads-status.svg")}
            src="/img/desktop-dark-ui/illustrations/dashboard-lead-status-funnel-view.svg"
            alt="dashboard leads status no found"
            className="dashboard-leads-status-img"
          />
          <h5 className="reports-graph-not-found-text">There is no data</h5>
        </div>
      </>
    );
  } else {
    return (
      <div className="funnel-view-outer-div">
        {/* {console.log(this.state.allLeadCount)} */}
        <DashboardRowFourFunnelViewCard
          type="New"
          number={leadStatusCount.NEW_LEAD}
          colorLight="rgba(161, 142, 255, 1)"
          // "linear-gradient(232deg, rgba(244,59,71,0.7) 0%, rgba(69,58,148,0.7) 100%)"
          colorDark="rgba(161, 142, 255, 1)"
          // "linear-gradient(232deg, rgba(244,59,71,1) 0%, rgba(69,58,148,1) 100%)"
          percent={
            allLeadCount !== 0 ? `${renderNewLeadsPercantage()}%` : `${2}%`
          }
          blockNum="1"
        />

        <DashboardRowFourFunnelViewCard
          type="Contacted"
          number={leadStatusCount.CONTACTED_LEADS}
          colorLight="rgba(161, 142, 255, 0.74)"
          // "linear-gradient(230deg, rgba(230,160,233,0.7) 0%, rgba(69,104,220,0.7) 51%, rgba(234,175,200,0.7) 100%)"
          colorDark="rgba(161, 142, 255, 0.74)"
          // "linear-gradient(230deg, rgba(230,160,233,1) 0%, rgba(69,104,220,1) 51%, rgba(234,175,200,1) 100%)"
          percent={
            allLeadCount !== 0
              ? `${renderContactedLeadsPercantage()}%`
              : `${2}%`
          }
          blockNum="2"
        />

        <DashboardRowFourFunnelViewCard
          type="Qualified"
          number={leadStatusCount.QUALIFIED_LEADS}
          colorLight="rgba(161, 142, 255, 0.49)"
          // "linear-gradient(230deg, rgba(80,46,255,0.7) 0%, rgba(209,199,255,0.7) 100%)"
          colorDark="rgba(161, 142, 255, 0.49)"
          // "linear-gradient(230deg, rgba(80,46,255,1) 0%, rgba(209,199,255,1) 100%)"
          percent={
            allLeadCount !== 0
              ? `${renderQualifiedLeadsPercantage()}%`
              : `${2}%`
          }
          blockNum="3"
        />

        <DashboardRowFourFunnelViewCard
          type="On Hold"
          number={leadStatusCount.ON_HOLD}
          colorLight="rgba(161, 142, 255, 0.26)"
          // "linear-gradient(230deg, rgba(252,53,76,0.7) 0%, rgba(10,191,188,0.7) 100%)"
          colorDark="rgba(161, 142, 255, 0.26)"
          // "linear-gradient(230deg, rgba(252,53,76,1) 0%, rgba(10,191,188,1) 100%)"
          percent={
            allLeadCount !== 0 ? `${renderOnHoldLeadsPercantage()}%` : `${2}%`
          }
          blockNum="4"
        />

        <DashboardRowFourFunnelViewCard
          type="Opportunity"
          number={leadStatusCount.OPPORTUNITIES}
          colorLight="rgba(161, 142, 255, 0.18)"
          // "linear-gradient(230deg, rgba(250,148,114,0.7) 0%, rgba(251,99,148,0.7) 100%)"
          colorDark="rgba(161, 142, 255, 0.18)"
          // "linear-gradient(230deg, rgba(250,148,114,1) 0%, rgba(251,99,148,1) 100%)"
          percent={
            allLeadCount !== 0
              ? `${renderOpportunityLeadsPercantage()}%`
              : `${2}%`
          }
          blockNum="5"
        />

        <DashboardRowFourFunnelViewCard
          type="Converted"
          number={leadStatusCount.CONVERTED}
          colorLight="rgba(161, 142, 255, 0.08)"
          // "linear-gradient(230deg, rgba(255,153,102,0.7) 0%, rgba(255,94,98,0.7) 100%)"
          colorDark="rgba(161, 142, 255, 0.08)"
          // "linear-gradient(230deg, rgba(255,153,102,1) 0%, rgba(255,94,98,1) 100%)"
          percent={
            allLeadCount !== 0
              ? `${renderConvertedLeadsPercantage()}%`
              : `${2}%`
          }
          blockNum="6"
        />
      </div>
    );
  }
}

export default DashboardRowFourFunnelView;
