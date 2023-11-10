import React, { Component, Fragment } from "react";
import { withRouter } from "react-router-dom";
import Alert from "react-s-alert";
import { connect } from "react-redux";
import {
  signUpAction,
  getWorkspace,
  getPlansAction,
} from "../../../store/actions/authAction";
import { PropTypes } from "prop-types";
import { validateSignUp } from "./../../../store/validations/signUpValidation.js/signUpValidation";
import SuccessMessage from "../../desktop/popups/SuccessMessage";
import isEmpty from "./../../../store/validations/is-empty";
import { maxLengths } from "../../../store/validations/maxLengths/MaxLengths";

export class SignUpFormFilds extends Component {
  constructor(props) {
    super(props);
    this.state = {
      passwordVisible: false,
      nextIndex: 1,
      workspaceName: "",
      firstName: "",
      lastName: "",
      companyEmail: "",
      password: "",
      confirmPassword: "",
      displayConfirmPassword: false,
      activePlan: "EGG",
      errors: {},
      status: "",
      workspaceError: "",
      allPlans: {},
      signUpUserInfo: {},
    };
  }

  /*===============================
      Lifecycle methods
  =================================*/

  componentDidMount() {
    // this.props.getPlansAction();
  }

  static getDerivedStateFromProps(nextProps, nextState) {
    if (nextProps.status !== nextState.status) {
      return {
        status: nextProps.status,
      };
    }
    if (nextProps.workspaceError !== nextState.workspaceError) {
      return {
        workspaceError: nextProps.workspaceError,
      };
    }
    if (
      !isEmpty(nextProps.plans) &&
      nextProps.plans !== nextState.allPlans &&
      !nextState.hasSetPlans
    ) {
      return {
        allPlans: nextProps.plans,
        activePlan: nextProps.plans[0].label,
        hasSetPlans: true,
      };
    }
    if (
      !isEmpty(nextProps.signUpUserInfo) &&
      nextProps.signUpUserInfo !== nextState.signUpUserInfo
    ) {
      return {
        signUpUserInfo: nextProps.signUpUserInfo,
      };
    }
    return null;
  }

  /*==================================
      on click password visible icon
  ===================================*/

  onClickPasswordVisible = () => {
    this.setState({
      passwordVisible: !this.state.passwordVisible,
    });
  };

  /*=============================
      Plans Handler
  ===============================*/
  onClickPlansHandler = (plan) => {
    console.log(plan);
    this.setState({
      activePlan: plan,
    });
  };

  /*====================================
      Forms Event Handlers
=====================================*/

