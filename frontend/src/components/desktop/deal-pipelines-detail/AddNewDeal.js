import React, { Fragment, useState, useEffect } from "react";
import Modal from "react-responsive-modal";
import "../common/CustomModalStyle.css";
import Select from "react-select";
import AddEmployeesFormFields from "../employees/AddEmployeesFormFields";
import AddLeadBlueProgressbar from "../leads/AddLeadBlueProgressbar";
import { validateAddNewDeal } from "../../../store/validations/dealPipelinesValidation/addNewDealValidation";

import isEmpty from "./../../../store/validations/is-empty";
import store from "./../../../store/store";
import { SET_EMPTY_ERRORS } from "./../../../store/types";
import { maxLengths } from "../../../store/validations/maxLengths/MaxLengths";
import {
  updateStackById,
  createDealsInPipeline,
} from "./../../../store/actions/dealsPipelineAction";
import { workspaceActivityForDeals } from "./../../../store/actions/workspaceActivityAction";
import { createDealAchievementForUser } from "./../../../store/actions/commandCenter";
import AddLeadsFormField from "./../leads/AddLeadsFormField";
import { useDispatch, useSelector } from "react-redux";

const totalFormSlides = 3;

function AddNewDeal({ dealDataToFetchMemberLog, stackData }) {
  const dispatch = useDispatch();
  const [values, setValues] = useState({
    open: false,
    prevNextIndex: 0,
    // form
    dealsName: "",
    dealsAccountNameSelectedOption: "",
    // dealsAccountNameOptions: [],
    leadNameSelectedOption: "",
    // leadNameOptions: [],
    worthValueOfDeal: "1500",
    errors: {},
    customTextboxfieldData: {},
    customeDropdownFieldData: {
      // Dropdown: { value: "Facebook", label: "Facebook" },
    },
    totalFormSlides: 3,
  });

  const [dealsAccountNameOptions, setDealsAccountNameOptions] = useState([]);
  const [leadNameOptions, setLeadNameOptions] = useState([]);

  const allAccounts = useSelector((state) => state.account.allAccounts);
  const allActiveLeads = useSelector((state) => state.leads.activeLeads);
  const dealCustomFields = useSelector(
    (state) => state.commandCenter.dealCustomFields
  );

  useEffect(() => {
    // handle prev and next screen by keyboard
    document.addEventListener("keydown", handleMainDivKeyDown);

    return () => {
      //  handle prev and next screen by keyboard
      document.removeEventListener("keydown", handleMainDivKeyDown);
      store.dispatch({
        type: SET_EMPTY_ERRORS,
      });
    };
  }, []);

  useEffect(() => {
    if (!isEmpty(allAccounts)) {
      let newArray =
        !isEmpty(allAccounts) &&
        allAccounts.map((account) => ({
          value: account._id,
          label: account.accountname,
        }));

      setValues({
        ...values,
        allAccounts: allAccounts,
        // dealsAccountNameOptions: newArray,
      });
      setDealsAccountNameOptions(newArray);
    }
  }, [allAccounts]);

  useEffect(() => {
    if (!isEmpty(allActiveLeads)) {
      let newArray =
        !isEmpty(allActiveLeads) &&
        allActiveLeads.map((lead) => ({
          value: lead._id,
          label: lead.name,
        }));
      setValues({
        ...values,
        allActiveLeads: allActiveLeads,
        // leadNameOptions: newArray,
      });
      setLeadNameOptions(newArray);
    }
  }, [allActiveLeads]);

  useEffect(() => {
    if (!isEmpty(dealCustomFields)) {
      let textBoxData = dealCustomFields.filter(
        (element) => element.type === "TEXTBOX"
      );

      let dropDownData = dealCustomFields.filter(
        (element) => element.type === "DROPDOWN"
      );

      let textDataFinalObject = {};
      if (!isEmpty(textBoxData)) {
        textBoxData.forEach((ele) => {
          ele.name = ele.name.split(" ").join("");
          textDataFinalObject[ele.name] = "";
        });
      }

      setValues({
        ...values,
        dealCustomFields: dealCustomFields,
        customTextboxfieldData: textDataFinalObject,
        totalFormSlides: !isEmpty(dealCustomFields) ? 4 : 3,
      });
    }
  }, [dealCustomFields]);

  /*===============================
      Model Open Handlers
  =================================*/

  const onOpenModal = () => {
    setValues({ ...values, open: true });
  };

  const onCloseModal = () => {
    setValues({
      ...values,
      open: false,
      prevNextIndex: 0,
      dealsName: "",
      worthValueOfDeal: "",
      prevNextIndex: 0,
      // form
      dealsName: "",
      dealsAccountNameSelectedOption: "",
      leadNameSelectedOption: "",
      errors: {},
    });
  };

  /*==============================
      Form Events Handlers
  ================================*/

  const handleChange = (e) => {
    setValues({
      ...values,
      errors: {},

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
      errors: {},
      dealsAccountNameSelectedOption: e,
    });
    console.log("Selected: " + e.value);
  };

  const onSelectDealsLeadName = (e) => {
    setValues({
      ...values,
      errors: {},
      leadNameSelectedOption: e,
    });
    console.log("Selected: " + e.value);
  };

  const handleSubmitOnKeyDown = (e) => {
    let keyCode = e.keyCode || e.which;
    if (keyCode === 13) {
      e.preventDefault();
      handleSubmitFunctionMain();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSubmitFunctionMain();
  };

  const callBackAddDeal = (status, dealResData) => {
    // const { dealDataToFetchMemberLog } = this.props;
    var data = JSON.parse(localStorage.getItem("Data"));
    if (status === 200) {
      onCloseModal();
      const formAchivementData = {
        user: data.id,
        deal: dealResData._id,
        value: dealResData.value,
        onDate: new Date().toISOString(),
        type: "OTHER",
      };
      dispatch(createDealAchievementForUser(formAchivementData));

      if (!isEmpty(dealDataToFetchMemberLog)) {
        dispatch(workspaceActivityForDeals(dealDataToFetchMemberLog));
      }
    }
  };

  const handleSubmitFunctionMain = () => {
    const {
      dealCustomFields,
      customTextboxfieldData,
      customeDropdownFieldData,
    } = values;
    const { errors, isValid } = validateAddNewDeal(values);
    // console.log(errors);
    if (!isValid) {
      setValues({
        ...values,
        errors,
      });
    }
    if (isValid) {
      // const { stackData } = this.props;
      var data = JSON.parse(localStorage.getItem("Data"));

      const formData = {
        dealname: values.dealsName,
        account: values.dealsAccountNameSelectedOption.value,
        salesperson: data.id,
        lead: values.leadNameSelectedOption.value,
        entityType: "ACCOUNT",
        entityId: values.dealsAccountNameSelectedOption.value,
        // type: "RECURRING",
        status: "OTHER",
        // frequency: "MONTHLY",
        value: values.worthValueOfDeal,
        //  closingDate:"2019-04-14T16:30:50.526Z",
        //  startDate: "2019-04-14T16:30:50.526Z",
        // endDate:"2019-04-14T16:30:50.526Z"
      };
      // console.log(
      //   dealCustomFields,
      //   customTextboxfieldData,
      //   customeDropdownFieldData
      // );
      dispatch(
        createDealsInPipeline(
          formData,
          stackData,
          dealCustomFields,
          customTextboxfieldData,
          customeDropdownFieldData,
          callBackAddDeal
        )
      );
    }
  };

  const handleMainDivKeyDown = (e) => {
    e.stopPropagation();
    let keyCode = e.keyCode || e.which;
    // Shift + ArrowLeft
    if (e.ctrlKey && keyCode === 37) {
      handlePrev();
    }
    // Shift + ArrowRight
    if (e.ctrlKey && keyCode === 39) {
      handleNext();
    }
  };

  const handlePrev = () => {
    setValues({
      ...values,
      prevNextIndex:
        values.prevNextIndex > 0
          ? values.prevNextIndex - 1
          : values.prevNextIndex,
    });
  };

  // handle next on key enter
  const onFormKeyDown = (e) => {
    e.stopPropagation();
    let keyCode = e.keyCode || e.which;
    if (
      keyCode === 13 &&
      values.prevNextIndex !== 1 &&
      values.prevNextIndex !== 2
    ) {
      e.preventDefault();
      handleNext();
    }
  };

  const handleNext = () => {
    const { errors, isValid } = validateAddNewDeal(values);

    if (values.prevNextIndex === 0) {
      if (errors.dealsName) {
        setValues({
          ...values,
          errors,
          prevNextIndex: values.prevNextIndex,
        });
      } else {
        setValues({
          ...values,
          prevNextIndex: values.prevNextIndex + 1,
          errors: {},
        });
      }
    } else if (values.prevNextIndex === 1) {
      if (errors.dealsAccountNameSelectedOption) {
        setValues({
          ...values,
          errors,
          prevNextIndex: values.prevNextIndex,
        });
      } else {
        setValues({
          ...values,
          prevNextIndex: values.prevNextIndex + 1,
          errors: {},
        });
      }
    } else if (values.prevNextIndex === 2) {
      if (errors.leadNameSelectedOption) {
        setValues({
          ...values,
          errors,
          prevNextIndex: values.prevNextIndex,
        });
      } else {
        setValues({
          ...values,
          prevNextIndex: values.prevNextIndex + 1,
          errors: {},
        });
      }
    } else {
      setValues({
        ...values,
        prevNextIndex:
          values.prevNextIndex < values.totalFormSlides
            ? values.prevNextIndex + 1
            : values.prevNextIndex,
        errors: {},
      });
    }
  };

  /*============================
    render form
  =============================*/

  /*==================================================
            CUSTOM FIELD SECTION START
  ====================================================*/

  // CUSTOM TEXTBOX SECTION

  const handleChangeCustomTextBox = (name) => (e) => {
    let prevFieldData = values.customTextboxfieldData;
    prevFieldData[name] = e.target.value;
    setValues({
      ...values,
      customTextboxfieldData: prevFieldData,
    });
  };

  const renderCustomTextbox = (fieldData) => {
    // console.log(fieldData);
    let name = fieldData.name.split(" ").join("");
    return (
      <AddLeadsFormField
        checkboxClass={"add-account-custom-fileds-input"}
        htmlFor={`${fieldData.name}`}
        type={"text"}
        labelName={`${fieldData.name}`}
        id={`${fieldData.name}`}
        name={`${fieldData.name}`}
        placeholder={"Eg. India"}
        onChange={handleChangeCustomTextBox(name)}
        value={values.customTextboxfieldData[name]}
        maxLength={maxLengths.char200}
      />
    );
  };

  // CUSTOM DROPDOWN SECTION

  const onCustomDropdownChange = (name) => (e) => {
    let prevFieldData = values.customeDropdownFieldData;
    prevFieldData[name] = { value: e.value, label: e.value };
    setValues({
      ...values,
      customeDropdownFieldData: prevFieldData,
    });
    // console.log("Selected: " + e.value, name);
  };

  const renderCustomDropdown = (fieldData) => {
    console.log(fieldData);
    let name = fieldData.name.split(" ").join("");
    let dropdownOption = [];
    fieldData.options.forEach((element) => {
      let obj = { value: element, label: element };
      dropdownOption.push(obj);
    });
    return (
      <div className="mb-30">
        <label
          htmlFor="leadsSource"
          className="add-lead-label font-24-semibold"
        >
          {fieldData.name}
        </label>
        <div className="add-lead-input-field border-0">
          <Select
            className="react-select-add-lead-form-container"
            classNamePrefix="react-select-add-lead-form"
            isSearchable={false}
            options={dropdownOption}
            value={values.customeDropdownFieldData[name]}
            onChange={onCustomDropdownChange(name)}
            placeholder="Select"
          />
        </div>
      </div>
    );
  };

  /*==================================================
            CUSTOM FIELD SECTION END
  ====================================================*/

  const renderForm = () => {
    const { open, prevNextIndex, errors, dealCustomFields } = values;
    // console.log(errors);
    return (
      <Modal
        open={open}
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
        <div className="add-lead-modal-container lead_page_component  container-fluid pr-0">
          <h1 className="font-30-bold mb-61 ">New Deal</h1>
          <AddLeadBlueProgressbar
            percentage={(100 / values.totalFormSlides) * (prevNextIndex + 0.5)}
            //skipButtonFrom={values.totalFormSlides}
            skipButtonFrom={values.totalFormSlides + 1}
            prevNextIndex={prevNextIndex}
          />
          <div className="add-lead-form-field-block">
            {/* prev next arrows */}
            <div className="add-lead-arrows">
              {prevNextIndex <= 0 ? (
                ""
              ) : (
                <>
                  {/*<img
                  src={require("../../../assets/img/icons/Dominate-Icon_prev-arrow.svg")}
                  alt="previous"
                  className="add-lead-prev-icon"
                  onClick={this.handlePrev}
                />*/}
                  <div className="add-lead-prev-icon" onClick={handlePrev}>
                    <img
                      src={require("../../../assets/img/icons/dominate-white-prev-arrow.png")}
                      alt="previous"
                    />
                  </div>
                </>
              )}

              {prevNextIndex >= values.totalFormSlides ? (
                ""
              ) : values.dealCustomFields && prevNextIndex === 3 ? (
                ""
              ) : (
                <>
                  {/*<img
                  src={require("../../../assets/img/icons/Dominate-Icon_next-arrow.svg")}
                  alt="next"
                  className="add-lead-next-icon"
                  onClick={this.handleNext}
                />*/}
                  <div className="add-lead-next-icon" onClick={handleNext}>
                    <img
                      src={require("../../../assets/img/icons/dominate-white-next-arrow-icon.png")}
                      alt="next"
                    />
                  </div>
                </>
              )}
            </div>
            {/* form */}
            <form
              noValidate
              // onSubmit={this.handleSubmit}
              onKeyDown={onFormKeyDown}
            >
              {/* name */}
              {prevNextIndex === 0 && (
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
              )}

              {prevNextIndex === 1 && (
                <>
                  <div className="add-new-deal-account-name-block">
                    <h3 className="add-lead-label font-24-semibold">
                      Which account is the deal with?
                    </h3>
                    <Select
                      className="react-select-container mb-20"
                      classNamePrefix="react-select-elements"
                      value={values.dealsAccountNameSelectedOption}
                      onChange={onSelectDealsAccountName}
                      options={dealsAccountNameOptions}
                      placeholder="Select"
                      isSearchable={false}
                    />
                    {errors.dealsAccountNameSelectedOption && (
                      <div className="is-invalid add-lead-form-field-errors">
                        {errors.dealsAccountNameSelectedOption}
                      </div>
                    )}
                  </div>
                </>
              )}

              {prevNextIndex === 2 && (
                <>
                  <div className="add-new-deal-account-name-block">
                    <h3 className="add-lead-label font-24-semibold">
                      Who is the lead for this deal?
                    </h3>
                    <Select
                      className="react-select-container mb-20"
                      classNamePrefix="react-select-elements"
                      value={values.leadNameSelectedOption}
                      onChange={onSelectDealsLeadName}
                      options={leadNameOptions}
                      placeholder="Select"
                      isSearchable={false}
                    />
                    {errors.leadNameSelectedOption && (
                      <div className="is-invalid add-lead-form-field-errors">
                        {errors.leadNameSelectedOption}
                      </div>
                    )}
                  </div>
                </>
              )}

              {prevNextIndex === 3 && (
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
                      <div className="is-invalid add-lead-form-field-errors">
                        {errors.worthValueOfDeal}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {prevNextIndex === 4 && (
                <>
                  <h1 className="font-24-semibold add-lead-label mb-61">
                    Custom Fields
                  </h1>{" "}
                  {/* CUSTOM FIELDS SETCION */}
                  {!isEmpty(dealCustomFields) &&
                    dealCustomFields.map((data, index) => {
                      if (data.type === "TEXTBOX") {
                        return (
                          <div key={index} className="mt-5">
                            {renderCustomTextbox(data)}
                          </div>
                        );
                      } else {
                        return (
                          <div key={index} className="mt-5">
                            {renderCustomDropdown(data)}
                          </div>
                        );
                      }
                    })}
                </>
              )}

              {/** Custom filed */}
              {!isEmpty(dealCustomFields) && prevNextIndex === 3 ? (
                <div className="pt-25 text-right">
                  <button
                    className="add_more_info_lead_button"
                    onClick={handleNext}
                  >
                    Add more info
                  </button>
                  <button
                    // type="submit"
                    onClick={handleSubmit}
                    onKeyDown={handleSubmitOnKeyDown}
                    className="new-save-btn-blue"
                  >
                    Save
                  </button>
                </div>
              ) : (
                ""
              )}
              {prevNextIndex === values.totalFormSlides && (
                <div className="pt-25 text-right">
                  <button
                    // type="submit"
                    onClick={handleSubmit}
                    onKeyDown={handleSubmitOnKeyDown}
                    className="new-save-btn-blue"
                  >
                    Save
                  </button>
                </div>
              )}

              {/*<AddLeadBlueProgressbar
                percentage={
                  (100 / this.state.totalFormSlides) * (prevNextIndex + 0.5)
                }
                skipButtonFrom={this.state.totalFormSlides}
                prevNextIndex={prevNextIndex}
              />*/}
            </form>
          </div>
        </div>
      </Modal>
    );
  };

  return (
    <Fragment>
      <div className="add-new-btn-kanban-board-block">
        <button className="add-new-btn-kanban-board" onClick={onOpenModal}>
          &#43; Add New Deal
        </button>
      </div>

      {renderForm()}
    </Fragment>
  );
}

export default AddNewDeal;
