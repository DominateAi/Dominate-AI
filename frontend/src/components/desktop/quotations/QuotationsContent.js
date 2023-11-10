import React, { Component, Fragment } from "react";
// import AddQuotations from "./AddQuotations";
import { connect } from "react-redux";
import isEmpty from "./../../../store/validations/is-empty";
import {
  getAllQuotation,
  searchQuotation,
  deleteQuotation,
} from "./../../../store/actions/quotationAction";
import {
  SET_CLICK_ON_QUOTATION,
  SET_SEARCH_IN_ALL_PAGE,
  SET_EDIT_OR_VIEW,
} from "../../../store/types";
import Pagination from "rc-pagination";
import "rc-pagination/assets/index.css";
import { format } from "date-fns";
import store from "./../../../store/store";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ViewQuotation from "./ViewQuotation";
import EditQuotation from "./EditQuotation";
import DeleteWarningPopup from "./../common/DeleteWarningPopup";
import { startOfDay, endOfDay } from "date-fns";
import { filterQuotationByLevel } from "./../../../store/actions/quotationAction";

// pagination
const totalRecordsInOnePage = 8;

class QuotationsContent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      deleteWarningPopup: false,
      quotationSearch: "",
      startDate: null,
      endDate: null,

      // pagination
      currentPagination: 1,
      // api
      getItemsList: {},
    };
  }

  /*==============================
        Lifecycle method
  ================================*/

  componentDidMount() {
    const getData = {
      pageNo: 1,
      pageSize: 0,
      query: {},
    };
    this.props.getAllQuotation(getData);
  }

  static getDerivedStateFromProps(nextProps, nextState) {
    if (
      !isEmpty(nextProps.allQuotation) &&
      nextProps.allQuotation !== nextState.allQuotation
    ) {
      return {
        allQuotation: nextProps.allQuotation,
        getItemsList: nextProps.allQuotation,
      };
    }
    return null;
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.allQuotation !== this.state.allQuotation) {
      this.setState({
        allQuotation: this.props.allQuotation,
        getItemsList: this.props.allQuotation,
      });
    }
  }

  // pagination
  onChangePagination = (page) => {
    this.setState({
      currentPagination: page,
    });
  };

  handleDownloadQuotation = (quotationData) => (e) => {
    console.log("Onclick quotation download");
    let data = JSON.parse(localStorage.getItem("Data"));
    window.open(
      `${quotationData.additionalInfo.attachment}&token=${data.token}`
    );
  };

  handleSendQuotation = () => {
    console.log("Onclick quotation send");
  };
  /*=============================
          Search Handler
  ==============================*/
  handleOnChange = (e) => {
    store.dispatch({
      type: SET_SEARCH_IN_ALL_PAGE,
      payload: e.target.value,
    });
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  handleOnSubmitSearch = (e) => {
    e.preventDefault();
    console.log(this.state.quotationSearch);
    this.props.searchQuotation(this.state.quotationSearch);
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  onQuotationCardClickHandler = (quoatationData) => (e) => {
    e.preventDefault();
    // console.log(quoatationData);
    store.dispatch({
      type: SET_EDIT_OR_VIEW,
      payload: false,
    });
    store.dispatch({
      type: SET_CLICK_ON_QUOTATION,
      payload: quoatationData,
    });
  };

  editQuotationHnadler = (quoatationData) => (e) => {
    e.preventDefault();
    store.dispatch({
      type: SET_EDIT_OR_VIEW,
      payload: true,
    });
    store.dispatch({
      type: SET_CLICK_ON_QUOTATION,
      payload: quoatationData,
    });
  };

  deleteQuotationHandler = (quotationData) => (e) => {
    this.setState({
      deleteWarningPopup: true,
      deleteId: quotationData._id,
    });
  };
  callBackDelete = () => {
    this.setState({
      deleteWarningPopup: false,
      deleteId: "",
    });
  };

  yesHandlder = () => {
    const { deleteId } = this.state;
    this.props.deleteQuotation(deleteId, this.callBackDelete);
  };

  noHandler = () => {
    this.setState({
      deleteWarningPopup: false,
      deleteId: "",
    });
  };

  /*=========================
      render datepicker
 ==========================*/

  handleChangeStart = (date) => {
    if (date === null) {
      this.setState({
        startDate: new Date(),
      });
    } else {
      this.setState({
        startDate: date,
      });
    }
  };

  handleChangeEnd = (date) => {
    if (date === null) {
      this.setState({
        endDate: new Date(),
      });
    } else {
      this.setState({
        endDate: date,
      });
    }
  };

  submitDateHandler = () => {
    let newStartDate = startOfDay(this.state.startDate);
    let endStartDate = endOfDay(this.state.endDate);
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
    this.props.filterQuotationByLevel(formData);
  };

  handleDateChangeRaw = (e) => {
    e.preventDefault();
  };

  renderDatePicker = () => {
    return (
      <>
        {/* datepicker */}
        <div className="leads-title-block-container__date-picker mr-0">
          {/* datepicker */}
          <DatePicker
            selected={this.state.startDate}
            selectsStart
            startDate={this.state.startDate}
            endDate={this.state.endDate}
            onChange={this.handleChangeStart}
            placeholderText="mm/dd/yyyy"
            onChangeRaw={this.handleDateChangeRaw}
          />
          <span className="font-18-medium">to</span>
          <DatePicker
            selected={this.state.endDate}
            selectsEnd
            startDate={this.state.startDate}
            endDate={this.state.endDate}
            onChange={this.handleChangeEnd}
            minDate={this.state.startDate}
            placeholderText="mm/dd/yyyy"
            onChangeRaw={this.handleDateChangeRaw}
          />
          <img
            onClick={this.submitDateHandler}
            src="/img/desktop-dark-ui/icons/purple-bg-arrow-next.svg"
            alt="next"
            className="leads-title-block-next-arrow-img"
          />
        </div>
      </>
    );
  };

  /*=========================
    render searchBlock
==========================*/
  renderSearchBlock = () => {
    return (
      <>
        <div className="leads-title-block-container__new-search-title-block m-0 p-0 lead-search-block--cust row mx-0 align-items-center">
          <div className="message-search-block px-0 mb-md-0">
            <form onSubmit={this.handleOnSubmitSearch}>
              <input
                type="text"
                name="quotationSearch"
                className="message-search-block__input mb-0 mr-0"
                placeholder="Search"
                onChange={this.handleOnChange}
                value={this.state.quotationSearch}
              />
              <img
                src="/img/desktop-dark-ui/icons/search-icon.svg"
                alt="search"
                className="message-search-block__icon"
                onClick={this.handleOnSubmitSearch}
              />
            </form>
          </div>
        </div>
      </>
    );
  };

  /*======================================
          Render quotation blocks
  =========================================*/
  renderQuotationBlocks = () => {
    const { allQuotation } = this.state;

    // Search

    let filtereddata = [];
    if (!isEmpty(this.props.searchInAllPage)) {
      let search = new RegExp(this.props.searchInAllPage, "i");
      filtereddata = allQuotation.filter((getall) => {
        if (search.test(getall.name)) {
          return getall;
        }
        // if (search.test(getall.company)) {
        //   return getall;
        // }
        // if (search.test(getall.email)) {
        //   return getall;
        // }
      });
      // console.log(filtereddata);
    } else {
      filtereddata = this.state.allQuotation;
    }
    let data = JSON.parse(localStorage.getItem("Data"));
    return (
      <Fragment>
        {!isEmpty(filtereddata) ? (
          filtereddata.map((quote, index) => {
            return (
              index >=
                (this.state.currentPagination - 1) * totalRecordsInOnePage &&
              index < this.state.currentPagination * totalRecordsInOnePage && (
                <div key={index} className="quotation-block-container">
                  {/*<div className="row mx-0 flex-nowrap justify-content-between">
                    <span className="mr-30">{quote.name}</span>
                    <div className="row mx-0 flex-nowrap">
                       <EditQuotation quotationData={quote} />
                      {/* {quote.status === "Draft" && (
                        <i
                          onClick={this.editQuotationHnadler(quote)}
                          className="fa fa-pencil-square-o"
                          aria-hidden="true"
                        ></i>
                      )}

                      <i
                        onClick={this.deleteQuotationHandler(quote)}
                        className="fa fa-trash"
                        aria-hidden="true"
                      ></i>
                    </div>
                  </div>

                  <h2>$ {quote.total}</h2>
                  <div className="row mx-0 flex-nowrap justify-content-between">
                    <p>{quote.lead.name}</p>
                    <ViewQuotation quotationData={quote} />
                    {/* <button
                      onClick={this.onQuotationCardClickHandler(quote)}
                      className="members-new-list-btn members-new-list-btn--view mr-0"
                    >
                      View
                    </button> 
                    </div>*/}
                  <div className="row mx-0 align-items-start flex-nowrap">
                    {!isEmpty(quote.additionalInfo.fileUrl) ? (
                      <div>
                        <img
                          src={`${quote.additionalInfo.fileUrl}&token=${data.token}`}
                          alt="quotation card profile"
                          className="quotation-card-profile-img"
                        />
                      </div>
                    ) : (
                      <div>
                        <img
                          src="https://res.cloudinary.com/myrltech/image/upload/v1620390514/Group_8823.svg"
                          alt="quotation card profile"
                          className="quotation-card-profile-img"
                        />
                      </div>
                    )}

                    <div className="quotation-block-container-text-block">
                      <h5 className="quotation-block-container-text-1">
                        {quote.additionalInfo.quotationNumber}
                      </h5>
                      <h4 className="quotation-block-container-text-2">
                        {quote.name}
                      </h4>
                      <h5 className="quotation-block-container-text-3">
                        {quote.status}
                        <span className="quotation-block-container-dot">.</span>
                        {""}
                        {/* <span className="quotation-block-container-text-4"> */}
                        Created on {format(quote.createdAt, "DD/MM/YYYY")}
                        {/* </span> */}
                      </h5>
                      {/* <div className="row mx-0 align-items-start">
                        <ViewQuotation quotationData={quote} />
                        <EditQuotation quotationData={quote} />
                      </div> */}
                    </div>
                    <ViewQuotation quotationData={quote} />
                  </div>
                  <div>
                    <h4 className="quotation-block-container-text-5">
                      Lead Name
                    </h4>
                    <h3 className="quotation-block-container-text-6">
                      {quote.lead.name}
                    </h3>
                  </div>
                  <div>
                    <h4 className="quotation-block-container-text-5 quotation-block-container-text-5--amount">
                      Amount Quoted
                    </h4>
                    <h5 className="quotation-block-container-text-7">
                      {/* $ */}
                      {quote.additionalInfo.currency.value} {quote.total}
                    </h5>
                  </div>
                  <div className="row mx-0 flex-nowrap quotation-block-container-bottom-div">
                    <button
                      className="quotation-send-btn"
                      onClick={this.handleSendQuotation}
                    >
                      <img
                        // src={require("../../../assets/img/quotations/quotation-send-icon.svg")}
                        src={
                          "/img/desktop-dark-ui/icons/quotation-send-icon.png"
                        }
                        alt="quotation send"
                        className="quotation-send-img"
                      />
                      send quotation
                    </button>
                    <button
                      className="quotation-send-btn quotation-send-btn--download"
                      onClick={this.handleDownloadQuotation(quote)}
                    >
                      <img
                        src={
                          "/img/desktop-dark-ui/icons/quotation-download-icon.png"
                        }
                        // src={require("../../../assets/img/quotations/quotation-download-icon.svg")}
                        alt="quotation send"
                        className="quotation-download-img"
                      />
                      Download
                    </button>
                    <EditQuotation quotationData={quote} />
                    <button
                      className="quotation-send-btn mx-0"
                      onClick={this.deleteQuotationHandler(quote)}
                    >
                      <img
                        src={"/img/desktop-dark-ui/icons/delete-icon.png"}
                        // src={require("../../../assets/img/quotations/quotation-delete-icon.svg")}
                        alt="quotation send"
                        className="quotation-delete-img"
                      />
                      {/* Delete */}
                    </button>
                  </div>
                </div>
              )
            );
          })
        ) : (
          <p className="font-18-medium color-white-79 mb-30">No Estimate Yet</p>
        )}
      </Fragment>
    );
  };

  render() {
    // console.log(this.props.allQuotation);
    // let array = ["1", "2", "3", "4"];
    const { allQuotation, deleteWarningPopup } = this.state;
    let allQuotationArray = [];
    if (allQuotation) {
      allQuotationArray = allQuotation;
    }

    return (
      <Fragment>
        <DeleteWarningPopup
          deleteWarningPopup={deleteWarningPopup}
          yesHandlder={this.yesHandlder}
          noHandler={this.noHandler}
          title={"quotation"}
        />
        {/* <div className="alphabates-filter-container leads-title-block-container">
          <div className="filter-container w-100">
            <div className="title align-items-center">
              <AddQuotations isMobile={false} />
            </div>
            <div className="customers-search-block align-items-center">
              <span className="font-24-semibold mr-30">
                {this.renderSearchBlock()}
              </span>
            </div>
          </div>          
        </div> */}
        <div className="row mx-0 flex-nowrap leads-new-datepicker-search-block">
          {this.renderSearchBlock()}
          <span className="border-right mx-3"></span>
          {this.renderDatePicker()}
        </div>
        <div className="row mx-0 quotation-block-view-conatiner">
          {isEmpty(allQuotationArray) ? (
            <p className="font-18-medium color-white-79 mb-30">
              No Estimate Yet
            </p>
          ) : (
            this.renderQuotationBlocks()
          )}
        </div>

        {!isEmpty(allQuotationArray) && (
          <div className="add-lead-pagination">
            <Pagination
              onChange={this.onChangePagination}
              current={this.state.currentPagination}
              defaultPageSize={totalRecordsInOnePage}
              total={this.state.getItemsList.length}
              showTitle={false}
            />
          </div>
        )}
      </Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  allQuotation: state.quotation.allQuotation,
  searchInAllPage: state.search.searchInAllPage,
});

export default connect(mapStateToProps, {
  getAllQuotation,
  searchQuotation,
  deleteQuotation,
  filterQuotationByLevel,
})(QuotationsContent);
