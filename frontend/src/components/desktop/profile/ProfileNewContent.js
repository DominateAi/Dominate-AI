import React, { Component, Fragment } from "react";

import { Tabs, Tab, TabPanel, TabList } from "react-web-tabs";
import isEmpty from "./../../../store/validations/is-empty";
import { validateProfileWorkspaceInfo } from "../../../store/validations/profileValidation/workspaceValidation";
import { validateProfileSettings } from "../../../store/validations/profileValidation/settingsValidation";
import Modal from "react-responsive-modal";
import { deleteEmployeeInPlans } from "./../../../store/actions/employeeAction";
import {
  updateUser,
  uploadOrganizationImage,
} from "./../../../store/actions/authAction";
import { connect } from "react-redux";
import {
  statusEmpty,
  updateOrganizationAddress,
  logoutUser,
  createOrganization,
  getOrganizationDetaisAction,
} from "./../../../store/actions/authAction";
import {
  beforePaymentAction,
  afterPaymentSuccessAction,
  upgradePlansOfPaidUsers,
  cancelUserSubscriptin,
  cancelNextSubscription,
  resumeSubscription,
  updateCustomerAddress,
} from "./../../../store/actions/paymentAction";

import { SET_LOADER, CLEAR_LOADER } from "./../../../store/types";
import store from "./../../../store/store";
import { withRouter, Link } from "react-router-dom";
import dateFns from "date-fns";
import Alert from "react-s-alert";
import { maxLengths } from "../../../store/validations/maxLengths/MaxLengths";

import EnterCurrentPassword from "../popups/EnterCurrentPassword";
import CommandCentreImgTextBorder from "../command-centre/CommandCentreImgTextBorder";
import ProfileNewReferrals from "./ProfileNewReferrals";
import ProfileNewReferralsNotificationModal from "./ProfileNewReferralsNotificationModal";

export class ProfileNewContent extends Component {
  constructor() {
    super();
    this.state = {
      fname: "",
      lname: "",
      settingsErrors: {},
      email: "",
      workspceName: "",
      allPlans: "",
      activePlan: [],
      planMaxUsers: [],
      allEmployees: [],
      empWarningPopup: false,
      empDeletePopup: false,
      prePaymentPopup: false,
      deleteEmployeeList: [],
      prevPlanMaxUsers: [],
      currentPlanAllData: [],
      planPrice: {},
      orderIdData: {},
      paymentId: {},
      success: false,
      // workspace info
      fileName: "",
      companyAddress: "",
      state: "",
      city: "",
      pincode: "",
      country: "",
      companyName: "",
      companyEmail: "",
      workspaceErrors: {},

      cancelApprove: false,
      isEdit: false,
      isEditSettings: false,
      isEditSettingsLastName: false,
      organizationData: {},
    };
  }

  /*===================================
            Lifecycle Methods
  ====================================*/

  componentDidMount() {
    this.props.getOrganizationDetaisAction();
    let organizationData = JSON.parse(localStorage.getItem("oraganiationData"));

    // console.log(organizationData);
    this.setState({
      oragnizationUploadedLogo:
        !isEmpty(organizationData) && organizationData.logo,
      // companyAddress:
      //   !isEmpty(organizationData) && organizationData.address.companyAddress,
      companyAddress: "",
      // state: !isEmpty(organizationData) && organizationData.address.state,
      // city: !isEmpty(organizationData) && organizationData.address.city,
      state: "",
      city: "",
      // pincode: !isEmpty(organizationData) && organizationData.address.pincode,
      pincode: "",
      // country: !isEmpty(organizationData) && organizationData.address.country,
      country: "",
      fileName: !isEmpty(organizationData) && organizationData.logo,
    });

    this.setState({
      fname: this.props.userData.firstName,
      lname: this.props.userData.lastName,
      email: this.props.userData.email,
    });
  }

  componentDidUpdate() {}

