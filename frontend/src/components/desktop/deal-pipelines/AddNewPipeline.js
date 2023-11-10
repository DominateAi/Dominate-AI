import React, { Fragment, useState, useEffect } from "react";
import Modal from "react-responsive-modal";
import "../common/CustomModalStyle.css";
import AddEmployeesFormFields from "../employees/AddEmployeesFormFields";
import { validateAddNewPipeline } from "../../../store/validations/dealPipelinesValidation/addNewPipelineValidation";

import isEmpty from "./../../../store/validations/is-empty";
import store from "./../../../store/store";
import { SET_EMPTY_ERRORS } from "./../../../store/types";
import { maxLengths } from "../../../store/validations/maxLengths/MaxLengths";
import { createPipeline } from "./../../../store/actions/dealsPipelineAction";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";

const totalFormSlides = 0;

function AddNewPipeline({ buttonText, buttonClassName }) {
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

  const callBackCreatePipeline = (status) => {
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
        name: values.pipelinesName,
        try: "",
        additionalInfo: {},
      };
      dispatch(createPipeline(formData, callBackCreatePipeline, history));

      // this.onCloseModal();
      // this.setState({
      //   success: true,
      // });
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
          <h1 className="font-30-bold mb-61">New Pipeline</h1>

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
                  labelName={"What is the deal pipeline's name?"}
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
        {buttonText ? (
          <span className="deals-pipeline-btn-text-plus-icon">
            {buttonText}
          </span>
        ) : (
          <> &#43; New Pipeline </>
        )}
        {buttonText && (
          <div className="row mx-0 flex-nowrap align-items-center justify-content-between deal-pipelines__card-bottom-block">
            <p className="font-18-semibold color-white">Add new Pipeline</p>
          </div>
        )}
      </button>

      {renderForm()}
    </Fragment>
  );
}

export default AddNewPipeline;

// import React, { Component, Fragment } from "react";
// import Modal from "react-responsive-modal";
// import "../common/CustomModalStyle.css";
// import AddEmployeesFormFields from "../employees/AddEmployeesFormFields";
// import { validateAddNewPipeline } from "../../../store/validations/dealPipelinesValidation/addNewPipelineValidation";

// import isEmpty from "./../../../store/validations/is-empty";
// import store from "./../../../store/store";
// import { SET_EMPTY_ERRORS } from "./../../../store/types";
// import { maxLengths } from "../../../store/validations/maxLengths/MaxLengths";
// import { createPipeline } from "./../../../store/actions/dealsPipelineAction";
// import { connect } from "react-redux";
// import { withRouter } from "react-router-dom";

// const totalFormSlides = 0;

// class AddNewPipeline extends Component {
//   state = {
//     open: false,
//     prevNextIndex: 0,
//     // account
//     pipelinesName: "",
//     errors: {},
//     apiErrors: {},
//     success: false,
//   };

//   /*===============================
//         Lifecycle Methods
//   =================================*/

//   componentDidMount() {
//     // handle prev and next screen by keyboard
//     document.addEventListener("keydown", this.handleMainDivKeyDown);
//   }

//   static getDerivedStateFromProps(nextProps, nextState) {
//     if (
//       !isEmpty(nextProps.apiError) &&
//       nextProps.apiError !== nextState.apiErrors
//     ) {
//       return {
//         apiErrors: nextProps.apiError,
//       };
//     }
//     return null;
//   }

//   // componentDidUpdate() {
//   // console.log("component did upadate", this.state.apiErrors);
//   // if (
//   //   this.props.apiStatus &&
//   //   this.state.success &&
//   //   !this.state.hasClosedModal
//   // ) {
//   //   this.onCloseModal();
//   //   this.setState({ hasClosedModal: true });
//   // }
//   // if (
//   //   !isEmpty(this.state.apiErrors) &&
//   //   this.state.apiErrors.statusCode === 400 &&
//   //   !this.state.hasSetErrors &&
//   //   isEmpty(this.state.errors)
//   // ) {
//   //   this.setState({
//   //     prevNextIndex: 1,
//   //     hasSetErrors: true,
//   //   });
//   // }
//   // }

