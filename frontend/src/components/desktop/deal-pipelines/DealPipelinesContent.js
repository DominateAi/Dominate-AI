import React, { Component, Fragment } from "react";
import DealPipelinesCard from "./DealPipelinesCard";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { connect } from "react-redux";
import isEmpty from "../../../store/validations/is-empty";
import DeleteWarningPopup from "./../common/DeleteWarningPopup";
import {
  deletePipelineById,
  seachPipelineAction,
} from "./../../../store/actions/dealsPipelineAction";
import { startOfDay, endOfDay } from "date-fns";
import AddNewPipeline from "./AddNewPipeline";

const dummyData = [1, 2, 3, 4, 5, 6, 7, 8];

export class DealPipelinesContent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      deleteWarningPopup: false,
      dealPipelinesSearch: "",
      startDate: null,
      endDate: null,
    };
  }

  static getDerivedStateFromProps(nextProps, nextState) {
    if (
      !isEmpty(nextProps.getAllPipelines) &&
      nextProps.getAllPipelines !== nextState.getAllPipelines
    ) {
      return {
        getAllPipelines: nextProps.getAllPipelines,
      };
    }
    return null;
  }

  componentDidUpdate() {
    if (this.props.getAllPipelines !== this.state.getAllPipelines) {
      this.setState({
        getAllPipelines: this.props.getAllPipelines,
      });
    }
  }

  /*==============================================
      render datepicker
 ==============================================*/

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
    this.props.seachPipelineAction(formData);
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

  /*==============================================
      render searchBlock
 ==============================================*/
  handleOnChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  handleOnSubmitSearch = (e) => {
    e.preventDefault();
    console.log(this.state.dealPipelinesSearch);
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  renderSearchBlock = () => {
    return (
      <>
        <div className="leads-title-block-container__new-search-title-block m-0 p-0 lead-search-block--cust row mx-0 align-items-center">
          <div className="message-search-block px-0 mb-md-0">
            <form onSubmit={this.handleOnSubmitSearch}>
              <input
                type="text"
                name="dealPipelinesSearch"
                className="message-search-block__input mb-0 mr-0"
                placeholder="Search"
                onChange={this.handleOnChange}
                value={this.state.dealPipelinesSearch}
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

  // Delete popup handlers

  deleteHandler = (id) => {
    console.log(id);
    this.setState({
      deleteWarningPopup: true,
      deleteId: id,
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
    this.props.deletePipelineById(deleteId, this.callBackDelete);
  };

  noHandler = () => {
    this.setState({
      deleteWarningPopup: false,
      deleteId: "",
    });
  };

  /*==============================================
      main
 ==============================================*/

  onClickPipelineCard = (pipelineData) => {
    console.log("clicked");
    localStorage.setItem("pipelineData", JSON.stringify(pipelineData));
  };
  render() {
    const { getAllPipelines, dealPipelinesSearch, deleteWarningPopup } =
      this.state;

    // Search
    let filtereddata = [];
    if (!isEmpty(dealPipelinesSearch)) {
      let search = new RegExp(dealPipelinesSearch, "i");
      filtereddata = getAllPipelines.filter((getall) => {
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
      filtereddata = getAllPipelines;
    }

    return (
      <>
        <DeleteWarningPopup
          deleteWarningPopup={deleteWarningPopup}
          yesHandlder={this.yesHandlder}
          noHandler={this.noHandler}
          title={"deal pipeline"}
        />
        <div className="row mx-0 flex-nowrap leads-new-datepicker-search-block">
          {this.renderSearchBlock()}
          <span className="border-right mx-3"></span>
          {this.renderDatePicker()}
        </div>
        <div className="account-cards-container">
          <div className="row mx-0">
            {/* for empty account */}
            <AddNewPipeline
              buttonText={"+"}
              buttonClassName={"deal-pipeline-add-card"}
            />
            {/* <h3 className="font-18-medium">No Account Found</h3> */}
            {!isEmpty(filtereddata) &&
              filtereddata.map((data, index) => (
                <Fragment key={index}>
                  <DealPipelinesCard
                    deleteHandler={this.deleteHandler}
                    cardData={data}
                    onClickPipelineCard={() => this.onClickPipelineCard(data)}
                    link={"/deal-pipelines-detail"}
                    img={require("../../../assets/img/deal-pipelines/deals-pipeline-card-dummy-img.svg")}
                    title={data.name}
                    extraCLassName={
                      this.props.activeWalkthroughPage === "deal-pipelines-2" &&
                      index === 0
                        ? "new-walkthrough-accounts-card-active"
                        : ""
                    }
                  />
                </Fragment>
              ))}
          </div>
        </div>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  getAllPipelines: state.dealsInPipeline.getAllPipelines,
  activeWalkthroughPage: state.auth.activeWalkthroughPage,
});

export default connect(mapStateToProps, {
  deletePipelineById,
  seachPipelineAction,
})(DealPipelinesContent);