  static getDerivedStateFromProps(nextProps, nextState) {
    if (
      !isEmpty(nextProps.organizationDetails) &&
      nextProps.organizationDetails !== nextState.organizationData
    ) {
      return {
        companyName: nextProps.organizationDetails.organizationName,
        // logo:""
        companyEmail: nextProps.organizationDetails.defaultUserEmailId,
        companyAddress: nextProps.organizationDetails.address.line1,
        city: nextProps.organizationDetails.address.city,
        state: nextProps.organizationDetails.address.state,
        pincode: nextProps.organizationDetails.address.pincode,
        country: nextProps.organizationDetails.address.country,
        organizationData: nextProps.organizationDetails,
      };
    }

    return null;
  }

  logoutHandler = () => {
    this.props.logoutUser();
  };

  /*===================================

             IsEdit

  ===================================*/
  handleEdit = () => {
    this.setState({ isEdit: true });
    console.log(this.state.isEdit);
  };

  handleCancel = () => {
    this.setState({ isEdit: false });
  };

  handleSettingEdit = () => {
    this.setState({ isEditSettings: true });
  };
  handleSettingLastEdit = () => {
    this.setState({ isEditSettingsLastName: true });
  };
  handleSettingCancel = () => {
    this.setState({ isEditSettings: false });
    this.setState({ isEditSettingsLastName: false });
  };

  /*============================================================================
                            Render Workspace info section
  =============================================================================*/

  // workspace info event handlers

  handleOnChangeFile = (e) => {
    e.preventDefault();
    // const data = new FormData();

    // data.append("file", e.target.files[0]);
    // this.setState({
    //   fileData: data
    // });
    const data = new FormData();
    // data.append("image", e.target.files[0].name);
    data.append("file", e.target.files[0]);

    this.props.uploadOrganizationImage(data);
    this.setState({
      fileName:
        e.target.files.length > 0 ? e.target.files[0].name : e.target.value,
    });

    console.log(
      "Upload file:",
      e.target.files.length > 0 ? e.target.files[0].name : e.target.value
    );
  };

  onchangeHandler = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  // pincode
  onchangeHandlerNumber = (e) => {
    this.setState({
      [e.target.name]: e.target.validity.valid ? e.target.value : "",
    });
  };

  saveWorkspaceInfoHandler = async (e) => {
    e.preventDefault();
    let organizationData = JSON.parse(localStorage.getItem("oraganiationData"));
    const { errors, isValid } = validateProfileWorkspaceInfo(this.state);
    // if (!isValid) {
    //   this.setState({ workspaceErrors: errors });
    // } else {
    this.setState({ workspaceErrors: {} });
    console.log("Save workspace info: ", this.state);

    const payload = {
      organizationName: this.state.companyName,
      logo: "dsfdfsd",
      defaultUserEmailId: this.state.companyEmail,
      address: {
        city: this.state.city,
        state: this.state.state,
        pincode: this.state.pincode,
        line1: this.state.companyAddress,
        country: this.state.country,
      },
    };

    let response = await this.props.createOrganization(payload);
    const { status, data = {} } = response || {};

    console.log("response", response);
    if (status === 200) {
      this.setState({
        isEdit: false,
      });
    }
    // }
  };

