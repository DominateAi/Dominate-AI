import React, { Fragment, useState, useEffect } from "react";
import LeadsContentBlockCard from "./../leads/LeadsContentBlockCard";
import {
  getKanBanLeads,
  updateKanBanLeadAction,
  updateLeadAction,
  dropLeadAction,
  getAllActiveLeads,
} from "./../../../store/actions/leadAction";
import isEmpty from "./../../../store/validations/is-empty";
import Modal from "react-responsive-modal";
import "../common/CustomModalStyle.css";
import { validateAddNewDeal } from "../../../store/validations/dealPipelinesValidation/addNewDealValidation";
import {
  GET_KANBAN_STATUS_CHANGE,
  SET_CONFETTI_ANIMATION,
  SET_LOADER,
  CLEAR_LOADER,
} from "./../../../store/types";
import store from "./../../../store/store";
import Alert from "react-s-alert";
import "react-s-alert/dist/s-alert-css-effects/jelly.css";
import { getAllAccounts } from "./../../../store/actions/accountsAction";

// phone flags country code
import "react-phone-input-2/lib/style.css";
import { maxLengths } from "../../../store/validations/maxLengths/MaxLengths";
import AddNewFormModal from "./AddNewFormModal";

import Checkbox from "rc-checkbox";
import "rc-checkbox/assets/index.css";
import Select from "react-select";
import AddEmployeesFormFields from "../employees/AddEmployeesFormFields";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ToggleSwitch from "../common/ToggleSwitch";
import { createDeal } from "./../../../store/actions/dealsAction";
import { seachPipelineAction } from "./../../../store/actions/dealsPipelineAction";
import { useSelector, useDispatch } from "react-redux";
import AddLead from "../leads/AddLead";

const selectReasonDropdownOptions = [
  { value: "Went to competitor", label: "Went to competitor" },
  { value: "Out of budget", label: "Out of budget" },
  { value: "Low followups", label: "Low followups" },
  { value: "Not interested", label: "Not interested" },
  { value: "Deal cancelled", label: "Deal cancelled" },
  { value: "Others", label: "Others" },
];

const frequencyOptions = [
  { value: "Yearly", label: "Yearly" },
  { value: "Monthly", label: "Monthly" },
  { value: "Quarterly", label: "Quarterly" },
];

const kanbanStatus = [
  { name: "New Leads", status: "NEW_LEAD" },
  { name: "Contacted Leads", status: "CONTACTED_LEADS" },
  { name: "Qualified Leads", status: "QUALIFIED_LEADS" },
  { name: "On Hold Leads", status: "ON_HOLD" },
  { name: "Opportunity Leads", status: "OPPORTUNITIES" },
  { name: "Converted Leads", status: "CONVERTED" },
];

