import React, { useState, useEffect } from "react";
import Modal from "react-responsive-modal";
import "../../common/CustomModalStyle.css";
import { connect } from "react-redux";
import { statusEmpty } from "../../../../store/actions/authAction";
import {
  getAllEmailTemapltes,
  deleteEmailTemplate,
  saveEmailTemplate,
  updateTemplateById,
} from "../../../../store/actions/leadsActivityAction";
import isEmpty from "../../../../store/validations/is-empty";
import Alert from "react-s-alert";
import { validateActivityEmail } from "../../../../store/validations/leadsValidation/leadActivityEmailValidation";
import ActivityContentEmailComposeModalSubjectInputField from "../../activity/ActivityContentEmailComposeModalSubjectInputField";
import ActivityContentEmailComposeModalContentTextareaField from "../../activity/ActivityContentEmailComposeModalContentTextareaField";
import EditorQuill from "./EditorQuill";
import { useDispatch, useSelector } from "react-redux";
import CreateTemplateSubject from "./CreateTemplateSubject";
import DeleteTemplateConfirmation from "./../../../desktop/popups/DeleteTemplateConfirmation";

function CreateEmailTemplate() {
  const dispatch = useDispatch();
  const [values, setValues] = useState({
    open: false,
    isActiveTab1: true,
    isActiveTab2: false,
    // newMail
    errors: {},
    allEmailTemplate: [],
    useTemplate: {},
  });

  const [activityTabEmailModalBody, setactivityTabEmailModalBody] =
    useState("");

  const [confirmDeleteModel, setconfirmDeleteModel] = useState(false);

  const allEmailTemplate = useSelector((state) => state.leads.emailTemplates);

  useEffect(() => {
    dispatch(getAllEmailTemapltes());
  }, [dispatch]);

  useEffect(() => {
    if (!isEmpty(allEmailTemplate)) {
      setValues({
        ...values,
        allEmailTemplate: allEmailTemplate,
      });
    } else {
      setValues({
        ...values,
        allEmailTemplate: [],
      });
    }
  }, [allEmailTemplate]);

  /*=====================================
        menu tab handlers
    ===================================== */

  const handleOnClickIsActiveTab1 = () => {
    setValues({
      ...values,
      isActiveTab1: true,
      isActiveTab2: false,
    });
  };

  const handleOnClickIsActiveTab2 = (e) => {
    e.preventDefault();
    setValues({
      ...values,
      isActiveTab1: false,
      isActiveTab2: true,
    });
  };

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
    localStorage.removeItem("createTemplateMailBody");
    localStorage.removeItem("createTemplateMailSubject");
    setValues({
      ...values,
      open: false,
      isActiveTab1: true,
      isActiveTab2: false,
      errors: {},
    });
    setactivityTabEmailModalBody("");
  };

  /*=====================================
       custom handlers new mail
    ===================================== */

  const handleOnChange = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value,
    });
  };

  const handleOnClickNewMailUpdateTemplate = (e) => {
    e.preventDefault();
    let createTemplateMailBody = JSON.parse(
      localStorage.getItem("createTemplateMailBody")
    );
    let createTemplateMailSubject = JSON.parse(
      localStorage.getItem("createTemplateMailSubject")
    );
    const formData = values.useTemplate;
    formData.subject = createTemplateMailSubject;
    formData.content = createTemplateMailBody;
    dispatch(updateTemplateById(formData._id, formData));
    onCloseModal();
  };

  const handleOnClickNewMailSaveTemplate = (e) => {
    // this.onCloseModal();
    e.preventDefault();

    const { errors, isValid } = validateActivityEmail(values);
    if (!isValid) {
      let createTemplateMailBody = JSON.parse(
        localStorage.getItem("createTemplateMailBody")
      );
      setValues({ ...values, errors });
      setactivityTabEmailModalBody(createTemplateMailBody);

      console.log(errors);
    }
    if (isValid) {
      let createTemplateMailBody = JSON.parse(
        localStorage.getItem("createTemplateMailBody")
      );
      let createTemplateMailSubject = JSON.parse(
        localStorage.getItem("createTemplateMailSubject")
      );

      const newTemplate = {
        subject: createTemplateMailSubject,
        name: "Template",
        content: createTemplateMailBody,
      };
      dispatch(saveEmailTemplate(newTemplate));
      onCloseModal();
    }
  };

  const handleOnClickNewMailDelete = (e) => {
    // this.onCloseModal();
    e.preventDefault();
    // console.log(this.state);
    console.log("clicked on new mail delete button");
  };

  const handleOnClickNewMailUseTemplate = (e) => {
    // this.onCloseModal();
    e.preventDefault();
    // console.log(this.state);
    console.log("clicked on new mail use template button");
  };

  /*============================================
      custom handlers use template handlers
  ============================================ */

  const handleOnClickUseTemplate = (template) => (e) => {
    // this.onCloseModal();
    e.preventDefault();
    setValues({
      ...values,
      isActiveTab1: true,
      isActiveTab2: false,
      useTemplate: template,
    });
    localStorage.setItem(
      "createTemplateMailSubject",
      JSON.stringify(template.subject)
    );
    localStorage.setItem(
      "createTemplateMailBody",
      JSON.stringify(template.content)
    );
    setactivityTabEmailModalBody(template.content);
    Alert.success("<h4>Template Added </h4>", {
      position: "top-right",
      effect: "slide",
      beep: false,
      html: true,
      timeout: 5000,
      // offset: 100
    });
  };

  const handleOnClickDelete = (teplateId) => (e) => {
    // this.onCloseModal();
    e.preventDefault();
    dispatch(deleteEmailTemplate(teplateId));
    setconfirmDeleteModel(false);
    // console.log(this.state);
    // console.log("clicked on delete button");
  };

  /*=====================================
        renderNewEmailBlock
  ===================================== */

  const renderNewEmailBlock = () => {
    return (
      <div className="ac-email-modal-form-block">
        <form>
          {/* outer div */}
          <div className="pr-20">
            <div className="pb-16"></div>
            {/* subject */}
            <CreateTemplateSubject errors={values.errors} />
            {/* body */}
            {/*<ActivityContentEmailComposeModalContentTextareaField
              name="activityTabEmailModalBody"
              onChange={this.handleOnChange}
              value={this.state.activityTabEmailModalBody}
              error={this.state.errors.activityTabEmailModalBody}
            />*/}
            <div className="dashboard-create-template-editorquill">
              <EditorQuill
                //placeholder="Mail body"
                emailEditorState={activityTabEmailModalBody}
              />
              {/* {values.errors && (
                <div className="is-invalid add-lead-form-field-errors ml-0">
                  {values.errors.activityTabEmailModalBody}
                </div>
              )} */}
            </div>
            {values.errors && (
              <div className="is-invalid add-lead-form-field-errors ml-0">
                {values.errors.activityTabEmailModalBody}
              </div>
            )}
          </div>
          {/* end outer div */}

          {/* buttons */}
          <div className="ac-email-modal-btns-block">
            {!isEmpty(values.useTemplate) ? (
              <>
                {" "}
                <button
                  className="btn-funnel-view btn-funnel-view--emailTemplate mr-30"
                  onClick={handleOnClickNewMailSaveTemplate}
                >
                  Save as new template
                </button>{" "}
                <button
                  className="btn-funnel-view btn-funnel-view--emailTemplate mr-30"
                  onClick={handleOnClickNewMailUpdateTemplate}
                >
                  Update template
                </button>
              </>
            ) : (
              <button
                className="btn-funnel-view btn-funnel-view--emailTemplate mr-30"
                onClick={handleOnClickNewMailSaveTemplate}
              >
                Save as template
              </button>
            )}
          </div>
        </form>
      </div>
    );
  };

  /*=====================================
        render template
    ===================================== */

  const openModel = () => {
    setconfirmDeleteModel(true);
  };
  const onCloseHandler = () => {
    setconfirmDeleteModel(false);
  };
  const renderTemplate = () => {
    const { allEmailTemplate } = values;
    if (!isEmpty(allEmailTemplate)) {
      return allEmailTemplate.map((template, index) => {
        return (
          <div
            key={index}
            className="ac-activity-card ac-activity-card--emailUseTemplate ac-activity-card--emailUseTemplate--dashboard ac-activity-card--emailUseTemplate--email-template align-items-start"
          >
            {/*<div className="ac-use-template-border-bottom">
              <div className="justify-content-space-between mb-10 pr-70">
                <h6 className="font-18-semibold">{template.subject}</h6>
              </div>
              <div className="justify-content-space-between">
                <p className="font-18-regular">{template.content}</p>
                <div className="d-flex">
                  <button
                    className="btn-funnel-view btn-funnel-view--emailUseTemplate"
                    onClick={handleOnClickUseTemplate(template)}
                  >
                    Use template
                  </button>
                </div>
              </div>
            </div>
            <div className="ac-use-template-delete-img-block">
              <DeleteTemplateConfirmation
                confirmDeleteModel={confirmDeleteModel}
                openModel={openModel}
                yesHandler={handleOnClickDelete}
                template={template}
                onCloseHandler={onCloseHandler}
              />
        </div>*/}
            <div className="mb-10 row mx-0 justify-content-between align-items-start ac-activity-card--emailUseTemplate--email-template--row1">
              <div className="pr-70">
                <h6 className="font-18-semibold">{template.subject}</h6>
              </div>
              <div className="d-flex">
                <button
                  className="btn-funnel-view btn-funnel-view--emailUseTemplate"
                  onClick={handleOnClickUseTemplate(template)}
                >
                  Use template
                </button>
                <div className="ac-use-template-delete-img-block ac-use-template-delete-img-block--use-email-template">
                  <DeleteTemplateConfirmation
                    confirmDeleteModel={confirmDeleteModel}
                    openModel={openModel}
                    yesHandler={handleOnClickDelete}
                    template={template}
                    onCloseHandler={onCloseHandler}
                  />
                </div>
              </div>
            </div>
            <div
              className="font-18-regular ac-use-template-text"
              contentEditable="true"
              dangerouslySetInnerHTML={{ __html: template.content }}
            ></div>
          </div>
        );
      });
    } else {
      return (
        <div className="ac-activity-card ac-activity-card--emailUseTemplate">
          <div className="ac-use-template-border-bottom">
            <div className="justify-content-space-between mb-10 pr-70">
              <h6 className="font-18-semibold">No Email Templates</h6>
            </div>
          </div>
        </div>
      );
    }
  };

  return (
    <div>
      <>
        {/* modal link */}
        <button className="create_email_template_button" onClick={onOpenModal}>
          Create Email Template
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
            modal:
              "customModal customModal--addLead customModal--mail-max-height",
            closeButton: "customCloseButton",
          }}
        >
          <div className="pl-30">
            {/* close modal */}
            <span className="closeIconInModal" onClick={onCloseModal} />

            {/* content title*/}
            <h3 className="font-30-bold mb-8 create-email-template-title">
              Create Email Template
            </h3>

            {/* tabs title  */}
            <div className="justify-content-space-between mb-30">
              <div className="ac-email-title">
                <h5
                  className={
                    values.isActiveTab1 ? "font-18-bold" : "font-18-regular"
                  }
                  onClick={handleOnClickIsActiveTab1}
                >
                  New template
                </h5>
                <span className="activity-text-border-right"></span>
                <h5
                  className={
                    values.isActiveTab2 ? "font-18-bold" : "font-18-regular"
                  }
                  onClick={handleOnClickIsActiveTab2}
                >
                  View template
                </h5>
              </div>
            </div>

            {/* tabs content */}
            {values.isActiveTab1 ? (
              <>{renderNewEmailBlock()}</>
            ) : (
              <>
                <div className="ac-email-template-outer-container">
                  {renderTemplate()}
                </div>
              </>
            )}
          </div>
        </Modal>
      </>
    </div>
  );
}

export default CreateEmailTemplate;
