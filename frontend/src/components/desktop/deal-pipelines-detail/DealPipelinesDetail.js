import React, { Fragment, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AddNewDeal from "./AddNewDeal";
import Navbar from "../header/Navbar";
import AddNewStack from "./AddNewStack";
import StackCard from "./StackCard";
import CloseDealForm from "./CloseDealForm";
import isEmpty from "../../../store/validations/is-empty";
import {
  getStackOfPerticularPipeline,
  updateStackById,
  closeDealInPipeline,
} from "./../../../store/actions/dealsPipelineAction";
import { connect } from "react-redux";
import { getAllAccounts } from "./../../../store/actions/accountsAction";
import { getAllActiveLeads } from "./../../../store/actions/leadAction";
import { deleteDealById } from "./../../../store/actions/dealsAction";
import {
  // getAllCustomFieldsByEntity,
  createDealAchievementForUser,
} from "./../../../store/actions/commandCenter";
import Alert from "react-s-alert";
import store from "../../../store/store";
import { SET_SINGLE_DEAL_DATA } from "./../../../store/types";
import Modal from "react-responsive-modal";
import { validateCloseDealForm } from "../../../store/validations/dealPipelinesValidation/closeDealFormValidation";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Select from "react-select";
import ToggleSwitch from "../common/ToggleSwitch";
import { createWorkspaceActivity } from "./../../../store/actions/workspaceActivityAction";
import displaySmallText from "./../../../store/utils/sliceString";
import DeleteWarningPopup from "./../common/DeleteWarningPopup";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useHistory } from "react-router-dom";
import { checkClosedPipelineExistOrNot } from "./../../../store/actions/dealsPipelineAction";
import BreadcrumbMenu from "../header/BreadcrumbMenu";

const frequencyOptions = [
  { value: "Yearly", label: "Yearly" },
  { value: "Monthly", label: "Monthly" },
  { value: "Quarterly", label: "Quarterly" },
];