//   componentWillUnmount() {
//     // handle prev and next screen by keyboard
//     document.removeEventListener("keydown", this.handleMainDivKeyDown);
//     store.dispatch({
//       type: SET_EMPTY_ERRORS,
//     });
//   }

//   /*===============================
//       Model Open Handlers
//   =================================*/

//   onOpenModal = () => {
//     this.setState({ open: true, hasClosedModal: false, success: false });
//   };

//   onCloseModal = () => {
//     this.setState({
//       open: false,
//       prevNextIndex: 0,
//       // account
//       pipelinesName: "",
//       errors: {},
//       apiErrors: {},
//       success: false,
//     });
//   };

//   /*==============================
//       Form Events Handlers
//   ================================*/

//   handleChange = (e) => {
//     this.setState({
//       errors: {},
//       apiErrors: {},
//       success: false,
//       hasSetErrors: false,
//       [e.target.name]: e.target.value,
//     });
//   };

//   handleSubmitOnKeyDown = (e) => {
//     let keyCode = e.keyCode || e.which;
//     if (keyCode === 13) {
//       e.preventDefault();
//       this.handleSubmitFunctionMain();
//     }
//   };

//   handleSubmit = (e) => {
//     e.preventDefault();
//     this.handleSubmitFunctionMain();
//   };

//   callBackCreatePipeline = (status) => {
//     if (status === 200) {
//       this.onCloseModal();
//     }
//   };

//   handleSubmitFunctionMain = () => {
//     console.log(this.state);
//     const { errors, isValid } = validateAddNewPipeline(this.state);
//     // console.log(errors);
//     if (!isValid) {
//       this.setState({
//         errors: errors,
//       });
//     }
//     if (isValid) {
//       const formData = {
//         name: this.state.pipelinesName,
//         try: "",
//         additionalInfo: {},
//       };
//       this.props.createPipeline(
//         formData,
//         this.callBackCreatePipeline,
//         this.props.history
//       );

//       // this.onCloseModal();
//       // this.setState({
//       //   success: true,
//       // });
//     }
//   };

//   handleMainDivKeyDown = (e) => {
//     e.stopPropagation();
//     let keyCode = e.keyCode || e.which;
//     // Shift + ArrowLeft
//     if (e.ctrlKey && keyCode === 37) {
//       this.handlePrev();
//     }
//     // Shift + ArrowRight
//     if (e.ctrlKey && keyCode === 39) {
//       this.handleNext();
//     }
//   };

//   handlePrev = () => {
//     this.setState({
//       success: false,
//       apiErrors: {},
//       hasSetErrors: false,
//       prevNextIndex:
//         this.state.prevNextIndex > 0
//           ? this.state.prevNextIndex - 1
//           : this.state.prevNextIndex,
//     });
//   };

//   // handle next on key enter
//   onFormKeyDown = (e) => {
//     e.stopPropagation();
//     let keyCode = e.keyCode || e.which;
//     if (keyCode === 13 && this.state.prevNextIndex !== 1) {
//       e.preventDefault();
//       this.handleNext();
//     }
//   };

//   handleNext = () => {
//     const { errors, isValid } = validateAddNewPipeline(this.state);
//     this.setState({
//       success: false,
//       apiErrors: {},
//       hasSetErrors: false,
//     });
//     if (this.state.prevNextIndex === 0) {
//       if (errors.pipelinesName) {
//         this.setState({
//           errors,
//           prevNextIndex: this.state.prevNextIndex,
//         });
//       } else {
//         this.setState({
//           prevNextIndex:
//             this.state.prevNextIndex < totalFormSlides
//               ? this.state.prevNextIndex + 1
//               : this.state.prevNextIndex,
//           errors: {},
//         });
//       }
//     }
//     // else {
//     //   this.setState({
//     //     prevNextIndex:
//     //       this.state.prevNextIndex < totalFormSlides
//     //         ? this.state.prevNextIndex + 1
//     //         : this.state.prevNextIndex,
//     //     errors: {},
//     //   });
//     // }
//   };

