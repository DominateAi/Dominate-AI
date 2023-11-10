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
} from "./../../../store/actions/authAction";
import {
  beforePaymentAction,
  afterPaymentSuccessAction,
  upgradePlansOfPaidUsers,
  cancelUserSubscriptin,
} from "./../../../store/actions/paymentAction";
import { withRouter, Link } from "react-router-dom";
import dateFns from "date-fns";
import Alert from "react-s-alert";
import { maxLengths } from "../../../store/validations/maxLengths/MaxLengths";

export class ProfileContent extends Component {
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
      workspaceErrors: {},
      subscriptionCancel: false,
      subscriptionUpdatedSuccess: false,
    };
  }

  /*===================================
            Lifecycle Methods
  ====================================*/

  componentDidMount() {
    let organizationData = JSON.parse(localStorage.getItem("oraganiationData"));

    // console.log(organizationData);
    this.setState({
      oragnizationUploadedLogo:
        !isEmpty(organizationData) && organizationData.logo,
      companyAddress:
        !isEmpty(organizationData) && organizationData.address.companyAddress,
      state: !isEmpty(organizationData) && organizationData.address.state,
      city: !isEmpty(organizationData) && organizationData.address.city,
      pincode: !isEmpty(organizationData) && organizationData.address.pincode,
      country: !isEmpty(organizationData) && organizationData.address.country,
      fileName: !isEmpty(organizationData) && organizationData.logo,
    });

    this.setState({
      fname: this.props.userData.firstName,
      lname: this.props.userData.lastName,
      email: this.props.userData.email,
      workspceName: this.props.userData.workspaceId + ".dominate.com",
      activePlan: this.props.billingType,
      allEmployees: this.props.allEmployees,
    });
  }

  componentDidUpdate() {
    if (!isEmpty(this.state.allPlans) && !this.state.hasSetUp) {
      this.onPreviousPlansEmployee();
      this.setState({
        hasSetUp: true,
      });
    }
    if (
      this.props.apiStatus &&
      this.state.success &&
      !this.state.hasClosedModal
    ) {
      this.setState({ hasClosedModal: true, empDeletePopup: false });
    }
    if (this.props.allEmployees !== this.state.allEmployees) {
      this.setState({
        allEmployees: this.props.allEmployees,
      });
    }
  }

  static getDerivedStateFromProps(nextProps, nextState) {
    if (
      !isEmpty(nextProps.allPlans) &&
      nextProps.allPlans !== nextState.allPlans &&
      !nextState.hasSet
    ) {
      let currentPlan = nextProps.allPlans.filter(
        (plan) => plan.label === nextProps.billingType
      );
      // console.log(currentPlan);
      return {
        allPlans: nextProps.allPlans,
        currentPlanAllData: currentPlan,
        planMaxUsers: !isEmpty(currentPlan) && currentPlan[0].maxUsers,
        planPrice: !isEmpty(currentPlan) && currentPlan[0].monthlyPrice,
        hasSet: true,
      };
    }

    if (
      !isEmpty(nextProps.allEmployees) &&
      nextProps.allEmployees !== nextState.allEmployees
    ) {
      return {
        allEmployees: nextProps.allEmployees,
      };
    }

    if (
      !isEmpty(nextProps.orderId) &&
      nextProps.orderId !== nextState.orderIdData
    ) {
      return {
        // orderIdData: nextProps.orderId,
        subscriptionId: nextProps.orderId.id,
      };
    }
    if (
      !isEmpty(nextProps.organizationDetails) &&
      nextProps.organizationDetails !== nextState.organizationDetails
    ) {
      return {
        organizationDetails: nextProps.organizationDetails,
      };
    }
    if (
      !isEmpty(nextProps.oragnizationUploadedLogo) &&
      nextProps.oragnizationUploadedLogo !== nextState.oragnizationUploadedLogo
    ) {
      // let dataToken = JSON.parse(localStorage.getItem("Data"));
      return {
        oragnizationUploadedLogo: nextProps.oragnizationUploadedLogo.fileUrl,
        fileName: nextProps.oragnizationUploadedLogo.fileUrl,
      };
    }
    return null;
  }

  /*================================
      All Plans handler
  =================================*/

  onPreviousPlansEmployee = () => {
    const allPlans = this.state.allPlans;
    const myPrevPlan = this.state.activePlan;
    if (!isEmpty(allPlans) && !isEmpty(myPrevPlan)) {
      let prevPlan = allPlans.filter((plan) => plan.label === myPrevPlan);
      this.setState({
        prevPlanMaxUsers:
          !isEmpty(prevPlan) && prevPlan[0].maxUsers
            ? prevPlan[0].maxUsers
            : "",
      });
    }
  };

  onClickPlansHandler = (plan) => {
    this.setState({
      activePlan: plan.label,
      planMaxUsers: plan.maxUsers,
      planPrice: plan.monthlyPrice,
    });

    // console.log(maxUsers);
    // Get employee count admin added
    // const { allEmployees } = this.state;
    // let count = allEmployees.length + 1;

    if (this.state.currentPlanAllData[0].maxUsers <= plan.maxUsers) {
      // console.log("ok");
    } else {
      this.setState({
        empWarningPopup: true,
      });
    }
  };

  /*============================
        Checkbox events handler
  =============================*/

  doEmailExist = (email) => {
    let obj = this.state.deleteEmployeeList.find((emp) => emp === email);
    // console.log(obj);
    return obj ? this.state.deleteEmployeeList.indexOf(obj) : false;
  };

  onChangeCheckbox = (email) => (e) => {
    // console.log("Checkbox checked:", email);
    let deleteEmployeeList = this.state.deleteEmployeeList;

    let returnValue = this.doEmailExist(email);
    if (returnValue || returnValue === 0) {
      deleteEmployeeList.splice(returnValue, 1);
    } else {
      deleteEmployeeList.push(email);
    }
    this.setState({
      deleteEmployeeList: deleteEmployeeList,
    });
  };

  toggle = () => {
    this.setState((state) => ({
      disabled: !state.disabled,
    }));
  };

  employeeCancelPopup = () => {
    this.setState({
      empDeletePopup: false,
    });
  };

  /*==================================
      After Payment Sucess Handler
====================================*/
  afterPyment = (paymentResponse) => {
    console.log(paymentResponse);
    const { orderIdData } = this.state;
    if (paymentResponse) {
      const afterPayment = {
        workspaceId: this.props.userData.workspaceId,
        organizationId: this.props.userData.organizationId,
        plan: this.state.activePlan,
        success: true,
        subscriptionId: this.state.subscriptionId,
        paymentId: paymentResponse.razorpay_payment_id,
      };
      this.props.afterPaymentSuccessAction(afterPayment, this.props.history);
    } else {
      console.log("failed");
    }
  };

  /*==============================
       All Popup Handler
  ================================*/
  WarningModalClose = () => {
    this.setState({
      prePaymentPopup: false,
      empWarningPopup: false,
    });
  };

  /*==============================
        Form event Hndler
  ===============================*/

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
  };

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

  saveWorkspaceInfoHandler = (e) => {
    e.preventDefault();
    const { errors, isValid } = validateProfileWorkspaceInfo(this.state);
    if (!isValid) {
      this.setState({ workspaceErrors: errors });
    } else {
      this.setState({ workspaceErrors: {} });
      console.log("Save workspace info: ", this.state);
      const organizationDetails = {
        logo: this.state.oragnizationUploadedLogo,
        address: {
          companyAddress: this.state.companyAddress,
          country: this.state.country,
          state: this.state.state,
          city: this.state.city,
          pincode: this.state.pincode,
        },
      };
      console.log(organizationDetails);
      this.props.updateOrganizationAddress(
        this.props.organizationId,
        organizationDetails,
        "Organization Updated"
      );
    }
  };

  /*===============================
        continue handler
  ===============================*/
  continueHandler = () => {
    // console.log(this.state.planPrice.substring(1));
    // console.log("success");
    // Get employee count admin added
    let data = JSON.parse(localStorage.getItem("Data"));
    const {
      allEmployees,
      // prevPlanMaxUsers,
      planMaxUsers,
    } = this.state;
    const newCount = allEmployees.length + 1;
    // console.log(allEmployees.length);
    // console.log(planMaxUsers);
    // console.log(newCount);

    if (newCount <= planMaxUsers) {
      const proceedPayment = {
        plan: this.state.activePlan,
        workspaceId: this.props.userData.workspaceId,
      };
      data.subscriptionType === "FREE" &&
        this.props.beforePaymentAction(proceedPayment);

      this.setState({
        prePaymentPopup: true,
        empWarningPopup: false,
      });
      // console.log("ready to update");
    } else {
      this.props.statusEmpty();
      this.setState({
        sucess: false,
        empDeletePopup: newCount <= planMaxUsers ? false : true,
        empWarningPopup: false,
      });
    }
  };

  /*============================
      Update Plan Handler
  =============================*/

  planUpdateHandler = () => {
    // console.log(this.state.planPrice.substring(1));
    // console.log("success");
    // Get employee count admin added
    let data = JSON.parse(localStorage.getItem("Data"));
    const {
      allEmployees,
      //  prevPlanMaxUsers,
      planMaxUsers,
    } = this.state;
    const newCount = allEmployees.length + 1;
    // console.log(newCount);
    // console.log(planMaxUsers);

    if (newCount <= planMaxUsers) {
      const proceedPayment = {
        plan: this.state.activePlan,
        workspaceId: this.props.userData.workspaceId,
      };
      data.subscriptionType === "FREE" &&
        this.props.beforePaymentAction(proceedPayment);
      this.setState({
        prePaymentPopup: true,
      });
      // console.log("ready to update");
    } else {
      this.props.statusEmpty();
      this.setState({
        sucess: false,
        empWarningPopup: true,
      });
    }
  };

  /*=============================
      Delete Employee Handler
  ==============================*/
  employeeDeleteHandler = () => {
    const { deleteEmployeeList } = this.state;
    if (isEmpty(deleteEmployeeList)) {
      Alert.success("<h4>Select employee</h4>", {
        position: "top-right",
        effect: "slide",
        beep: false,
        html: true,
        timeout: 5000,
        // offset: 100
      });
    } else {
      this.props.deleteEmployeeInPlans(deleteEmployeeList);
      this.setState({
        success: true,
      });
      console.log(deleteEmployeeList);
    }
  };

  /*==============================================
      Upgrade plan of already paid user handler
  ===============================================*/
  callBackSubscriptionUpdate = (response) => {
    console.log(response);
    if (response.success === true) {
      this.setState({
        prePaymentPopup: false,
        subscriptionUpdatedSuccess: true,
      });
    }
  };

  upgradePlanOfPaidUser = (data) => (e) => {
    const PlanInfo = {
      plan: this.state.activePlan,
      workspaceId: data.workspaceId,
    };
    // console.log(PlanInfo);
    this.props.upgradePlansOfPaidUsers(
      data.organizationId,
      PlanInfo,
      this.callBackSubscriptionUpdate,
      data.workspaceId
    );
  };

  /*==============================
     Razorpay Payment Hanler
  ===============================*/
  openCheckout = (after) => (e) => {
    console.log(this.state.activePlan);
    // const { activePlan } = this.state;
    this.setState({
      prePaymentPopup: false,
    });
    let options = {
      key_id: "rzp_test_dHuLalQnzgiRoc",
      key_secret: "JhBfdBBMnrFya2jTFyH5qXcx",
      // key_id: "rzp_live_FoO6VyNz42LUO7",
      // key_secret: "fZi8tSCO0Ib73RLYmuWM1Vqq",
      subscription_id: this.state.subscriptionId,
      // subscription_card_change: 1,
      amount: 100, // 2000 paise = INR 20, amount in paisa
      // currency: "INR",
      order_id: this.state.orderIdData.id,
      name: "Dominate",
      description: "Billing",
      image:
        "https://res.cloudinary.com/myrltech/image/upload/v1578390114/Group_1546.svg",
      handler: function (response) {
        // window.location.href = "/payment-success";
        after(response);
        // alert(response.razorpay_payment_id);
        // alert(response.razorpay_order_id);
        // alert(response.razorpay_signature);
      },
      prefill: {
        name: "Harshil Mathur",
        email: "harshil@razorpay.com",
      },
      notes: {
        address: "Hello World",
      },
      theme: {
        color: "#502effab",
      },
    };

    let rzp = new window.Razorpay(options);
    rzp.open();
  };

  /*=============================
    Render PrePayment Popup
  ==============================*/
  renderPrePaymentPopup = () => {
    const { prePaymentPopup, planPrice, activePlan, planMaxUsers } = this.state;
    let data = JSON.parse(localStorage.getItem("Data"));
    return (
      <Modal
        open={prePaymentPopup}
        onClose={() => console.log("unable to close")}
        closeOnEsc={true}
        closeOnOverlayClick={false}
        center
        classNames={{
          overlay: "customOverlay",
          modal:
            "warning-employee-model customModal-warning customModal--addLead",
          closeButton: "customCloseButton",
        }}
      >
        <span className="closeIconInModal" onClick={this.WarningModalClose} />
        <div className="employee-warning-popup-container">
          {data.subscriptionType === "FREE" ? (
            <h3>Proceed To Payment</h3>
          ) : (
            <h3>Proceed To Upgrade</h3>
          )}
        </div>
        <div className="warning-downgarade-section">
          <div className="current-plan-section">
            <h3>Your Selected Plan</h3>
            <div className="detail-section">
              <img
                src={
                  activePlan === "ROVER"
                    ? require("./../../../assets/img/plans/plans1.svg")
                    : activePlan === "ASTRONAUT"
                    ? require("./../../../assets/img/plans/plans0.svg")
                    : activePlan === "SPACESHIP"
                    ? require("./../../../assets/img/plans/plans3.svg")
                    : activePlan === "SPACESTATION"
                    ? require("./../../../assets/img/plans/plans2.svg")
                    : ""
                }
                alt="plans"
              />
              <div>
                <h4>{activePlan}</h4>
                <p>
                  {activePlan === "ASTRONAUT"
                    ? `${planMaxUsers} User`
                    : activePlan === "ROVER"
                    ? `2-${planMaxUsers} Users`
                    : activePlan === "SPACESHIP"
                    ? `6-${planMaxUsers} Users`
                    : activePlan === "SPACESTATION"
                    ? `11-${planMaxUsers} Users`
                    : ""}
                </p>
                <p>{planPrice}/Mo</p>
              </div>
            </div>
          </div>

          <div className="btn-section">
            <button className="cancel-btn" onClick={this.WarningModalClose}>
              Cancel
            </button>
            <button
              onClick={
                data.subscriptionType === "FREE"
                  ? this.openCheckout(this.afterPyment)
                  : this.upgradePlanOfPaidUser(data)
              }
              className="continue-btn"
            >
              Continue
            </button>
          </div>
        </div>
      </Modal>
    );
  };

  /*=============================
      Render Warning popup
  ==============================*/
  renderWarningPopup = () => {
    // get running plan employees
    const { billingType } = this.props;
    const {
      empWarningPopup,
      // planMaxUsers,
      currentPlanAllData,
      activePlan,
    } = this.state;

    // Get employee count admin added
    // const { allEmployees } = this.state;
    // let runningPlanEmployeeCreated = allEmployees.length + 1;

    return (
      <Modal
        open={empWarningPopup}
        onClose={() => console.log("unable to close")}
        closeOnEsc={true}
        closeOnOverlayClick={false}
        center
        classNames={{
          overlay: "customOverlay",
          modal:
            "warning-employee-model customModal-warning customModal--addLead",
          closeButton: "customCloseButton",
        }}
      >
        {/* <span className="closeIconInModal" onClick={this.WarningModalClose} /> */}
        <div className="employee-warning-popup-container">
          <h3>Downgrade your plan</h3>
          {/* <p>You are creted {runningPlanEmployeeCreated} employees </p>
          <p>Your running plan employees are {this.state.prevPlanMaxUsers} </p>
          <p>
            Your selected plan has max {planMaxUsers} employees allowed to add
          </p>
          <p>
            Please delete {runningPlanEmployeeCreated - planMaxUsers} employees
          </p>
          <button
            onClick={this.planUpdateHandler}
            className="employees-delete-btn"
          >
            Delete Employees
          </button> */}
        </div>
        <div className="warning-downgarade-section">
          <div className="current-plan-section">
            <h3>Your Current Plan</h3>
            <div className="detail-section">
              <img
                src={
                  billingType === "ROVER"
                    ? require("./../../../assets/img/plans/plans1.svg")
                    : billingType === "ASTRONAUT"
                    ? require("./../../../assets/img/plans/plans0.svg")
                    : billingType === "SPACESHIP"
                    ? require("./../../../assets/img/plans/plans3.svg")
                    : billingType === "SPACESTATION"
                    ? require("./../../../assets/img/plans/plans2.svg")
                    : ""
                }
                alt="plans"
              />
              <div>
                <h4>{this.props.billingType}</h4>
                <p>
                  {billingType === "ASTRONAUT"
                    ? `${
                        !isEmpty(currentPlanAllData) &&
                        currentPlanAllData[0].maxUsers
                      } User`
                    : billingType === "ROVER"
                    ? `2-${
                        !isEmpty(currentPlanAllData) &&
                        currentPlanAllData[0].maxUsers
                      } Users`
                    : billingType === "SPACESHIP"
                    ? `6-${
                        !isEmpty(currentPlanAllData) &&
                        currentPlanAllData[0].maxUsers
                      } Users`
                    : billingType === "SPACESTATION"
                    ? `11-${
                        !isEmpty(currentPlanAllData) &&
                        currentPlanAllData[0].maxUsers
                      } Users`
                    : ""}

                  {/* 1 -
                  {!isEmpty(currentPlanAllData) &&
                    currentPlanAllData[0].maxUsers}{" "}
                  Users */}
                </p>
                <p>
                  {!isEmpty(currentPlanAllData) && (
                    <>{currentPlanAllData[0].monthlyPrice}/Mo</>
                  )}
                </p>
              </div>
            </div>
          </div>
          <div className="downgrading-plan-section">
            <h3>You are downgrading to the plan:</h3>
            <div className="detail-section">
              <img
                src={
                  activePlan === "ROVER"
                    ? require("./../../../assets/img/plans/plans1.svg")
                    : activePlan === "ASTRONAUT"
                    ? require("./../../../assets/img/plans/plans0.svg")
                    : activePlan === "SPACESHIP"
                    ? require("./../../../assets/img/plans/plans3.svg")
                    : activePlan === "SPACESTATION"
                    ? require("./../../../assets/img/plans/plans2.svg")
                    : ""
                }
                alt="plans"
              />
              <div>
                <h4>{this.state.activePlan}</h4>
                <p>
                  {activePlan === "ASTRONAUT"
                    ? `${this.state.planMaxUsers} User`
                    : activePlan === "ROVER"
                    ? `2-${this.state.planMaxUsers} Users`
                    : activePlan === "SPACESHIP"
                    ? `6-${this.state.planMaxUsers} Users`
                    : activePlan === "SPACESTATION"
                    ? `11-${this.state.planMaxUsers} Users`
                    : ""}
                </p>
                <p>{this.state.planPrice}/Mo</p>
              </div>
            </div>
          </div>
          <div className="btn-section">
            <button className="cancel-btn" onClick={this.WarningModalClose}>
              Cancel
            </button>
            <button onClick={this.continueHandler} className="continue-btn">
              Continue
            </button>
          </div>
        </div>
      </Modal>
    );
  };

  /*=============================
    Render Delete Employee popup
  ==============================*/
  renderEmployeeDeletePopup = () => {
    const { empDeletePopup, allEmployees, planMaxUsers } = this.state;

    // Get employee count admin added
    let runningPlanEmployeeCreated = allEmployees.length + 1;
    return (
      <Modal
        open={empDeletePopup}
        onClose={() => console.log("unable to close")}
        closeOnEsc={true}
        closeOnOverlayClick={false}
        center
        classNames={{
          overlay: "customOverlay",
          modal: "employee-delete-popup",
          closeButton: "customCloseButton",
        }}
      >
        {/* <span className="closeIconInModal" onClick={this.onCloseModal} /> */}
        <div className="paymentDeleteModalContentTitleBlock">
          <h1 className="paymentDeleteModalContentTitle">
            Downgrade your plan
          </h1>
        </div>
        <div className="paymentDeleteModalContent">
          <div className="paymentDeleteModalContent__textBlock">
            <p className="font-18-regular pb-10">
              You are exceeding the number of employees in your selected
              downgrade plan. We need you to achieve{" "}
              <b>"{runningPlanEmployeeCreated - planMaxUsers}"</b> of your
              employees
            </p>
            <h3 className="font-24-bold">Your Team</h3>
          </div>
          <ul>
            {!isEmpty(allEmployees) &&
              allEmployees.map((employee, index) => {
                return (
                  <li key={index}>
                    <input
                      type="checkbox"
                      onChange={this.onChangeCheckbox(employee.email)}
                      checked={
                        this.doEmailExist(employee.email) ||
                        this.doEmailExist(employee.email) === 0
                          ? true
                          : false
                      }
                    />
                    <img
                      src={require("./../../../assets/img/leads/ben-1.png")}
                      alt="employee-profile"
                    />
                    <div>
                      <h5 className="font-24-bold mb-10">{employee.name}</h5>
                      <h6 className="font-21-regular">Designation</h6>
                    </div>
                  </li>
                );
              })}
          </ul>
          <div className="paymentDeleteModalContent__buttonBlock">
            <button
              onClick={this.employeeCancelPopup}
              className="cancelBtnDeleteModal"
            >
              Cancel
            </button>
            <button
              onClick={this.employeeDeleteHandler}
              className="cancelBtnDeleteModal cancelBtnDeleteModal--delete"
            >
              Archieve
            </button>
          </div>
        </div>
      </Modal>
    );
  };

  /*===========================
    Render Edit Profile Form
  =============================*/

  renderEditProfileForm = () => {
    const { settingsErrors } = this.state;
    return (
      <Fragment>
        <div className="edit-profile-form-container">
          <form noValidate onSubmit={this.editProfileHandler}>
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
              {settingsErrors.fname && (
                <div className="is-invalid add-lead-form-field-errors ml-3">
                  {settingsErrors.fname}
                </div>
              )}
            </div>
            {/* Last Name */}
            <div className="form-group">
              <label htmlFor="lname">Last Name</label>
              <input
                type="text"
                name="lname"
                onChange={this.onchangeHandler}
                maxLength={maxLengths.char30}
                value={this.state.lname}
              />

              {settingsErrors.lname && (
                <div className="is-invalid add-lead-form-field-errors ml-3">
                  {settingsErrors.lname}
                </div>
              )}
            </div>
            {/* Password Reset */}
            {/* <div className="form-group">
              <label htmlFor="resetPassword">Reset Password</label>
              <input type="password" name="password" />
            </div> */}
            {/* Workspace Name */}
            <div className="form-group">
              <label htmlFor="workspaceName">Workspace Name</label>
              <input
                type="text"
                name="workspceName"
                className="disabled-field"
                value={this.state.workspceName}
                disabled
              />
            </div>

            {/* Email */}
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                className="disabled-field"
                name="email"
                value={this.state.email}
                disabled
              />
            </div>
            <div>
              <button type="submit">Save</button>
            </div>
          </form>
        </div>
      </Fragment>
    );
  };

  /*=======================================
      Render Subscription Cancel Model
  =========================================*/
  callBackSubscriptionCancel = (status) => {
    console.log(status);
    if (status === 200) {
      this.setState({
        cancelApprove: true,
      });
    } else {
      Alert.success("<h4>Not able to cancel</h4>", {
        position: "top-right",
        effect: "slide",
        beep: false,
        html: true,
        timeout: 5000,
        // offset: 100
      });
    }
  };

  onClickSubscriptionCancel = () => {
    this.setState({
      subscriptionCancel: true,
    });
  };

  cancelSubscriptionHandler = () => {
    let data = JSON.parse(localStorage.getItem("Data"));
    const formData = {
      plan: "ROVER",
      workspaceId: data.workspaceId,
    };

    this.props.cancelUserSubscriptin(
      data.organizationId,
      formData,
      this.callBackSubscriptionCancel
    );
  };

  onCloseModal = () => {
    this.setState({
      subscriptionCancel: false,
      subscriptionUpdatedSuccess: false,
    });
  };

  /*============================================
        Render After Subscription Updated 
  ============================================*/

  renderSubscriptionUpdatedModel = () => {
    const { subscriptionUpdatedSuccess } = this.state;
    return (
      <Modal
        open={subscriptionUpdatedSuccess}
        onClose={this.onCloseModal}
        closeOnEsc={true}
        closeOnOverlayClick={false}
        center
        classNames={{
          overlay: "customOverlay customOverlay--warning_before_five_days",
          modal: "customeModel_success_after_subscription_update",
          closeButton: "customCloseButton",
        }}
      >
        <span className="closeIconInModal" onClick={this.onCloseModal} />
        <div className="warning_before_plan_expired_container">
          <div>
            <p>
              You have updated your plan and will be charged for new plan
              starting next month as your current plan is in progress.
            </p>
            <div className="button_section">
              <button onClick={this.onCloseModal} className="okay_button">
                Okay
              </button>
            </div>
          </div>
        </div>
      </Modal>
    );
  };

  /*==========================================
      Render Subscription Cancel model
  ============================================*/

  renderSubscriptionCancelModel = () => {
    const { subscriptionCancel } = this.state;

    var data = JSON.parse(localStorage.getItem("oraganiationData"));
    var dateFirst = new Date(dateFns.format(new Date(), "MM/DD/YYYY"));
    var dateSecond =
      !isEmpty(data) &&
      new Date(dateFns.format(data.subscriptionStarted, "MM/DD/YYYY"));
    var timeDiff = dateSecond.getTime() - dateFirst.getTime();

    var diffDays = Math.ceil(Math.abs(timeDiff) / (1000 * 3600 * 24));
    // console.log(diffDays);

    const cancelSubscriptionBeforeFiveDays = () => {
      return (
        <div>
          {diffDays <= 5 ? (
            <p>
              Your subscription has now been cancelled. You no longer will be
              charged monthly fee. Your refund process has been initiated.
            </p>
          ) : (
            <p>
              Your subscription has now been cancelled. You no longer will be
              charged the monthly fee starting next month.
            </p>
          )}

          <div className="text-center">
            <Link to="/dashboard">
              <button onClick={this.onCloseModal} className="go_to_dashboard">
                Go To Dashboard
              </button>
            </Link>
          </div>
        </div>
      );
    };

    return (
      <Modal
        open={subscriptionCancel}
        onClose={this.onCloseModal}
        closeOnEsc={true}
        closeOnOverlayClick={false}
        center
        classNames={{
          overlay: "customOverlay customOverlay--warning_before_five_days",
          modal: "customeModel_warning_befor_subscription_cancel",
          closeButton: "customCloseButton",
        }}
      >
        <span className="closeIconInModal" onClick={this.onCloseModal} />

        {/* logo */}
        <div className="warning_before_plan_expired_container">
          {this.state.cancelApprove ? (
            cancelSubscriptionBeforeFiveDays()
          ) : (
            <div>
              <p>
                Are you sure you want to cancel your subscription? We have more
                exciting stuff coming on the way!
              </p>
              <div className="button_section">
                <button onClick={this.onCloseModal} className="later_button">
                  No
                </button>

                <button
                  onClick={this.cancelSubscriptionHandler}
                  className="upgrade_button"
                >
                  Yes
                </button>
              </div>
            </div>
          )}
        </div>
      </Modal>
    );
  };

  /*====================================
      Render Update Plans section
  =====================================*/
  renderUpdatePlanSection = () => {
    const { allPlans, activePlan } = this.state;
    const { billingType } = this.props;
    let data = JSON.parse(localStorage.getItem("Data"));
    var organizationData = JSON.parse(localStorage.getItem("oraganiationData"));
    let nextSubscriptionPlan =
      !isEmpty(organizationData.nextSubscription) &&
      organizationData.nextSubscription.nextPlan;
    let nextSubsriptionDate =
      !isEmpty(organizationData.nextSubscription) &&
      new Date(organizationData.nextSubscription.nextPlanDate).toISOString();
    nextSubsriptionDate = dateFns.format(nextSubsriptionDate, "Do MMM YYYY");
    console.log(nextSubsriptionDate);
    // console.log(billingType);
    return (
      <Fragment>
        <div className="justify-content-space-between">
          <div className="payment-main-conatiner">
            {billingType === "COLONY" ? (
              <div>
                <h3>Welcome to enterprise account</h3>
              </div>
            ) : (
              <Fragment>
                <div className="form-group">
                  <label htmlFor="workspaceName">Current Plan</label>
                  {organizationData.nextSubscription !== undefined && (
                    <p className="next_subscription_info">
                      Your next subscription plan is{" "}
                      {nextSubscriptionPlan === "ROVER"
                        ? "Rover"
                        : nextSubscriptionPlan === "ASTRONAUT"
                        ? "Astronaut"
                        : nextSubscriptionPlan === "SPACESHIP"
                        ? "Spaceship"
                        : nextSubscriptionPlan === "SPACESTATION"
                        ? "Spacestation"
                        : ""}{" "}
                      which will start on {nextSubsriptionDate}
                    </p>
                  )}

                  <div className="subscription container">
                    <div className="row">
                      {!isEmpty(allPlans) &&
                        allPlans.map((plan, index) => {
                          return (
                            <div
                              key={index}
                              className={
                                activePlan === plan.label
                                  ? "active-plan leads-red-gradient-block subscription-box col-md-5"
                                  : "leads-red-gradient-block subscription-box col-md-5"
                              }
                              onClick={() => this.onClickPlansHandler(plan)}
                            >
                              <div className="subscription-box__imgBlock">
                                {/* <i className="fa fa-users fa-4x" /> */}
                                {index === 0 && (
                                  <img
                                    src={require("../../../assets/img/plans/plans0.svg")}
                                    alt="plans"
                                    className="plans0-img"
                                  />
                                )}

                                {index === 1 && (
                                  <img
                                    src={require("../../../assets/img/plans/plans1.svg")}
                                    alt="plans"
                                    className="plans1-img"
                                  />
                                )}
                                {index === 2 && (
                                  <img
                                    src={require("../../../assets/img/plans/plans2.svg")}
                                    alt="plans"
                                    className="plans2-img"
                                  />
                                )}
                                {index === 3 && (
                                  <img
                                    src={require("../../../assets/img/plans/plans3.svg")}
                                    alt="plans"
                                    className="plans3-img"
                                  />
                                )}
                                {index === 4 && (
                                  <img
                                    src={require("../../../assets/img/plans/plans4.svg")}
                                    alt="plans"
                                    className="plans4-img"
                                  />
                                )}
                              </div>
                              <div className="plan-content text-left">
                                <p className="plan-price">
                                  {plan.monthlyPrice}/Mo
                                </p>
                                <p className="plan-name">{plan.label}</p>
                                {/* </div>
                          <div> */}
                                <p className="plan-users">
                                  {plan.name === "ASTRONAUT"
                                    ? `${plan.maxUsers} User`
                                    : plan.name === "ROVER"
                                    ? `2-${plan.maxUsers} Users`
                                    : plan.name === "SPACESHIP"
                                    ? `6-${plan.maxUsers} Users`
                                    : plan.name === "SPACESTATION"
                                    ? `11-${plan.maxUsers} Users`
                                    : ""}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                </div>
                <div className="buttons-section">
                  {data.subscriptionType === "PAID" && (
                    <button
                      onClick={this.onClickSubscriptionCancel}
                      className="subscription-cancel"
                    >
                      Cancel
                    </button>
                  )}

                  <button
                    onClick={
                      data.subscriptionType === "PAID" &&
                      activePlan === data.billingType
                        ? console.log("hello")
                        : this.planUpdateHandler
                    }
                    className={
                      data.subscriptionType === "PAID" &&
                      activePlan === data.billingType
                        ? "make-payment-upgrade-disabled"
                        : "make-payment"
                    }
                  >
                    {data.subscriptionType === "FREE" ? "Pay now" : "Update"}
                  </button>

                  <p>
                    {data.subscriptionType === "PAID" &&
                      activePlan === data.billingType &&
                      `You already subscribed to ${
                        data.billingType === "ROVER"
                          ? "Rover"
                          : data.billingType === "ASTRONAUT"
                          ? "Astronaut"
                          : data.billingType === "SPACESHIP"
                          ? "Spaceship"
                          : data.billingType === "SPACESTATION"
                          ? "Spacestation"
                          : ""
                      }`}
                  </p>
                </div>
              </Fragment>
            )}
          </div>
        </div>
      </Fragment>
    );
  };

  /*====================================
      Render Payment History section
  =====================================*/
  renderPaymentHistory = () => {
    return (
      <table className="table employee-data-leads-own">
        <thead>
          <tr>
            <th>Date</th>
            <th>Plan Type</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>12-Feb-2019</td>
            <td>Astronaut</td>
            <td>$15</td>
          </tr>
        </tbody>
      </table>
    );
  };

  /*====================================
      Render Workspace info section
  =====================================*/
  renderWorkspaceInfo = () => {
    const { workspaceErrors } = this.state;
    let dataToken = JSON.parse(localStorage.getItem("Data"));
    return (
      <div className="justify-content-space-between">
        <div className="edit-profile-form-container edit-profile-form-container--workspace">
          <form noValidate onSubmit={this.saveWorkspaceInfoHandler}>
            <label className="add-lead-label font-24-semibold">
              Default Company Logo
            </label>
            <div className="row mx-0 flex-nowrap align-items-center">
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
              <div>
                {/* select image file */}
                <div className="quotation-upload-img-block">
                  <button className="quotation-upload-img__btn">
                    Upload Logo
                  </button>
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
                  />
                </div>
              </div>
            </div>

            <div className="row mx-0">
              {/* company address */}
              <div className="col-10 px-0 form-group">
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
              <div className="col-10 col-md-6 pl-0 form-group">
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
            <div>
              <button type="submit">Save</button>
            </div>
          </form>
        </div>
      </div>
    );
  };
  render() {
    const { userRole } = this.props;
    // const { allPlans, activePlan } = this.state;
    // console.log(this.state.allEmployees);
    return (
      <Fragment>
        {/* Render Pre Payment popup */}
        {this.renderPrePaymentPopup()}
        {/* render employee delete warning popup */}
        {this.renderWarningPopup()}
        {/* render employee delete popup */}
        {this.renderEmployeeDeletePopup()}
        <div className="activityMenuTabs">
          <Tabs
            defaultTab={userRole === "Administrator" ? "plans" : "settings"}
            onChange={(tabId) => {
              // console.log(tabId);
            }}
          >
            <TabList>
              {userRole === "Administrator" && <Tab tabFor="plans"> Plans</Tab>}
              {userRole === "Administrator" && (
                <Tab tabFor="workspace-info">Workspace info</Tab>
              )}

              {userRole === "Administrator" && (
                <Tab tabFor="paymentHistory">Payment History</Tab>
              )}
              <Tab tabFor="settings">Settings</Tab>
            </TabList>

            <TabPanel tabId="workspace-info">
              {this.renderWorkspaceInfo()}
            </TabPanel>

            {userRole === "Administrator" && (
              <TabPanel tabId="plans">
                {this.renderUpdatePlanSection()}
              </TabPanel>
            )}
            {userRole === "Administrator" && (
              <TabPanel tabId="paymentHistory">
                {this.renderPaymentHistory()}
              </TabPanel>
            )}

            <TabPanel tabId="settings">
              <div className="justify-content-space-between">
                {this.renderEditProfileForm()}
              </div>
            </TabPanel>
          </Tabs>
        </div>
        {/* render subscription cancel handler */}
        {this.renderSubscriptionCancelModel()}
        {/* Render subscription updated       */}
        {this.renderSubscriptionUpdatedModel()}
      </Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  userRole: state.auth.user.role.name,
  apiStatus: state.auth.status,
  orderId: state.payment.beforePaymentData,
  organizationDetails: state.auth.organizationDetails,
  organizationId: state.auth.user.organizationId,
  oragnizationUploadedLogo: state.auth.oragnizationUploadedLogo,
});

export default connect(mapStateToProps, {
  deleteEmployeeInPlans,
  updateUser,
  statusEmpty,
  beforePaymentAction,
  afterPaymentSuccessAction,
  upgradePlansOfPaidUsers,
  cancelUserSubscriptin,
  updateOrganizationAddress,
  uploadOrganizationImage,
})(withRouter(ProfileContent));