  renderWorkspaceInfo = () => {
    const { workspaceErrors } = this.state;
    let dataToken = JSON.parse(localStorage.getItem("Data"));
    return (
      <>
        <div className="profile-new-page-setting-tab-title-block row mx-0 align-items-center flex-nowrap">
          <CommandCentreImgTextBorder
            isDisplayImage={false}
            title="personal info"
          />
          {!this.state.isEdit ? (
            <button
              onClick={this.handleEdit}
              className="lead-new-detail-edit-button lead-new-detail-edit-button--command-center mb-0"
            >
              <img
                src="/img/desktop-dark-ui/icons/pencil-with-underscore.svg"
                alt=""
              />
              Edit
            </button>
          ) : (
            <button
              onClick={this.handleEdit}
              className="lead-new-detail-edit-button lead-new-detail-edit-button--command-center mb-0 opacity-0"
            >
              <img
                src="/img/desktop-dark-ui/icons/pencil-with-underscore.svg"
                alt=""
              />
              Edit
            </button>
          )}
        </div>
        <div className="edit-profile-form-container edit-profile-form-container--workspace">
          <form noValidate onSubmit={this.saveWorkspaceInfoHandler}>
            <div className="row mx-0 align-items-start edit-profile-form-container--workspace__rowMain">
              <div className="edit-profile-form-container--workspace__colm1">
                {this.state.isEdit === true ? (
                  <>
                    <div className="row mx-0">
                      {/* company address */}
                      <div className="col-12 pl-0 form-group">
                        <label htmlFor="companyAddress">Company Address</label>
                        <input
                          type="text"
                          name="companyAddress"
                          onChange={this.onchangeHandler}
                          value={this.state.companyAddress}
                        />
                        {workspaceErrors.companyAddress && (
                          <div className="is-invalid add-lead-form-field-errors ml-3">
                            {workspaceErrors.companyAddress}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="row mx-0">
                      {/* state */}
                      <div className="col-12 col-md-6 pl-0 form-group">
                        <label htmlFor="state">Company Name</label>
                        <input
                          type="text"
                          name="companyName"
                          onChange={this.onchangeHandler}
                          value={this.state.companyName}
                        />
                        {workspaceErrors.companyName && (
                          <div className="is-invalid add-lead-form-field-errors ml-3">
                            {workspaceErrors.companyName}
                          </div>
                        )}
                      </div>

                      {/* city */}
                      <div className="col-10 col-md-6 pl-0 form-group">
                        <label htmlFor="city">Company Email</label>
                        <input
                          type="text"
                          name="companyEmail"
                          onChange={this.onchangeHandler}
                          value={this.state.companyEmail}
                        />
                        {workspaceErrors.companyEmail && (
                          <div className="is-invalid add-lead-form-field-errors ml-3">
                            {workspaceErrors.companyEmail}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="row mx-0">
                      {/* state */}
                      <div className="col-12 col-md-6 pl-0 form-group">
                        <label htmlFor="state">State</label>
                        <input
                          type="text"
                          name="state"
                          onChange={this.onchangeHandler}
                          value={this.state.state}
                        />
                        {workspaceErrors.state && (
                          <div className="is-invalid add-lead-form-field-errors ml-3">
                            {workspaceErrors.state}
                          </div>
                        )}
                      </div>

                      {/* city */}
                      <div className="col-10 col-md-6 pl-0 form-group">
                        <label htmlFor="city">City</label>
                        <input
                          type="text"
                          name="city"
                          onChange={this.onchangeHandler}
                          value={this.state.city}
                        />
                        {workspaceErrors.city && (
                          <div className="is-invalid add-lead-form-field-errors ml-3">
                            {workspaceErrors.city}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="row mx-0">
                      {/* pincode */}
                      <div className="col-10 col-md-6 pl-0 form-group">
                        <label htmlFor="pincode">Pincode</label>
                        <input
                          type="text"
                          pattern="[0-9]*"
                          name="pincode"
                          onChange={this.onchangeHandlerNumber}
                          value={this.state.pincode}
                          maxLength={6}
                        />
                        {workspaceErrors.pincode && (
                          <div className="is-invalid add-lead-form-field-errors ml-3">
                            {workspaceErrors.pincode}
                          </div>
                        )}
                      </div>

                      {/* country */}
                      <div className="col-10 col-md-6 pl-0 form-group">
                        <label htmlFor="country">Country</label>
                        <input
                          type="text"
                          name="country"
                          onChange={this.onchangeHandler}
                          value={this.state.country}
                        />
                        {workspaceErrors.country && (
                          <div className="is-invalid add-lead-form-field-errors ml-3">
                            {workspaceErrors.country}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="row mx-0 profile-setting-btn-div algin-items-center">
                      <button
                        className="profile-workspace-cancel-btn"
                        onClick={this.handleCancel}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="profile-workspace-save-btn"
                      >
                        Save Changes
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="row mx-0">
                      {/* company address */}
                      <div className="col-12 pl-0 form-group">
                        <label htmlFor="companyAddress">Company Address</label>
                        <input
                          type="text"
                          name="companyAddress"
                          onChange={this.onchangeHandler}
                          value={this.state.companyAddress}
                          readOnly={true}
                        />
                        {workspaceErrors.companyAddress && (
                          <div className="is-invalid add-lead-form-field-errors ml-3">
                            {workspaceErrors.companyAddress}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="row mx-0">
                      {/* state */}
                      <div className="col-12 col-md-6 pl-0 form-group">
                        <label htmlFor="state">Company Name</label>
                        <input
                          type="text"
                          name="comapnyName"
                          onChange={this.onchangeHandler}
                          value={this.state.companyName}
                          readOnly={true}
                        />
                        {workspaceErrors.companyName && (
                          <div className="is-invalid add-lead-form-field-errors ml-3">
                            {workspaceErrors.companyName}
                          </div>
                        )}
                      </div>

                      {/* city */}
                      <div className="col-10 col-md-6 pl-0 form-group">
                        <label htmlFor="city">Company Email</label>
                        <input
                          type="text"
                          name="comapnyEmail"
                          onChange={this.onchangeHandler}
                          value={this.state.companyEmail}
                          readOnly={true}
                        />
                        {workspaceErrors.companyEmail && (
                          <div className="is-invalid add-lead-form-field-errors ml-3">
                            {workspaceErrors.companyEmail}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="row mx-0">
                      {/* state */}
                      <div className="col-10 col-md-6 pl-0 form-group">
                        <label htmlFor="state">State</label>
                        <input
                          type="text"
                          name="state"
                          onChange={this.onchangeHandler}
                          value={this.state.state}
                          readOnly={true}
                        />
                        {workspaceErrors.state && (
                          <div className="is-invalid add-lead-form-field-errors ml-3">
                            {workspaceErrors.state}
                          </div>
                        )}
                      </div>

                      {/* city */}
                      <div className="col-10 col-md-6 pl-0 form-group">
                        <label htmlFor="city">City</label>
                        <input
                          type="text"
                          name="city"
                          onChange={this.onchangeHandler}
                          value={this.state.city}
                          readOnly={true}
                        />
                        {workspaceErrors.city && (
                          <div className="is-invalid add-lead-form-field-errors ml-3">
                            {workspaceErrors.city}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="row mx-0">
                      {/* pincode */}
                      <div className="col-10 col-md-6 pl-0 form-group">
                        <label htmlFor="pincode">Pincode</label>
                        <input
                          type="text"
                          pattern="[0-9]*"
                          name="pincode"
                          onChange={this.onchangeHandlerNumber}
                          value={this.state.pincode}
                          maxLength={6}
                          readOnly={true}
                        />
                        {workspaceErrors.pincode && (
                          <div className="is-invalid add-lead-form-field-errors ml-3">
                            {workspaceErrors.pincode}
                          </div>
                        )}
                      </div>

                      {/* country */}
                      <div className="col-10 col-md-6 pl-0 form-group">
                        <label htmlFor="country">Country</label>
                        <input
                          type="text"
                          name="country"
                          onChange={this.onchangeHandler}
                          value={this.state.country}
                          readOnly={true}
                        />
                        {workspaceErrors.country && (
                          <div className="is-invalid add-lead-form-field-errors ml-3">
                            {workspaceErrors.country}
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
              <div className="edit-profile-form-container--workspace__colm2">
                <label className="add-lead-label font-24-semibold">
                  Default Company Logo
                </label>
                {/* display logo */}
                <div className="profile-info-tab-logo-block">
                  <div className="add-quotation-final-modal-logo">
                    {!isEmpty(this.state.fileName) && (
                      <img
                        src={`${this.state.oragnizationUploadedLogo}&token=${dataToken.token}`}
                        alt="logo"
                      />
                    )}
                  </div>
                </div>
                {/* select image file */}

                <div className="quotation-upload-img-block quotation-upload-img-block--profile">
                  {/*<button className="quotation-upload-img__btn">
                    Upload Logo
                  </button>*/}
                  <label
                    htmlFor="profile-workspace-upload"
                    className="quotation-upload-img__btn"
                  >
                    Upload Logo
                  </label>
                  {isEmpty(this.state.fileName) && workspaceErrors.fileName && (
                    <div className="is-invalid add-lead-form-field-errors ml-3">
                      {workspaceErrors.fileName}
                    </div>
                  )}

                  <input
                    type="file"
                    accept="image/jpeg, image/png"
                    title=""
                    className="font-21-regular quotation-upload-img__input"
                    onChange={this.handleOnChangeFile}
                    hidden
                    id="profile-workspace-upload"
                  />
                </div>
              </div>
            </div>
          </form>
        </div>
      </>
    );
  };

  /*===================================================================================
                         Render Edit Profile Form
  =====================================================================================*/

  /*==============================
        Form event Hndler
  ===============================*/

  editProfileHandler = (e) => {
    e.preventDefault();
    const { errors, isValid } = validateProfileSettings(this.state);
    if (!isValid) {
      this.setState({ settingsErrors: errors });
    } else {
      const updateUser = {
        firstName: this.state.fname,
        lastName: this.state.lname,
      };

      this.setState({ settingsErrors: {} });

      this.props.updateUser(this.props.userData.id, updateUser);
      // console.log(this.state);
    }
    this.setState({ isEditSettings: false });
    this.setState({ isEditSettingsLastName: false });
  };

  displayError = (errorDisplay) => {
    return (
      <>
        {errorDisplay ? (
          <div className="is-invalid add-lead-form-field-errors ml-3">
            {errorDisplay}
          </div>
        ) : (
          <div className="is-invalid add-lead-form-field-errors ml-3 opacity-0">
            NA
          </div>
        )}
      </>
    );
  };

  renderEditProfileForm = () => {
    const { settingsErrors } = this.state;
    return (
      <Fragment>
        <div className="profile-new-page-setting-tab-title-block row mx-0 align-items-center flex-nowrap">
          <CommandCentreImgTextBorder
            isDisplayImage={false}
            title="personal info"
          />
          {!this.state.isEditSettings ? (
            <button
              onClick={this.handleSettingEdit}
              className="lead-new-detail-edit-button lead-new-detail-edit-button--command-center mb-0"
            >
              <img
                src="/img/desktop-dark-ui/icons/pencil-with-underscore.svg"
                alt=""
              />
              Edit
            </button>
          ) : (
            <button className="lead-new-detail-edit-button lead-new-detail-edit-button--command-center mb-0 opacity-0">
              <img
                src="/img/desktop-dark-ui/icons/pencil-with-underscore.svg"
                alt=""
              />
              Edit
            </button>
          )}
        </div>

        <div className="edit-profile-form-container edit-profile-form-container--setting">
          <form noValidate onSubmit={this.editProfileHandler}>
            <div className="profile-settings-content-pl">
              {/* ===========================   setting fist name ========================= */}
              {this.state.isEditSettings === true ? (
                <>
                  {/* first name */}
                  <div className="form-group">
                    <label htmlFor="fname">First Name</label>
                    <input
                      type="text"
                      name="fname"
                      onChange={this.onchangeHandler}
                      maxLength={maxLengths.char30}
                      value={this.state.fname}
                    />
                    {this.displayError(settingsErrors.fname)}
                  </div>
                </>
              ) : (
                <>
                  {/* first name disabled*/}
                  <div className="profile-settings-edit-btn-outer-div">
                    <div className="form-group">
                      <label htmlFor="fname">First Name</label>
                      <input
                        type="text"
                        name="fname"
                        onChange={this.onchangeHandler}
                        maxLength={maxLengths.char30}
                        value={this.state.fname}
                        readOnly={true}
                      />
                      {this.displayError(null)}
                    </div>
                  </div>
                </>
              )}
              {/* ===========================   setting last name ========================= */}
              {this.state.isEditSettings === true ? (
                <>
                  {/* Last Name disabled*/}
                  <div className="form-group">
                    <label htmlFor="lname">Last Name</label>
                    <input
                      type="text"
                      name="lname"
                      onChange={this.onchangeHandler}
                      maxLength={maxLengths.char30}
                      value={this.state.lname}
                    />
                    {this.displayError(settingsErrors.lname)}
                  </div>
                </>
              ) : (
                <>
                  {/* Last Name */}
                  <div className="profile-settings-edit-btn-outer-div mb-30">
                    <div className="form-group">
                      <label htmlFor="lname">Last Name</label>
                      <input
                        type="text"
                        name="lname"
                        onChange={this.onchangeHandler}
                        maxLength={maxLengths.char30}
                        value={this.state.lname}
                        readOnly={true}
                      />
                      {this.displayError(null)}
                    </div>
                  </div>
                </>
              )}
            </div>
            {/* ===========================   setting cancel and save btn ========================= */}
            {this.state.isEditSettings === true && (
              <div className="row mx-0 profile-setting-btn-div algin-items-center profile-settings-content-pl">
                <button
                  className="profile-workspace-cancel-btn"
                  onClick={this.handleSettingCancel}
                >
                  Cancel
                </button>
                <button type="submit" className="profile-workspace-save-btn">
                  Save Changes
                </button>
              </div>
            )}
            <div className="profile-new-page-setting-tab-title-block profile-new-page-setting-tab-title-block--password">
              <CommandCentreImgTextBorder
                isDisplayImage={false}
                title="Password"
              />
            </div>

            <div className="profile-settings-content-pl">
              {/* <h5 className="font-18-bold">Password</h5> */}
              <h5 className="font-14-regular profile-new-page-setting-tab-change-password-title">
                Last Password Activity on DD-MM-YY
              </h5>

              <EnterCurrentPassword />
            </div>
          </form>
        </div>
      </Fragment>
    );
  };

  render() {
    const { userRole, history } = this.props;
    let organisationData = JSON.parse(localStorage.getItem("oraganiationData"));
    let userData = JSON.parse(localStorage.getItem("Data"));

    return (
      <Fragment>
        <div className="cmd-centre-block cmd-centre-block--leadsNew cmd-centre-block--leadsNewDetailsPage cmd-centre-block--profileNew">
          <div className="row mx-0 align-items-center profile-new-text-div-aside-tabs">
            <h4 className="profile-new-text-div-aside-tabs__text1">
              Need help? Write to us
              <a href="mailto:marketing@myrl.tech" rel="noopener noreferrer">
                marketing@myrl.tech
              </a>
            </h4>
            <Link
              to={{
                pathname: "/dashboard",
                state: { watchWalkthroughAgain: true },
              }}
            >
              <span className="overview-demo-outline-button">
                Watch Walkthrough Again
              </span>
            </Link>
          </div>
          <Tabs
            defaultTab={
              userData.role.name === "Administrator"
                ? "workspace-info"
                : "settings"
            }
            onChange={(tabId) => {
              // console.log(tabId);
            }}
          >
            <TabList>
              {userData.role.name === "Administrator" && (
                <Tab tabFor="workspace-info">Workspace info</Tab>
              )}

              <Tab tabFor="settings">Settings</Tab>
            </TabList>

            <TabPanel tabId="workspace-info">
              {this.renderWorkspaceInfo()}
            </TabPanel>

            <TabPanel tabId="settings">{this.renderEditProfileForm()}</TabPanel>
          </Tabs>
        </div>
      </Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  organizationDetails: state.auth.organizationDetails,
  customerStripeObject: state.payment.customerStripeObject,
});

export default connect(mapStateToProps, {
  updateUser,
  statusEmpty,
  updateOrganizationAddress,
  uploadOrganizationImage,
  logoutUser,
  createOrganization,
  getOrganizationDetaisAction,
})(withRouter(ProfileNewContent));