  handleChange = (e) => {
    if (e.target.name === "workspaceName") {
      this.setState({
        errors: {},
      });
      this.props.getWorkspace(e.target.value);
    }
    if (e.target.name === "password") {
      this.setState({
        displayConfirmPassword: true,
      });
    }
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  onSubmitHandler = (e) => {
    e.preventDefault();
    console.log(this.state);
    const newUser = {
      organizationName: this.state.workspaceName,
      workspaceId: this.state.workspaceName,
      billingType: this.state.activePlan,
      defaultUserEmailId: this.state.companyEmail,
      defaultUserPassword: this.state.password,
      defaultUserFirstName: this.state.firstName,
      defaultUserLastName: this.state.lastName,
      features: ["call"],
    };
    this.props.signUpAction(newUser);
  };

  // handle next on key enter
  // onFormKeyDown = e => {
  //   if (e.keyCode === 13 && this.state.nextIndex !== 6) {
  //     e.preventDefault();
  //     this.handleNext();
  //   }
  // };

  handleNext = () => {
    const { errors, isValid } = validateSignUp(this.state);
    console.log(this.state.workspaceError);

    if (!isValid) {
      this.setState({ errors });
    }

    if (isValid) {
      this.setState({ errors: {}, nextIndex: this.state.nextIndex + 1 });
    }

    // if (!isValid) {
    //   this.setState({ errors });
    // if (this.state.workspaceError === true) {
    //   Alert.success("<h4>Workspace Already Exists</h4>", {
    //     position: "top-right",
    //     effect: "slide",
    //     beep: false,
    //     html: true,
    //     timeout: 5000
    //     // offset: 100
    //   });
    // }
    // }

    // if (this.state.nextIndex === 1) {
    //   if (errors.workspaceName) {
    //     this.setState({
    //       errors,
    //       nextIndex: this.state.nextIndex
    //     });
    //   } else if (this.state.workspaceError === true) {
    //     Alert.success("<h4>Workspace Already Exists</h4>", {
    //       position: "top-right",
    //       effect: "slide",
    //       beep: false,
    //       html: true,
    //       timeout: 5000
    //       // offset: 100
    //     });
    //   } else {
    //     this.setState({
    //       nextIndex: this.state.nextIndex + 1,
    //       errors: {}
    //     });
    //   }
    // } else if (this.state.nextIndex === 2) {
    //   if (errors.firstName) {
    //     this.setState({
    //       errors,
    //       nextIndex: this.state.nextIndex
    //     });
    //   } else {
    //     this.setState({
    //       nextIndex: this.state.nextIndex + 1,
    //       errors: {}
    //     });
    //   }
    // } else if (this.state.nextIndex === 3) {
    //   if (errors.lastName) {
    //     this.setState({
    //       errors,
    //       nextIndex: this.state.nextIndex
    //     });
    //   } else {
    //     this.setState({
    //       nextIndex: this.state.nextIndex + 1,
    //       errors: {}
    //     });
    //   }
    // } else if (this.state.nextIndex === 4) {
    //   if (errors.companyEmail) {
    //     this.setState({
    //       errors,
    //       nextIndex: this.state.nextIndex
    //     });
    //   } else {
    //     this.setState({
    //       nextIndex: this.state.nextIndex + 1,
    //       errors: {}
    //     });
    //   }
    // } else if (this.state.nextIndex === 5) {
    //   if (errors.password || errors.confirmPassword) {
    //     this.setState({
    //       errors,
    //       nextIndex: this.state.nextIndex
    //     });
    //   } else {
    //     this.setState({
    //       nextIndex: this.state.nextIndex + 1,
    //       errors: {}
    //     });
    //   }
    // }
  };

  handleBack = (e) => {
    e.preventDefault();
    const { nextIndex } = this.state;
    if (nextIndex > 1) {
      this.setState({
        nextIndex: this.state.nextIndex - 1,
      });
    }
  };

  backbutton = () => {
    return (
      <button
        onClick={this.handleBack}
        type="button"
        className="float-left back-btn"
      >
        Back
      </button>
    );
  };

  finishbutton = () => {
    return (
      <div className="text-right">
        <button onClick={this.onSubmitHandler} type="submit">
          Finish
        </button>
      </div>
    );
  };

  nextbutton = () => {
    return (
      <div className="text-right">
        <button onClick={this.handleNext} type="button">
          Next
        </button>
      </div>
    );
  };

  /*========================================
      Render Suceesfull Popup After Signup
  ===========================================*/

  renderSuccesPopUp = () => {
    const { status, signUpUserInfo } = this.state;

    if (status === 200) {
      return (
        <Fragment>
          <SuccessMessage signUpUserInfo={this.state.signUpUserInfo} />
        </Fragment>
      );
    }
    return null;
  };

  /*============================
      Render Workspace field
  =============================*/

  renderWorkSpaceField = () => {
    const { errors, workspaceError } = this.state;

    return (
      <div className="form-group">
        {/* <label htmlFor="workspaceName">Work Space*</label> */}
        <div className="workspace-name-div">
          <SignUpInputField
            placeholder="Workspace Name"
            name="workspaceName"
            id="workspaceName"
            type="text"
            value={this.state.workspaceName}
            onChange={this.handleChange}
            maxLength={maxLengths.char30}
            autoFocus={true}
          />
          {/* <p>.dominate.com</p> */}
        </div>
        {workspaceError && (
          <div className="is-invalid">Organisation already exists</div>
        )}
        {errors.workspaceName && (
          <div className="is-invalid">{errors.workspaceName}</div>
        )}
      </div>
    );
  };

  /*===========================
    Render First name field
  ============================*/

  renderFirstNameField = () => {
    const { errors } = this.state;
    return (
      <Fragment>
        <div className="form-group">
          {/* <label htmlFor="firstName">First Name*</label> */}
          <div className="workspace-name-div">
            <SignUpInputField
              placeholder="First Name"
              name="firstName"
              id="firstName"
              type="text"
              value={this.state.firstName}
              onChange={this.handleChange}
              maxLength={maxLengths.char30}
              autoFocus={true}
            />
          </div>
          {errors.firstName && (
            <div className="is-invalid">{errors.firstName}</div>
          )}
        </div>
      </Fragment>
    );
  };

  /*============================
      Render Last Name Field
  ==============================*/

  renderlastNameField = () => {
    const { errors } = this.state;
    return (
      <Fragment>
        <div className="form-group">
          {/* <label htmlFor="lastName">Last Name*</label> */}
          <div className="workspace-name-div">
            <SignUpInputField
              placeholder="Last Name"
              name="lastName"
              id="lastName"
              type="text"
              value={this.state.lastName}
              onChange={this.handleChange}
              autoFocus={true}
            />
          </div>
          {errors.lastName && (
            <div className="is-invalid">{errors.lastName}</div>
          )}
        </div>
      </Fragment>
    );
  };

  /*================================
          Render Company Emial
  =================================*/

  renderCompanyEmailField = () => {
    const { errors } = this.state;
    return (
      <Fragment>
        <div className="form-group">
          {/* <label htmlFor="companyEmail">Company Email *</label> */}
          <div className="workspace-name-div">
            <SignUpInputField
              placeholder="Company Email"
              name="companyEmail"
              id="companyEmail"
              type="email"
              value={this.state.companyEmail}
              onChange={this.handleChange}
              autoFocus={true}
            />
          </div>
          {errors.companyEmail && (
            <div className="is-invalid">{errors.companyEmail}</div>
          )}
        </div>
      </Fragment>
    );
  };

  /*==============================
         Render Password Field 
  ===============================*/

  renderPasswordField = () => {
    const { errors, passwordVisible } = this.state;
    return (
      <Fragment>
        <div className="form-group">
          {/* <label htmlFor="password">Password*</label> */}
          <div className="workspace-name-div">
            <SignUpInputField
              placeholder="Password"
              name="password"
              id="password"
              type={this.state.passwordVisible ? "text" : "password"}
              value={this.state.password}
              onChange={this.handleChange}
              autoFocus={true}
            />
            {passwordVisible ? (
              <i
                onClick={this.onClickPasswordVisible}
                className="fa fa-eye-slash fa-lg"
              ></i>
            ) : (
              <i
                onClick={this.onClickPasswordVisible}
                className="fa fa-eye fa-lg"
              ></i>
            )}
          </div>
          {errors.password && (
            <div className="is-invalid">{errors.password}</div>
          )}
        </div>
        {this.state.displayConfirmPassword && (
          <div className="form-group">
            {/* <label htmlFor="confirmPassword">Confirm Password*</label> */}
            <div className="workspace-name-div">
              <SignUpInputField
                placeholder="Confirm Password"
                name="confirmPassword"
                id="confirmPassword"
                type={this.state.passwordVisible ? "text" : "password"}
                value={this.state.confirmPassword}
                onChange={this.handleChange}
                autoFocus={false}
              />
            </div>
            {errors.confirmPassword && (
              <div className="is-invalid">{errors.confirmPassword}</div>
            )}
          </div>
        )}
      </Fragment>
    );
  };

  /*===========================
          Render Plans
  =============================*/

  // renderPlans = () => {
  //   const { activePlan, allPlans } = this.state;

  //   return (
  //     <Fragment>
  //       <div className="form-group">
  //         <label htmlFor="workspaceName">
  //           Select a Plan* (15 day free trial)
  //         </label>
  //         <div className="subscription container">
  //           <div className="row">
  //             {allPlans &&
  //               allPlans.map((plan, index) => {
  //                 return (
  //                   <Fragment key={index}>
  //                     <div
  //                       className={
  //                         activePlan === plan.label
  //                           ? "active-plan subscription-box col-md-5"
  //                           : "subscription-box col-md-5"
  //                       }
  //                       onClick={() => this.onClickPlansHandler(plan.label)}
  //                     >
  //                       <div className="subscription-box__imgBlock">
  //                         {/* <i className="fa fa-users fa-2x" /> */}
  //                         {index === 0 && (
  //                           <img
  //                             src={require("../../../assets/img/plans/plans0.svg")}
  //                             alt="plans"
  //                             className="plans0-img"
  //                           />
  //                         )}

  //                         {index === 1 && (
  //                           <img
  //                             src={require("../../../assets/img/plans/plans1.svg")}
  //                             alt="plans"
  //                             className="plans1-img"
  //                           />
  //                         )}
  //                         {index === 2 && (
  //                           <img
  //                             src={require("../../../assets/img/plans/plans2.svg")}
  //                             alt="plans"
  //                             className="plans2-img"
  //                           />
  //                         )}
  //                         {index === 3 && (
  //                           <img
  //                             src={require("../../../assets/img/plans/plans3.svg")}
  //                             alt="plans"
  //                             className="plans3-img"
  //                           />
  //                         )}
  //                         {index === 4 && (
  //                           <img
  //                             src={require("../../../assets/img/plans/plans4.svg")}
  //                             alt="plans"
  //                             className="plans4-img"
  //                           />
  //                         )}
  //                       </div>
  //                       <div>
  //                         <p className="plan-name plan-content">{plan.label}</p>
  //                         <div className="d-flex justify-content-between align-items-center plan-content">
  //                           <p className="plan-price">{plan.monthlyPrice}/Mo</p>
  //                           <p className="plan-users text-center">
  //                             {plan.name === "ASTRONAUT"
  //                               ? `${plan.maxUsers} User`
  //                               : plan.name === "ROVER"
  //                               ? `2-${plan.maxUsers} Users`
  //                               : plan.name === "SPACESHIP"
  //                               ? `6-${plan.maxUsers} Users`
  //                               : plan.name === "SPACESTATION"
  //                               ? `11-${plan.maxUsers} Users`
  //                               : ""}
  //                           </p>
  //                         </div>

  //                         {/* <span>Users</span> */}
  //                       </div>
  //                     </div>
  //                   </Fragment>
  //                 );
  //               })}
  //           </div>
  //         </div>
  //       </div>
  //     </Fragment>
  //   );
  // };

  render() {
    const { nextIndex } = this.state;
    // console.log(this.state.signUpUserInfo);

    return (
      <Fragment>
        {this.renderSuccesPopUp()}
        <div
          className="login-form-fields"
          // onKeyDown={this.onFormKeyDown}
        >
          {nextIndex === 1 && (
            <>
              {this.renderWorkSpaceField()}
              <div className="row mx-0">
                <div className="col-6 pl-0">{this.renderFirstNameField()}</div>
                <div className="col-6 pr-0">{this.renderlastNameField()}</div>
              </div>
              {this.renderCompanyEmailField()}
              {this.renderPasswordField()}
            </>
          )}

          {/* {nextIndex === 2 && this.renderPlans()} */}
          {/* {this.renderWorkSpaceField()}
          {this.renderFirstNameField()}
          {this.renderlastNameField()} */}
          {/* <div className={`form-progress-bar form-progress-${nextIndex}`}>
            <p>(0{nextIndex}/06) </p>
          </div> */}
          <div>
            {nextIndex === 2 ? (
              <Fragment>
                {this.backbutton()}
                {this.finishbutton()}
              </Fragment>
            ) : (
              <Fragment>{this.nextbutton()}</Fragment>
            )}
          </div>
        </div>
      </Fragment>
    );
  }
}

SignUpFormFilds.propTypes = {
  signUpAction: PropTypes.func.isRequired,
  getPlansAction: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  status: state.auth.status,
  workspaceError: !isEmpty(state.errors.errors) && state.errors.errors.exist,
  plans: state.plans.plans.plans,
  signUpUserInfo: state.auth.signUpUserInfo,
});

export default connect(mapStateToProps, {
  signUpAction,
  getWorkspace,
  getPlansAction,
})(withRouter(SignUpFormFilds));

/*=====================================
  functinal component of Sign Up fields
========================================*/

function SignUpInputField({
  placeholder,
  name,
  id,
  type,
  value,
  onChange,
  autoFocus,
}) {
  return (
    <Fragment>
      <input
        placeholder={placeholder}
        name={name}
        id={id}
        type={type}
        className="form-control-new"
        value={value}
        onChange={onChange}
        autoFocus={autoFocus}
        autoComplete="off"
      />
    </Fragment>
  );
}
