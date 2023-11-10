import React, { useState, useEffect } from "react";
import Modal from "react-responsive-modal";
import "../common/CustomModalStyle.css";
import { connect } from "react-redux";
import { statusEmpty } from "./../../../store/actions/authAction";
import {
  sendEmailToLeads,
  saveEmailTemplate,
  getAllEmailTemapltes,
  deleteEmailTemplate,
} from "./../../../store/actions/leadsActivityAction";
import isEmpty from "./../../../store/validations/is-empty";
import { validateActivityEmail } from "./../../../store/validations/leadsValidation/leadActivityEmailValidation";
import Alert from "react-s-alert";
import ActivityContentEmailComposeModalSubjectInputField from "./ActivityContentEmailComposeModalSubjectInputField";
import ActivityContentEmailComposeModalContentTextareaField from "./ActivityContentEmailComposeModalContentTextareaField";

import { withRouter, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

function ActivityContentEmailComposeModal({ leadActivityData }) {
  const dispatch = useDispatch();
  const history = useHistory();
  const [values, setValues] = useState({
    open: false,
    selectMailModel: false,
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
    allEmailTemplates: [],
    integratedMail: "",
  });

  const allEmailTemplates = useSelector((state) => state.leads.emailTemplates);

  useEffect(() => {
    dispatch(getAllEmailTemapltes());
  }, []);

  useEffect(() => {
    if (!isEmpty(allEmailTemplates)) {
      setValues({
        ...values,
        allEmailTemplates: allEmailTemplates,
      });
    } else {
      setValues({
        ...values,
        allEmailTemplates: [],
      });
    }
  }, [allEmailTemplates]);

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

  const handleOnClickIsActiveTab2 = () => {
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
      selectMailModel: true,
      // open: true,
      // sentMailsuccess: false,
      // hasModelClose: false,
    });
  };

  const onCloseModal = () => {
    setValues({
      ...values,
      selectMailModel: false,
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
    const { errors, isValid } = validateActivityEmail(values);
    if (!isValid) {
      setValues({ ...values, errors });
    }
    if (isValid) {
      // console.log(
      //   "subject : ",
      //   this.state.activityTabEmailModalSubject,
      //   "message : ",
      //   this.state.activityTabEmailModalBody
      // );
      // console.log("clicked on new mail save as template button");
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
    const { activeAccounts, integratedMail } = values;
    var userData = JSON.parse(localStorage.getItem("Data"));
    var gapiProfile = JSON.parse(localStorage.getItem("gapiProfile"));
    console.log(gapiProfile);

    e.preventDefault();
    // console.log(
    //   "subject : ",
    //   this.state.activityTabEmailModalSubject,
    //   "message : ",
    //   this.state.activityTabEmailModalBody
    // );
    // console.log("clicked on new mail send button");

    const { errors, isValid } = validateActivityEmail(values);
    // if (!isValid) {
    //   setValues({ ...values, errors });
    // }
    // if (isValid) {
    const newEmail = {
      to: leadActivityData.email,
      from: integratedMail === true ? gapiProfile : userData.email,
      subject: values.activityTabEmailModalSubject,
      body: values.activityTabEmailModalBody,
      entityType: "LEAD",
      entityId: leadActivityData._id,
      status: "NEW",
    };
    dispatch(
      sendEmailToLeads(newEmail, leadActivityData._id, callBackSendMail)
    );
    // setValues({ ...values, sentMailsuccess: true });
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
    console.log("clicked on delete button");
  };

  /*=====================================
        renderNewEmailBlock
  ===================================== */

  const renderNewEmailBlock = () => {
    const { activeAccounts, integratedMail } = values;
    var userData = JSON.parse(localStorage.getItem("Data"));
    var gapiProfile = JSON.parse(localStorage.getItem("gapiProfile"));
    return (
      <div className="ac-email-modal-form-block">
        <form>
          {/* outer div */}
          <div className="pr-20">
            <button onClick={changeHandler} className="change_button">
              Change
            </button>
            <h6 className="font-18-semibold mb-8 pl-10">
              From :{" "}
              <span className="font-18-regular">
                {integratedMail ? gapiProfile : userData.email}
              </span>
            </h6>
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
    const { allEmailTemplates } = values;
    if (!isEmpty(allEmailTemplates)) {
      return allEmailTemplates.map((template, index) => {
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

  /*============================================================
                    Select Sender Mail Model
  ==============================================================*/

  const changeHandler = (e) => {
    e.preventDefault();
    setValues({
      ...values,
      open: false,
      selectMailModel: true,
    });
  };

  const onClickHandler = (value) => (e) => {
    setValues({
      ...values,
      integratedMail: value,
    });
  };

  const nextHandelr = () => {
    setValues({
      ...values,
      open: true,
      selectMailModel: false,
    });
  };

  const syncMailHandler = () => {
    history.push("/mailbox");
  };

  const renderSelectSenderMail = () => {
    const { selectMailModel, activeAccounts, integratedMail } = values;
    var userData = JSON.parse(localStorage.getItem("Data"));
    var gapiProfile = JSON.parse(localStorage.getItem("gapiProfile"));

    return (
      <Modal
        open={selectMailModel}
        onClose={onCloseModal}
        closeOnEsc={false}
        closeOnOverlayClick={false}
        center
        classNames={{
          overlay: "customOverlay",
          modal: "customModal customModal--select_sender_mail",
          closeButton: "customCloseButton",
        }}
      >
        <div className="pl-30 text-center select_sender_mail">
          {/* close modal */}
          <span className="closeIconInModal" onClick={onCloseModal} />
          <h1>Compose Mail</h1>
          <p>Please select your sender address</p>
          <div className="select_mail_section">
            <div>
              <img
                className={!integratedMail ? "activeClass" : ""}
                onClick={onClickHandler(false)}
                src={`${userData.profileImage}&token=${userData.token}`}
                alt=""
              ></img>
              <div className="sender_mail">{userData.email}</div>
            </div>
            <div>
              {!isEmpty(gapiProfile) ? (
                <>
                  {" "}
                  <img
                    className={integratedMail ? "activeClass" : ""}
                    onClick={onClickHandler(true)}
                    // src={`${activeAccounts[0].profile.photos[0].url}`}
                    alt=""
                  ></img>
                  <div className="sender_mail">{gapiProfile}</div>{" "}
                </>
              ) : (
                <>
                  {" "}
                  <img
                    onClick={syncMailHandler}
                    src={require("./../../../assets/img/leads/img1.svg")}
                    alt=""
                  ></img>
                  <p>Sync Your Mailbox</p>
                </>
              )}
            </div>
          </div>

          <button onClick={nextHandelr}>Next</button>
        </div>
      </Modal>
    );
  };

  return (
    <>
      {renderSelectSenderMail()}
      {/* modal link */}
      <button
        className="leads-title-block-btn-red-bg leads-title-block-btn-red-bg--notes"
        onClick={onOpenModal}
      >
        &#43; Compose
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
          <h3 className="font-30-bold mb-8">Compose Mail</h3>

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

export default ActivityContentEmailComposeModal;
