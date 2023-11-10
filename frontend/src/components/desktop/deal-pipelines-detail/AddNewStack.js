import React, { useState, useEffect, Fragment } from "react";
import Modal from "react-responsive-modal";
import "../common/CustomModalStyle.css";
import AddEmployeesFormFields from "../employees/AddEmployeesFormFields";
import { validateAddNewStack } from "../../../store/validations/dealPipelinesValidation/addNewStackValidation";

import isEmpty from "./../../../store/validations/is-empty";
import store from "./../../../store/store";
import { SET_EMPTY_ERRORS } from "./../../../store/types";
import { maxLengths } from "../../../store/validations/maxLengths/MaxLengths";
import { createStack } from "./../../../store/actions/dealsPipelineAction";
import { useDispatch } from "react-redux";

const totalFormSlides = 0;

function AddNewStack() {
  const dispatch = useDispatch();
  const [values, setValues] = useState({
    open: false,
    prevNextIndex: 0,
    // form
    stackName: "",
    errors: {},
  });

  useEffect(() => {
    // handle prev and next screen by keyboard
    document.addEventListener("keydown", handleMainDivKeyDown);
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
      // form
      stackName: "",
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

  const callBackCreateStack = (status) => {
    if (status === 200) {
      onCloseModal();
    }
  };

  const handleSubmitFunctionMain = () => {
    // console.log(this.state);
    const { errors, isValid } = validateAddNewStack(values);
    // console.log(errors);
    if (!isValid) {
      setValues({
        ...values,
        errors: errors,
      });
    }
    if (isValid) {
      var pipelineData = JSON.parse(localStorage.getItem("pipelineData"));

      const formData = {
        name: values.stackName,
        pipeline: pipelineData._id,
        cards: [],
        type: "OTHER",
        additionalInfo: {},
      };
      dispatch(createStack(formData, callBackCreateStack));
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
    const { errors, isValid } = validateAddNewStack(values);
    // setValues({
    //   ...values,
    //   success: false,
    //   apiErrors: {},
    //   hasSetErrors: false,
    // });
    if (values.prevNextIndex === 0) {
      if (errors.stackName) {
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
          <h1 className="font-30-bold mb-61">New Stack</h1>

          <div className="add-lead-form-field-block">
            {/* prev next arrows */}
            <div className="add-lead-arrows">
              {prevNextIndex <= 0 ? (
                ""
              ) : (
                <img
                  src={require("../../../assets/img/icons/Dominate-Icon_prev-arrow.svg")}
                  alt="previous"
                  className="add-lead-prev-icon"
                  onClick={handlePrev}
                />
              )}

              {prevNextIndex >= totalFormSlides ? (
                ""
              ) : (
                <img
                  src={require("../../../assets/img/icons/Dominate-Icon_next-arrow.svg")}
                  alt="previous"
                  className="add-lead-next-icon"
                  onClick={handleNext}
                />
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
                  htmlFor={"stackName"}
                  labelName={"What is the stack's name?"}
                  id={"stackName"}
                  name={"stackName"}
                  placeholder={"Eg. name"}
                  onChange={handleChange}
                  value={values.stackName}
                  maxLength={maxLengths.char30}
                  error={errors.stackName}
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
      <div onClick={onOpenModal} className="heads add_new_stack">
        <div className="stack_heading_dropdown">
          <h3 className="heads__title">New Stack</h3>
        </div>
      </div>

      {renderForm()}
    </Fragment>
  );
}

export default AddNewStack;
