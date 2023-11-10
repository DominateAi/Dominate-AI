import React, { useEffect, useState } from "react";
import MemberLogCommunicationGraph from "./MemberLogCommunicationGraph";
import MembersLogDealsGraph from "./MembersLogDealsGraph";
import { useDispatch, useSelector } from "react-redux";
import {
  communicationOverview,
  communicationOverviewChart,
  followupsPortfolioCount,
  revenueGeneratedByMember,
  revenueGeneratedByMemberChart,
  workspaceActivityForLeads,
  workspaceActivityForDeals,
  workspaceActivityForFollowups,
} from "./../../../store/actions/workspaceActivityAction";
import { getAllAccounts } from "./../../../store/actions/accountsAction";
import { getAllLeads } from "./../../../store/actions/leadAction";
import isEmpty from "../../../store/validations/is-empty";
import { format, startOfWeek, endOfWeek, startOfDay, endOfDay } from "date-fns";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import AddLead from "../leads/AddLead";
import AddNewDeal from "../deal-pipelines-detail/AddNewDeal";
import AddFollowUpInCalender from "./../calender/AddFollowUpInCalender";

import CommandCentreImgTextBorder from "../command-centre/CommandCentreImgTextBorder";

import graph1 from "../../../assets/img/employees/member-log-account-graph.svg";
import graph2 from "../../../assets/img/employees/member-log-leads-graph.svg";
import graph3 from "../../../assets/img/employees/member-log-deals-graph.svg";
import graph4 from "../../../assets/img/employees/member-log-followup-graph.svg";
// import profileImage from "../../../assets/img/employees/employees.png";

// console.log(startOfWeek(new Date()));

