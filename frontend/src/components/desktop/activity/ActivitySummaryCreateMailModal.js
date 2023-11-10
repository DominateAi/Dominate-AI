import React, { useState, useEffect } from "react";
import Modal from "react-responsive-modal";
import "../common/CustomModalStyle.css";
import { connect } from "react-redux";
import { statusEmpty } from "./../../../store/actions/authAction";
import {
  sendEmailToLeads,
  deleteEmailTemplate,
  saveEmailTemplate,
} from "./../../../store/actions/leadsActivityAction";
import isEmpty from "./../../../store/validations/is-empty";
import Alert from "react-s-alert";
import { validateActivityEmail } from "./../../../store/validations/leadsValidation/leadActivityEmailValidation";
import ActivityContentEmailComposeModalSubjectInputField from "./ActivityContentEmailComposeModalSubjectInputField";
import ActivityContentEmailComposeModalContentTextareaField from "./ActivityContentEmailComposeModalContentTextareaField";
import { useDispatch, useSelector } from "react-redux";

function ActivitySummaryCreateMailModal({ leadActivityData }) {
  const dispatch = useDispatch();
  const [values, setValues] = useState({
    open: false,
    isActiveTab1: true,
    isActiveTab2: false,
    sentMailsuccess: false,
    // newMail
    mailTo: "",
    activityTabEmailModalSubject: "",
    activityTabEmailModalBody: "",
    errors: {},
    fromMail: "",
    leadId: "",
    allEmailTemplate: [],
  });

  const allEmailTemplate = useSelector((state) => state.leads.emailTemplates);

  useEffect(() => {
    if (!isEmpty(allEmailTemplate)) {
      setValues({
        ...values,
        allEmailTemplate: allEmailTemplate,
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
      sentMailsuccess: false,
      hasModelClose: false,
    });
  };

  const onCloseModal = () => {
    setValues({
      ...values,
      open: false,
      activityTabEmailModalSubject: "",
      activityTabEmailModalBody: "",
      errors: {},
    });
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

  const handleOnClickNewMailSaveTemplate = (e) => {
    // this.onCloseModal();
    e.preventDefault();
    // console.log(
    //   "subject : ",
    //   this.state.activityTabEmailModalSubject,
    //   "message : ",
    //   this.state.activityTabEmailModalBody
    // );
    // console.log("clicked on new mail save as template button");
    const { errors, isValid } = validateActivityEmail(values);
    if (!isValid) {
      setValues({ ...values, errors });
    }
    if (isValid) {
      const newTemplate = {
        subject: values.activityTabEmailModalSubject,
        name: "Template",
        content: values.activityTabEmailModalBody,
      };
      dispatch(saveEmailTemplate(newTemplate));
      onCloseModal();
    }
  };

  const callBackSendMail = (status) => {
    if (status === 200) {
      onCloseModal();
    }
  };
  const handleOnClickNewMailSend = (e) => {
    e.preventDefault();
    const { errors, isValid } = validateActivityEmail(values);
    // if (!isValid) {
    //   setValues({ ...values, errors });
    // }
    // if (isValid) {
    const newEmail = {
      to: leadActivityData.email,
      from: leadActivityData.createdBy,
      subject: values.activityTabEmailModalSubject,
      body: values.activityTabEmailModalBody,
      entityType: "LEAD",
      entityId: leadActivityData._id,
      status: "NEW",
    };

    dispatch(
      sendEmailToLeads(newEmail, leadActivityData._id, callBackSendMail)
    );
    setValues({
      ...values,
      sentMailsuccess: true,
    });
    // }
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

  const handleOnClickUseTemplate = (templateSub, templateBody) => (e) => {
    // this.onCloseModal();
    e.preventDefault();
    setValues({
      ...values,
      activityTabEmailModalSubject: templateSub,
      activityTabEmailModalBody: templateBody,
      isActiveTab1: true,
      isActiveTab2: false,
    });
    Alert.success("<h4>Template Added To Mail</h4>", {
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
          {/* outer div className="pr-20"*/}
          <div>
            {/* to */}
            <h6 className="font-18-semibold mb-8 pl-10">
              To :{" "}
              <span className="font-18-regular">{leadActivityData.email}</span>
            </h6>
            {/* subject */}
            <ActivityContentEmailComposeModalSubjectInputField
              name="activityTabEmailModalSubject"
              onChange={handleOnChange}
              value={values.activityTabEmailModalSubject}
              error={values.errors.activityTabEmailModalSubject}
            />
            {/* body */}
            <ActivityContentEmailComposeModalContentTextareaField
              name="activityTabEmailModalBody"
              onChange={handleOnChange}
              value={values.activityTabEmailModalBody}
              error={values.errors.activityTabEmailModalBody}
            />
          </div>
          {/* end outer div */}

          {/* buttons */}
          <div className="ac-email-modal-btns-block">
            {/* <button type="submit" value="submit">Submit</button> */}
            <button
              className="btn-funnel-view btn-funnel-view--emailTemplate mr-30"
              onClick={handleOnClickNewMailSaveTemplate}
            >
              Save as Template
            </button>
            <button
              className="btn-funnel-view btn-funnel-view--activitySummary btn-funnel-view--activitySummary--email"
              onClick={handleOnClickNewMailSend}
            >
              Send Mail
            </button>
            {/* <img
              src={require("../../../assets/img/icons/Dominate-Icon_dustbin.svg")}
              alt="delete"
              className="activity-delete-img"
              onClick={this.handleOnClickNewMailDelete}
            /> */}
          </div>
        </form>
      </div>
    );
  };

  /*=====================================
        render template
    ===================================== */
  const renderTemplate = () => {
    const { allEmailTemplate } = values;
    if (!isEmpty(allEmailTemplate)) {
      return allEmailTemplate.map((template, index) => {
        return (
          <div
            key={index}
            className="ac-activity-card ac-activity-card--emailUseTemplate"
          >
            <div className="ac-use-template-border-bottom">
              <div className="justify-content-space-between mb-10 pr-70">
                <h6 className="font-18-semibold">{template.subject}</h6>
              </div>
              <div className="justify-content-space-between">
                <p className="font-18-regular">{template.content}</p>
                <div className="d-flex">
                  <button
                    className="btn-funnel-view btn-funnel-view--emailUseTemplate"
                    onClick={handleOnClickUseTemplate(
                      template.subject,
                      template.content
                    )}
                  >
                    Use template
                  </button>
                  <div className="ac-use-template-delete-img-block">
                    <img
                      src={require("../../../assets/img/icons/Dominate-Icon_dustbin.svg")}
                      alt="delete"
                      className="ac-email-template-delete-img"
                      onClick={handleOnClickDelete(template._id)}
                    />
                  </div>
                </div>
              </div>
            </div>
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
    <>
      {/* modal link */}
      <button
        className="leads-new-inner-page-profile-row__colm2-btn"
        onClick={onOpenModal}
      >
        <img src="/img/desktop-dark-ui/icons/lead-email.svg" alt="" />
        <span className="font-15-bold">Email</span>
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
          <h3 className="font-30-bold mb-8 activity-text-border-bottom">
            Compose Mail
          </h3>

          {/* tabs title  */}
          <div className="justify-content-space-between mb-30">
            <div className="ac-email-title">
              <button
                className={
                  values.isActiveTab1
                    ? "leads-new-filter-button leads-new-filter-button--active"
                    : "leads-new-filter-button"
                }
                onClick={handleOnClickIsActiveTab1}
              >
                New mail
              </button>
              {/* <span className="activity-text-border-right"></span> */}
              <button
                className={
                  values.isActiveTab2
                    ? "leads-new-filter-button leads-new-filter-button--active"
                    : "leads-new-filter-button"
                }
                onClick={handleOnClickIsActiveTab2}
              >
                Use template
              </button>
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
  );
}

export default ActivitySummaryCreateMailModal;