function KanbanBoard() {
  const dispatch = useDispatch();
  const [values, setValues] = useState({
    newLeads: [],
    qualifiedLeads: [],
    contactLeads: [],
    onHoldLeads: [],
    opportunityLeads: [],
    convertedLeads: [],
    allKanLead: [],
    dragStartData: [],
    setData: false,
    leadDataOfStatusChanged: [],
    convertedLeadPopup: false,
    addMoreInfoPopup: false,

    //add deal fields
    dealsName: "",
    dealsAccountNameSelectedOption: "",
    dealsAccountNameOptions: [],
    leadNameSelectedOption: "",
    leadNameOptions: [],
    worthValueOfDeal: "",

    errors: {},
    // drop lead form modal
    openDropLeadFormModal: false,
    deleteLeadCheckbox: false,
    selectedReasonOptionDropdown: selectReasonDropdownOptions[0],
    dropLeadReason: selectReasonDropdownOptions[0].value,
    additionalComment: "",
    errorsDropLead: {},
    customerOnBoardPopup: false,
    dealType: true,
    startDate: new Date(),
    endDate: new Date(),
    frequencySelectedOptionDropdown: frequencyOptions[0],
    pipelineSelectedOptionDropdown: "",
  });

  const [pipelineOptions, setPipelineOptions] = useState([]);

  //COMPONENT DID MOUNT
  useEffect(() => {
    var data = JSON.parse(localStorage.getItem("Data"));
    store.dispatch({
      type: GET_KANBAN_STATUS_CHANGE,
      payload: [],
    });
    dispatch(getKanBanLeads(data.id));
    const allLeadQuery = {
      query: {},
    };
    const formData = {
      // pageNo: 1,
      // pageSize: 3,
      query: {},
    };
    dispatch(seachPipelineAction(formData));
    dispatch(getAllActiveLeads(allLeadQuery));
    dispatch(getAllAccounts());
    // handle prev and next screen by keyboard
    // document.addEventListener("keydown", handleMainDivKeyDown);

    return () => {
      // handle prev and next screen by keyboard
      store.dispatch({
        type: SET_CONFETTI_ANIMATION,
        payload: false,
      });
      // document.removeEventListener("keydown", handleMainDivKeyDown);
    };
  }, []);

  // STATIC GET DERIVED
  const leadDataOfStatusChanged = useSelector(
    (state) => state.leads.kanbanLeadStatusChangedData
  );
  const kanBanLeads = useSelector((state) => state.leads.kanBanLeads);
  const allAccounts = useSelector((state) => state.account.allAccounts);
  const allLeads = useSelector((state) => state.leads.allLeads);
  const filterName = useSelector((state) => state.filterName.filterName);
  const getAllPipelines = useSelector(
    (state) => state.dealsInPipeline.getAllPipelines
  );
  const kanbanSearch = useSelector((state) => state.search.kanbanSearch);

  useEffect(() => {
    if (!isEmpty(getAllPipelines)) {
      let newPipelineOptions =
        !isEmpty(getAllPipelines) &&
        getAllPipelines.map((pipeline) => ({
          value: pipeline._id,
          label: pipeline.name,
        }));
      setPipelineOptions(newPipelineOptions);
    } else {
      setPipelineOptions([]);
    }
  }, [getAllPipelines]);

  useEffect(() => {
    if (!isEmpty(leadDataOfStatusChanged)) {
      var data = JSON.parse(localStorage.getItem("Data"));
      setValues({
        ...values,
        leadDataOfStatusChanged: leadDataOfStatusChanged,
      });
      if (leadDataOfStatusChanged.status === "CONVERTED") {
        let phoneNoNew = leadDataOfStatusChanged.phone;
        let countryCodeNew = phoneNoNew.slice(0, 3);
        let finalPhoneNoNew = phoneNoNew.slice(3, 10);
        dispatch(
          updateLeadAction(
            leadDataOfStatusChanged._id,
            {
              name: leadDataOfStatusChanged.name,
              company: leadDataOfStatusChanged.company,
              email: leadDataOfStatusChanged.email,
              phone: leadDataOfStatusChanged.phone,
              phoneCode: leadDataOfStatusChanged.phoneCode,
              status: leadDataOfStatusChanged.status,
              tags: leadDataOfStatusChanged.tags,
              assigned: leadDataOfStatusChanged.assigned,
              additionalInfo: "{'sdsd':'sdsd'}",
              profileImage: "https://xyz.com",
              about: leadDataOfStatusChanged.about,
              degree: leadDataOfStatusChanged.degree,
              entityType: "ACCOUNT",
              entityId: leadDataOfStatusChanged.account_id,
              media: {
                facebook: leadDataOfStatusChanged.media.facebook,

                linkedIn: leadDataOfStatusChanged.media.linkedIn,

                instagram: leadDataOfStatusChanged.media.instagram,

                other: leadDataOfStatusChanged.media.other,
              },
              worth: leadDataOfStatusChanged.worth,
              source: leadDataOfStatusChanged.source,
              convertedDate: new Date().toISOString(),
              isKanban: leadDataOfStatusChanged.isKanban,
              isHidden: leadDataOfStatusChanged.isHidden,
            },
            data.id
          )
        );

        /*============================
          Set add deal popup data
      =============================*/
        store.dispatch({
          type: CLEAR_LOADER,
        });
        store.dispatch({
          type: SET_CONFETTI_ANIMATION,
          payload: true,
        });
        // console.log("convrted", leadDataOfStatusChanged);

        let selectedAccount =
          !isEmpty(allAccounts) &&
          allAccounts.filter(
            (account) => account._id === leadDataOfStatusChanged.account_id
          );

        let newAccountArray =
          !isEmpty(allAccounts) &&
          allAccounts.map((account) => ({
            value: account._id,
            label: account.accountname,
          }));

        let newLeadArray =
          !isEmpty(allLeads) &&
          allLeads.map((lead) => ({
            value: lead._id,
            label: lead.name,
          }));

        setValues({
          ...values,
          convertedLeadPopup: false,
          setPopup: true,
          customerOnBoardPopup: true,
          dealsName: leadDataOfStatusChanged.name,
          worthValueOfDeal: leadDataOfStatusChanged.worth,
          dealsAccountNameSelectedOption: {
            value: !isEmpty(selectedAccount) ? selectedAccount[0]._id : "",
            label: !isEmpty(selectedAccount)
              ? selectedAccount[0].accountname
              : "",
          },
          dealsAccountNameOptions: newAccountArray,
          leadNameOptions: newLeadArray,
          leadNameSelectedOption: {
            value: !isEmpty(leadDataOfStatusChanged)
              ? leadDataOfStatusChanged._id
              : "",
            label: !isEmpty(leadDataOfStatusChanged)
              ? leadDataOfStatusChanged.name
              : "",
          },
        });
      }

      // set drop lead model

      if (leadDataOfStatusChanged.status === "DROPPED_LEAD") {
        setValues({
          ...values,
          openDropLeadFormModal: true,
        });
      }
    }
  }, [leadDataOfStatusChanged]);

  useEffect(() => {
    if (!isEmpty(kanBanLeads)) {
      let newLead = kanBanLeads.filter((newLeads) => {
        return newLeads.status === "NEW_LEAD";
      });

      let qualifiedLead = kanBanLeads.filter((newLeads) => {
        return newLeads.status === "QUALIFIED_LEADS";
      });

      let contactedLead = kanBanLeads.filter((newLeads) => {
        return newLeads.status === "CONTACTED_LEADS";
      });

      let onHoldLead = kanBanLeads.filter((newLeads) => {
        return newLeads.status === "ON_HOLD";
      });

      let oportunityLead = kanBanLeads.filter((newLeads) => {
        return newLeads.status === "OPPORTUNITIES";
      });
      let convertedLead = kanBanLeads.filter((newLeads) => {
        return newLeads.status === "CONVERTED";
      });
      let dropedLead = kanBanLeads.filter((newLeads) => {
        return newLeads.status === "DROPPED_LEAD";
      });
      convertedLead = convertedLead.reverse();
      convertedLead = convertedLead.splice(0, 10);
      // console.log(convertedLead);

      setValues({
        ...values,
        newLeads: newLead,
        qualifiedLeads: qualifiedLead,
        contactLeads: contactedLead,
        onHoldLeads: onHoldLead,
        opportunityLeads: oportunityLead,
        convertedLeads: convertedLead,
        dropedLead: dropedLead,
        allKanLead: kanBanLeads,
      });
    }
  }, [kanBanLeads]);

  /*===================================
        Drag And Drop Event Handlers
  =====================================*/
  const onDragEndHandler = (e) => {
    e.target.style.opacity = "";
    e.currentTarget.style.background = "#ffffff";
    e.currentTarget.style.color = "#000000";
  };
  const onDragStartHandler = (data, index) => (e) => {
    // console.log("Drag Start", data, index );
    store.dispatch({
      type: GET_KANBAN_STATUS_CHANGE,
      payload: [],
    });
    setValues({
      ...values,
      dragStartData: data,
      setPopup: false,
    });
    e.target.style.opacity = 0.4;
    e.target.style.background =
      "linear-gradient(305deg, #1488cc, #1488cc, #20bdff, #a5fecb)";
    e.currentTarget.style.color = "#ffffff";
  };
  const onDropHandler = (value) => (e) => {
    e.preventDefault();
    var data = JSON.parse(localStorage.getItem("Data"));
    // console.log(this.state.dragStartData._id);
    // console.log(value);

    // console.log(this.state.dragStartData);
    const { dragStartData } = values;
    if (dragStartData.status === "CONVERTED") {
      // alert("can not change status");
      Alert.success("<h4>Cant change status of converted lead</h4>", {
        position: "top-right",
        effect: "jelly",
        beep: false,
        html: true,
        timeout: 5000,
        // offset: 100
      });
    } else if (dragStartData.status === "DROPPED_LEAD") {
      // alert("can not change status");
      Alert.success("<h4>Cant change status of dropped lead</h4>", {
        position: "top-right",
        effect: "jelly",
        beep: false,
        html: true,
        timeout: 5000,
        // offset: 100
      });
    } else if (value === "DROPPED_LEAD") {
      // console.log(this.state.dragStartData);
      setValues({
        ...values,
        openDropLeadFormModal: true,
      });
    } else if (value === "CONVERTED") {
      store.dispatch({
        type: SET_LOADER,
      });
      dispatch(
        updateKanBanLeadAction(
          dragStartData._id,
          {
            name: dragStartData.name,
            company: dragStartData.company,
            email: dragStartData.email,
            phone: dragStartData.phone,
            phoneCode: dragStartData.phoneCode,
            status: value,
            tags: dragStartData.tags,
            assigned: dragStartData.assigned,
            additionalInfo: "{'sdsd':'sdsd'}",
            profileImage: "https://xyz.com",
            about: dragStartData.about,
            degree: dragStartData.degree,
            entityType: "Lead",
            entityId: dragStartData.account_id,
            media: {
              facebook: dragStartData.media.facebook,

              linkedIn: dragStartData.media.linkedIn,

              instagram: dragStartData.media.instagram,

              other: dragStartData.media.other,
            },
            worth: dragStartData.worth,
            source: dragStartData.source,
            convertedDate: new Date().toISOString(),
            isKanban: dragStartData.isKanban,
            isHidden: dragStartData.isHidden,
          },
          data.id,
          filterName
        )
      );
    } else {
      dispatch(
        updateKanBanLeadAction(
          dragStartData._id,
          {
            name: dragStartData.name,
            company: dragStartData.company,
            email: dragStartData.email,
            phone: dragStartData.phone,
            phoneCode: dragStartData.phoneCode,
            status: value,
            tags: dragStartData.tags,
            assigned: dragStartData.assigned,
            additionalInfo: "{'sdsd':'sdsd'}",
            profileImage: "https://xyz.com",
            about: dragStartData.about,
            degree: dragStartData.degree,
            media: {
              facebook: dragStartData.media.facebook,

              linkedIn: dragStartData.media.linkedIn,

              instagram: dragStartData.media.instagram,

              other: dragStartData.media.other,
            },
            worth: dragStartData.worth,
            source: dragStartData.source,
            // convertedDate: new Date().toISOString(),
            isKanban: dragStartData.isKanban,
            isHidden: dragStartData.isHidden,
          },
          data.is,
          filterName
        )
      );
    }

    // console.log("Drop Hanlder",e.dataTransfer, value );
  };
  const onDragOverHandler = (e) => {
    e.preventDefault();
    // console.log("DragOver", e);
  };

  /*===================================
      Add Deal form event handlers
  ====================================*/

  const handleChange = (e) => {
    setValues({
      ...values,
      errors: {},
      apiErrors: {},
      success: false,
      hasSetErrors: false,
      [e.target.name]: e.target.value,
    });
  };

  const handleChangeNumber = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.validity.valid ? e.target.value : "",
      errors: {},
    });
  };

  const onSelectDealsAccountName = (e) => {
    setValues({
      ...values,
      dealsAccountNameSelectedOption: e,
    });
    console.log("Selected: " + e.value);
  };

  const onSelectDealsLeadName = (e) => {
    setValues({
      ...values,
      leadNameSelectedOption: e,
    });
    console.log("Selected: " + e.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSubmitFunctionMain();
  };

  const onCloseModal = (e) => {
    e.preventDefault();
    store.dispatch({
      type: GET_KANBAN_STATUS_CHANGE,
      payload: [],
    });
    setValues({
      ...values,
      dealsName: "",
      worthValueOfDeal: "",
      errors: {},
      convertedLeadPopup: false,
      addMoreInfoPopup: false,
      setPopup: false,
      customerOnBoardPopup: false,
    });
  };

  // const handleSubmit = (e) => {
  //   e.preventDefault();

  //   handleSubmitFunctionMain();
  // };

  const callBackDealCreated = (status) => {
    if (status === 200) {
      store.dispatch({
        type: GET_KANBAN_STATUS_CHANGE,
        payload: [],
      });
      setValues({
        ...values,
        dealsName: "",
        worthValueOfDeal: "",
        errors: {},
        convertedLeadPopup: false,
        addMoreInfoPopup: false,
        setPopup: false,
        customerOnBoardPopup: false,
      });
    }
  };

  const handleSubmitFunctionMain = (e) => {
    // console.log(this.state);
    const { leadDataOfStatusChanged } = values;
    const { errors, isValid } = validateAddNewDeal(values);
    // console.log(errors);
    if (!isValid) {
      setValues({
        ...values,
        errors,
      });
      console.log(errors);
    }
    if (isValid) {
      var data = JSON.parse(localStorage.getItem("Data"));
      if (values.dealType === true) {
        const formData = {
          dealname: values.dealsName,
          account: values.dealsAccountNameSelectedOption.value,
          salesperson: data.id,
          lead: values.leadNameSelectedOption.value,
          type: "RECURRING",
          status: "CLOSED",
          frequency:
            values.frequencySelectedOptionDropdown.value === "Yearly"
              ? "ANNUAL"
              : values.frequencySelectedOptionDropdown.value === "Monthly"
              ? "MONTHLY"
              : "QUARTERLY",
          value: values.worthValueOfDeal,
          closingDate: new Date().toISOString(),
          startDate: values.startDate.toISOString(),
          endDate: values.endDate.toISOString(),
          entityType: "ACCOUNT",
          entityId: leadDataOfStatusChanged.account_id,
        };
        dispatch(
          createDeal(
            formData,
            values.pipelineSelectedOptionDropdown,
            callBackDealCreated
          )
        );
      } else {
        const formData = {
          dealname: values.dealsName,
          account: values.dealsAccountNameSelectedOption.value,
          salesperson: data.id,
          lead: values.leadNameSelectedOption.value,
          type: "ONETIME",
          status: "CLOSED",
          closingDate: new Date(),
          value: values.worthValueOfDeal,
          entityType: "ACCOUNT",
          entityId: leadDataOfStatusChanged.account_id,
        };

        dispatch(
          createDeal(
            formData,
            values.pipelineSelectedOptionDropdown,
            callBackDealCreated
          )
        );
      }
    }
  };

  const greatWorkHandler = () => {
    store.dispatch({
      type: SET_CONFETTI_ANIMATION,
      payload: false,
    });
    setValues({
      ...values,
      convertedLeadPopup: true,
    });
  };

  const renderOnBoardCustomerPopup = () => {
    const { customerOnBoardPopup, leadDataOfStatusChanged } = values;
    return (
      <Modal
        onClose={() => console.log("Unable to close")}
        open={customerOnBoardPopup}
        // open={true}
        // onClose={onCloseModal}
        closeOnEsc={true}
        closeOnOverlayClick={false}
        center
        classNames={{
          overlay: "customOverlay",
          modal: "customModal customModal--addLead",
          closeButton: "customCloseButton",
        }}
      >
        {/* <span className="closeIconInModal" onClick={this.logoutHandle} /> */}
        <div className="great_work_model text-center">
          <img
            src={require("./../../../assets/img/leads/great-work.svg")}
            alt=""
          />
          <h3>Great work!</h3>
          <p>
            &ldquo;{leadDataOfStatusChanged.name}&rdquo; Is now onboard.
            <br />
            Lets Add the deal finalized to the workspace.
          </p>
          <button onClick={greatWorkHandler}>Add Deal</button>
        </div>
      </Modal>
    );
  };

  /*================================================
     Render Add converted lead as Customer Form
  ==================================================*/

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

  const onSelectPipeloneDropdownSelect = (e) => {
    setValues({
      ...values,
      pipelineSelectedOptionDropdown: e,
    });
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

  const handleDateChangeRaw = (e) => {
    e.preventDefault();
  };

  const renderAddDealFields = () => {
    const { errors } = values;
    return (
      <div className="add-lead-modal-container container-fluid pr-0">
        <h1 className="font-30-bold mb-61">New Deal</h1>

        <div className="add-lead-form-field-block">
          {/* form */}
          <form
            noValidate
            // onSubmit={this.handleSubmit}
            // onKeyDown={this.onFormKeyDown}
          >
            <div className="new-edit-lead-form-overflow-block">
              <div className="row mx-0 edit-lead-new-design__row">
                <div className="edit-lead-new-design__colm1">
                  {/* name */}
                  <AddEmployeesFormFields
                    type="text"
                    htmlFor={"dealsName"}
                    labelName={"What is the deal's name?"}
                    id={"dealsName"}
                    name={"dealsName"}
                    placeholder={"Eg. name"}
                    onChange={handleChange}
                    value={values.dealsName}
                    maxLength={maxLengths.char30}
                    error={errors.dealsName}
                  />

                  <div className="add-new-deal-account-name-block kanban-add-deal-react-select-outerblock">
                    <h3 className="add-lead-label font-24-semibold">
                      Which account is the deal with?
                    </h3>
                    <Select
                      className="react-select-container pl-0"
                      classNamePrefix="react-select-elements"
                      value={values.dealsAccountNameSelectedOption}
                      onChange={onSelectDealsAccountName}
                      options={values.dealsAccountNameOptions}
                      placeholder="Select"
                      isSearchable={false}
                    />
                  </div>
                </div>
                <div className="edit-lead-new-design__colm2">
                  <div className="add-new-deal-account-name-block kanban-add-deal-react-select-outerblock">
                    <h3 className="add-lead-label font-24-semibold">
                      Who is the lead for this deal?
                    </h3>
                    <Select
                      className="react-select-container pl-0"
                      classNamePrefix="react-select-elements"
                      value={values.leadNameSelectedOption}
                      onChange={onSelectDealsLeadName}
                      options={values.leadNameOptions}
                      placeholder="Select"
                      isSearchable={false}
                    />
                  </div>

                  <div className="leads-new-details-col-1 mb-30">
                    <label
                      htmlFor="worthValueOfDeal"
                      className="add-lead-label font-24-semibold"
                    >
                      What is the worth value($) of the deal?
                    </label>
                    <br />
                    <div>
                      <input
                        type="text"
                        pattern="[0-9]*"
                        id="worthValueOfDeal"
                        name="worthValueOfDeal"
                        className="add-lead-input-field font-18-regular"
                        placeholder="Eg. 1500"
                        value={values.worthValueOfDeal}
                        onChange={handleChangeNumber}
                        autoFocus
                        maxLength={10}
                      />
                      {errors.worthValueOfDeal && (
                        <div className="is-invalid">
                          {errors.worthValueOfDeal}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="close-deal-form-screen-1 col-6 pl-0 deals-toggle-color-change">
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
                <div className="close-deal-form-screen-1 col-6 pl-0">
                  <h3 className="add-lead-label font-24-semibold">Pipeline</h3>

                  <Select
                    className="react-select-follow-up-form-container"
                    classNamePrefix="react-select-follow-up-form"
                    isSearchable={false}
                    options={pipelineOptions}
                    value={values.pipelineSelectedOptionDropdown}
                    onChange={onSelectPipeloneDropdownSelect}
                    placeholder="Select"
                  />
                </div>
              </div>
            </div>
            <div className="pt-25 text-right">
              <button
                // type="submit"
                onClick={onCloseModal}
                // onKeyDown={this.handleSubmitOnKeyDown}
                className="new-save-btn-blue-skip"
              >
                Skip
              </button>
              <button
                // type="submit"
                onClick={handleSubmit}
                // onKeyDown={this.handleSubmitOnKeyDown}
                className="new-save-btn-blue"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  /*===========================================
      Render drop lead form Modal and handlers
  =============================================*/

  const onOpenDropLeadModal = () => {
    setValues({
      ...values,
      openDropLeadFormModal: true,
    });
  };

  const onCloseDropLeadModal = (e) => {
    e.preventDefault();
    setValues({
      ...values,
      openDropLeadFormModal: false,
      deleteLeadCheckbox: false,
      selectedReasonOptionDropdown: selectReasonDropdownOptions[0],
      dropLeadReason: selectReasonDropdownOptions[0].value,
      additionalComment: "",
      errorsDropLead: {},
    });
  };

  const onReasonDropdownSelect = (e) => {
    setValues({
      ...values,
      selectedReasonOptionDropdown: e,
      dropLeadReason: e.value,
    });
  };

  const handleChangeDropLead = (e) => {
    this.setState({
      ...values,
      [e.target.name]: e.target.value,
    });
  };

  const handleCheckboxChangeDropLead = (e) => {
    setValues({
      ...values,
      [e.target.id]: e.target.checked,
    });
  };

  const leadUpdateCallbackAction = (status) => {
    if (status === 200) {
      setValues({
        ...values,
        openDropLeadFormModal: false,
        deleteLeadCheckbox: false,
        selectedReasonOptionDropdown: selectReasonDropdownOptions[0],
        dropLeadReason: selectReasonDropdownOptions[0].value,
        additionalComment: "",
        errorsDropLead: {},
      });
    }
  };

  const handleOnClickConfirm = (e) => {
    e.preventDefault();
    var data = JSON.parse(localStorage.getItem("Data"));
    const { dropLeadReason, deleteLeadCheckbox } = values;
    // console.log(this.state);
    // this.onCloseDropLeadModal();
    let leadData = values.dragStartData;
    leadData.reason_for_drop =
      dropLeadReason === "Went to competitor"
        ? "WENT_TO_COMPETITOR"
        : dropLeadReason === "Out of budget"
        ? "OUT_OF_BUDGET"
        : dropLeadReason === "Low followups"
        ? "LOW_FOLLOWUPS"
        : dropLeadReason === "Not interested"
        ? "NOT_INTERESTED"
        : dropLeadReason === "Deal cancelled"
        ? "DEAL_CANCELLED"
        : dropLeadReason === "Others"
        ? "OTHERS"
        : "";
    if (deleteLeadCheckbox === true) {
      leadData.status = "ARCHIVE";
      leadData.isHidden = true;
    } else {
      leadData.status = "DROPPED_LEAD";
      leadData.isHidden = false;
      leadData.isKanban = true;
    }

    dispatch(
      dropLeadAction(leadData._id, leadData, data.id, leadUpdateCallbackAction)
    );
  };

  const renderDropLeadFormModal = () => {
    let { openDropLeadFormModal, errorsDropLead } = values;
    return (
      <Modal
        open={openDropLeadFormModal}
        onClose={onCloseDropLeadModal}
        closeOnEsc={true}
        closeOnOverlayClick={false}
        center
        classNames={{
          overlay: "customOverlay",
          modal: "customModal customModal--addLead",
          closeButton: "customCloseButton",
        }}
      >
        <span className="closeIconInModal" onClick={onCloseDropLeadModal} />

        <div className="add-lead-modal-container add-lead-modal-container--followUp">
          <h1 className="font-21-bold mb-30">Reason for lead drop</h1>
          <form noValidate>
            <div className="add-lead-form-field-block add-follow-up-main-container">
              <div className="follow-up-select mb-30">
                <div className="set_level_and_status_of_lead mb-30">
                  <Select
                    className="react-select-follow-up-form-container"
                    classNamePrefix="react-select-follow-up-form"
                    isSearchable={false}
                    options={selectReasonDropdownOptions}
                    value={values.selectedReasonOptionDropdown}
                    onChange={(e) => onReasonDropdownSelect(e)}
                    placeholder="Select"
                  />
                </div>

                <div className="customCheckbox mb-30">
                  <label htmlFor="deleteLeadCheckbox">
                    <Checkbox
                      id="deleteLeadCheckbox"
                      onChange={handleCheckboxChangeDropLead}
                      value={values.deleteLeadCheckbox}
                      checked={values.deleteLeadCheckbox}
                      defaultChecked={false}
                    />
                    <span className="font-21-regular pl-2">
                      Delete the lead
                    </span>
                  </label>
                </div>

                <div className="row mx-0 justify-content-between">
                  <button
                    onClick={onCloseDropLeadModal}
                    className="drop-lead-cancel-btn"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={handleOnClickConfirm}
                    className="drop-lead-confirm-btn"
                  >
                    Confirm
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </Modal>
    );
  };

  /*==================================
      Render Converted Leads Model
  ====================================*/
  const renderConvertedLeadModel = () => {
    const { convertedLeadPopup } = values;
    return (
      <Fragment>
        <Modal
          open={convertedLeadPopup}
          onClose={onCloseModal}
          closeOnEsc={true}
          closeOnOverlayClick={false}
          center
          classNames={{
            overlay: "customOverlay customOverlay--warning_before_five_days",
            modal: "customModal lead_add_more_info_model",
            closeButton: "customCloseButton",
          }}
        >
          <span className="closeIconInModal" onClick={onCloseModal} />
          {renderAddDealFields()}
        </Modal>
      </Fragment>
    );
  };

  /*===================================
            Render New Leads
  ====================================*/

  let filtereddata = [];
  if (!isEmpty(kanbanSearch)) {
    let search = new RegExp(kanbanSearch, "i");
    filtereddata = kanBanLeads.filter((getall) => {
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
    filtereddata = kanBanLeads;
  }

  const renderKanbanLeads = (status) => {
    let filteredLeads = filtereddata.filter((ele) => ele.status === status);

    let list = [];
    if (!isEmpty(filteredLeads)) {
      list = filteredLeads.map((data, index) => (
        <div
          key={index}
          className="lead-single-card-container"
          draggable="true"
          onDragStart={onDragStartHandler(data, index)}
          onDragEnd={onDragEndHandler}
        >
          <LeadsContentBlockCard
            leadName={data.name}
            /* leadEmoji={this.props.lead.leadEmoji} */
            // leadEmoji="&#128165;"
            leadFollowUp={data.followups}
            leadFiles={"1"}
            leadContacted={"05-09-2019"}
            leadNotes={data.notes}
            leadTags={!isEmpty(data.tags) ? true : false}
            tagsArray={!isEmpty(data.tags) && data.tags}
            leadData={data}
            style={values.style}
          />
        </div>
      ));
    }

    return list;
  };

  const renderLeadsCount = (status) => {
    let filteredLeads = filtereddata.filter((ele) => ele.status === status);
    return <span>{filteredLeads.length} Leads</span>;
  };

  /*===================================
      Render Droped Leads
  =====================================*/

  const renderDropedLeads = () => {
    let list =
      !isEmpty(values.dropedLead) &&
      values.dropedLead.map((data, index) => (
        <div
          key={index}
          className="lead-single-card-container"
          draggable="true"
          onDragStart={onDragStartHandler(data, index)}
          onDragEnd={onDragEndHandler}
        >
          <LeadsContentBlockCard
            leadName={data.name}
            /* leadEmoji={this.props.lead.leadEmoji} */
            leadEmoji="&#128165;"
            leadFollowUp={data.followups}
            leadFiles={"1"}
            leadContacted={"05-09-2019"}
            leadNotes={data.notes}
            leadTags={!isEmpty(data.tags) ? true : false}
            tagsArray={!isEmpty(data.tags) && data.tags}
            leadData={data}
          />
        </div>
      ));
    return list;
  };

  const {
    // confettiAnimation,
    // newLeads,
    // qualifiedLeads,
    // contactLeads,
    // onHoldLeads,
    // opportunityLeads,
    // convertedLeads,
    dropedLead,
  } = values;

  return (
    <Fragment>
      {renderOnBoardCustomerPopup()}
      {renderConvertedLeadModel()}
      {renderDropLeadFormModal()}
      {!isEmpty(kanBanLeads) ? (
        <div className="leads-content-container">
          {kanbanStatus.map((data, index) => {
            return (
              <div key={index} className="leads-content-container__colms">
                <div className="heads">
                  <h3 className="heads__title">
                    {/* <span role="img" aria-labelledby="emoji">
                          👶
                        </span> */}
                    {data.name}
                    {renderLeadsCount(data.status)}
                    {/* <span>{!isEmpty(newLeads) ? newLeads.length : 0} Leads</span> */}
                  </h3>
                </div>
                <AddNewFormModal initialStatusDropDownOption={index} />
                <div
                  className="new_leads_container"
                  onDrop={onDropHandler(data.status)}
                  onDragOver={onDragOverHandler}
                >
                  {renderKanbanLeads(data.status)}
                </div>
              </div>
            );
          })}

          <div className="leads-content-container__colms">
            <div className="heads">
              <h3 className="heads__title">
                {/* <span role="img" aria-labelledby="emoji">
                        🧔
                      </span>{" "} */}
                Dropped Leads
                <span>
                  {!isEmpty(dropedLead) ? dropedLead.length : 0} Leads
                </span>
              </h3>
            </div>
            <div
              className="kanban-single-status-conainer"
              onDrop={onDropHandler("DROPPED_LEAD")}
              onDragOver={onDragOverHandler}
            >
              {renderDropedLeads()}
            </div>
          </div>
        </div>
      ) : (
        // <div className="container-fluid task-list-table-illustration-container">
        //   <h3>No leads added to kanban view</h3>
        //   <img
        //     src={require("../../../assets/img/illustrations/leads-kanban.svg")}
        //     alt="illustration"
        //     className="w-100"
        //   />
        //   </div>

        <div className="leads-pipeline-empty-div">
          <img
            src="/img/desktop-dark-ui/illustrations/lead-pipeline-inner-list-view.svg"
            alt=""
          />
          <AddLead
            isMobile={false}
            className="leads-title-block-btn-red-bg mr-30 ml-30"
            buttonText="+ Add New Lead"
          />
        </div>
      )}
    </Fragment>
  );
}

export default KanbanBoard;
