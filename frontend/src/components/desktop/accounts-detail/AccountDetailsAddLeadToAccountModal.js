import React, { Fragment, useState, useEffect } from "react";
import Modal from "react-responsive-modal";
import "../common/CustomModalStyle.css";
import isEmpty from "./../../../store/validations/is-empty";
import store from "./../../../store/store";
import { SET_EMPTY_ERRORS } from "./../../../store/types";
import AddMemberSelectAndDisplayList from "../common/AddMemberSelectAndDisplayList";
import AddLead from "../leads/AddLead";
import { connect } from "react-redux";
import { addLeadInAccountDetails } from "./../../../store/actions/accountsAction";
import { useSelector, useDispatch } from "react-redux";

const allEmployeesOptions = [
  "All Members",
  "Archive Members",
  "Active Members",
];

const totalFormSlides = 2;

function AccountDetailsAddLeadToAccountModal() {
  const dispatch = useDispatch();
  const [values, setValues] = useState({
    open: false,
    displayListSelected: [],
    options: [],
    errors: {},
    apiErrors: {},
    singleAccountData: {},
  });

  const allActiveLeads = useSelector((state) => state.leads.activeLeads);

  const singleAccountData = useSelector(
    (state) => state.account.singleAccountData
  );

  useEffect(() => {
    if (!isEmpty(allActiveLeads) && !isEmpty(singleAccountData)) {
      let filterAccountLead = allActiveLeads.filter(
        (activeLead) => activeLead.account_id._id !== singleAccountData._id
      );
      let newArray = [];
      if (!isEmpty(filterAccountLead)) {
        newArray =
          filterAccountLead &&
          filterAccountLead.map((lead) => ({
            value: lead._id,
            label: lead.name,
            leadData: lead,
          }));
      } else {
        newArray = [];
      }

      setValues({
        ...values,
        allActiveLeads: allActiveLeads,
        options: newArray,
        singleAccountData: singleAccountData,
      });
    }
  }, [allActiveLeads, singleAccountData]);

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
      displayListSelected: [],
      errors: {},
      apiErrors: {},
    });
  };

  /*==============================
      Form Events Handlers
  ================================*/

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

  const handleChangeSelectClient = (selectedOption) => {
    setValues({
      ...values,
      selectOption: selectedOption,
      errors: { displayListSelected: "" },
    });

    // add option to list if it's not present in list
    // let newList = this.state.displayListSelected;
    let newList = [];
    if (newList.indexOf(selectedOption) === -1) {
      newList.push(selectedOption);
      setValues({
        ...values,
        displayListSelected: newList,
      });
    }
  };

  const handleRemoveMember = (index) => (e) => {
    let newList = values.displayListSelected;
    newList.splice(index, 1);
    setValues({
      ...values,
      selectOption: "",
      displayListSelected: newList,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSubmitFunctionMain();
  };

  const callBackAddLead = (status) => {
    if (status === 200) {
      onCloseModal();
    }
  };

  const handleSubmitFunctionMain = () => {
    const { displayListSelected } = values;
    const { singleAccountData } = values;
    if (isEmpty(displayListSelected)) {
      setValues({
        ...values,
        errors: { displayListSelected: "At least one lead is required" },
      });
    } else {
      // console.log(this.state);
      displayListSelected.forEach((element) => {
        let leadData = element.leadData;
        leadData.account_id = singleAccountData._id;

        dispatch(
          addLeadInAccountDetails(
            leadData._id,
            leadData,
            singleAccountData._id,
            callBackAddLead
          )
        );
      });

      // this.onCloseModal();
      // this.setState({
      //   success: true,
      // });
    }
  };

  /*============================
    render form
  =============================*/

  const renderForm = () => {
    const { open, errors } = values;
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
        <div className="add-lead-modal-container container-fluid pr-0">
          <h1 className="font-30-bold mb-61">Add leads to account</h1>

          <div className="add-lead-form-field-block pl-0">
            {/* form */}
            <form noValidate>
              <AddMemberSelectAndDisplayList
                selectedOptionValue={values.selectOption}
                handleChangeSelectClient={handleChangeSelectClient}
                options={values.options}
                displayListSelected={values.displayListSelected}
                handleRemoveMember={handleRemoveMember}
                error={errors.displayListSelected}
                customText={"Select Lead"}
                customSelectedText={"Selected Leads"}
              />

              <div className="row mx-0 align-items-center justify-content-end pt-25">
                {/* <div className="accounts-detail-leads-container__create-lead"> */}
                <AddLead
                  isMobile={false}
                  className="leads-title-block-btn-red-bg mr-30 ml-30"
                  buttonText="+ Add New Lead"
                />
                {/* </div> */}
                <button
                  // type="submit"
                  onClick={handleSubmit}
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
      <button
        className="leads-title-block-btn-red-bg leads-title-block-btn-red-bg--account-details-add-lead"
        onClick={onOpenModal}
      >
        &#43;Add New Lead
        {/* &#43; Add Lead to Account */}
      </button>

      {renderForm()}
    </Fragment>
  );
}

export default AccountDetailsAddLeadToAccountModal;