export default function MembersNewLog() {
  const dispatch = useDispatch();
  const [leadsActivity, setleadsActivity] = useState([]);
  const [dealsActivity, setdealsActivity] = useState([]);
  const [followupsActivity, setfollowupsActivity] = useState([]);
  const [portfolio, setportfolioCount] = useState([]);
  const [employeesList, setemployeesList] = useState([]);

  const [values, setValues] = useState({
    startDate: startOfDay(new Date()),
    endDate: endOfDay(new Date()),
  });
  const [activeIndex, setActiveIndex] = useState("");
  const [newValues, newSetValues] = useState({
    isActiveBtn: "today",
  });

  const handleChangeBtn = (activeBtn) => (e) => {
    const today = new Date();
    const yesterday = new Date(today);

    yesterday.setDate(yesterday.getDate() - 1);

    e.preventDefault();
    newSetValues({
      ...newValues,
      isActiveBtn: activeBtn,
    });
    console.log(activeBtn);

    const formData = {
      user: activeIndex,
      startDate:
        activeBtn === "thisWeek"
          ? startOfWeek(new Date())
          : activeBtn === "today"
          ? startOfDay(new Date())
          : yesterday.toISOString(),
      endDate:
        activeBtn === "thisWeek"
          ? endOfWeek(new Date())
          : activeBtn === "today"
          ? endOfDay(new Date())
          : yesterday.toISOString(),
    };
    dispatch(communicationOverview(formData));
    dispatch(communicationOverviewChart(formData));
    dispatch(followupsPortfolioCount(formData));
    dispatch(revenueGeneratedByMember(formData));
    dispatch(revenueGeneratedByMemberChart(formData));

    const leadData = {
      query: {
        type: "LEAD",
        user: activeIndex,
        date: {
          $gt:
            activeBtn === "thisWeek"
              ? startOfWeek(new Date())
              : activeBtn === "today"
              ? startOfDay(new Date())
              : yesterday.toISOString(),
          $lt:
            activeBtn === "thisWeek"
              ? endOfWeek(new Date())
              : activeBtn === "today"
              ? endOfDay(new Date())
              : yesterday.toISOString(),
        },
      },
    };
    const dealData = {
      query: {
        type: "DEAL",
        user: activeIndex,
        date: {
          $gt:
            activeBtn === "thisWeek"
              ? startOfWeek(new Date())
              : activeBtn === "today"
              ? startOfDay(new Date())
              : yesterday.toISOString(),
          $lt:
            activeBtn === "thisWeek"
              ? endOfWeek(new Date())
              : activeBtn === "today"
              ? endOfDay(new Date())
              : yesterday.toISOString(),
        },
      },
    };
    const followupData = {
      query: {
        type: "FOLLOWUP",
        user: activeIndex,
        date: {
          $gt:
            activeBtn === "thisWeek"
              ? startOfWeek(new Date())
              : activeBtn === "today"
              ? startOfDay(new Date())
              : yesterday.toISOString(),
          $lt:
            activeBtn === "thisWeek"
              ? endOfWeek(new Date())
              : activeBtn === "today"
              ? endOfDay(new Date())
              : yesterday.toISOString(),
        },
      },
    };
    dispatch(workspaceActivityForLeads(leadData));
    dispatch(workspaceActivityForDeals(dealData));
    dispatch(workspaceActivityForFollowups(followupData));

    if (activeBtn === "thisWeek") {
      setValues({
        ...values,
        startDate: startOfWeek(new Date()),
        endDate: endOfWeek(new Date()),
      });
    } else if (activeBtn === "today") {
      setValues({
        ...values,
        startDate: new Date(),
        endDate: new Date(),
      });
    } else {
      setValues({
        ...values,
        startDate: yesterday,
        endDate: yesterday,
      });
    }
  };
  useEffect(() => {
    const allLeadQuery = {
      query: {},
    };
    dispatch(getAllLeads(allLeadQuery));
    dispatch(getAllAccounts());
  }, []);

  const allEmployees = useSelector((state) => state.employee.allEmployees);

  const workspaceLeadsLog = useSelector(
    (state) => state.workspaceActivity.workspaceLeadsLog
  );

  const workspaceDealsLog = useSelector(
    (state) => state.workspaceActivity.workspaceDealsLog
  );

  const workspaceFollowupLog = useSelector(
    (state) => state.workspaceActivity.workspaceFollowupLog
  );

  const portfolioCount = useSelector(
    (state) => state.workspaceActivity.portfolioCount
  );

  useEffect(() => {
    if (!isEmpty(allEmployees)) {
      setemployeesList(allEmployees);
      setActiveIndex(allEmployees[0]._id);
      const formData = {
        user: allEmployees[0]._id,
        startDate: values.startDate,
        endDate: values.endDate,
      };
      dispatch(communicationOverview(formData));
      dispatch(communicationOverviewChart(formData));
      dispatch(followupsPortfolioCount(formData));
      dispatch(revenueGeneratedByMember(formData));
      dispatch(revenueGeneratedByMemberChart(formData));

      const leadData = {
        query: {
          type: "LEAD",
          user: allEmployees[0]._id,
          date: {
            $gt: values.startDate,
            $lt: values.endDate,
          },
        },
      };
      const dealData = {
        query: {
          type: "DEAL",
          user: allEmployees[0]._id,
          date: {
            $gt: values.startDate,
            $lt: values.endDate,
          },
        },
      };
      const followupData = {
        query: {
          type: "FOLLOWUP",
          user: allEmployees[0]._id,
          date: {
            $gt: values.startDate,
            $lt: values.endDate,
          },
        },
      };
      dispatch(workspaceActivityForLeads(leadData));
      dispatch(workspaceActivityForDeals(dealData));
      dispatch(workspaceActivityForFollowups(followupData));
    } else {
      setemployeesList([]);
    }
  }, [allEmployees]);

  useEffect(() => {
    if (!isEmpty(workspaceLeadsLog)) {
      setleadsActivity(workspaceLeadsLog);
    } else {
      setleadsActivity([]);
    }
  }, [workspaceLeadsLog]);

  useEffect(() => {
    if (!isEmpty(workspaceDealsLog)) {
      setdealsActivity(workspaceDealsLog);
    } else {
      setdealsActivity([]);
    }
  }, [workspaceDealsLog]);

  useEffect(() => {
    if (!isEmpty(workspaceFollowupLog)) {
      setfollowupsActivity(workspaceFollowupLog);
    } else {
      setfollowupsActivity(workspaceFollowupLog);
    }
  }, [workspaceFollowupLog]);

  useEffect(() => {
    if (!isEmpty(portfolioCount)) {
      setportfolioCount(portfolioCount);
    } else {
      setportfolioCount([]);
    }
  }, [portfolioCount]);

  /*==========================================
           handler
==========================================*/
  const handleChangeStart = (date) => {
    if (date === null) {
      setValues({
        ...values,
        startDate: new Date(),
      });
    } else {
      setValues({
        ...values,
        startDate: date,
      });
    }
  };

  const handleChangeEnd = (date) => {
    if (date === null) {
      setValues({
        ...values,
        endDate: new Date(),
      });
    } else {
      setValues({
        ...values,
        endDate: date,
      });
    }
  };

  const handleDateChangeRaw = (e) => {
    e.preventDefault();
  };

  const submitDateHandler = () => {
    console.log("start date", values.startDate);
    console.log("end date", values.endDate);
    const formData = {
      user: activeIndex,
      startDate: values.startDate,
      endDate: values.endDate,
    };
    dispatch(communicationOverview(formData));
    dispatch(communicationOverviewChart(formData));
    dispatch(followupsPortfolioCount(formData));
    dispatch(revenueGeneratedByMember(formData));
    dispatch(revenueGeneratedByMemberChart(formData));

    const leadData = {
      query: {
        type: "LEAD",
        user: activeIndex,
        date: {
          $gt: values.startDate,
          $lt: values.endDate,
        },
      },
    };
    const dealData = {
      query: {
        type: "DEAL",
        user: activeIndex,
        date: {
          $gt: values.startDate,
          $lt: values.endDate,
        },
      },
    };
    const followupData = {
      query: {
        type: "FOLLOWUP",
        user: activeIndex,
        date: {
          $gt: values.startDate,
          $lt: values.endDate,
        },
      },
    };
    dispatch(workspaceActivityForLeads(leadData));
    dispatch(workspaceActivityForDeals(dealData));
    dispatch(workspaceActivityForFollowups(followupData));
  };

  /*==========================================
           Leads Card
==========================================*/
  const renderLeads = () => {
    const leadData = {
      query: {
        type: "LEAD",
        user: activeIndex,
        date: {
          $gt: values.startDate,
          $lt: values.endDate,
        },
      },
    };
    return (
      <div className="member-log-leads-card-div">
        <div className="row mx-0 align-items-center">
          <img
            src={require("../../../assets/img/employees/member-leads-icon.svg")}
            alt="member leads"
            className="member-leads-icon-img"
          />
          <h3 className="member-log-leads-card-title font-18-bold">Leads</h3>
        </div>
        <div className="member-log-leads-content-div">
          {!isEmpty(leadsActivity) ? (
            <>
              {!isEmpty(leadsActivity) &&
                leadsActivity.map((data, index) => (
                  <div
                    className="row mx-0 flex-nowrap member-log-leads-content-row-div"
                    key={index}
                  >
                    <div className="member-log-leads-content-left-div">
                      <h3 className="font-18-bold">
                        {format(data.date, "DD-MM")}
                      </h3>
                      <h4 className="member-log-leads-content-time-text">
                        {format(data.date, "hh:mm a")}
                      </h4>
                    </div>
                    <div className="member-log-leads-content-right-div">
                      <h5
                        className="member-log-leads-content-right-text"
                        // contentEditable="true"
                        dangerouslySetInnerHTML={{ __html: data.description }}
                      ></h5>
                      {/* <h5 className="member-log-leads-content-right-text">
                    {data.description}
                  </h5> */}
                    </div>
                  </div>
                ))}{" "}
            </>
          ) : (
            <div className="text-center">
              <img
                // src={require("../../../assets/img/illustrations/member-log-leads.svg")}
                src="/img/desktop-dark-ui/illustrations/member-log-leads.svg"
                alt=""
                className="member-log-leads-img"
              />
              {/* <p className="font-18-medium color-white-79 mb-30">No Leads Yet</p> */}
              <AddLead
                leadDataToFetchMemberLog={leadData}
                isMobile={false}
                className="leads-title-block-btn-red-bg"
                buttonText="+ Add New Lead"
              />
            </div>
          )}
        </div>
      </div>
    );
  };

  /*=======================================================================

                                 renderDealsCard

    ========================================================================*/
  const renderDealsCards = () => {
    const dealData = {
      query: {
        type: "DEAL",
        user: activeIndex,
        date: {
          $gt: values.startDate,
          $lt: values.endDate,
        },
      },
    };
    return (
      <div className="member-log-leads-card-div member-log-leads-card-div--deals">
        <div className="row mx-0 align-items-center">
          <img
            src={require("../../../assets/img/employees/member-deals-icon.svg")}
            alt="member deals"
            className="member-deals-icon-img"
          />
          <h3 className="member-log-leads-card-title font-18-bold">Deals</h3>
        </div>
        <div className="member-log-leads-content-div">
          {!isEmpty(dealsActivity) ? (
            <>
              {!isEmpty(dealsActivity) &&
                dealsActivity.map((data, index) => (
                  <div
                    className="row mx-0 flex-nowrap member-log-leads-content-row-div"
                    key={index}
                  >
                    <div className="member-log-leads-content-left-div">
                      <h3 className="font-18-bold">
                        {" "}
                        {format(data.date, "DD-MM")}
                      </h3>
                      <h4 className="member-log-leads-content-time-text">
                        {format(data.date, "hh:mm a")}
                      </h4>
                    </div>
                    <div className="member-log-leads-content-right-div">
                      <h5
                        className="member-log-leads-content-right-text"
                        // contentEditable="true"
                        dangerouslySetInnerHTML={{ __html: data.description }}
                      ></h5>
                      {/* <h5 className="member-log-leads-content-right-text member-log-leads-content-right-text--deals">
                    {data.description}
                  </h5> */}
                    </div>
                  </div>
                ))}{" "}
            </>
          ) : (
            <div className="text-center reports-biggest-deals-div reports-biggest-deals-div--member-log">
              <img
                // src={require("../../../assets/img/illustrations/member-log-deals.svg")}
                src="/img/desktop-dark-ui/illustrations/member-log-deals.svg"
                alt=""
                className="member-log-deals-img"
              />
              <p className="font-18-medium color-white-79 mb-30">
                No Deals Yet
              </p>
              <AddNewDeal dealDataToFetchMemberLog={dealData} />
            </div>
          )}
        </div>
      </div>
    );
  };

  /*===============================================================================================

                                   renderFollowUpCard

    =================================================================================================*/
  const renderFollowUpCard = () => {
    const followupData = {
      query: {
        type: "FOLLOWUP",
        user: activeIndex,
        date: {
          $gt: values.startDate,
          $lt: values.endDate,
        },
      },
    };
    return (
      <div className="member-log-leads-card-div member-log-leads-card-div--deals mr-0">
        <div className="row mx-0 align-items-center">
          <img
            src={require("../../../assets/img/employees/member-followup-icon.svg")}
            alt="member followup"
            className="member-followup-icon-img"
          />
          <h3 className="member-log-leads-card-title font-18-bold">
            Followups
          </h3>
        </div>
        <div className="member-log-leads-content-div">
          {!isEmpty(followupsActivity) ? (
            <>
              {!isEmpty(followupsActivity) &&
                followupsActivity.map((data, index) => (
                  <div
                    className="row mx-0 flex-nowrap member-log-leads-content-row-div"
                    key={index}
                  >
                    <div className="member-log-leads-content-left-div">
                      <h3 className="font-18-bold">
                        {" "}
                        {format(data.date, "DD-MM")}
                      </h3>
                      <h4 className="member-log-leads-content-time-text">
                        {" "}
                        {format(data.date, "hh:mm a")}
                      </h4>
                    </div>
                    <div className="member-log-leads-content-right-div">
                      {/* <div
                    contentEditable="true"
                    dangerouslySetInnerHTML={{ __html: description }}
                  ></div> */}
                      <h5
                        className="member-log-leads-content-right-text member-log-leads-content-right-text--deals"
                        // contentEditable="true"
                        dangerouslySetInnerHTML={{ __html: data.descripton }}
                      >
                        {/* {data.descripton} */}
                      </h5>
                    </div>
                  </div>
                ))}{" "}
            </>
          ) : (
            <div className="text-center member-log-followup-not-found">
              <img
                // src={require("../../../assets/img/illustrations/member-log-followup.svg")}
                src="/img/desktop-dark-ui/illustrations/member-log-followup.svg"
                alt=""
                className="member-log-followup-img"
              />
              <p className="font-18-medium color-white-79 mb-30">
                No Followups Yet
              </p>

              <AddFollowUpInCalender
                followupdDataToFetchMemberLog={followupData}
                buttonClassName="leads-title-block-btn-red-bg leads-title-block-btn-red-bg--followup"
                buttonText="+ Add New Follow Up"
              />
            </div>
          )}
        </div>
      </div>
    );
  };

  /*=============================================
              complete Portfolio Member
 ================================================*/
  const completePortfolioMember = () => {
    return (
      <div className="member-log-complete-portfolio-card">
        <div className="row mx-0 align-items-center">
          <img
            src={require("../../../assets/img/icons/purple-gradient-circle-icon.svg")}
            alt=" "
            className="member-orange-gradient-circle-img"
          />
          <h3 className="member-log-communication-graph-title">
            Complete Portfolio of Member
          </h3>
        </div>
        <div className="row mx-0 pt-40">
          {/* Accounts */}
          <div className="complete-porfolio-member-card">
            <h4 className="complete-porfolio-member-card-title">Accounts</h4>
            <div className="row justify-content-between mx-0">
              <h3 className="font-24-semibold">
                {!isEmpty(portfolio) && portfolio.account}
              </h3>
              <img
                src={graph1}
                alt="account"
                className="member-log-account-graph-img"
              />
            </div>
          </div>
          {/* Leads */}
          <div className="complete-porfolio-member-card complete-porfolio-member-card--leads mr-0">
            <h4 className="complete-porfolio-member-card-title">Leads</h4>
            <div className="row justify-content-between mx-0">
              <h3 className="font-24-semibold">
                {!isEmpty(portfolio) && portfolio.lead}
              </h3>
              <img
                src={graph2}
                alt="account"
                className="member-log-account-graph-img"
              />
            </div>
          </div>
        </div>
        {/* row 2 */}
        <div className="row mx-0 pt-20">
          {/* Deals */}
          <div className="complete-porfolio-member-card complete-porfolio-member-card--deals">
            <h4 className="complete-porfolio-member-card-title">Deals</h4>
            <div className="row justify-content-between mx-0">
              <h3 className="font-24-semibold">
                {!isEmpty(portfolio) && portfolio.deal}
              </h3>
              <img
                src={graph3}
                alt="account"
                className="member-log-account-graph-img"
              />
            </div>
          </div>
          {/* Followups */}
          <div className="complete-porfolio-member-card complete-porfolio-member-card--followups mr-0">
            <h4 className="complete-porfolio-member-card-title">Followups</h4>
            <div className="row justify-content-between mx-0">
              <h3 className="font-24-semibold">
                {!isEmpty(portfolio) && portfolio.followup}
              </h3>
              <img
                src={graph4}
                alt="account"
                className="member-log-account-graph-img"
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  /*=============================================================================
                       member
      ==============================================================================*/
  const handleOnClickTeamMemberBlock = (data) => (e) => {
    e.preventDefault();
    setActiveIndex(data._id);
    const formData = {
      user: data._id,
      startDate: values.startDate,
      endDate: values.endDate,
    };
    dispatch(communicationOverview(formData));
    dispatch(communicationOverviewChart(formData));
    dispatch(followupsPortfolioCount(formData));
    dispatch(revenueGeneratedByMember(formData));
    dispatch(revenueGeneratedByMemberChart(formData));

    const leadData = {
      query: {
        type: "LEAD",
        user: data._id,
        date: {
          $gt: values.startDate,
          $lt: values.endDate,
        },
      },
    };
    const dealData = {
      query: {
        type: "DEAL",
        user: data._id,
        date: {
          $gt: values.startDate,
          $lt: values.endDate,
        },
      },
    };
    const followupData = {
      query: {
        type: "FOLLOWUP",
        user: data._id,
        date: {
          $gt: values.startDate,
          $lt: values.endDate,
        },
      },
    };
    dispatch(workspaceActivityForLeads(leadData));
    dispatch(workspaceActivityForDeals(dealData));
    dispatch(workspaceActivityForFollowups(followupData));
    // console.log(activeIndex, "activeIndex");
  };
  // console.log(activeIndex, "activeIndex");
  const renderMember = () => {
    var userData = JSON.parse(localStorage.getItem("Data"));
    return (
      <div className="row mx-0 align-items-center pt-20 member-log-select-member-div">
        <div className="row mx-0 align-items-center ">
          <img
            src={require("../../../assets/img/icons/purple-gradient-circle-icon.svg")}
            alt=" "
            className="member-orange-gradient-circle-img"
          />
          <h3 className="member-log-communication-graph-title">Members</h3>
        </div>
        <div className="row mx-0 align-items-start member-log-member-row-div">
          {!isEmpty(allEmployees) &&
            allEmployees.map((data, index) => (
              <div
                className={
                  data._id === activeIndex
                    ? "member-log-member-div member-log-member-div--active"
                    : "member-log-member-div"
                }
                key={index}
                onClick={handleOnClickTeamMemberBlock(data)}
              >
                {/*console.log(data, "data")*/}
                <div className="member-log-member-img-div">
                  <img
                    src={`${data.profileImage}&token=${userData.token}`}
                    alt="member"
                  />
                </div>
                <h5 className="member-log-member-name">{data.name}</h5>
              </div>
            ))}
        </div>
      </div>
    );
  };

  /*===============================================================================

                             Date Range

  ===============================================================================*/

  /*=========================
      render datepicker
 ==========================*/
  const renderDatePicker = () => {
    return (
      <div className="member-log-date-picker-div">
        {/* datepicker */}
        <div className="leads-title-block-container__date-picker mr-0">
          {/* datepicker */}
          <DatePicker
            selected={values.startDate}
            selectsStart
            startDate={values.startDate}
            endDate={values.endDate}
            onChange={handleChangeStart}
            placeholderText="mm/dd/yyyy"
            onChangeRaw={handleDateChangeRaw}
          />
          <span className="font-18-medium">to</span>
          <DatePicker
            selected={values.endDate}
            selectsEnd
            startDate={values.startDate}
            endDate={values.endDate}
            onChange={handleChangeEnd}
            minDate={values.startDate}
            placeholderText="mm/dd/yyyy"
            onChangeRaw={handleDateChangeRaw}
          />
          <img
            onClick={submitDateHandler}
            src="/img/desktop-dark-ui/icons/purple-bg-arrow-next.svg"
            alt="next"
            className="leads-title-block-next-arrow-img"
          />
        </div>
      </div>
    );
  };
  const renderDateRange = () => {
    return (
      <div className="pt-30 member-log-select-member-div member-log-select-member-div--date-range">
        <div className="row mx-0 align-items-center pt-20">
          <img
            src={require("../../../assets/img/icons/purple-gradient-circle-icon.svg")}
            alt=" "
            className="member-orange-gradient-circle-img"
          />
          <h3 className="member-log-communication-graph-title">Date range</h3>
          {renderDatePicker()}
          <div className="member-log-btn-section">
            <button
              onClick={handleChangeBtn("yesterday")}
              className={
                newValues.isActiveBtn === "yesterday"
                  ? "member-log-btn-section-active-btn"
                  : "member-log-btn-section-inactive-btn"
              }
            >
              Yesterday
            </button>
            <button
              onClick={handleChangeBtn("today")}
              className={
                newValues.isActiveBtn === "today"
                  ? "member-log-btn-section-active-btn"
                  : "member-log-btn-section-inactive-btn"
              }
            >
              Today
            </button>
            <button
              onClick={handleChangeBtn("thisWeek")}
              className={
                newValues.isActiveBtn === "thisWeek"
                  ? "member-log-btn-section-active-btn"
                  : "member-log-btn-section-inactive-btn"
              }
            >
              This week
            </button>
          </div>
        </div>
      </div>
    );
  };
  return (
    <div className="member-log-div">
      {/*=============================================================================
                       Select details to filter data by
      ==============================================================================*/}
      <>
        <h3 className="font-18-bold filtered-data-title-text">
          Select details to filter data by
        </h3>
        {renderMember()}
        {renderDateRange()}
      </>
      {/*=============================================================================
                       Filtered Data
      ==============================================================================*/}
      <>
        {/* <h3 className="font-18-bold filtered-data-title-text">Filtered Data</h3> */}
        <CommandCentreImgTextBorder
          imgPath="/img/desktop-dark-ui/icons/white-filter-icon.svg"
          title="Filtered Data"
        />
        <div className="row mx-0 flex-nowrap pt-40">
          <MemberLogCommunicationGraph />
          {completePortfolioMember()}
          <MembersLogDealsGraph />
        </div>
      </>

      {/*=============================================================================
                       showing member activity
      ==============================================================================*/}
      <div className="showing-member-activity-div">
        <div className="row mx-0 align-items-center showing-member-activity-title-div">
          <img
            src={require("../../../assets/img/icons/member-orange-gradient-circle.svg")}
            alt=" "
            className="member-orange-gradient-circle-img"
          />
          <h3 className="showing-member-activity-title">
            Showing Member activity for period
          </h3>
        </div>
        <div className="row mx-0 justify-content-between flex-nowrap">
          {renderLeads()}
          {renderDealsCards()}
          {renderFollowUpCard()}
        </div>
      </div>
    </div>
  );
}
