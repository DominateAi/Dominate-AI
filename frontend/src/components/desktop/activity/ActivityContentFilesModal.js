import React, { useState } from "react";
import Modal from "react-responsive-modal";
import "../common/CustomModalStyle.css";
import { connect } from "react-redux";
import { leadsActivityFilesUpload } from "./../../../store/actions/leadsActivityAction";
import { validateLeadActivityFile } from "../../../store/validations/leadsValidation/leadActivityAddFileValidation";
import { useDispatch } from "react-redux";

function ActivityContentFilesModal({ leadActivityData }) {
  const dispatch = useDispatch();
  const [values, setValues] = useState({
    open: false,
    fileName: "",
    fileData: "",
    fileInfo: "",
    description: "",
    errors: {},
  });

  /*=====================================
        modal handlers
    ===================================== */

  const onOpenModal = () => {
    setValues({
      ...values,
      open: true,
      hasModelClose: false,
    });
  };

  const onCloseModal = () => {
    setValues({
      ...values,
      open: false,
      fileName: "",
      fileData: "",
      fileInfo: "",
      description: "",
      errors: {},
    });
  };

  /*=====================================
       custom handlers
    ===================================== */

  const handleOnChangeFile = (e) => {
    const data = new FormData();

    data.append("file", e.target.files[0]);

    setValues({
      ...values,
      fileName:
        e.target.files.length > 0 ? e.target.files[0].name : e.target.value,
      fileInfo: e.target.files.length > 0 ? e.target.files[0] : e.target.value,
      fileData: data,
    });

    // this.setState({
    //   fileName:
    //     e.target.files.length > 0 ? e.target.files[0].name : e.target.value
    // });
  };

  const handleOnChange = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value,
    });
  };

  const handleOnClickDiscard = () => {
    setValues({
      ...values,
      fileName: "",
      description: "",
      errors: {},
      open: false,
    });
  };

  const callBackUpload = (status) => {
    if (status === 200) {
      onCloseModal();
    }
  };

  const handleOnClickSave = (e) => {
    e.preventDefault();
    // console.log(this.state);

    const { errors, isValid } = validateLeadActivityFile(values);
    if (!isValid) {
      setValues({ ...values, errors });
    }

    if (isValid) {
      // console.log(this.state.fileData);
      dispatch(
        leadsActivityFilesUpload(
          values.fileData,
          values.description,
          leadActivityData._id,
          callBackUpload
        )
      );
    }
  };

  return (
    <>
      {/* modal link */}
      <button
        className="leads-title-block-btn-red-bg leads-title-block-btn-red-bg--notes"
        onClick={onOpenModal}
      >
        &#43; Upload New File
      </button>

      {/* modal content */}
      <Modal
        open={values.open}
        onClose={onCloseModal}
        closeOnEsc={false}
        closeOnOverlayClick={false}
        center
        classNames={{
          overlay: "customOverlay",
          modal: "customModal customModal--addLead",
          closeButton: "customCloseButton",
        }}
      >
        <div className="ac-files-modal-container">
          {/* close modal */}
          <span className="closeIconInModal" onClick={onCloseModal} />

          {/* content title*/}
          <h3 className="font-21-bold mb-48">&#43; New file</h3>

          <form>
            {/* select file */}
            <div className="ac-input-file-block">
              <div className="font-21-regular ac-input-file-block__textInput">
                {values.fileName === "" ? "Select the file" : values.fileName}
              </div>
              <input
                type="file"
                title=""
                accept="application/pdf, application/msword, image/jpeg, image/png"
                className="font-21-regular ac-input-file-block__fileInput"
                onChange={handleOnChangeFile}
              />
              <span className="ac-input-file-block__border-onfocus"></span>
            </div>
            <div>
              <p className="font-15-regular ac-input-file-block__note">
                &#40;Only supports pdf, word, jpeg, png file&#41;
              </p>
            </div>
            <div className="ac-input-file-block__errorBlock">
              {values.errors.fileName && (
                <div className="is-invalid add-lead-form-field-errors ml-0">
                  {values.errors.fileName}
                </div>
              )}
            </div>

            <div className="ac-input-file-block-textarea">
              <textarea
                rows="7"
                name="description"
                className="font-18-regular ac-email-modal-subject-textarea"
                placeholder="Type description here"
                value={values.description}
                onChange={handleOnChange}
                maxLength="50"
              />
              <div className="ac-input-file-block__errorBlock-description">
                {values.errors.description && (
                  <div className="is-invalid add-lead-form-field-errors ml-0">
                    {values.errors.description}
                  </div>
                )}
              </div>
            </div>

            {/* buttons */}
            <div className="ac-files-buttons-container">
              <button
                type="button"
                className="btn-funnel-view btn-funnel-view--files"
                onClick={handleOnClickDiscard}
              >
                Discard
              </button>
              <button
                type="submit"
                className="btn-funnel-view btn-funnel-view--files"
                onClick={handleOnClickSave}
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
}

export default ActivityContentFilesModal;
