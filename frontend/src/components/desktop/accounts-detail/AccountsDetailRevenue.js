import React, { useState, useEffect } from "react";
import AccountsDetailRevenueBarGraph from "./AccountsDetailRevenueBarGraph";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
import isEmpty from "../../../store/validations/is-empty";
import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import displaySmallText from "./../../../store/utils/sliceString";
import { useSelector } from "react-redux";

const statusLeadOption = ["Highest to Lowest", "Lowest to Highest"];

const dummyData = [1, 2, 3, 4, 5, 6, 7, 8];

function AccountsDetailRevenue() {
  const [values, setValues] = useState({
    statusLeadValue: statusLeadOption[0].value,
    statusLead: statusLeadOption[0],
    dealsWithRevenue: [],
    revenueOverview: [],
  });

  const dealsWithRevenue = useSelector(
    (state) => state.account.dealsWithRevenue
  );
  const revenueOverview = useSelector((state) => state.account.revenueOverview);

  useEffect(() => {
    if (!isEmpty(dealsWithRevenue)) {
      let HighestToLowest = [];
      if (dealsWithRevenue) {
        dealsWithRevenue.sort((a, b) => {
          return b.revenuefromdeal - a.revenuefromdeal;
        });

        HighestToLowest = dealsWithRevenue;
      }
      setValues({
        ...values,
        dealsWithRevenue: HighestToLowest,
      });
    } else {
      setValues({
        ...values,
        dealsWithRevenue: [],
      });
    }
  }, [dealsWithRevenue]);

  useEffect(() => {
    if (!isEmpty(revenueOverview)) {
      setValues({
        ...values,
        revenueOverview: revenueOverview,
      });
    }
  }, [revenueOverview]);

  const handleDropdownChange = (e) => {
    setValues({ ...values, statusLead: e, statusLeadValue: e.value });

    const { dealsWithRevenue } = values;

    if (e.value === "Lowest to Highest") {
      let LowestToHighest = [];
      if (dealsWithRevenue) {
        dealsWithRevenue.sort((a, b) => {
          return a.revenuefromdeal - b.revenuefromdeal;
        });

        LowestToHighest = dealsWithRevenue;
      }
    } else {
      let HighestToLowest = [];
      if (dealsWithRevenue) {
        dealsWithRevenue.sort((a, b) => {
          return b.revenuefromdeal - a.revenuefromdeal;
        });

        HighestToLowest = dealsWithRevenue;
      }
    }
  };

  const renderBlockLeftCard = () => {
    const { dealsWithRevenue } = values;
    console.log(dealsWithRevenue);

    if (!isEmpty(dealsWithRevenue)) {
      return (
        <div>
          <div className="accounts-revenue-card-block">
            <div className="row mx-0 align-items-center justify-content-between">
              <h2 className="accounts-revenue-card-title ml-30">
                Deals &amp; their revenue
              </h2>
              <Dropdown
                className="lead-status-dropDown font-18-semibold lead-status-dropDown--accounts-profile-display-fields-text-block-contactLeads"
                options={statusLeadOption}
                value={values.statusLead}
                onChange={(e) => handleDropdownChange(e)}
              />
            </div>
            <div className="accounts-revenue-table-title-container">
              <table className="table accounts-revenue-table-title mb-0">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>lead Name</th>
                    <th>representative</th>
                    <th>amount($)</th>
                  </tr>
                </thead>
              </table>
            </div>
            <div className="accounts-revenue-table-container">
              <table className="table">
                <tbody>
                  {!isEmpty(dealsWithRevenue) &&
                    dealsWithRevenue.map((deal, index) => (
                      <tr key={index}>
                        <td>
                          <div className="row mx-0 flex-nowrap">
                            <h5 className="table_icon">🌋</h5>
                            {displaySmallText(deal._id.dealname, 10, true)}
                          </div>
                        </td>
                        <td>
                          {!isEmpty(deal.leadData)
                            ? displaySmallText(deal.leadData[0].name, 10, true)
                            : ""}
                        </td>
                        <td>Jason Williams</td>
                        <td>{deal.revenuefromdeal}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div>
          <div
            className="accounts-revenue-card-block"
            style={{ height: "100%", textAlign: "center" }}
          >
            <div className="row mx-0 align-items-center justify-content-between">
              <h2 className="accounts-revenue-card-title ml-30">
                Deals &amp; their revenue
              </h2>
              <Dropdown
                className="lead-status-dropDown font-18-semibold lead-status-dropDown--accounts-profile-display-fields-text-block-contactLeads"
                options={statusLeadOption}
                value={values.statusLead}
                onChange={(e) => handleDropdownChange(e)}
              />
            </div>
            <div className="no_schedule_found">
              {/* <Loader type="Triangle" color="#502EFF" /> */}
              <img
                src="/img/desktop-dark-ui/illustrations/accounts-revenue-no-data.svg"
                alt=""
                className="accounts-revenue-no-data-img"
              />
              <p className="font-18-medium color-white-79 mb-21">
                No Revenue Recorded yet
              </p>
            </div>
          </div>
        </div>
      );
    }
  };

  return (
    <>
      <div className="row mx-0 flex-nowrap">
        {renderBlockLeftCard()}{" "}
        <div className="accounts-revenue-card-block accounts-revenue-card-block--graph">
          <h2 className="accounts-revenue-card-title mb-30">
            Revenue forecast
          </h2>
          <AccountsDetailRevenueBarGraph />
        </div>
      </div>
      <div className="row mx-0 flex-nowrap mt-20">
        <div className="accounts-revenue-count-card-block">
          <h3 className="accounts-revenue-count-card-block-title">
            {!isEmpty(values.revenueOverview) &&
              values.revenueOverview.revRecur}
          </h3>
          <p className="accounts-revenue-count-card-block-text">
            Total Revenue from reoccurring deals ($)
          </p>
        </div>
        <div className="accounts-revenue-count-card-block accounts-revenue-count-card-block--2">
          <h3 className="accounts-revenue-count-card-block-title">
            {!isEmpty(values.revenueOverview) &&
              values.revenueOverview.revThisMonth}
          </h3>
          <p className="accounts-revenue-count-card-block-text">
            Total Revenue this month ($)
          </p>
        </div>
        <div className="accounts-revenue-count-card-block accounts-revenue-count-card-block--3">
          <h3 className="accounts-revenue-count-card-block-title">
            {!isEmpty(values.revenueOverview) &&
              values.revenueOverview.revTillDate}
          </h3>
          <p className="accounts-revenue-count-card-block-text">
            Total Revenue till date ($)
          </p>
        </div>
      </div>
    </>
  );
}

export default AccountsDetailRevenue;
