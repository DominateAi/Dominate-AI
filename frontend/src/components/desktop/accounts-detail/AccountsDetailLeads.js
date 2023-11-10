import React, { Fragment, useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import AccountsDetailLeadsCard from "./AccountsDetailLeadsCard";
import AccountDetailsAddLeadToAccountModal from "./AccountDetailsAddLeadToAccountModal";
import isEmpty from "../../../store/validations/is-empty";
import { getLeadsOfPerticulerAccount } from "./../../../store/actions/accountsAction";
import AddLead from "./../leads/AddLead";
import { useSelector, useDispatch } from "react-redux";
// const dummyData = [1, 2, 3, 4];

const allLeadOptions = [
  "All Leads",
  "My Leads",
  "Hidden Leads",
  "Archive Leads",
];

function AccountsDetailLeads() {
  const dispatch = useDispatch();
  const [values, setValues] = useState({
    allLeadDefaultOption: allLeadOptions[0],
    startDate: null,
    endDate: null,
    leadSearch: "",
    leadsOfAccount: [],
  });

  const leadsOfAccount = useSelector((state) => state.account.leadsOfAccount);
  const singleAccountData = useSelector(
    (state) => state.account.singleAccountData
  );

  useEffect(() => {
    if (!isEmpty(leadsOfAccount)) {
      setValues({
        ...values,
        leadsOfAccount: leadsOfAccount,
      });
    } else {
      setValues({
        ...values,
        leadsOfAccount: [],
      });
    }
  }, [leadsOfAccount]);

  /*==========================================================
        handlers
 ==========================================================*/

  const onAllLeadDropdownSelect = (data) => (e) => {
    e.preventDefault();
    // console.log(data);
    setValues({
      ...values,
      allLeadDefaultOption: data,
    });

    var userData = JSON.parse(localStorage.getItem("Data"));
    if (data === "My Leads") {
      const formLeadData = {
        query: {
          account_id: singleAccountData._id,
          assigned: userData.id,
          status: { $ne: "ARCHIVE" },
        },
      };
      dispatch(getLeadsOfPerticulerAccount(formLeadData));
    } else if (data === "Hidden Leads") {
      const formLeadData = {
        query: {
          account_id: singleAccountData._id,
          isHidden: true,
        },
      };
      dispatch(getLeadsOfPerticulerAccount(formLeadData));
    } else if (data === "Archive Leads") {
      const formLeadData = {
        query: {
          account_id: singleAccountData._id,
          status: "ARCHIVE",
        },
      };
      dispatch(getLeadsOfPerticulerAccount(formLeadData));
    } else {
      const formLeadData = {
        query: {
          account_id: singleAccountData._id,
          status: { $ne: "ARCHIVE" },
        },
      };
      dispatch(getLeadsOfPerticulerAccount(formLeadData));
    }
  };

  const handleDateChangeRaw = (e) => {
    e.preventDefault();
  };
  /*==========================================================
        render datepicker
 ==========================================================*/

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
    // const { allLeadDefaultOption, loginUserId } = this.state;
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

  const renderDatePicker = () => {
    return (
      <>
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
            // onClick={""}
            src="/img/desktop-dark-ui/icons/purple-bg-arrow-next.svg"
            alt="next"
            className="leads-title-block-next-arrow-img"
          />
        </div>
      </>
    );
  };

  /*==========================================================
        render searchBlock
 ==========================================================*/
  const handleOnSubmitSearch = (e) => {
    e.preventDefault();
    // console.log(this.state.leadSearch);
  };

  const handleOnChange = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value,
    });
  };

  const renderSearchBlock = () => {
    return (
      <>
        <div className="leads-title-block-container__new-search-title-block m-0 p-0 lead-search-block--cust row mx-0 align-items-center">
          <div className="message-search-block px-0 mb-md-0">
            <form onSubmit={handleOnSubmitSearch}>
              <input
                type="text"
                name="leadSearch"
                className="message-search-block__input mb-0 mr-0"
                placeholder="Search"
                onChange={handleOnChange}
                value={values.leadSearch}
              />
              <img
                src="/img/desktop-dark-ui/icons/search-icon.svg"
                alt="search"
                className="message-search-block__icon"
                onClick={handleOnSubmitSearch}
              />
            </form>
          </div>
        </div>
      </>
    );
  };

  return (
    <div className="accounts-detail-leads-container">
      <div className="row mx-0 align-items-center justify-content-between accounts-detail-leads-filter-row">
        <div className="leads-new-filter-button-block pl-0">
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
        <div className="accounts-detail-leads-container__filter-row-btns-colm">
          <AccountDetailsAddLeadToAccountModal />
        </div>
      </div>
      <div className="row mx-0 flex-nowrap leads-new-datepicker-search-block">
        {renderSearchBlock()}
        <span className="border-right mx-3"></span>
        {renderDatePicker()}
      </div>
      {!isEmpty(leadsOfAccount) ? (
        <>
          <div className="accounts-details-leads-card-title-div row mx-0 align-items-center">
            <h3 className="accounts-details-leads-card-title-1 font-14-semibold">
              name
            </h3>
            <h3 className="accounts-details-leads-card-title-2 font-14-semibold">
              {" "}
              level
            </h3>
            <h3 className="accounts-details-leads-card-title-3 font-14-semibold">
              assigned to
            </h3>
            <h3 className="accounts-details-leads-card-title-4 font-14-semibold">
              status
            </h3>
          </div>
          <div className=" accounts-details-leads-card-overflow-div">
            {leadsOfAccount.map((data, index) => (
              <Fragment key={index}>
                <AccountsDetailLeadsCard
                  cardData={data}
                  filterName={values.allLeadDefaultOption}
                />
              </Fragment>
            ))}
          </div>
        </>
      ) : (
        <div className="text-center no-leads-found-div">
          <img
            src="/img/desktop-dark-ui/illustrations/lead-pipeline-inner-list-view.svg"
            alt="lead not found"
            className="account-details-leads-tabpanel-no-lead-img"
          />
          {/* <p className="font-18-medium color-white-79 mb-30 text-center">
            No leads yet
          </p> */}
          <AddLead
            isMobile={false}
            className="leads-title-block-btn-red-bg"
            buttonText="+ Add New Lead"
          />
        </div>
      )}
    </div>
  );
}

export default AccountsDetailLeads;
