import React from "react";
import isEmpty from "../../../store/validations/is-empty";
import dateFns from "date-fns";
import { withRouter, useHistory } from "react-router-dom";
import { useSelector } from "react-redux";

function AccountsDetailAllDealsCard({ dealData }) {
  const history = useHistory();

  const singleAccountData = useSelector(
    (state) => state.account.singleAccountData
  );

  const viewHandler = () => {
    // const { dealData, singleAccountData } = this.props;
    history.push({
      pathname:
        dealData.status === "CLOSED"
          ? "/closed-deals-details"
          : "/deals-details",
      state: {
        dealData: dealData,
        prevUrl: "/accounts-detail-new",
        accountData: singleAccountData,
      },
    });
  };

  const editHandler = () => {
    // const { dealData, singleAccountData } = this.props;
    history.push({
      pathname:
        dealData.status === "CLOSED"
          ? "/closed-deals-details"
          : "/deals-details",
      state: {
        dealData: dealData,
        isEditLink: true,
        prevUrl: "/accounts-detail-new",
        accountData: singleAccountData,
      },
    });
  };
  return (
    <div className="accounts-details-all-deals-card">
      <div className="row mx-0 align-items-center flex-nowrap">
        <div className="accounts-details-all-deals-card-details-div row mx-0 align-items-center flex-nowrap">
          <div className="accounts-details-all-deals-card-profileImg-div">
            <img
              src={require("../../../assets/img/accounts/deal-dot.svg")}
              alt="deal"
              className="accounts-details-all-deals-card-profileImg"
            />
          </div>
          <h2 className="accounts-details-all-deals-card-title font-18-semibold">
            {dealData.dealname}
          </h2>
        </div>
        {/* <div className="mx-0 accounts-details-all-deals-card-details-div-middle">
            <div className="row mx-0 justify-content-start accounts-details-all-deals-card-details-div-middle-left">
              <div className="row mx-0  accounts-details-all-deals-card-details-div-middle-colm-1">
                {dealData.status === "CLOSED" && (
                  <>
                    {" "}
                    <h3 className="font-18-bold accounts-details-all-deals-card-subtitle">
                      Closed on
                    </h3>
                    <h3 className="font-18-semibold accounts-details-all-deals-card-subtitle-data">
                      {dateFns.format(dealData.closingDate, "DD/MM/YYYY")}
                    </h3>
                  </>
                )}
              </div>
              <div className="row mx-0  accounts-details-all-deals-card-details-div-middle-colm-2">
                {dealData.type === "RECURRING" && (
                  <>
                    {" "}
                    <h3 className="font-18-bold accounts-details-all-deals-card-subtitle">
                      type
                    </h3>
                    <h3 className="font-18-semibold accounts-details-all-deals-card-subtitle-data-type">
                      {dealData.type}
                    </h3>{" "}
                  </>
                )}
              </div>

              {dealData.type === "RECURRING" && (
                <>
                  <div className="row mx-0  accounts-details-all-deals-card-details-div-middle-colm-3">
                    <h3 className="font-18-bold accounts-details-all-deals-card-subtitle">
                      Start date
                    </h3>
                    <h3 className="font-18-semibold accounts-details-all-deals-card-subtitle-data">
                      {dateFns.format(dealData.startDate, "DD/MM/YYYY")}
                    </h3>
                  </div>
                  <div className="row mx-0  accounts-details-all-deals-card-details-div-middle-colm-4">
                    <h3 className="font-18-bold accounts-details-all-deals-card-subtitle">
                      end date
                    </h3>
                    <h3 className="font-18-semibold accounts-details-all-deals-card-subtitle-data">
                      {dateFns.format(dealData.endDate, "DD/MM/YYYY")}
                    </h3>
                  </div>
                  <div className="row mx-0  accounts-details-all-deals-card-details-div-middle-colm-5">
                    <h3 className="font-18-bold accounts-details-all-deals-card-subtitle">
                      Next payment
                    </h3>
                    <h3 className="font-18-semibold accounts-details-all-deals-card-subtitle-data">
                      {dateFns.format(dealData.nextPayment, "DD/MM/YYYY")}
                    </h3>
                  </div>
                </>
              )}
            </div>
            <div className="accounts-details-all-deals-card-details-button-div">
              <button
                onClick={viewHandler}
                className="accounts-card-list-btn accounts-card-list-btn--view"
              >
                View
              </button>
              <button
                onClick={editHandler}
                className="accounts-card-list-btn accounts-card-list-btn--edit"
              >
                Edit
              </button>
            </div>
          </div> */}
        {/* <div className="accounts-details-all-deals-card-details-bottom-div mx-0"> */}
        <div className="accounts-details-all-deals-card-details-bottom-block accounts-details-all-deals-card-details-bottom-block-1 column">
          {/* <h3 className="font-18-bold accounts-details-all-deals-card-subtitle ">
                leads
              </h3> */}
          <div className="row mx-0 flex-nowrap align-items-center ">
            <img
              src={require("../../../assets/img/accounts/leads.svg")}
              alt="accounts leads"
              className="accounts-details-all-deals-bottom-img"
            />
            <h3 className="font-21-semibold accounts-details-all-deals-card-subtitle-data">
              {!isEmpty(dealData) && dealData.leadsdata[0] !== undefined
                ? dealData.leadsdata[0].name
                : "----"}
            </h3>
          </div>
        </div>
        <div className="accounts-details-all-deals-card-details-bottom-block accounts-details-all-deals-card-details-bottom-block-2 column">
          {/* <h3 className="font-18-bold accounts-details-all-deals-card-subtitle ">
                Salesperson
              </h3> */}
          <div className="row mx-0 flex-nowrap align-items-center ">
            <img
              src={require("../../../assets/img/accounts/deals.svg")}
              alt="accounts leads"
              className="accounts-details-all-deals-bottom-img"
            />
            <h3 className="font-21-semibold accounts-details-all-deals-card-subtitle-data">
              {!isEmpty(dealData) && dealData.salespersonsdata[0].name}
            </h3>
          </div>
        </div>
        <div className="accounts-details-all-deals-card-details-bottom-block accounts-details-all-deals-card-details-bottom-block-3 column">
          {/* <h3 className="font-18-bold accounts-details-all-deals-card-subtitle ">
                Revenue till date($)
              </h3> */}
          <h3 className="accounts-details-all-deals-card-details-bottom-block-text">
            {dealData.revenue}
          </h3>
        </div>
        <div className="accounts-details-all-deals-card-details-bottom-block accounts-details-all-deals-card-details-bottom-block--worth-amount column">
          {/* <h3 className="font-18-bold accounts-details-all-deals-card-subtitle ">
                worth amount($)
              </h3> */}
          <h3 className="accounts-details-all-deals-card-details-bottom-block-text">
            {dealData.value}
          </h3>
        </div>
        {/* </div> */}
        <div className="row mx-0 align-items-center flex-nowrap accounts-details-all-deals-card-details-button-div">
          <button
            onClick={viewHandler}
            className="accounts-card-list-btn accounts-card-list-btn--view"
          >
            View Details
          </button>
          <button
            onClick={editHandler}
            className="accounts-card-list-btn accounts-card-list-btn--edit"
          >
            {/* Edit
             */}

            <img
              src={"/img/desktop-dark-ui/icons/pencil-with-underscore.svg"}
              alt=""
              className="accounts-details-all-deals-card-details-pencil-icon"
            />
          </button>
        </div>
      </div>
      {dealData.type === "RECURRING" && (
        <div className="accounts-details-all-deals-card-details-bottom-div row mx-0 justify-content-start align-items-center">
          {/* <div className="row mx-0 justify-content-start align-items-center accounts-details-all-deals-card-details-div-middle-left"> */}
          <div className="row mx-0  accounts-details-all-deals-card-details-div-middle-colm-1">
            {dealData.status === "CLOSED" && (
              <>
                {" "}
                <h3 className="font-14-semibold accounts-details-all-deals-card-subtitle">
                  Closed on :
                </h3>
                <h3 className="font-14-regular accounts-details-all-deals-card-subtitle-data">
                  {dateFns.format(dealData.closingDate, "DD/MM/YYYY")}
                </h3>
              </>
            )}
          </div>
          <div className="row mx-0  accounts-details-all-deals-card-details-div-middle-colm-2">
            {dealData.type === "RECURRING" && (
              <>
                {" "}
                <h3 className="font-14-semibold accounts-details-all-deals-card-subtitle">
                  type :
                </h3>
                <h3 className="font-14-regular accounts-details-all-deals-card-subtitle-data-type">
                  {dealData.type}
                </h3>{" "}
              </>
            )}
          </div>

          {dealData.type === "RECURRING" && (
            <>
              <div className="row mx-0  accounts-details-all-deals-card-details-div-middle-colm-3">
                <h3 className="font-14-semibold accounts-details-all-deals-card-subtitle">
                  Start date :
                </h3>
                <h3 className="font-14-regular accounts-details-all-deals-card-subtitle-data">
                  {dateFns.format(dealData.startDate, "DD/MM/YYYY")}
                </h3>
              </div>
              <div className="row mx-0  accounts-details-all-deals-card-details-div-middle-colm-4">
                <h3 className="font-14-semibold accounts-details-all-deals-card-subtitle">
                  end date :
                </h3>
                <h3 className="font-14-regular accounts-details-all-deals-card-subtitle-data">
                  {dateFns.format(dealData.endDate, "DD/MM/YYYY")}
                </h3>
              </div>
              <div className="row mx-0  accounts-details-all-deals-card-details-div-middle-colm-5">
                <h3 className="font-14-semibold accounts-details-all-deals-card-subtitle">
                  Next paymenton :
                </h3>
                <h3 className="font-14-regular accounts-details-all-deals-card-subtitle-data">
                  {dateFns.format(dealData.nextPayment, "DD/MM/YYYY")}
                </h3>
              </div>
            </>
          )}
          {/* </div> */}
        </div>
      )}
    </div>
  );
}

export default AccountsDetailAllDealsCard;
