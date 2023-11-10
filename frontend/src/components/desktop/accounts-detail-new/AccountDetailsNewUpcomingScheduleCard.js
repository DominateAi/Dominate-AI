import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import isEmpty from "./../../../store/validations/is-empty";
import dateFns from "date-fns";
import AddFollowupForAccountLead from "./AddFollowupForAccountLead";

const dummyData = [
  { type: "Meeting" },
  { type: "Follow Up" },
  { type: "Meeting" },
];
function AccountDetailsNewUpcomingScheduleCard() {
  const [accountData, setaccountData] = useState({});

  const singleAccountData = useSelector(
    (state) => state.account.singleAccountData
  );

  useEffect(() => {
    if (!isEmpty(singleAccountData)) {
      setaccountData(singleAccountData);
    }
  }, [singleAccountData]);

  return (
    <>
      <div className="accounts-detail-new-card-calendar">
        <h3 className="accounts-new-details-us-title">
          <img
            src={require("../../../../src/assets/img/accounts-new/calendar-icon.svg")}
            alt="calendar"
            className="accounts-new-details-profile-calendar-icon"
          />
          Upcoming Schedule
        </h3>
        <div className="accounts-new-details-us-table-div">
          <table>
            <tbody>
              {!isEmpty(accountData.upcomingFollowups) ? (
                accountData.upcomingFollowups.map((data, index) => (
                  <tr key={index}>
                    <td>
                      <div>
                        <div>
                          <span className="accounts-new-details-us-text-1">
                            {dateFns.format(data.followupAtDate, "Do")}
                          </span>
                          <span className="accounts-new-details-us-text-2">
                            {dateFns.format(data.followupAtDate, "MMM")}
                          </span>
                        </div>
                        <span className="accounts-new-details-us-text-3">
                          {dateFns.format(data.followupAtTime, "HH:mm aa")}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div className="accounts-new-details-us-text-3--width3">
                        <span className="accounts-new-details-us-text-5">
                          {data.name}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div className="row mx-0 flex-nowrap align-items-start">
                        <div className="accounts-new-details-us-blue-circle-icon-block">
                          <img
                            src={require("../../../../src/assets/img/leads/lead_default_img.svg")}
                            alt="lead"
                          />
                        </div>
                        <div className="accounts-new-details-us-text-3--width1">
                          <span className="accounts-new-details-us-text-4">
                            {data.lead_data.name}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="row mx-0 flex-nowrap align-items-start">
                        <div className="accounts-new-details-us-blue-circle-icon-block">
                          <img
                            src={require("../../../../src/assets/img/accounts-new/blue-circle-icon.svg")}
                            alt="salesperson"
                          />
                        </div>
                        <div className="accounts-new-details-us-text-3--width2">
                          <span className="accounts-new-details-us-text-4">
                            {data.user_data.name}
                          </span>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr className="border-bottom-0">
                  <td colSpan="100" className="py-0">
                    <div className="no_schedule_found">
                      <img
                        // src={require("../../../../src/assets/img/accounts-new/no_schedules.png")}
                        src="/img/desktop-dark-ui/illustrations/no_schedules.svg"
                        alt=""
                        className="no_schedule_img"
                      />
                      <p className="font-18-medium color-white-79 mb-21">
                        No Upcoming Schedule yet
                      </p>
                      <AddFollowupForAccountLead
                        leadActivityData={accountData}
                      />
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default AccountDetailsNewUpcomingScheduleCard;
