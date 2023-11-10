import React, { useState, useEffect } from "react";
import LeadsFunnelViewCard from "./LeadsFunnelViewCard";
import isEmpty from "./../../../store/validations/is-empty";
import { useSelector } from "react-redux";

function LeadsFunnelView() {
  const [values, setValues] = useState({
    leadStatusCount: {},
    allLeadCount: {},
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

  // console.log(allLeadCount, leadStatusCount);

  if (loading === true || values.allLeadCount === 0) {
    return (
      <div
        style={{ justifyContent: "center" }}
        className="funnel-view-outer-div"
      >
        <div className="text-center">
          <img
            // src={require("../../../assets/img/illustrations/dashboard-leads-status.svg")}
            src="/img/desktop-dark-ui/illustrations/dashboard-lead-status-funnel-view.svg"
            alt="dashboard leads status no found"
            className="dashboard-leads-status-img"
          />
          <h5 className="reports-graph-not-found-text">There is no data</h5>
        </div>
      </div>
    );
  } else {
    return (
      <div className="funnel-view-outer-div">
        <LeadsFunnelViewCard
          type="New Leads"
          number={values.leadStatusCount.NEW_LEAD}
          colorLight="rgba(161, 142, 255, 1)"
          // "#B3C9FE"
          colorDark="rgba(161, 142, 255, 1)"
          // "#3F77FF"
          percent={
            allLeadCount !== 0 ? `${renderNewLeadsPercantage()}%` : `${2}%`
          }
          blockNum="1"
        />

        <LeadsFunnelViewCard
          type="Contacted Leads"
          number={values.leadStatusCount.CONTACTED_LEADS}
          colorLight="rgba(161, 142, 255, 0.74)"
          // "#EBC1FE"
          colorDark="rgba(161, 142, 255, 0.74)"
          // "#CA53FF"
          percent={
            allLeadCount !== 0
              ? `${renderContactedLeadsPercantage()}%`
              : `${2}%`
          }
          blockNum="2"
        />

        <LeadsFunnelViewCard
          type="Qualified Leads"
          number={values.leadStatusCount.QUALIFIED_LEADS}
          colorLight="rgba(161, 142, 255, 0.49)"
          // "#FAE7B0"
          colorDark="rgba(161, 142, 255, 0.49)"
          // "#FFD65E"
          percent={
            allLeadCount !== 0
              ? `${renderQualifiedLeadsPercantage()}%`
              : `${2}%`
          }
          blockNum="3"
        />

        <LeadsFunnelViewCard
          type="On Hold Leads"
          number={values.leadStatusCount.ON_HOLD}
          colorLight="rgba(161, 142, 255, 0.26)"
          // "#FFFFA7"
          colorDark="rgba(161, 142, 255, 0.26)"
          // "#FFFF51"
          percent={
            allLeadCount !== 0 ? `${renderOnHoldLeadsPercantage()}%` : `${2}%`
          }
          blockNum="4"
        />

        <LeadsFunnelViewCard
          type="Opportunity"
          number={values.leadStatusCount.OPPORTUNITIES}
          colorLight="rgba(161, 142, 255, 0.18)"
          // "#A8FFA5"
          colorDark="rgba(161, 142, 255, 0.18)"
          // "#3FFF39"
          percent={
            allLeadCount !== 0
              ? `${renderOpportunityLeadsPercantage()}%`
              : `${2}%`
          }
          blockNum="5"
        />

        <LeadsFunnelViewCard
          type="Converted"
          number={values.leadStatusCount.CONVERTED}
          colorLight="rgba(161, 142, 255, 0.08)"
          // "#FFAEAE"
          colorDark="rgba(161, 142, 255, 0.08)"
          // "#FF5D5D"
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

export default LeadsFunnelView;
