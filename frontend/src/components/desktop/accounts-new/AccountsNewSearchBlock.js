import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { SET_SEARCH_IN_ALL_PAGE } from "./../../../store/types";
import store from "../../../store/store";
import { searchAccount } from "./../../../store/actions/accountsAction";
import { startOfDay, endOfDay } from "date-fns";
import { useDispatch } from "react-redux";

function AccountsNewSearchBlock() {
  const dispatch = useDispatch();
  const [values, setValues] = useState({
    accountSearch: "",
    startDate: null,
    endDate: null,
  });

  /*==============================================
      render datepicker
 ==============================================*/

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

  const submitDateHandler = () => {
    let newStartDate = startOfDay(values.startDate);
    let endStartDate = endOfDay(values.endDate);
    const formData = {
      // pageNo: 1,
      // pageSize: 3,
      query: {
        $and: [
          { createdAt: { $lte: endStartDate } },
          { createdAt: { $gte: newStartDate } },
        ],
      },
    };
    dispatch(searchAccount(formData));
  };

  const handleDateChangeRaw = (e) => {
    e.preventDefault();
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
            onClick={submitDateHandler}
            src="/img/desktop-dark-ui/icons/purple-bg-arrow-next.svg"
            alt="next"
            className="leads-title-block-next-arrow-img"
          />
        </div>
      </>
    );
  };

  /*==============================================
      render searchBlock
 ==============================================*/
  const handleOnChange = (e) => {
    store.dispatch({
      type: SET_SEARCH_IN_ALL_PAGE,
      payload: e.target.value,
    });
    setValues({
      ...values,
      [e.target.name]: e.target.value,
    });
  };

  const handleOnSubmitSearch = (e) => {
    e.preventDefault();
    // console.log(this.state.accountSearch);
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
                name="accountSearch"
                className="message-search-block__input mb-0 mr-0"
                placeholder="Search"
                onChange={handleOnChange}
                value={values.accountSearch}
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
    <div className="row mx-0 flex-nowrap leads-new-datepicker-search-block leads-new-datepicker-search-block--account-new-search mt-20 ">
      {renderSearchBlock()}
      <span className="border-right mx-3"></span>
      {renderDatePicker()}
    </div>
  );
}

export default AccountsNewSearchBlock;