//   /*============================
//     render form
//   =============================*/

//   renderForm = () => {
//     const { open, prevNextIndex, errors } = this.state;
//     // console.log(errors);
//     return (
//       <Modal
//         open={open}
//         onClose={this.onCloseModal}
//         closeOnEsc={true}
//         closeOnOverlayClick={false}
//         center
//         classNames={{
//           overlay: "customOverlay",
//           modal: "customModal customModal--addLead",
//           closeButton: "customCloseButton",
//         }}
//       >
//         <span className="closeIconInModal" onClick={this.onCloseModal} />
//         <div className="add-lead-modal-container container-fluid pr-0">
//           <h1 className="font-30-bold mb-61">New Pipeline</h1>

//           <div className="add-lead-form-field-block">
//             {/* prev next arrows */}
//             <div className="add-lead-arrows">
//               {prevNextIndex <= 0 ? (
//                 ""
//               ) : (
//                 <>
//                   {/*<img
//                   src={require("../../../assets/img/icons/Dominate-Icon_prev-arrow.svg")}
//                   alt="previous"
//                   className="add-lead-prev-icon"
//                   onClick={this.handlePrev}
//                 />*/}
//                   <div className="add-lead-prev-icon" onClick={this.handlePrev}>
//                     <img
//                       src={require("../../../assets/img/icons/dominate-white-prev-arrow.png")}
//                       alt="previous"
//                     />
//                   </div>
//                 </>
//               )}

//               {prevNextIndex >= totalFormSlides ? (
//                 ""
//               ) : (
//                 <>
//                   {/*<img
//                   src={require("../../../assets/img/icons/Dominate-Icon_next-arrow.svg")}
//                   alt="next"
//                   className="add-lead-next-icon"
//                   onClick={this.handleNext}
//                 />*/}
//                   <div className="add-lead-next-icon" onClick={this.handleNext}>
//                     <img
//                       src={require("../../../assets/img/icons/dominate-white-next-arrow-icon.png")}
//                       alt="next"
//                     />
//                   </div>
//                 </>
//               )}
//             </div>
//             {/* form */}
//             <form
//               noValidate
//               // onSubmit={this.handleSubmit}
//               onKeyDown={this.onFormKeyDown}
//             >
//               {/* name */}
//               {prevNextIndex === 0 && (
//                 <AddEmployeesFormFields
//                   type="text"
//                   htmlFor={"pipelinesName"}
//                   labelName={"What is the deal pipeline's name?"}
//                   id={"pipelinesName"}
//                   name={"pipelinesName"}
//                   placeholder={"Eg. name"}
//                   onChange={this.handleChange}
//                   value={this.state.pipelinesName}
//                   maxLength={maxLengths.char30}
//                   error={errors.pipelinesName}
//                 />
//               )}
//               {prevNextIndex === totalFormSlides && (
//                 <div className="pt-25 text-right">
//                   <button
//                     // type="submit"
//                     onClick={this.handleSubmit}
//                     onKeyDown={this.handleSubmitOnKeyDown}
//                     className="new-save-btn-blue"
//                   >
//                     Save
//                   </button>
//                 </div>
//               )}
//             </form>
//           </div>
//         </div>
//       </Modal>
//     );
//   };

//   render() {
//     return (
//       <Fragment>
//         <button
//           className="leads-title-block-btn-red-bg mr-30 ml-30"
//           onClick={this.onOpenModal}
//         >
//           &#43; New Pipeline
//         </button>

//         {this.renderForm()}
//       </Fragment>
//     );
//   }
// }

// export default connect(null, { createPipeline })(withRouter(AddNewPipeline));
