import React from "react";
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
import ActivityContentEmailComposeModalSubjectInputField from "./../activity/ActivityContentEmailComposeModalSubjectInputField";
import ActivityContentEmailComposeModalContentTextareaField from "./../activity/ActivityContentEmailComposeModalContentTextareaField";

import { withRouter } from "react-router-dom";

class AccountDetailsComposeModel extends React.Component {
  state = {
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
  };

  /*=====================================
                Lifecycle Methods
    =======================================*/
  componentDidMount() {
    this.props.getAllEmailTemapltes();
  }

  static getDerivedStateFromProps(nextProps, nextState) {
    if (
      !isEmpty(nextProps.allEmailTemplates) &&
      nextProps.allEmailTemplates !== nextState.allEmailTemplates
    ) {
      return {
        allEmailTemplates: nextProps.allEmailTemplates,
      };
    }
    // if (
    //   !isEmpty(nextProps.activeAccounts) &&
    //   nextProps.activeAccounts !== nextState.activeAccounts
    // ) {
    //   return {
    //     activeAccounts: nextProps.activeAccounts,
    //   };
    // }
    return null;
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.apiStatus &&
      this.state.sentMailsuccess &&
      !this.state.hasModelClose
    ) {
      this.onCloseModal();
      this.setState({
        hasModelClose: true,
        sentMailsuccess: false,
      });
    }
    if (this.props.allEmailTemplates !== this.state.allEmailTemplates) {
      this.setState({
        allEmailTemplates: this.props.allEmailTemplates,
      });
    }
  }

  /*=====================================
        menu tab handlers
    ===================================== */

  handleOnClickIsActiveTab1 = () => {
    this.setState({
      isActiveTab1: true,
      isActiveTab2: false,
    });
  };

  handleOnClickIsActiveTab2 = () => {
    this.setState({
      isActiveTab1: false,
      isActiveTab2: true,
    });
  };

  /*=====================================
        modal handlers
    ===================================== */

  onOpenModal = () => {
    this.props.statusEmpty();
    this.setState({
      selectMailModel: true,
      // open: true,
      // sentMailsuccess: false,
      // hasModelClose: false,
    });
  };

  onCloseModal = () => {
    this.setState({
      open: false,
      activityTabEmailModalSubject: "",
      activityTabEmailModalBody: "",
      errors: {},
    });
  };

  /*=====================================
       custom handlers new mail
    ===================================== */

  handleOnChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  handleOnClickNewMailSaveTemplate = (e) => {
    // this.onCloseModal();
    e.preventDefault();
    const { errors, isValid } = validateActivityEmail(this.state);
    if (!isValid) {
      this.setState({ errors });
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
        subject: this.state.activityTabEmailModalSubject,
        name: "Template",
        content: this.state.activityTabEmailModalBody,
      };
      this.props.saveEmailTemplate(newTemplate);
      this.onCloseModal();
    }
  };

  handleOnClickNewMailSend = (e) => {
    const { activeAccounts, integratedMail } = this.state;
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

    const { errors, isValid } = validateActivityEmail(this.state);
    if (!isValid) {
      this.setState({ errors });
    }
    if (isValid) {
      const newEmail = {
        to: this.props.leadActivityData.email,
        from: integratedMail === true ? gapiProfile : userData.email,
        subject: this.state.activityTabEmailModalSubject,
        body: this.state.activityTabEmailModalBody,
        entityType: "LEAD",
        entityId: this.props.leadActivityData._id,
        status: "NEW",
      };
      this.props.sendEmailToLeads(newEmail, this.props.leadActivityData._id);
      this.setState({
        sentMailsuccess: true,
      });
    }
  };

  handleOnClickNewMailDelete = (e) => {
    // this.onCloseModal();
    e.preventDefault();
    console.log(this.state);
    console.log("clicked on new mail delete button");
  };

  handleOnClickNewMailUseTemplate = (e) => {
    // this.onCloseModal();
    e.preventDefault();
    console.log(this.state);
    console.log("clicked on new mail use template button");
  };

  /*============================================
      custom handlers use template handlers
  ============================================ */

  handleOnClickUseTemplate = (templateSub, templateBody) => (e) => {
    // this.onCloseModal();
    e.preventDefault();
    this.setState({
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

  handleOnClickDelete = (teplateId) => (e) => {
    // this.onCloseModal();
    e.preventDefault();
    this.props.deleteEmailTemplate(teplateId);
    console.log(this.state);
    console.log("clicked on delete button");
  };

  /*=====================================
        renderNewEmailBlock
  ===================================== */

  renderNewEmailBlock = () => {
    const { activeAccounts, integratedMail } = this.state;
    var userData = JSON.parse(localStorage.getItem("Data"));
    var gapiProfile = JSON.parse(localStorage.getItem("gapiProfile"));
    return (
      <div className="ac-email-modal-form-block">
        <form>
          {/* outer div */}
          <div className="pr-20">
            <button onClick={this.changeHandler} className="change_button">
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
              <span className="font-18-regular">
                {this.props.leadActivityData.email}
              </span>
            </h6>
            {/* subject */}
            <ActivityContentEmailComposeModalSubjectInputField
              name="activityTabEmailModalSubject"
              onChange={this.handleOnChange}
              value={this.state.activityTabEmailModalSubject}
              error={this.state.errors.activityTabEmailModalSubject}
            />
            {/* body */}
            <ActivityContentEmailComposeModalContentTextareaField
              name="activityTabEmailModalBody"
              onChange={this.handleOnChange}
              value={this.state.activityTabEmailModalBody}
              error={this.state.errors.activityTabEmailModalBody}
            />
          </div>
          {/* end outer div */}

          {/* buttons */}
          <div className="ac-email-modal-btns-block">
            {/* <button type="submit" value="submit">Submit</button> */}
            <button
              className="btn-funnel-view btn-funnel-view--emailTemplate mr-30"
              onClick={this.handleOnClickNewMailSaveTemplate}
            >
              Save as Template
            </button>
            <button
              className="btn-funnel-view btn-funnel-view--activitySummary btn-funnel-view--activitySummary--email"
              onClick={this.handleOnClickNewMailSend}
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
  renderTemplate = () => {
    const { allEmailTemplates } = this.state;
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
                    onClick={this.handleOnClickUseTemplate(
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
                      onClick={this.handleOnClickDelete(template._id)}
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

  changeHandler = (e) => {
    e.preventDefault();
    this.setState({
      open: false,
      selectMailModel: true,
    });
  };

  onClickHandler = (value) => (e) => {
    this.setState({
      integratedMail: value,
    });
  };

  nextHandelr = () => {
    this.setState({
      open: true,
      selectMailModel: false,
    });
  };

  onCloseModal = () => {
    this.setState({
      selectMailModel: false,
      open: false,
    });
  };

  syncMailHandler = () => {
    this.props.history.push("/mailbox");
  };

  renderSelectSenderMail = () => {
    const { selectMailModel, activeAccounts, integratedMail } = this.state;
    var userData = JSON.parse(localStorage.getItem("Data"));
    var gapiProfile = JSON.parse(localStorage.getItem("gapiProfile"));

    return (
      <Modal
        open={selectMailModel}
        onClose={this.onCloseModal}
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
          <span className="closeIconInModal" onClick={this.onCloseModal} />
          <h1>Compose Mail</h1>
          <p>Please select your sender address</p>
          <div className="select_mail_section">
            <div>
              <img
                className={!integratedMail ? "activeClass" : ""}
                onClick={this.onClickHandler(false)}
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
                    onClick={this.onClickHandler(true)}
                    // src={`${activeAccounts[0].profile.photos[0].url}`}
                    alt=""
                  ></img>
                  <div className="sender_mail">{gapiProfile}</div>{" "}
                </>
              ) : (
                <>
                  {" "}
                  <img
                    onClick={this.syncMailHandler}
                    src={require("./../../../assets/img/leads/img1.svg")}
                    alt=""
                  ></img>
                  <p>Sync Your Mailbox</p>
                </>
              )}
            </div>
          </div>

          <button onClick={this.nextHandelr}>Next</button>
        </div>
      </Modal>
    );
  };

  /*=====================================
        main method
    ===================================== */
  render() {
    const { open, isActiveTab1, isActiveTab2 } = this.state;
    // console.log(this.state.allEmailTemplates);
    return (
      <>
        {this.renderSelectSenderMail()}
        {/* modal link */}
        <button
          className="leads-new-inner-page-profile-row__colm2-btn"
          onClick={this.onOpenModal}
        >
          <img src="/img/desktop-dark-ui/icons/lead-email.svg" alt="" />
          <span className="font-15-bold">Email</span>
        </button>

        {/* modal content */}
        <Modal
          open={open}
          onClose={this.onCloseModal}
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
            <span className="closeIconInModal" onClick={this.onCloseModal} />

            {/* content title*/}
            <h3 className="font-30-bold mb-8">Compose Mail</h3>

            {/* tabs title  */}
            <div className="justify-content-space-between mb-30">
              <div className="ac-email-title">
                <button
                  className={
                    isActiveTab1
                      ? "leads-new-filter-button leads-new-filter-button--active"
                      : "leads-new-filter-button"
                  }
                  onClick={this.handleOnClickIsActiveTab1}
                >
                  New mail
                </button>
                {/* <span className="activity-text-border-right"></span> */}
                <button
                  className={
                    isActiveTab2
                      ? "leads-new-filter-button leads-new-filter-button--active"
                      : "leads-new-filter-button"
                  }
                  onClick={this.handleOnClickIsActiveTab2}
                >
                  Use template
                </button>
              </div>
            </div>

            {/* tabs content */}
            {isActiveTab1 ? (
              <>{this.renderNewEmailBlock()}</>
            ) : (
              <>
                <div className="ac-email-template-outer-container">
                  {this.renderTemplate()}
                </div>
              </>
            )}
          </div>
        </Modal>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  apiStatus: state.auth.status,
  allEmailTemplates: state.leads.emailTemplates,
  // activeAccounts: state.connectapp.auth.active_accounts,
});

export default connect(mapStateToProps, {
  statusEmpty,
  sendEmailToLeads,
  saveEmailTemplate,
  getAllEmailTemapltes,
  deleteEmailTemplate,
})(withRouter(AccountDetailsComposeModel));
