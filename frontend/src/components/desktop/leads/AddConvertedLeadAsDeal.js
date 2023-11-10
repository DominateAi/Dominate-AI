import React, { Fragment, useState, useEffect } from "react";
import Modal from "react-responsive-modal";
import { maxLengths } from "./../../../store/validations/maxLengths/MaxLengths";
import AddEmployeesFormFields from "./../leads/AddLeadsFormField";
import Checkbox from "rc-checkbox";
import "rc-checkbox/assets/index.css";
import Select from "react-select";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ToggleSwitch from "../common/ToggleSwitch";
import isEmpty from "../../../store/validations/is-empty";
import { useSelector } from "react-redux";

function AddConvertedLeadAsDeal({
  convertedLeadPopup,
  onCloseModal,
  leadData,
}) {
  const [values, setValues] = useState({
    errors: "",
    dealsAccountNameSelectedOption: "",
    leadNameSelectedOption: "",
    dealsName: "",
    worthValueOfDeal: "",
    dealType: true,
    frequencySelectedOptionDropdown: "",
    startDate: new Date(),
    endDate: new Date(),
  });
  const [leadNameOptions, setleadNameOptions] = useState([]);
  const [dealsAccountNameOptions, setdealsAccountNameOptions] = useState([]);
  const [frequencyOptions, setfrequencyOptions] = useState([
    { value: "Yearly", label: "Yearly" },
    { value: "Monthly", label: "Monthly" },
    { value: "Quarterly", label: "Quarterly" },
  ]);

  useEffect(() => {
    if (!isEmpty(leadData)) {
      setValues({
        ...values,
        dealsName: leadData.name,
        worthValueOfDeal: leadData.worth,
      });
    }
  }, [convertedLeadPopup]);

  const allAccounts = useSelector((state) => state.account.allAccounts);

  const allLeads = useSelector((state) => state.leads.allLeads);

  useEffect(() => {
    if (!isEmpty(allAccounts)) {
      let newAccountArray =
        !isEmpty(allAccounts) &&
        allAccounts.map((account) => ({
          value: account._id,
          label: account.accountname,
        }));

      setdealsAccountNameOptions(newAccountArray);

      if (!isEmpty(leadData)) {
        setValues({
          ...values,
          dealsAccountNameSelectedOption: {
            value: leadData.account_id._id,
            label: leadData.account_id.accountname,
          },
        });
      }
    }
  }, [allAccounts, leadData]);

  useEffect(() => {
    if (!isEmpty(allLeads)) {
      let newLeadArray = allLeads.map((lead) => ({
        value: lead._id,
        label: lead.name,
      }));

      setleadNameOptions(newLeadArray);

      if (!isEmpty(leadData)) {
        setValues({
          ...values,
          leadNameSelectedOption: {
            value: leadData._id,
            label: leadData.name,
          },
        });
      }
    }
  }, [allLeads, leadData]);

  /*===================================
      Add Deal form event handlers
  ====================================*/

  const handleChange = (e) => {
    setValues({
      ...values,
      errors: {},
      apiErrors: {},
      [e.target.name]: e.target.value,
    });
  };

  const handleChangeNumber = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.validity.valid ? e.target.value : "",
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

  // const onCloseModal = () => {
  //   // store.dispatch({
  //   //   type: GET_KANBAN_STATUS_CHANGE,
  //   //   payload: [],
  //   // });
  //   // this.setState({
  //   //   dealsName: "",
  //   //   worthValueOfDeal: "1500",
  //   //   errors: {},
  //   //   convertedLeadPopup: false,
  //   //   addMoreInfoPopup: false,
  //   //   setPopup: false,
  //   //   customerOnBoardPopup: false,
  //   // });
  // };

  const callBackDealCreated = (status) => {
    if (status === 200) {
    }
  };

  const handleSubmitFunctionMain = (e) => {
    // console.log(this.state);
    // const { leadDataOfStatusChanged } = this.state;
    // const { errors, isValid } = validateAddNewDeal(this.state);
    // // console.log(errors);
    // if (!isValid) {
    //   this.setState({
    //     errors,
    //   });
    // }
    // if (isValid) {
    //   var data = JSON.parse(localStorage.getItem("Data"));
    //   if (this.state.dealType === true) {
    //     const formData = {
    //       dealname: this.state.dealsName,
    //       account: this.state.dealsAccountNameSelectedOption.value,
    //       salesperson: data.id,
    //       lead: this.state.leadNameSelectedOption.value,
    //       type: "RECURRING",
    //       status: "CLOSED",
    //       frequency:
    //         this.state.frequencySelectedOptionDropdown.value === "Yearly"
    //           ? "ANNUAL"
    //           : this.state.frequencySelectedOptionDropdown.value === "Monthly"
    //           ? "MONTHLY"
    //           : "QUARTERLY",
    //       value: this.state.worthValueOfDeal,
    //       closingDate: new Date().toISOString(),
    //       startDate: this.state.startDate.toISOString(),
    //       endDate: this.state.endDate.toISOString(),
    //       entityType: "ACCOUNT",
    //       entityId: leadDataOfStatusChanged.account_id,
    //     };
    //     this.props.createDeal(formData, this.callBackDealCreated);
    //   } else {
    //     const formData = {
    //       dealname: this.state.dealsName,
    //       account: this.state.dealsAccountNameSelectedOption.value,
    //       salesperson: data.id,
    //       lead: this.state.leadNameSelectedOption.value,
    //       type: "ONETIME",
    //       status: "CLOSED",
    //       closingDate: new Date(),
    //       value: this.state.worthValueOfDeal,
    //       entityType: "ACCOUNT",
    //       entityId: leadDataOfStatusChanged.account_id,
    //     };
    //     this.props.createDeal(formData, this.callBackDealCreated);
    //   }
    // }
  };

  const onSelectDropdownSelect = (e) => {
    setValues({
      ...values,
      frequencySelectedOptionDropdown: e,
    });
    console.log("Selected: " + e.value);
  };

  const toggleFunction = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.checked,
      hasActive: false,
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

  return (
    <div>
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
          <div className="add-lead-modal-container container-fluid pr-0">
            <h1 className="font-30-bold mb-61">New Deal</h1>

            <div className="add-lead-form-field-block">
              {/* form */}
              <form
                noValidate
                onSubmit={handleSubmit}
                // onKeyDown={onFormKeyDown}
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
                        error={values.errors.dealsName}
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
                          options={dealsAccountNameOptions}
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
                          options={leadNameOptions}
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
                          {values.errors.worthValueOfDeal && (
                            <div className="is-invalid add-lead-form-field-errors">
                              {values.errors.worthValueOfDeal}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="close-deal-form-screen-1 deals-toggle-color-change">
                      <h3 className="add-lead-label font-24-semibold">
                        Deal Type
                      </h3>
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
                  </div>
                </div>
                <div className="pt-25 text-right">
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
        </Modal>
      </Fragment>
    </div>
  );
}

export default AddConvertedLeadAsDeal;
