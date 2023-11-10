import React, {
  Fragment,
  useState,
  //  useEffect
} from "react";
import Modal from "react-responsive-modal";
import "../common/CustomModalStyle.css";
import AddLeadBlueProgressbar from "../leads/AddLeadBlueProgressbar";

const totalFormSlides = 3;

export default function ModalFormStructure() {
  const [values, setValues] = useState({
    open: false,
    prevNextIndex: 0,
  });

  // useEffect(() => {
  //   if (values.open) {
  //     console.log("mount");
  //     document.addEventListener("keydown", handleMainDivKeyDown);
  //   }
  //   return () => {
  //     if (!values.open) {
  //       console.log("unmount");
  //       document.removeEventListener("keydown", handleMainDivKeyDown);
  //     }
  //   };
  // }, [values.open]);

  // const handleMainDivKeyDown = (e) => {
  //   e.stopPropagation();
  //   e.preventDefault();
  //   let keyCode = e.keyCode || e.which;
  //   // Shift + ArrowLeft
  //   if (e.ctrlKey && keyCode === 37) {
  //     handlePrev();
  //   }
  //   // Shift + ArrowRight
  //   if (e.ctrlKey && keyCode === 39) {
  //     handleNext();
  //   }
  // };

  /*===================================================================================
        modal handlers
  ===================================================================================*/
  const onOpenModal = () => {
    setValues({
      ...values,
      open: true,
    });
  };

  const onCloseModal = () => {
    setValues({
      ...values,
      open: false,
      prevNextIndex: 0,
    });
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
    if (keyCode === 13) {
      e.preventDefault();
      handleNext();
    }
  };

  const handleNext = () => {
    // if (values.prevNextIndex === 0) {
    //   if (values.errors.leadsName) {
    //     setValues({
    //       ...values,
    //       prevNextIndex: values.prevNextIndex,
    //     });
    //   } else {
    //     setValues({
    //       ...values,
    //       prevNextIndex: values.prevNextIndex + 1,
    //     });
    //   }
    // }
    setValues({
      ...values,
      prevNextIndex:
        values.prevNextIndex < totalFormSlides
          ? values.prevNextIndex + 1
          : values.prevNextIndex,
    });
  };

  /*===================================================================================
        handlers
  ===================================================================================*/

  const handleSubmitOnKeyDown = (e) => {
    let keyCode = e.keyCode || e.which;
    if (keyCode === 13) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onCloseModal();
  };

  /*===================================================================================
        main
  ===================================================================================*/

  return (
    <>
      <button
        className="leads-title-block-btn-red-bg leads-title-block-btn-red-bg--email-list ml-30"
        onClick={onOpenModal}
      >
        New Form
      </button>
      {/* render add more info model */}
      <Modal
        open={values.open}
        onClose={onCloseModal}
        closeOnEsc={true}
        closeOnOverlayClick={false}
        center
        classNames={{
          overlay: "customOverlay",
          modal: "customModal customModal--addNewEmailList",
          closeButton: "customCloseButton",
        }}
      >
        <span className="closeIconInModal" onClick={onCloseModal} />
        {console.log(values.prevNextIndex)}
        <Fragment>
          <div className="add-lead-modal-container container-fluid pr-0 lead_page_component">
            <h1 className="font-30-bold mb-61">New Form</h1>
            <AddLeadBlueProgressbar
              percentage={
                (100 / totalFormSlides) * (values.prevNextIndex + 0.5)
              }
              skipButtonFrom={6}
              prevNextIndex={values.prevNextIndex}
            />
            <div className="add-lead-form-field-block">
              {/* prev next arrows */}
              <div className="add-lead-arrows">
                {values.prevNextIndex <= 0 ? (
                  ""
                ) : (
                  <>
                    <div className="add-lead-prev-icon" onClick={handlePrev}>
                      <img
                        src={require("../../../assets/img/icons/dominate-white-prev-arrow.png")}
                        alt="previous"
                      />
                    </div>
                  </>
                )}

                {values.prevNextIndex >= totalFormSlides ? (
                  ""
                ) : (
                  <div className="add-lead-next-icon" onClick={handleNext}>
                    <img
                      src={require("../../../assets/img/icons/dominate-white-next-arrow-icon.png")}
                      alt="next"
                    />
                  </div>
                )}
              </div>

              {/* form */}
              <form
                noValidate
                // onSubmit={handleSubmit}
                onKeyDown={onFormKeyDown}
              >
                {/* name */}
                {values.prevNextIndex === 0 && "lorem"}
                {values.prevNextIndex === 1 && "ipsum"}
                {values.prevNextIndex === 2 && "lorem"}
                {values.prevNextIndex === 3 && "ipsum"}

                {/* Set lead level and status */}
                {values.prevNextIndex === totalFormSlides && (
                  <>
                    <button
                      // type="submit"
                      onClick={handleSubmit}
                      onKeyDown={handleSubmitOnKeyDown}
                      className="save_new_lead_button"
                    >
                      Save
                    </button>
                  </>
                )}
              </form>
            </div>
          </div>
        </Fragment>
      </Modal>
    </>
  );
}
