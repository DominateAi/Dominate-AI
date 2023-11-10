import React, { useState } from "react";
import AddEmployeesFormFields from "./../../desktop/employees/AddEmployeesFormFields";
import Modal from "react-responsive-modal";
import { maxLengths } from "../../../store/validations/maxLengths/MaxLengths";
import { addToLog } from "./../../../store/actions/leadsActivityAction";
import isEmpty from "../../../store/validations/is-empty";
import { useDispatch } from "react-redux";

function AddToLogModal({
  leadActivityData,
  modalButtonContent,
  modalButtonClassName,
}) {
  const dispatch = useDispatch();
  const [values, setValues] = useState({
    isAddToLogModalOpen: false,
    activityTitle: "",
  });

  /*======================================================================
        renderAddToLogModalOpen
  ======================================================================*/
  const onOpenModal = () => {
    setValues({
      ...values,
      isAddToLogModalOpen: true,
    });
  };

  const onCloseModal = () => {
    setValues({
      ...values,
      isAddToLogModalOpen: false,
    });
  };

  const handleChange = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value,
    });
  };

  const addToLogCallback = (status) => {
    if (status === 200) {
      setValues({
        ...values,
        isAddToLogModalOpen: false,
        activityTitle: "",
      });
    }
  };

  const OnKeyDownAddLog = (e) => {
    e.stopPropagation();
    let keyCode = e.keyCode || e.which;
    if (keyCode === 13) {
      e.preventDefault();
      onActivitySubmit();
    }
  };

  const onActivitySubmit = (e) => {
    if (!isEmpty(e)) {
      e.preventDefault();
    }

    const formData = {
      logName: values.activityTitle,
      lead: leadActivityData._id,
      status: "UPCOMING",
      description: "this is the best",
      notes: [],
      files: [],
      date: new Date().toISOString(),
    };
    dispatch(addToLog(formData, addToLogCallback));
    // console.log(formData);
  };

  const renderAddToLogModalOpen = () => {
    return (
      <Modal
        open={values.isAddToLogModalOpen}
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
        <div className="add_activity_log add-lead-modal-container container-fluid pr-0 lead_page_component">
          <h1 className="font-30-bold mb-61">New Activity Log</h1>
          <form
            noValidate
            // onSubmit={this.handleSubmit}
            onKeyDown={OnKeyDownAddLog}
          >
            <AddEmployeesFormFields
              type="text"
              htmlFor={"activityTitle"}
              labelName={"What is the title of the log?"}
              id={"activityTitle"}
              name={"activityTitle"}
              placeholder={"Eg. name"}
              onChange={handleChange}
              value={values.activityTitle}
              maxLength={maxLengths.char30}
              // error={errors.contactsName}
            />
            <button onClick={onActivitySubmit}>Save</button>
          </form>
        </div>
      </Modal>
    );
  };

  return (
    <div>
      <>
        <button className={modalButtonClassName} onClick={onOpenModal}>
          {modalButtonContent}
        </button>
        {renderAddToLogModalOpen()}
      </>
    </div>
  );
}

export default AddToLogModal;
