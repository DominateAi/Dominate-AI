import React, { Fragment, useState, useEffect } from "react";
import Modal from "react-responsive-modal";
import "../common/CustomModalStyle.css";
import AddEmployeesFormFields from "../employees/AddEmployeesFormFields";
import { validateAddNewPipeline } from "../../../store/validations/dealPipelinesValidation/addNewPipelineValidation";

import isEmpty from "./../../../store/validations/is-empty";
import store from "./../../../store/store";
import { SET_EMPTY_ERRORS } from "./../../../store/types";
import { maxLengths } from "../../../store/validations/maxLengths/MaxLengths";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { createLeadsPipeline } from "./../../../store/actions/leadsPipelineAction";

const totalFormSlides = 0;

function AddLeadsPipeline({ buttonText, buttonClassName }) {
  const history = useHistory();
  const dispatch = useDispatch();
  const [values, setValues] = useState({
    open: false,
    prevNextIndex: 0,
    // account
    pipelinesName: "",
    errors: {},
  });

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
      // account
      pipelinesName: "",
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

  const createLeadPipeline = (status) => {
    if (status === 200) {
      onCloseModal();
    }
  };

  const handleSubmitFunctionMain = () => {
    // console.log(this.state);
    const { errors, isValid } = validateAddNewPipeline(values);
    // console.log(errors);
    if (!isValid) {
      setValues({
        ...values,
        errors: errors,
      });
    }
    if (isValid) {
      const formData = {
        leadPipelineName: values.pipelinesName,
        description: "Pipeline Description",
        additionalInfo: {
          Type: "NEW",
        },
      };
      dispatch(createLeadsPipeline(formData, createLeadPipeline));
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
    if (keyCode === 13 && values.prevNextIndex !== 1) {
      e.preventDefault();
      handleNext();
    }
  };

  const handleNext = () => {
    const { errors, isValid } = validateAddNewPipeline(values);

    if (values.prevNextIndex === 0) {
      if (errors.pipelinesName) {
        setValues({
          ...values,
          errors,
          prevNextIndex: values.prevNextIndex,
        });
      } else {
        setValues({
          ...values,
          prevNextIndex:
            values.prevNextIndex < totalFormSlides
              ? values.prevNextIndex + 1
              : values.prevNextIndex,
          errors: {},
        });
      }
    }
    // else {
    //   this.setState({
    //     prevNextIndex:
    //       this.state.prevNextIndex < totalFormSlides
    //         ? this.state.prevNextIndex + 1
    //         : this.state.prevNextIndex,
    //     errors: {},
    //   });
    // }
  };

  /*============================
    render form
  =============================*/

  const renderForm = () => {
    const { open, prevNextIndex, errors } = values;
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
          <h1 className="font-30-bold mb-61">New Lead Pipeline</h1>

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

              {prevNextIndex >= totalFormSlides ? (
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
                  htmlFor={"pipelinesName"}
                  labelName={"What is the lead pipeline's name?"}
                  id={"pipelinesName"}
                  name={"pipelinesName"}
                  placeholder={"Eg. name"}
                  onChange={handleChange}
                  value={values.pipelinesName}
                  maxLength={maxLengths.char30}
                  error={errors.pipelinesName}
                />
              )}
              {prevNextIndex === totalFormSlides && (
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
            </form>
          </div>
        </div>
      </Modal>
    );
  };

  return (
    <Fragment>
      <button
        className={
          buttonClassName
            ? buttonClassName
            : "leads-title-block-btn-red-bg mr-30 ml-30"
        }
        onClick={onOpenModal}
      >
        {buttonText ? buttonText : <>&#43; New Lead Pipeline </>}
      </button>

      {renderForm()}
    </Fragment>
  );
}

export default AddLeadsPipeline;
