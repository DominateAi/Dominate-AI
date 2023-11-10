import React from "react";
import Modal from "react-responsive-modal";
import "../common/CustomModalStyle.css";

import AddLeadBlueProgressbar from "./../leads/AddLeadBlueProgressbar";
import PopupInputFields from "./../common/PopupInputFields";
import { maxLengths } from "./../../../store/validations/maxLengths/MaxLengths";
import { useState, useEffect } from "react";
import {
  createNote,
  updateNoteById,
} from "./../../../store/actions/accountsAction";
import { useDispatch, useSelector } from "react-redux";
import isEmpty from "../../../store/validations/is-empty";

const totalFormSlides = 1;
function EditNotes({ addTaskButtonClassName, addTaskButtonText, noteData }) {
  const dispatch = useDispatch();
  const [values, setValues] = useState({
    taskName: "",
    taskDesc: "",
  });

  const [prevNextIndex, setprevNextIndex] = useState(0);

  const [accountData, setaccountData] = useState({});

  const [addNotesModel, setAddNotesModel] = useState(false);

  const singleAccountData = useSelector(
    (state) => state.account.singleAccountData
  );

  useEffect(() => {
    if (!isEmpty(singleAccountData)) {
      setaccountData(singleAccountData);
    }
  }, [singleAccountData]);

  useEffect(() => {
    if (!isEmpty(noteData)) {
      setValues({
        taskName: noteData.title,
        taskDesc: noteData.data,
      });
    }
  }, [noteData]);

  /*===========================
      Render add task form
  ============================*/

  const handleSubmitOnKeyDown = (e) => {
    e.preventDefault();
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

  const callbackUpdateTask = (status) => {
    if (status === 200) {
      setAddNotesModel(false);
    }
  };

  const handleSubmitFunctionMain = (e) => {
    const newTask = {
      entityType: "ACCOUNT",
      entityId: accountData._id,
      title: values.taskName,
      data: values.taskDesc,
    };

    console.log(newTask);

    dispatch(updateNoteById(noteData._id, newTask, callbackUpdateTask));
  };

  const onFormKeyDown = (e) => {
    e.stopPropagation();
    let keyCode = e.keyCode || e.which;
    if (keyCode === 13 && prevNextIndex !== 1) {
      e.preventDefault();
      handleNext();
    } else if (keyCode === 13 && prevNextIndex === 1) {
      handleSubmitFunctionMain();
    }
  };

  const handlePrev = () => {
    setprevNextIndex(prevNextIndex > 0 ? prevNextIndex - 1 : prevNextIndex);
  };

  const handleNext = () => {
    setprevNextIndex(prevNextIndex + 1);
  };

  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value,
    });
  };

  const onOpenModal = () => {
    setAddNotesModel(true);
  };

  const onCloseModal = () => {
    setAddNotesModel(false);
  };

  const renderAddTaskForm = () => {
    // Task Description field
    const taskDescriptionField = (
      <div className="mb-30">
        <label htmlFor="taskDesc" className="add-lead-label font-24-semibold">
          Description for this note
        </label>
        <br />
        <textarea
          rows="5"
          id="taskDesc"
          name="taskDesc"
          className="add-lead-input-field font-18-regular"
          placeholder="Eg. Phase Alpha"
          value={values.taskDesc}
          onChange={handleChange}
          maxLength={maxLengths.char30}
          autoFocus={true}
        />
        {/* {errors.taskDesc && (
          <div className="is-invalid add-lead-form-field-errors ml-30">
            {errors.taskDesc}
          </div>
        )} */}
      </div>
    );

    return (
      <div className="add-lead-modal-container lead_page_component container-fluid pr-0">
        <h1 className="font-30-bold mb-61">Edit Note</h1>
        <AddLeadBlueProgressbar
          percentage={(100 / totalFormSlides) * (prevNextIndex + 0.5)}
          skipButtonFrom={3}
          prevNextIndex={prevNextIndex}
        />
        <div className="add-lead-form-field-block">
          {/* prev next arrows */}
          <div className="add-lead-arrows">
            {prevNextIndex <= 0 ? (
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

            {prevNextIndex >= totalFormSlides ? (
              ""
            ) : (
              <>
                <div className="add-lead-next-icon" onClick={handleNext}>
                  <img
                    src={require("../../../assets/img/icons/dominate-white-next-arrow-icon.png")}
                    alt="next"
                  />
                </div>
              </>
            )}

            {/* form */}
            <form
              className="add-tasklist-form"
              // onSubmit={this.handleSubmit}
              onKeyDown={onFormKeyDown}
            >
              {/* name */}
              {prevNextIndex === 0 ? (
                <PopupInputFields
                  htmlFor={"taskName"}
                  type={"text"}
                  labelName={"Name of note?"}
                  id={"taskName"}
                  name={"taskName"}
                  placeholder={"Eg. Make UI changes"}
                  onChange={handleChange}
                  value={values.taskName}
                  maxLength={maxLengths.char30}
                  //   error={errors.taskName}
                />
              ) : (
                ""
              )}
              {/* Description of task */}
              {prevNextIndex === 1 ? (
                <>
                  {taskDescriptionField} {/* buttons */}
                  <div className="pt-25 text-right">
                    <button
                      type="submit"
                      onClick={handleSubmit}
                      onKeyDown={handleSubmitOnKeyDown}
                      className="btn-funnel-view btn-funnel-view--add-lead-save-btn"
                    >
                      Save
                    </button>
                  </div>{" "}
                </>
              ) : (
                ""
              )}
            </form>

            {/*<AddLeadBlueProgressbar
              percentage={(100 / totalFormSlides) * (prevNextIndex + 0.5)}
              skipButtonFrom={2}
              prevNextIndex={prevNextIndex}
            />*/}
          </div>
        </div>
      </div>
    );
  };

  console.log(prevNextIndex);

  return (
    <>
      <button className={addTaskButtonClassName} onClick={onOpenModal}>
        {addTaskButtonText}
      </button>

      <Modal
        open={addNotesModel}
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
        {renderAddTaskForm()}
      </Modal>
    </>
  );
}

export default EditNotes;