function DealPipelinesDetail() {
  const location = useLocation();
  const history = useHistory();
  const dispatch = useDispatch();
  const [values, setValues] = useState({
    deleteWarningPopup: false,
    closedDealOnboard: false,
    dealType: true,
    startDate: new Date(),
    endDate: new Date(),
    frequencySelectedOptionDropdown: frequencyOptions[0],
    city: "",
    shippingAddress: "",
    errors: {},
    getAllStackOfPipeline: [],
    getClosedStackOfPipeline: [],
  });

  const getAllStackOfPipeline = useSelector(
    (state) => state.dealsInPipeline.getAllStackOfPipeline
  );
  const getClosedStackOfPipeline = useSelector(
    (state) => state.dealsInPipeline.getClosedStackOfPipeline
  );

  useEffect(() => {
    // console.log(this.props.history.location.state.detail._id);
    const allLeadQuery = {
      query: {},
    };
    dispatch(getAllActiveLeads(allLeadQuery));
    dispatch(getAllAccounts());
    // dispatch(getAllCustomFieldsByEntity("DEAL"));
    // var pipelineData = JSON.parse(localStorage.getItem("pipelineData"));
    if (!isEmpty(history.location.state)) {
      const formData = {
        query: {
          pipeline: history.location.state.detail._id,
        },
      };
      dispatch(getStackOfPerticularPipeline(formData));
      setValues({
        ...values,
        pipelineData: history.location.state.detail,
      });
      const formDataCheckClosedList = {
        query: {
          pipeline: history.location.state.detail._id,
          type: "CLOSED",
        },
      };
      dispatch(checkClosedPipelineExistOrNot(formDataCheckClosedList));
    }
    store.dispatch({
      type: SET_SINGLE_DEAL_DATA,
      payload: {},
    });
  }, []);

  useEffect(() => {
    if (!isEmpty(getAllStackOfPipeline)) {
      setValues({
        ...values,
        getAllStackOfPipeline: getAllStackOfPipeline,
      });
    }
  }, [getAllStackOfPipeline]);

  useEffect(() => {
    if (!isEmpty(getClosedStackOfPipeline)) {
      setValues({
        ...values,
        getClosedStackOfPipeline: getClosedStackOfPipeline,
      });
    }
  }, [getClosedStackOfPipeline]);

  /*===========================================
             Scroll KanBan View
  =============================================*/

  const sideScroll = (element, direction, speed, distance, step) => {
    let scrollAmount = 0;
    var slideTimer = setInterval(function () {
      if (direction == "left") {
        element.scrollLeft -= step;
      } else {
        element.scrollLeft += step;
      }
      scrollAmount += step;
      if (scrollAmount >= distance) {
        window.clearInterval(slideTimer);
      }
    }, speed);
  };

  const nextHandler = () => {
    console.log("hello");
    var container = document.getElementById("container");
    sideScroll(container, "right", 25, 300, 20);
  };

  const prevHandler = () => {
    var container = document.getElementById("container");
    sideScroll(container, "left", 25, 300, 20);
  };

  const renderNexPrevButton = () => {
    // const { getAllStackOfPipeline } = values;

    return (
      <div style={{ marginLeft: "80px" }}>
        <img
          onClick={prevHandler}
          id="slideBack"
          src={require("./../../../assets/img/deal-pipelines/prev.svg")}
          alt=""
        />
        &nbsp;
        <img
          id="slide"
          onClick={nextHandler}
          src={require("./../../../assets/img/deal-pipelines/next.svg")}
          alt=""
        />
      </div>
    );
  };

  /*===========================================
             Scroll KanBan View End
  =============================================*/

  /*=================================
    closed deal Form Events Handlers
  ===================================*/

  const handleChange = (e) => {
    setValues({
      ...values,
      errors: {},
      [e.target.name]: e.target.value,
    });
  };

  const toggleFunction = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.checked,
      hasActive: false,
    });
  };

  const onSelectDropdownSelect = (e) => {
    setValues({
      ...values,
      frequencySelectedOptionDropdown: e,
    });
    console.log("Selected: " + e.value);
  };

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

  const handleSubmitOnKeyDown = () => (e) => {
    let keyCode = e.keyCode || e.which;
    if (keyCode === 13) {
      e.preventDefault();
      handleSubmitFunctionMain();
    }
  };

  const handleSubmit = () => (e) => {
    e.preventDefault();
    handleSubmitFunctionMain();
  };

  const callBackClosedDeal = (status, dealResData) => {
    var data = JSON.parse(localStorage.getItem("Data"));
    if (status === 200) {
      setValues({
        ...values,
        closedDealOnboard: false,
      });
      const formAchivementData = {
        user: data.id,
        deal: dealResData._id,
        value: dealResData.value,
        onDate: new Date().toISOString(),
        type: "CLOSED",
      };
      dispatch(createDealAchievementForUser(formAchivementData));
    }
  };

  const handleSubmitFunctionMain = () => {
    // console.log(this.state);
    const { errors, isValid } = validateCloseDealForm(values);
    if (!isValid) {
      setValues({
        ...values,
        errors,
      });
    }
    if (!isValid) {
      const { dragStartCardData, finalPreviousStackData, stackData } = values;
      let dealData = {};
      if (values.dealType === true) {
        dealData = dragStartCardData;
        dealData.status = "CLOSED";
        dealData.entityType = "ACCOUNT";
        dealData.entityId = dragStartCardData.account._id;
        dealData.type = "RECURRING";
        dealData.frequency =
          values.frequencySelectedOptionDropdown.value === "Yearly"
            ? "YEARLY"
            : values.frequencySelectedOptionDropdown.value === "Monthly"
            ? "MONTHLY"
            : "QUARTERLY";
        dealData.closingDate = new Date().toISOString();
        dealData.startDate = values.startDate.toISOString();
        dealData.endDate = values.endDate.toISOString();
      } else if (values.dealType === false) {
        dealData = dragStartCardData;
        dealData.entityType = "ACCOUNT";
        dealData.entityId = dragStartCardData.account._id;
        dealData.status = "CLOSED";
        dealData.type = "ONETIME";
        dealData.closingDate = new Date().toISOString();
      }

      console.log("dealData", dealData);
      console.log("stackdata", values.stackData);
      console.log("finalprevious", values.finalPreviousStackData);
      dispatch(
        closeDealInPipeline(dragStartCardData._id, dealData, callBackClosedDeal)
      );
      dispatch(
        updateStackById(finalPreviousStackData._id, finalPreviousStackData)
      );
      dispatch(updateStackById(stackData._id, stackData));
      dispatch(
        createWorkspaceActivity({
          name: dealData.dealname,
          type: "DEAL",
          act: "UPDATE",
          oldStatus: finalPreviousStackData.name,
          newStatus: stackData.name,
        })
      );
    }
  };

  /*==================================
        Drag And Drop Handler
  ===================================*/

  const onDragEndHandler = (e) => {
    // e.target.style.opacity = "";
    // e.currentTarget.style.background = "#ffffff";
    // e.currentTarget.style.color = "#000000";
  };
  const onDragStartHandler = (stackData, data, index) => (e) => {
    // console.log("Drag Start", stackData, data, index);
    setValues({
      ...values,
      dragStartStackData: stackData,
      dragStartCardData: data,
      dragStartCardIndex: index,
    });
  };

  const onDropHandler = (stackData, stackStatus) => (e) => {
    e.preventDefault();

    const { dragStartStackData, dragStartCardData, dragStartCardIndex } =
      values;

    console.log(stackStatus);
    if (stackStatus === "CLOSED") {
      let finalPreviousStackData = dragStartStackData;
      let finalPreviousCardData = dragStartStackData.cards;
      finalPreviousCardData.splice(dragStartCardIndex, 1);
      finalPreviousStackData.cards = finalPreviousCardData;
      let dealData = dragStartCardData;
      stackData.cards.push({ _id: dealData._id });
      setValues({
        ...values,
        closedDealOnboard: true,
        stackData: stackData,
        finalPreviousStackData: finalPreviousStackData,
      });
    } else if (
      stackStatus === "OTHER" &&
      dragStartCardData.status === "CLOSED"
    ) {
      Alert.success(`<h4>Can't change status of closed deals</h4>`, {
        position: "top-right",
        effect: "slide",
        beep: false,
        html: true,
        timeout: 5000,
        // offset: 100
      });
    } else {
      if (stackData !== dragStartStackData) {
        let dealData = dragStartCardData;
        let finalPreviousStackData = dragStartStackData;
        let finalPreviousCardData = dragStartStackData.cards;
        finalPreviousCardData.splice(dragStartCardIndex, 1);
        finalPreviousStackData.cards = finalPreviousCardData;
        stackData.cards.push(dragStartCardData);
        dispatch(
          updateStackById(finalPreviousStackData._id, finalPreviousStackData)
        );
        dispatch(updateStackById(stackData._id, stackData));
        console.log("previous stack", finalPreviousStackData);
        console.log("new stack", stackData);
        console.log("deal data", dealData);
        dispatch(
          createWorkspaceActivity({
            name: dealData.dealname,
            type: "DEAL",
            act: "UPDATE",
            oldStatus: finalPreviousStackData.name,
            newStatus: stackData.name,
          })
        );
      }
    }
  };
  const onDragOverHandler = (e) => {
    e.preventDefault();
    // console.log("DragOver", e);
  };

  /*==================================
        Drag And Drop Handler end
  ===================================*/

  /*===================================
            Render Cards
  ====================================*/
  const onCardClickHandler = (cardData, stackData, cardIndex) => (e) => {
    // console.log(cardData, stackData, cardIndex);
    // this.setState({
    //   kanbanCardDetailsPopup: true,
    //   selectedCardName: cardData.name,
    //   selectedCardDescription: cardData.description,
    //   selectedCardIndex: cardIndex,
    //   selectedStackData: stackData,
    // });
  };

  const handleDelete = (stackData, dealData) => (e) => {
    setValues({
      ...values,
      deleteWarningPopup: true,
      stackData: stackData,
      dealData: dealData,
    });
    // let finalPreviousStackData = stackData;
    // let cardArray = stackData.cards;
    // console.log(cardArray);
    // const index = cardArray.indexOf(dealData);
    // if (index > -1) {
    //   cardArray.splice(index, 1);
    // }
    // finalPreviousStackData.cards = cardArray;
    // // console.log(finalPreviousStackData);
    // this.props.deleteDealById(dealData._id);
    // this.props.updateStackById(
    //   finalPreviousStackData._id,
    //   finalPreviousStackData
    // );
  };

  const callBackDelete = () => {
    setValues({
      ...values,
      deleteWarningPopup: false,
      stackData: "",
      dealData: "",
    });
  };

  const yesHandlder = () => {
    const { stackData, dealData } = values;
    let finalPreviousStackData = stackData;
    let cardArray = stackData.cards;
    // console.log(cardArray);
    const index = cardArray.indexOf(dealData);
    if (index > -1) {
      cardArray.splice(index, 1);
    }
    finalPreviousStackData.cards = cardArray;
    // console.log(finalPreviousStackData);
    dispatch(deleteDealById(dealData._id, callBackDelete));
    dispatch(
      updateStackById(finalPreviousStackData._id, finalPreviousStackData)
    );
  };
  const noHandler = () => {
    setValues({
      ...values,
      deleteWarningPopup: false,
    });
  };

  const renderCards = (stackData) => {
    let list =
      !isEmpty(stackData.cards) &&
      stackData.cards.map((card, index) => (
        <div
          key={index}
          draggable="true"
          onDragStart={onDragStartHandler(stackData, card, index)}
          onDragEnd={onDragEndHandler}
          className="stack-card-container"
        >
          <div className="row mx-0 stack-card-container-row1 flex-nowrap">
            <div className="stack-card-img-div">
              <img
                src={require("../../../assets/img/deal-pipelines/deal-profile-img.png")}
                alt="stack"
                className="stack-card-img"
              />
            </div>
            <div className="stack-card-row1-colm2">
              <h3 className="font-18-semibold stack-card-title">
                {card.dealname}
              </h3>
              <h4 className="font-16-medium stack-card-subtitle">
                {!isEmpty(card.account) && card.account.accountname}
              </h4>
            </div>
          </div>
          <div className="row mx-0 stack-card-row2 flex-nowrap">
            <h3 className="font-16-medium stack-card-subtitle">Lead Name:</h3>
            <h4 className="font-16-medium stack-card-data">
              {!isEmpty(card.lead) && card.lead.name}
            </h4>
          </div>
          <div className="row mx-0 stack-card-row2 flex-nowrap">
            <h3 className="font-16-medium stack-card-subtitle">Assigned to:</h3>
            <h4 className="font-16-medium stack-card-data">
              {!isEmpty(card.salesperson) && card.salesperson.name}
            </h4>
          </div>
          <div className="row justify-content-between pt-10 mx-0">
            <div className="trash-icon">
              <i
                className="fa fa-trash"
                onClick={handleDelete(stackData, card)}
              />
            </div>
            <div>
              <Link
                to={{
                  pathname:
                    card.status === "CLOSED"
                      ? "/closed-deals-details"
                      : "/deals-details",
                  state: {
                    dealData: card,
                    // isEditLink: true,
                  },
                }}
              >
                <span className="stack-card-btn stack-card-btn-view">View</span>
              </Link>
              <Link
                to={{
                  pathname:
                    card.status === "CLOSED"
                      ? "/closed-deals-details"
                      : "/deals-details",
                  state: {
                    dealData: card,
                    isEditLink: true,
                  },
                }}
              >
                <span className="stack-card-btn stack-card-btn-edit">Edit</span>
              </Link>
            </div>
          </div>
        </div>
      ));
    return list;
  };

  const backHandler = () => {
    localStorage.removeItem("pipelineData");
    history.push("/deal-pipelines");
  };

  const onCloseModal = () => {
    var pipelineData = JSON.parse(localStorage.getItem("pipelineData"));
    if (!isEmpty(pipelineData)) {
      const formData = {
        query: {
          pipeline: pipelineData._id,
        },
      };
      dispatch(getStackOfPerticularPipeline(formData));
    }
    setValues({
      ...values,
      closedDealOnboard: false,
    });
  };

  const handleDateChangeRaw = (e) => {
    e.preventDefault();
  };

  /*============================
    render closed deal form
  =============================*/

  const renderClosedDealForm = () => {
    const { errors, closedDealOnboard } = values;

    return (
      <Modal
        open={closedDealOnboard}
        onClose={onCloseModal}
        closeOnEsc={true}
        closeOnOverlayClick={false}
        center
        classNames={{
          overlay: "customOverlay",
          modal: "customModal customModal--addLead",
          closeButton: "customCloseButton",
        }}
      >
        <span className="closeIconInModal" onClick={onCloseModal} />
        <div className="add-lead-modal-container container-fluid pr-0">
          <h1 className="font-30-bold mb-61">Close Deal</h1>

          <div className="add-lead-form-field-block">
            {/* form */}
            <form
              noValidate
              // onSubmit={this.handleSubmit}
              // onKeyDown={onFormKeyDown}
            >
              <div className="close-deal-form-screen-1 deals-toggle-color-change">
                <h3 className="add-lead-label font-24-semibold">Deal Type</h3>
                <ToggleSwitch
                  name="dealType"
                  currentState={values.dealType}
                  type={"checkbox"}
                  spantext1={"Reccurring"}
                  spantext2={"One Time"}
                  toggleclass={"toggle toggle--new-dashboard"}
                  toggleinputclass={
                    "toggle__switch toggle__switch--new-dashboard mx-3"
                  }
                  onChange={toggleFunction}
                  defaultChecked={true}
                />

                {values.dealType && (
                  <div>
                    <div>
                      <h3 className="add-lead-label font-24-semibold">
                        Frequency
                      </h3>

                      <Select
                        className="react-select-follow-up-form-container"
                        classNamePrefix="react-select-follow-up-form"
                        isSearchable={false}
                        options={frequencyOptions}
                        value={values.frequencySelectedOptionDropdown}
                        onChange={onSelectDropdownSelect}
                        placeholder="Select"
                      />
                    </div>
                    {/* datepicker */}
                    <div className="leads-title-block-container__date-picker mr-0">
                      {/* datepicker */}
                      <div>
                        <h3 className="add-lead-label font-24-semibold">
                          Start Date
                        </h3>
                        <DatePicker
                          selected={values.startDate}
                          selectsStart
                          startDate={values.startDate}
                          endDate={values.endDate}
                          onChange={handleChangeStart}
                          placeholderText="mm/dd/yyyy"
                          onChangeRaw={handleDateChangeRaw}
                        />
                      </div>
                      <div>
                        <h3 className="add-lead-label font-24-semibold">
                          End Date
                        </h3>
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
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-25 text-right">
                <button
                  // type="submit"
                  onClick={handleSubmit()}
                  onKeyDown={handleSubmitOnKeyDown()}
                  className="new-save-btn-blue"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      </Modal>
    );
  };

  return (
    <Fragment>
      <Navbar />
      <BreadcrumbMenu
        menuObj={[
          {
            title: "Sales Centre",
            link: "/sales-centre#engage",
          },
          {
            title: "Deal Pipelines",
            link: "/deal-pipelines",
          },
          {
            title: "Deal Pipeline",
          },
        ]}
      />
      <DeleteWarningPopup
        deleteWarningPopup={values.deleteWarningPopup}
        yesHandlder={yesHandlder}
        noHandler={noHandler}
        title={"deal"}
      />
      {renderClosedDealForm()}
      <div className="deals-background">
        <div className="quotation-new-container">
          <div className="row mx-0 align-items-center">
            {/* <Link to="/deal-pipelines"> */}
            <div className="go-back-yellow-arrow-new-leads">
              <img
                onClick={backHandler}
                src="/img/desktop-dark-ui/icons/white-back-arrow-circle.svg"
                alt="prev arrow"
              />
            </div>
            {/* </Link> */}
            <h2 className="page-title-new pl-0">
              {history.location.state.detail.name}
            </h2>
            {/* <AddNewDeal /> */}
            {renderNexPrevButton()}
          </div>
        </div>
        <div className="account-cards-container">
          <div id="container" className="kanban_view_main_container ">
            {!isEmpty(values.getAllStackOfPipeline) &&
              values.getAllStackOfPipeline.map((stack, index) => {
                console.log(stack);
                return (
                  <div key={index} className="kanban_list_columns">
                    <div className="heads">
                      <div className="stack_heading_dropdown">
                        <h3 className="heads__title">
                          {displaySmallText(stack.name, 10, true)}
                          {/* {} */}
                          {/* {this.renderStackEditDropdown(stack)} */}
                          <span>
                            {!isEmpty(stack.cards) ? stack.cards.length : 0}{" "}
                            deals
                          </span>
                        </h3>
                      </div>
                    </div>
                    <div
                      className="list_conatiner"
                      onDrop={onDropHandler(stack, "OTHER")}
                      onDragOver={onDragOverHandler}
                    >
                      <AddNewDeal stackData={stack} />
                      {renderCards(stack)}
                    </div>
                  </div>
                );
              })}
            <div className="add_new_stack_column">
              <AddNewStack />
            </div>
            {!isEmpty(values.getClosedStackOfPipeline) &&
              values.getClosedStackOfPipeline.map((stack, index) => {
                return (
                  <div key={index} className="closed_stack_column closed_stack">
                    <div className="heads">
                      <div className="stack_heading_dropdown">
                        <h3 className="heads__title">
                          CLOSED
                          {/* {this.renderStackEditDropdown(stack)} */}
                          <span>
                            {!isEmpty(stack.cards) ? stack.cards.length : 0}{" "}
                            deals
                          </span>
                        </h3>
                      </div>
                    </div>
                    <div
                      className="list_conatiner"
                      onDrop={onDropHandler(stack, "CLOSED")}
                      onDragOver={onDragOverHandler}
                    >
                      <div className="add-new-btn-kanban-board-block">
                        <button className="drop_deal_text_box">
                          Drop your closed deals here
                        </button>
                      </div>
                      {renderCards(stack)}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </Fragment>
  );
}

export default DealPipelinesDetail;
